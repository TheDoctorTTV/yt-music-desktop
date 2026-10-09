#include "discord.h"

#include <QCoreApplication>
#include <QDateTime>
#include <QDir>
#include <QFileInfo>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonValue>
#include <QUrl>
#include <QUuid>
#include <cmath>

namespace {
constexpr auto applicationId = "1558206362809274408";
constexpr auto fallbackArtKey = "yt-music-discord-rpc";
constexpr auto playingArtKey = "yt-music-playing";
constexpr auto pausedArtKey = "yt-music-paused";
constexpr qint64 positionRefreshMs = 5000;

quint32 read32(const char *bytes) {
  return quint32(quint8(bytes[0])) | (quint32(quint8(bytes[1])) << 8) |
         (quint32(quint8(bytes[2])) << 16) |
         (quint32(quint8(bytes[3])) << 24);
}

void append32(QByteArray &bytes, quint32 value) {
  for (int shift = 0; shift < 32; shift += 8)
    bytes.append(char((value >> shift) & 0xff));
}

QString albumArt(const QVariantMap &player) {
  for (const auto &value : player.value("discordArtwork").toList()) {
    const QUrl url(value.toString());
    const auto host = url.host();
    if (url.scheme() == "https" &&
        (host == "i.ytimg.com" || host == "yt3.ggpht.com" ||
         host == "lh3.googleusercontent.com" ||
         host.endsWith(".googleusercontent.com") ||
         host.endsWith(".ggpht.com")))
      return url.toString();
  }
  return {};
}

QString trackTime(double value) {
  const auto seconds = qint64(std::floor(value));
  const auto hours = seconds / 3600;
  const auto minutes = (seconds / 60) % 60;
  const auto remainder = seconds % 60;
  if (hours > 0)
    return QStringLiteral("%1:%2:%3")
        .arg(hours)
        .arg(minutes, 2, 10, QLatin1Char('0'))
        .arg(remainder, 2, 10, QLatin1Char('0'));
  return QStringLiteral("%1:%2")
      .arg(seconds / 60)
      .arg(remainder, 2, 10, QLatin1Char('0'));
}

} // namespace

DiscordPresence::DiscordPresence(QObject *parent) : QObject(parent) {
  reconnect.setInterval(5000);
  connect(&reconnect, &QTimer::timeout, this, &DiscordPresence::connectIfNeeded);
  connect(&socket, &QLocalSocket::connected, this, [this] {
    incoming.clear();
    ready = false;
    published = false;
    sendFrame(0, {{"v", 1}, {"client_id", QString::fromLatin1(applicationId)}});
  });
  connect(&socket, &QLocalSocket::readyRead, this, &DiscordPresence::receive);
  connect(&socket, &QLocalSocket::disconnected, this, [this] {
    ready = false;
    published = false;
    incoming.clear();
  });
}

DiscordPresence::~DiscordPresence() { clear(); }

void DiscordPresence::connectIfNeeded() {
  if (!enabled || socket.state() != QLocalSocket::UnconnectedState)
    return;
  QStringList bases;
  for (const auto *name : {"XDG_RUNTIME_DIR", "TMPDIR", "TMP", "TEMP"}) {
    const QString value = qEnvironmentVariable(name);
    if (!value.isEmpty() && !bases.contains(value))
      bases << value;
  }
  bases << "/tmp";
  for (const auto &base : bases) {
    for (int index = 0; index < 10; ++index) {
      const auto path = QDir(base).filePath("discord-ipc-" + QString::number(index));
      if (QFileInfo::exists(path)) {
        socket.connectToServer(path);
        return;
      }
    }
  }
}

void DiscordPresence::sendFrame(quint32 opcode, const QJsonObject &payload) {
  if (socket.state() != QLocalSocket::ConnectedState)
    return;
  const QByteArray json = QJsonDocument(payload).toJson(QJsonDocument::Compact);
  QByteArray frame;
  frame.reserve(8 + json.size());
  append32(frame, opcode);
  append32(frame, quint32(json.size()));
  frame.append(json);
  socket.write(frame);
}

void DiscordPresence::receive() {
  incoming.append(socket.readAll());
  while (incoming.size() >= 8) {
    const auto opcode = read32(incoming.constData());
    const auto length = read32(incoming.constData() + 4);
    if (length > 1024 * 1024) {
      socket.abort();
      return;
    }
    if (incoming.size() < 8 + int(length))
      return;
    const auto bytes = incoming.mid(8, int(length));
    incoming.remove(0, 8 + int(length));
    if (opcode == 3) {
      // Discord expects its ping payload returned unchanged.
      if (socket.state() == QLocalSocket::ConnectedState) {
        QByteArray frame;
        append32(frame, 4);
        append32(frame, length);
        frame.append(bytes);
        socket.write(frame);
      }
    } else if (opcode == 2) {
      socket.disconnectFromServer();
    } else if (opcode == 1) {
      const auto message = QJsonDocument::fromJson(bytes).object();
      if (message.value("evt").toString() == "READY") {
        ready = true;
        publish();
      }
    }
  }
}

