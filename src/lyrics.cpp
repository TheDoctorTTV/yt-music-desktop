#include "lyrics.h"

#include <QJsonArray>
#include <QJsonDocument>
#include <QByteArray>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QDebug>
#include <QDateTime>
#include <QRegularExpression>
#include <QSharedPointer>
#include <QTextDocument>
#include <QTimer>
#include <QUrl>
#include <QUrlQuery>
#include <QWebEnginePage>
#include <QWebEngineScript>
#include <QStringList>
#include <QVector>
#include <algorithm>
#include <cmath>

namespace {
QString normalized(QString value) {
  value.remove(QRegularExpression(
      R"(\s*[\[(](official (music )?video|official audio|lyrics?|visualizer)[\])]$)",
      QRegularExpression::CaseInsensitiveOption));
  value = value.normalized(QString::NormalizationForm_KD).toCaseFolded();
  value.replace(QRegularExpression("[^\\p{L}\\p{N}]+"), " ");
  return value.simplified();
}

bool similar(const QString &actual, const QString &wanted) {
  if (wanted.isEmpty() || actual.isEmpty())
    return false;
  return actual == wanted || actual.startsWith(wanted + ' ') ||
         wanted.startsWith(actual + ' ');
}

bool titleSimilar(const QString &actual, const QString &wanted) {
  return similar(actual, wanted) ||
         (wanted.size() >= 12 && actual.contains(wanted));
}

const QStringList providers = {"lrclib", "simpmusic", "kugou", "lyricsovh", "genius"};

QString providerName(const QString &provider) {
  if (provider == "lrclib") return "LRCLIB";
  if (provider == "simpmusic") return "SimpMusic";
  if (provider == "kugou") return "KuGou";
  if (provider == "genius") return "Genius";
  return "Lyrics.ovh";
}

QJsonObject result(const QString &source, const QString &plain,
                   const QString &synced = {}) {
  return {{"source", source}, {"plain", plain}, {"synced", synced}};
}

QStringList lyricLines(const QString &value, bool timedOnly) {
  QStringList lines;
  const QRegularExpression stamp(R"(^\[\d+:\d+(?:\.\d+)?\])");
  const QRegularExpression wordStamp(R"(<\d+:\d+(?:\.\d+)?>)");
  const QRegularExpression heading(R"(^\[[^\]]+\]$)");
  for (QString line : value.split('\n')) {
    line = line.trimmed();
    const bool timed = stamp.match(line).hasMatch();
    if (timedOnly && !timed) continue;
    while (stamp.match(line).hasMatch()) line.remove(stamp);
    line.remove(wordStamp);
    if (heading.match(line).hasMatch()) continue;
    const QString clean = normalized(line);
    if (!clean.isEmpty()) lines.append(clean);
  }
  return lines;
}
} // namespace

Lyrics::Lyrics(QWebEnginePage *p, bool enabled)
    : QObject(nullptr), page(p), debug(enabled) {}

QString Lyrics::searchTitle() const {
  QString cleaned = title;
  cleaned.remove(QRegularExpression(
      R"(\s*[-|]\s*(?:Honkai\s*:\s*Star Rail|.*\bOST\b).*$)",
      QRegularExpression::CaseInsensitiveOption));
  cleaned.remove(QRegularExpression(
      R"(\s*[\[(](?:official (?:music )?video|official audio|lyrics?|visualizer)[\])]$)",
      QRegularExpression::CaseInsensitiveOption));
  // Strip upload labels while retaining quoted Japanese song names.
  cleaned.remove(QRegularExpression(
      R"(【[^】]*(?:OST|BGM)[^】]*】|「[^」]*(?:主題歌|BGM)[^」]*」)",
      QRegularExpression::CaseInsensitiveOption));
  cleaned.remove(QRegularExpression(R"(\s*字幕付き\s*$)"));
  cleaned = cleaned.trimmed();
  const auto parts = cleaned.split(QRegularExpression(R"(\s+[-–—|]\s+)"));
  if (parts.size() == 2) {
    const QString credit = normalized(artist);
    if (similar(normalized(parts[1]), credit)) cleaned = parts[0];
    else if (similar(normalized(parts[0]), credit)) cleaned = parts[1];
  }
  return cleaned.trimmed().isEmpty() ? title.trimmed() : cleaned.trimmed();
}

void Lyrics::reset() {
  ++generation;
  if (reply)
    reply->abort();
  reply = nullptr;
  cache.clear();
  providerErrors.clear();
  failedUntil.clear();
  id.clear();
  title.clear();
  artist.clear();
  open = false;
}

void Lyrics::show(const QJsonObject &value) {
  const QByteArray json = QJsonDocument(value).toJson(QJsonDocument::Compact);
  page->runJavaScript("window.__ytmdLyrics?.receive(" +
                          QString::fromUtf8(json) + ");",
                      QWebEngineScript::ApplicationWorld);
}

void Lyrics::update(const QVariantMap &state) {
  const QString nextId = state.value("id").toString();
  const QString nextTitle = state.value("lyricsTitle", state.value("title"))
                                .toString().trimmed();
  const QString nextArtist = state.value("lyricsArtist", state.value("artist"))
                                 .toString().trimmed();
  const double nextDuration = state.value("duration").toDouble();
  QString nextChoice = state.value("lyricsSource", "auto").toString();
  if (!providers.contains(nextChoice) && nextChoice != "youtube")
    nextChoice = "auto";
  const bool nextOpen = state.value("lyricsOpen").toBool();
  // YouTube Music can briefly clear the player ID near the end of a track.
  // Keep the current lyrics until another video ID arrives or the page resets.
  if (nextId.isEmpty() && !id.isEmpty())
    return;
  const bool idChanged = nextId != id;
  const bool trackChanged = idChanged ||
                            (!nextTitle.isEmpty() && nextTitle != title) ||
                            (!nextArtist.isEmpty() && nextArtist != artist);
  const bool preferenceChanged = nextChoice != choice;
  const bool opened = nextOpen && !open;
  if (trackChanged) {
    ++generation;
    if (reply)
      reply->abort();
    reply = nullptr;
    cache.clear();
    providerErrors.clear();
    failedUntil.clear();
    id = nextId;
    if (idChanged) {
      title.clear();
      artist.clear();
      duration = 0;
    }
    if (!nextTitle.isEmpty()) title = nextTitle;
    if (!nextArtist.isEmpty()) artist = nextArtist;
    if (debug && !id.isEmpty())
      qInfo().noquote() << "Lyrics: track" << id << "title:" << title
                        << "artist:" << artist << "search:" << searchTitle();
  }
  // Duration can temporarily become zero or change as playback ends. It helps
  // provider matching but must not invalidate lyrics for the same video ID.
  if (nextDuration > 0) duration = nextDuration;
  choice = nextChoice;
  open = nextOpen;
  if (debug && (preferenceChanged || opened))
    qInfo() << "Lyrics: source" << choice << "panel open:" << open;
  // A failed service is not a permanent no-match. Allow a fresh attempt on
  // reopening the panel or selecting a source again after a short cooldown.
  if (preferenceChanged || opened) {
    const qint64 now = QDateTime::currentMSecsSinceEpoch();
    for (auto it = failedUntil.begin(); it != failedUntil.end();) {
      if (it.value() <= now) {
        cache.remove(it.key());
        providerErrors.remove(it.key());
        it = failedUntil.erase(it);
      } else ++it;
    }
  }
  if (open && (trackChanged || preferenceChanged || opened))
    resolve();
}