QJsonObject DiscordPresence::activity(const QVariantMap &player) const {
  const auto id = player.value("id").toString();
  const auto title = player.value("title").toString().trimmed();
  if (id.isEmpty() || title.isEmpty() ||
      player.value("status").toString() == "Stopped")
    return {};

  QJsonObject result{{"type", 2},
                     {"name", "YT Music"},
                     {"details", title.size() < 2 ? "Unknown track" : title.left(128)}};
  const auto artist = player.value("artist").toString().trimmed();
  const auto playbackStatus = player.value("status").toString();
  const double position = player.value("position").toDouble();
  const double duration = player.value("duration").toDouble();
  const bool validPosition = std::isfinite(position) && position >= 0 &&
                             position < 1000000000;
  const bool validDuration = std::isfinite(duration) && duration > 0 &&
                             duration < 1000000000;
  // A start timestamp keeps Discord's activity clock stable across updates.
  // The song position is text because Discord cannot pause its progress bar.
  if (!validPosition || !validDuration || position > duration)
    return {};
  const auto artistText = artist.isEmpty() ? QStringLiteral("Unknown artist") : artist;
  const auto progress = " · " + trackTime(position) + " / " + trackTime(duration);
  result["state"] = artistText.left(128 - progress.size()) + progress;
  const auto link = "https://music.youtube.com/watch?v=" + id;
  result["details_url"] = link;
  const auto cover = albumArt(player);
  result["assets"] = QJsonObject{{"large_image", cover.isEmpty()
                                                   ? QString::fromLatin1(fallbackArtKey)
                                                   : cover},
                                  {"large_text", title.left(128)},
                                  {"small_image", playbackStatus == "Playing"
                                                      ? QString::fromLatin1(playingArtKey)
                                                      : QString::fromLatin1(pausedArtKey)},
                                  {"small_text", playbackStatus}};
  result["timestamps"] = QJsonObject{{"start", double(activityStartedAtMs)}};
  return result;
}

void DiscordPresence::publish() {
  if (!ready || !enabled)
    return;
  QJsonObject request{{"cmd", "SET_ACTIVITY"},
                      {"args", QJsonObject{{"pid", QCoreApplication::applicationPid()},
                                            {"activity", desired.isEmpty()
                                                             ? QJsonValue(QJsonValue::Null)
                                                             : QJsonValue(desired)}}},
                      {"nonce", QUuid::createUuid().toString(QUuid::WithoutBraces)}};
  sendFrame(1, request);
  published = !desired.isEmpty();
}

void DiscordPresence::update(const QVariantMap &player) {
  const bool nextEnabled = player.value("discordEnabled").toBool();
  if (!nextEnabled) {
    if (enabled)
      clear();
    return;
  }
  if (!enabled) {
    enabled = true;
    reconnect.start();
    connectIfNeeded();
  }
  const auto id = player.value("id").toString();
  const auto status = player.value("status").toString();
  if (id.isEmpty() || status == "Stopped") {
    currentTrackId.clear();
    activityStartedAtMs = 0;
  } else if (id != currentTrackId) {
    currentTrackId = id;
    activityStartedAtMs = QDateTime::currentMSecsSinceEpoch();
  }
  const auto next = activity(player);
  const auto key = id + '\n' +
                   status + '\n' +
                   player.value("title").toString() + '\n' +
                   player.value("artist").toString() + '\n' +
                   albumArt(player) + '\n' +
                   QString::number(qRound64(player.value("duration").toDouble()));
  const double position = player.value("position").toDouble();
  const double expected = lastPosition +
                          (lastUpdate.isValid() &&
                                   player.value("status").toString() == "Playing"
                               ? lastUpdate.elapsed() / 1000.0
                               : 0);
  const bool changed = key != lastKey ||
                       (lastUpdate.isValid() && std::abs(position - expected) > 1.5) ||
                       (status == "Playing" && lastUpdate.isValid() &&
                        lastUpdate.elapsed() >= positionRefreshMs);
  if (!changed)
    return;
  lastKey = key;
  lastPosition = position;
  lastUpdate.restart();
  desired = next;
  if (ready && (!desired.isEmpty() || published))
    publish();
}

void DiscordPresence::clear() {
  if (ready && published) {
    desired = {};
    publish();
    socket.flush();
  }
  enabled = false;
  reconnect.stop();
  socket.disconnectFromServer();
  ready = false;
  published = false;
  lastKey.clear();
  lastUpdate.invalidate();
  currentTrackId.clear();
  activityStartedAtMs = 0;
}