void Lyrics::resolve() {
  if (choice == "youtube") {
    show({{"source", "youtube"}});
    return;
  }
  if (id.isEmpty() || title.isEmpty()) {
    show(choice == "auto" ? QJsonObject{{"source", "youtube"}}
                          : QJsonObject{{"source", choice},
                                        {"message", "Track details are unavailable."}});
    return;
  }
  const QStringList order = choice == "auto" ? providers : QStringList{choice};
  QJsonObject textResult;
  for (const QString &provider : order) {
    if (!cache.contains(provider)) {
      show(choice == "auto"
               ? QJsonObject{{"source", "youtube"},
                             {"checking", providerName(provider)}}
               : QJsonObject{{"source", provider},
                             {"message", "Finding lyrics…"}});
      request(provider);
      return;
    }
    const auto found = cache.value(provider);
    if (!found.value("plain").toString().isEmpty() ||
        !found.value("synced").toString().isEmpty()) {
      textResult = found;
      break;
    }
  }
  if (textResult.isEmpty()) {
    show(choice == "auto" ? QJsonObject{{"source", "youtube"}}
                          : QJsonObject{{"source", choice},
                                        {"message", providerErrors.value(choice,
                                            "Lyrics were not found.")}});
    return;
  }
  QStringList timingOrder = {textResult.value("source").toString()};
  for (const QString &provider : QStringList{"lrclib", "simpmusic", "kugou"})
    if (!timingOrder.contains(provider)) timingOrder.append(provider);
  for (const QString &provider : timingOrder) {
    if (provider != "lrclib" && provider != "simpmusic" && provider != "kugou")
      continue;
    if (!cache.contains(provider)) {
      QJsonObject loading = textResult;
      loading.insert("timingChecking", providerName(provider));
      show(loading);
      request(provider);
      return;
    }
    const auto candidate = cache.value(provider);
    if (candidate.value("synced").toString().isEmpty()) continue;
    if (!timingCompatible(textResult, candidate)) continue;
    textResult.insert("timing", candidate.value("synced"));
    textResult.insert("timingSource", provider);
    if (debug)
      qInfo() << "Lyrics: text from" << textResult.value("source").toString()
              << "timing from" << provider;
    show(textResult);
    return;
  }
  textResult.insert("timingMessage", "No matching timestamps");
  if (debug)
    qInfo() << "Lyrics: no matching timestamps for"
            << textResult.value("source").toString();
  show(textResult);
}

bool Lyrics::timingCompatible(const QJsonObject &text,
                              const QJsonObject &timing) const {
  QString words = text.value("plain").toString();
  if (words.isEmpty()) words = text.value("synced").toString();
  const QStringList a = lyricLines(words, false);
  const QStringList b = lyricLines(timing.value("synced").toString(), true);
  if (a.isEmpty() || b.isEmpty()) return false;
  QVector<int> previous(b.size() + 1), row(b.size() + 1);
  for (const QString &line : a) {
    for (qsizetype j = 1; j <= b.size(); ++j)
      row[j] = line == b[j - 1] ? previous[j - 1] + 1
                              : std::max(previous[j], row[j - 1]);
    previous.swap(row);
    row.fill(0);
  }
  const int matches = previous.last();
  const bool compatible = matches >= std::min(3, int(a.size())) &&
                          matches * 100 >= int(a.size()) * 60 &&
                          matches * 100 >= int(b.size()) * 60;
  if (debug)
    qInfo() << "Lyrics: timing match" << text.value("source").toString()
            << "with" << timing.value("source").toString()
            << matches << "/" << a.size() << "text lines," << b.size()
            << "timed lines; accepted:" << compatible;
  return compatible;
}

void Lyrics::request(const QString &provider, int stage) {
  if (provider == "lrclib" && artist.isEmpty())
    stage = 1;
  QUrl url;
  if (provider == "lrclib") {
    url = QUrl("https://lrclib.net/api/search");
    QUrlQuery query;
    query.addQueryItem("track_name", searchTitle());
    if (stage == 0 && !artist.isEmpty())
      query.addQueryItem("artist_name", artist);
    url.setQuery(query);
  } else if (provider == "simpmusic") {
    if (!QRegularExpression("^[A-Za-z0-9_-]{11}$").match(id).hasMatch()) {
      cache.insert(provider, {});
      resolve();
      return;
    }
    url = QUrl("https://api-lyrics.simpmusic.org/v1/" + id);
  } else if (provider == "kugou") {
    url = QUrl("https://lyrics.kugou.com/search");
    QUrlQuery query;
    query.addQueryItem("ver", "1");
    query.addQueryItem("client", "pc");
    query.addQueryItem("man", "yes");
    query.addQueryItem("keyword", searchTitle());
    if (duration > 0)
      query.addQueryItem("duration", QString::number(qRound64(duration * 1000)));
    url.setQuery(query);
  } else if (provider == "genius") {
    url = QUrl("https://genius.com/api/search/multi");
    QUrlQuery query;
    query.addQueryItem("q", searchTitle());
    query.addQueryItem("page", "1");
    query.addQueryItem("per_page", "5");
    url.setQuery(query);
  } else {
    if (artist.isEmpty()) {
      cache.insert(provider, {});
      resolve();
      return;
    }
    url = QUrl("https://api.lyrics.ovh/v1/" +
               QString::fromUtf8(QUrl::toPercentEncoding(artist)) + "/" +
               QString::fromUtf8(QUrl::toPercentEncoding(searchTitle())));
  }
  fetch(provider, url, stage);
}

void Lyrics::fetch(const QString &provider, const QUrl &url, int stage, int attempt) {
  if (reply) {
    if (reply->property("provider").toString() == provider &&
        reply->property("stage").toInt() == stage)
      return;
    ++generation;
    reply->abort();
    reply = nullptr;
  }
  QNetworkRequest req(url);
  req.setTransferTimeout(9000);
  req.setAttribute(QNetworkRequest::RedirectPolicyAttribute,
                   QNetworkRequest::ManualRedirectPolicy);
  req.setRawHeader("User-Agent",
                   "YouTube Music Desktop/" YTMUSIC_VERSION
                   " (https://github.com/thedoctorttv/yt-music-desktop)");
  if (provider == "genius") {
    req.setRawHeader("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) "
                                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                                   "Chrome/130.0.0.0 Safari/537.36");
    req.setRawHeader("Accept", stage == 0 ? "application/json" : "text/html");
  }
  auto *current = network.get(req);
  reply = current;
  current->setProperty("provider", provider);
  current->setProperty("stage", stage);
  const quint64 token = generation;
  auto body = QSharedPointer<QByteArray>::create();
  const qint64 limit = provider == "genius" && stage == 1
                           ? 4 * 1024 * 1024 : 512 * 1024;
  connect(current, &QIODevice::readyRead, current, [current, body, limit] {
    if (body->size() + current->bytesAvailable() > limit) {
      current->setProperty("lyricsTooLarge", true);
      current->abort();
      return;
    }
    body->append(current->readAll());
  });
  connect(current, &QNetworkReply::finished, this,
          [this, current, body, provider, stage, token, url, attempt] {
            const int status = current->attribute(
                QNetworkRequest::HttpStatusCodeAttribute).toInt();
            const bool ok = current->error() == QNetworkReply::NoError &&
                            status == 200;
            const QByteArray data = *body;
            if (token != generation || reply != current) {
              current->deleteLater();
              return;
            }
            if (debug) {
              if (ok)
                qInfo() << "Lyrics:" << provider << "stage" << stage
                        << "HTTP" << status << "bytes" << data.size();
              else
                qInfo() << "Lyrics:" << provider << "stage" << stage
                        << "HTTP" << status << "error" << current->errorString();
              if (provider == "genius" && stage != 1 && !ok)
                qInfo().noquote() << "Lyrics: Genius search error body:"
                                  << QString::fromUtf8(data).left(300).simplified();
            }
            const bool temporary = status == 0 || status >= 500;
            if (!ok && temporary && attempt == 0 &&
                !current->property("lyricsTooLarge").toBool()) {
              if (debug)
                qInfo() << "Lyrics:" << provider << "retrying once after temporary failure";
              // Keep this reply as the in-flight marker during the delay, so
              // repeated UI state updates cannot launch duplicate requests.
              QTimer::singleShot(1500, this,
                  [this, pending = QPointer<QNetworkReply>(current),
                   provider, url, stage, token, attempt] {
                    if (!pending) return;
                    pending->deleteLater();
                    if (token != generation || reply != pending) return;
                    reply = nullptr;
                    fetch(provider, url, stage, attempt + 1);
                  });
              return;
            }
            current->deleteLater();
            reply = nullptr;
            if (!ok && !(provider == "lyricsovh" && status == 404)) {
              providerErrors.insert(provider, providerName(provider) +
                  " is unavailable" + (status ? QString(" (HTTP %1)").arg(status)
                                               : QString{}) +
                  ". Reopen the panel or reselect the source in 30 seconds to retry.");
              failedUntil.insert(provider, QDateTime::currentMSecsSinceEpoch() + 30000);
            } else {
              providerErrors.remove(provider);
              failedUntil.remove(provider);
            }
            finish(provider, stage, data, ok);
          });
}

QJsonObject Lyrics::lrclib(const QByteArray &body, bool titleOnly) const {
  const auto doc = QJsonDocument::fromJson(body);
  if (!doc.isArray())
    return {};
  const QString wantedTitle = normalized(searchTitle());
  const QString wantedArtist = normalized(artist);
  QJsonObject best;
  int bestScore = -1;
  for (const auto &entry : doc.array()) {
    const auto item = entry.toObject();
    const QString foundTitle = normalized(item.value("trackName").toString());
    const QString foundArtist = normalized(item.value("artistName").toString());
    const bool artistMatch = similar(foundArtist, wantedArtist);
    if (!titleSimilar(foundTitle, wantedTitle) ||
        (!titleOnly && !artistMatch) || item.value("instrumental").toBool())
      continue;
    const QString plain = item.value("plainLyrics").toString().trimmed();
    const QString synced = item.value("syncedLyrics").toString().trimmed();
    if (plain.isEmpty() && synced.isEmpty())
      continue;
    const double foundDuration = item.value("duration").toDouble();
    if (duration > 0 && foundDuration > 0 &&
        std::abs(foundDuration - duration) > 15)
      continue;
    if (!artistMatch && (duration <= 0 ||
                         foundDuration <= 0))
      continue;
    int score = (foundTitle == wantedTitle ? 4 : 0) +
                (foundArtist == wantedArtist ? 2 : 0) +
                (!synced.isEmpty() ? 2 : 0);
    if (duration > 0 && foundDuration > 0)
      score += std::max(0, 3 - int(std::abs(foundDuration - duration) / 5));
    if (score > bestScore) {
      bestScore = score;
      best = result("lrclib", plain, synced);
    }
  }
  return best;
}

QJsonObject Lyrics::lyricsOvh(const QByteArray &body) const {
  const auto doc = QJsonDocument::fromJson(body);
  if (!doc.isObject())
    return {};
  const QString plain = doc.object().value("lyrics").toString().trimmed();
  return plain.isEmpty() ? QJsonObject{} : result("lyricsovh", plain);
}

QJsonObject Lyrics::simpMusic(const QByteArray &body) const {
  const auto doc = QJsonDocument::fromJson(body);
  if (!doc.isObject() || !doc.object().value("success").toBool())
    return {};
  for (const auto &entry : doc.object().value("data").toArray()) {
    const auto item = entry.toObject();
    if (item.value("videoId").toString() != id)
      continue;
    const QString plain = item.value("plainLyric").toString().trimmed();
    const QString synced = item.value("syncedLyrics").toString().trimmed();
    if (!plain.isEmpty() || !synced.isEmpty())
      return result("simpmusic", plain, synced);
  }
  return {};
}

QJsonObject Lyrics::kugouDownload(const QByteArray &body) const {
  const auto doc = QJsonDocument::fromJson(body);
  if (!doc.isObject())
    return {};
  const QByteArray decoded = QByteArray::fromBase64(
      doc.object().value("content").toString().toUtf8());
  const QString synced = QString::fromUtf8(decoded).trimmed();
  if (decoded.isEmpty() || !synced.contains(QRegularExpression(
                                 R"(\[\d+:\d+(?:\.\d+)?\])")))
    return {};
  return result("kugou", {}, synced);
}

QUrl Lyrics::geniusSearch(const QByteArray &body) const {
  const auto doc = QJsonDocument::fromJson(body);
  if (!doc.isObject()) {
    if (debug) qInfo() << "Lyrics: Genius search returned invalid JSON";
    return {};
  }
  const auto response = doc.object().value("response").toObject();
  QJsonArray sections = response.value("sections").toArray();
  if (!response.value("hits").toArray().isEmpty())
    sections.prepend(QJsonObject{{"hits", response.value("hits").toArray()}});
  const QString wanted = normalized(searchTitle());
  QUrl best;
  int bestScore = -1;
  int hits = 0;
  for (const auto &section : sections) {
    for (const auto &hit : section.toObject().value("hits").toArray()) {
      ++hits;
      const auto item = hit.toObject().value("result").toObject();
      const QString found = normalized(item.value("title").toString());
      if (!titleSimilar(found, wanted)) continue;
      const QUrl url(item.value("url").toString());
      if (url.scheme() != "https" || url.host() != "genius.com" ||
          !url.path().endsWith("-lyrics")) continue;
      const QString foundArtist = normalized(item.value("primary_artist")
                                                .toObject().value("name").toString());
      const int score = (found == wanted ? 4 : 0) +
                        (similar(foundArtist, normalized(artist)) ? 1 : 0);
      if (score > bestScore) {
        bestScore = score;
        best = url;
      }
    }
  }
  if (debug)
    qInfo() << "Lyrics: Genius search hits:" << hits
            << "matched page:" << !best.isEmpty();
  return best;
}

QJsonObject Lyrics::geniusLyrics(const QByteArray &body) const {
  const QString html = QString::fromUtf8(body);
  const QRegularExpression start(
      R"(<div\b[^>]*\bdata-lyrics-container\s*=\s*["']true["'][^>]*>)",
      QRegularExpression::CaseInsensitiveOption);
  const QRegularExpression divTag(R"(<\s*/?\s*div\b[^>]*>)",
                                  QRegularExpression::CaseInsensitiveOption);
  QStringList parts;
  auto containers = start.globalMatch(html);
  while (containers.hasNext()) {
    const auto container = containers.next();
    const int begin = container.capturedEnd();
    int end = -1;
    int depth = 1;
    auto tags = divTag.globalMatch(html, begin);
    while (tags.hasNext()) {
      const auto tag = tags.next();
      if (tag.captured().startsWith("</")) --depth;
      else ++depth;
      if (depth == 0) {
        end = tag.capturedStart();
        break;
      }
    }
    if (end < begin) continue;
    QTextDocument text;
    text.setHtml(html.mid(begin, end - begin));
    const QString part = text.toPlainText().trimmed();
    if (!part.isEmpty()) parts.append(part);
  }
  const QString plain = parts.join("\n\n").trimmed();
  if (debug)
    qInfo() << "Lyrics: Genius lyric sections:" << parts.size()
            << "characters:" << plain.size();
  return plain.isEmpty() ? QJsonObject{} : result("genius", plain);
}

void Lyrics::finish(const QString &provider, int stage, const QByteArray &body,
                    bool ok) {
  if (provider == "genius" && (stage == 0 || stage == 2)) {
    const QUrl url = ok ? geniusSearch(body) : QUrl{};
    if (url.isValid() && !url.isEmpty()) {
      fetch(provider, url, 1);
      return;
    }
    if (stage == 0) {
      QUrl fallback("https://genius.com/api/search/song");
      QUrlQuery query;
      query.addQueryItem("q", searchTitle());
      fallback.setQuery(query);
      fetch(provider, fallback, 2);
      return;
    }
  }
  if (provider == "lrclib" && stage == 0) {
    const auto found = ok ? lrclib(body, false) : QJsonObject{};
    if (!found.isEmpty()) {
      cache.insert(provider, found);
      if (open) resolve();
    } else if (ok) {
      request(provider, 1);
    } else {
      cache.insert(provider, {});
      if (open) resolve();
    }
    return;
  }
  if (provider == "kugou" && stage == 0) {
    const auto doc = ok ? QJsonDocument::fromJson(body) : QJsonDocument{};
    const auto candidates = doc.object().value("candidates").toArray();
    const QString wanted = normalized(searchTitle());
    for (const auto &entry : candidates) {
      const auto item = entry.toObject();
      const QString song = normalized(item.value("song").toString());
      const double milliseconds = item.value("duration").toDouble();
      const QString lyricId = item.value("id").toVariant().toString();
      const QString accessKey = item.value("accesskey").toString();
      if (!titleSimilar(song, wanted) ||
          (duration > 0 && milliseconds > 0 &&
           std::abs(milliseconds / 1000 - duration) > 15) ||
          !QRegularExpression("^\\d+$").match(lyricId).hasMatch() ||
          !QRegularExpression("^[A-Za-z0-9]{1,128}$")
               .match(accessKey).hasMatch())
        continue;
      QUrl url("https://lyrics.kugou.com/download");
      QUrlQuery query;
      query.addQueryItem("ver", "1");
      query.addQueryItem("client", "pc");
      query.addQueryItem("id", lyricId);
      query.addQueryItem("accesskey", accessKey);
      query.addQueryItem("fmt", "lrc");
      query.addQueryItem("charset", "utf8");
      url.setQuery(query);
      fetch(provider, url, 1);
      return;
    }
  }
  QJsonObject found;
  if (ok) {
    if (provider == "lrclib") found = lrclib(body, true);
    else if (provider == "lyricsovh") found = lyricsOvh(body);
    else if (provider == "simpmusic") found = simpMusic(body);
    else if (provider == "kugou" && stage == 1)
      found = kugouDownload(body);
    else if (provider == "genius" && stage == 1)
      found = geniusLyrics(body);
  }
  cache.insert(provider, found);
  if (open) resolve();
}
