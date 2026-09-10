#include <QAction>
#include <QApplication>
#include <QBuffer>
#include <QCloseEvent>
#include <QCryptographicHash>
#include <QDBusAbstractAdaptor>
#include <QDBusConnection>
#include <QDBusMessage>
#include <QDBusObjectPath>
#include <QDesktopServices>
#include <QDir>
#include <QFile>
#include <QImage>
#include <QImageReader>
#include <QLockFile>
#include <QMainWindow>
#include <QMenuBar>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QRegularExpression>
#include <QSaveFile>
#include <QSettings>
#include <QStandardPaths>
#include <QStatusBar>
#include <QTimer>
#include <QWebEngineNewWindowRequest>
#include <QWebEnginePage>
#include <QWebEngineProfile>
#include <QWebEngineSettings>
#include <QWebEngineView>
#include <cmath>

static const QString appId = "net.thedoctorttv.ytmusicdesktop";
static const QString busPath = "/org/mpris/MediaPlayer2";
static const QString playerInterface = "org.mpris.MediaPlayer2.Player";

class Player : public QObject {
  Q_OBJECT
public:
  QWebEnginePage *page;
  QVariantMap metadata;
  QString status = "Stopped", track, artworkKey;
  qlonglong position = 0, duration = 0;
  double volume = 1;
  bool available = false, pending = false, stoppedByUser = false;
  quint64 navigation = 0;
  QNetworkAccessManager network;
  QString cache;
  quint64 generation = 0;
  explicit Player(QWebEnginePage *p) : page(p) {
    cache = QStandardPaths::writableLocation(QStandardPaths::CacheLocation) +
            "/artwork";
    QDir().mkpath(cache);
    // Bound disk usage between runs; files used by this run remain stable.
    QDir dir(cache);
    auto files = dir.entryInfoList(QDir::Files, QDir::Time);
    for (int i = 128; i < files.size(); ++i)
      QFile::remove(files[i].absoluteFilePath());
  }
  void changed(const QVariantMap &values) {
    auto msg = QDBusMessage::createSignal(
        busPath, "org.freedesktop.DBus.Properties", "PropertiesChanged");
    msg << playerInterface << values << QStringList{};
    QDBusConnection::sessionBus().send(msg);
  }
  void command(const QString &js) {
    if (page->url().host() == "music.youtube.com" || page->url().isLocalFile())
      page->runJavaScript("(() => { const v=document.querySelector('video'); "
                          "const p=document.querySelector('#movie_player'); " +
                          js + " })()");
  }
  void seek(double seconds) {
    if (!available || !std::isfinite(seconds))
      return;
    seconds = qBound(0.0, seconds, double(duration) / 1000000);
    command(QString("if(v) v.currentTime=%1;").arg(seconds, 0, 'g', 16));
  }
  void artwork(QStringList urls, quint64 token) {
    if (token != generation || urls.isEmpty())
      return;
    QUrl url(urls.takeFirst());
    const auto host = url.host();
    // Artwork is untrusted page data. Do not allow arbitrary local/network
    // URLs.
    const bool allowed = host == "i.ytimg.com" || host == "yt3.ggpht.com" ||
                         host == "lh3.googleusercontent.com" ||
                         host.endsWith(".googleusercontent.com") ||
                         host.endsWith(".ggpht.com");
    if (url.scheme() != "https" || !allowed) {
      artwork(urls, token);
      return;
    }
    QString path = cache + '/' +
                   QString(QCryptographicHash::hash(url.toEncoded(),
                                                    QCryptographicHash::Sha256)
                               .toHex()) +
                   ".png";
    auto publish = [this, token, path] {
      if (token != generation)
        return;
      metadata["mpris:artUrl"] = QUrl::fromLocalFile(path).toString();
      changed({{"Metadata", metadata}});
    };
    if (QFile::exists(path)) {
      publish();
      return;
    }
    QNetworkRequest req(url);
    req.setTransferTimeout(10000);
    req.setAttribute(QNetworkRequest::RedirectPolicyAttribute,
                     QNetworkRequest::ManualRedirectPolicy);
    auto reply = network.get(req);
    connect(reply, &QNetworkReply::downloadProgress, reply,
            [reply](qint64 bytes, qint64 total) {
              if (bytes > 16 * 1024 * 1024 || total > 16 * 1024 * 1024)
                reply->abort();
            });
    connect(reply, &QNetworkReply::finished, this, [=] {
      const auto bytes = reply->readAll();
      bool ok =
          reply->error() == QNetworkReply::NoError &&
          reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt() ==
              200;
      reply->deleteLater();
      if (token != generation)
        return;
      QBuffer buffer;
      buffer.setData(bytes);
      buffer.open(QIODevice::ReadOnly);
      QImageReader reader(&buffer);
      const auto size = reader.size();
      ok =
          ok && size.isValid() && size.width() <= 8192 && size.height() <= 8192;
      QImage image = ok ? reader.read() : QImage{};
      // YouTube sometimes returns a tiny placeholder with HTTP 200.
      ok = !image.isNull() && image.width() >= 200 && image.height() >= 150;
      if (ok) {
        QSaveFile file(path);
        ok = file.open(QIODevice::WriteOnly) && image.save(&file, "PNG") &&
             file.commit();
      }
      if (ok)
        publish();
      else
        artwork(urls, token);
    });
  }
  void update(const QVariant &result) {
    auto s = result.toMap();
    const QString id = s.value("id").toString();
    QString nextStatus = s.value("status", "Stopped").toString();
    if (id != track || nextStatus == "Playing")
      stoppedByUser = false;
    if (stoppedByUser && nextStatus == "Paused")
      nextStatus = "Stopped";
    const bool nextAvailable = s.value("available").toBool();
    const qlonglong nextPosition =
        qlonglong(s.value("position").toDouble() * 1000000);
    const auto oldPosition = position;
    position = nextPosition;
    duration = qlonglong(s.value("duration").toDouble() * 1000000);
    QVariantMap changes;
    if (status != nextStatus) {
      status = nextStatus;
      changes["PlaybackStatus"] = status;
    }
    if (available != nextAvailable) {
      available = nextAvailable;
      for (const auto &name :
           {"CanPlay", "CanPause", "CanSeek", "CanGoNext", "CanGoPrevious"})
        changes[name] = available;
    }
    double nextVolume = s.value("volume", 1).toDouble();
    if (volume != nextVolume) {
      volume = nextVolume;
      changes["Volume"] = volume;
    }
    QVariantMap next;
    if (!id.isEmpty()) {
      next["mpris:trackid"] = QVariant::fromValue(QDBusObjectPath(
          "/net/thedoctorttv/track/t" + QString(id.toUtf8().toHex())));
      next["mpris:length"] = duration;
      next["xesam:title"] = s.value("title");
      next["xesam:artist"] = QStringList{s.value("artist").toString()};
      next["xesam:album"] = s.value("album");
      next["xesam:url"] = "https://music.youtube.com/watch?v=" + id;
    }
    QStringList urls;
    for (const auto &v : s.value("artwork").toList())
      urls << v.toString();
    const QString key = id + urls.join('\n');
    bool reload = key != artworkKey;
    if (!reload && metadata.contains("mpris:artUrl"))
      next["mpris:artUrl"] = metadata["mpris:artUrl"];
    if (metadata != next) {
      metadata = next;
      changes["Metadata"] = metadata;
    }
    if (!changes.isEmpty())
      changed(changes);
    if (track == id && std::abs(position - oldPosition) > 2000000)
      emit seeked(position);
    track = id;
    if (reload) {
      artworkKey = key;
      ++generation;
      if (!id.isEmpty())
        artwork(urls, generation);
    }
  }
signals:
  void seeked(qlonglong position);
};

class RootAdaptor : public QDBusAbstractAdaptor {
  Q_OBJECT
  Q_CLASSINFO("D-Bus Interface", "org.mpris.MediaPlayer2")
  Q_PROPERTY(bool CanQuit READ yes CONSTANT)
  Q_PROPERTY(bool CanRaise READ yes CONSTANT)
  Q_PROPERTY(bool HasTrackList READ no CONSTANT)
  Q_PROPERTY(QString Identity READ identity CONSTANT)
  Q_PROPERTY(QString DesktopEntry READ desktop CONSTANT)
  Q_PROPERTY(QStringList SupportedUriSchemes READ schemes CONSTANT)
  Q_PROPERTY(QStringList SupportedMimeTypes READ mimes CONSTANT)
  QWidget *window;

public:
  RootAdaptor(Player *p, QWidget *w) : QDBusAbstractAdaptor(p), window(w) {}
  bool yes() const { return true; }
  bool no() const { return false; }
  QString identity() const { return "YouTube Music Desktop"; }
  QString desktop() const { return appId; }
  QStringList schemes() const { return {"https"}; }
  QStringList mimes() const { return {}; }
public slots:
  void Raise() {
    window->showNormal();
    window->raise();
    window->activateWindow();
  }
  void Quit() { window->close(); }
};
class PlayerAdaptor : public QDBusAbstractAdaptor {
  Q_OBJECT
  Q_CLASSINFO("D-Bus Interface", "org.mpris.MediaPlayer2.Player")
  Q_PROPERTY(QString PlaybackStatus READ playbackStatus)
  Q_PROPERTY(double Rate READ rate WRITE setRate)
  Q_PROPERTY(double MinimumRate READ rate CONSTANT)
  Q_PROPERTY(double MaximumRate READ rate CONSTANT)
  Q_PROPERTY(double Volume READ volume WRITE setVolume)
  Q_PROPERTY(QVariantMap Metadata READ metadata)
  Q_PROPERTY(qlonglong Position READ position)
  Q_PROPERTY(bool CanGoNext READ available)
  Q_PROPERTY(bool CanGoPrevious READ available)
  Q_PROPERTY(bool CanPlay READ available)
  Q_PROPERTY(bool CanPause READ available)
  Q_PROPERTY(bool CanSeek READ available)
  Q_PROPERTY(bool CanControl READ yes CONSTANT)
  Player *p;

public:
  explicit PlayerAdaptor(Player *player)
      : QDBusAbstractAdaptor(player), p(player) {
    connect(p, &Player::seeked, this, &PlayerAdaptor::Seeked);
  }
  QString playbackStatus() const { return p->status; }
  double rate() const { return 1; }
  void setRate(double) {}
  double volume() const { return p->volume; }
  void setVolume(double v) {
    if (std::isfinite(v))
      p->command(QString("if(v) v.volume=%1;").arg(qBound(0.0, v, 1.0)));
  }
  QVariantMap metadata() const { return p->metadata; }
  qlonglong position() const { return p->position; }
  bool available() const { return p->available; }
  bool yes() const { return true; }
public slots:
  void Play() {
    p->stoppedByUser = false;
    p->command("v?.play().catch(()=>{});");
  }
  void Pause() {
    p->stoppedByUser = false;
    p->command("v?.pause();");
  }
  void PlayPause() {
    p->stoppedByUser = false;
    p->command(
        "if(v) { if(v.paused) v.play().catch(()=>{}); else v.pause(); }");
  }
  void Stop() {
    p->stoppedByUser = true;
    p->command("if(v) { v.pause(); v.currentTime=0; }");
  }
  void Next() {
    p->command(
        "document.querySelector('ytmusic-player-bar .next-button')?.click();");
  }
  void Previous() {
    p->command("document.querySelector('ytmusic-player-bar "
               ".previous-button')?.click();");
  }
  void Seek(qlonglong offset) {
    p->seek(double(p->position) / 1000000 + double(offset) / 1000000);
  }
  void SetPosition(const QDBusObjectPath &id, qlonglong pos) {
    if (p->metadata.value("mpris:trackid").value<QDBusObjectPath>().path() ==
            id.path() &&
        pos >= 0 && pos <= p->duration)
      p->seek(double(pos) / 1000000);
  }
  void OpenUri(const QString &uri) {
    QUrl u(uri);
    if (u.scheme() == "https" && u.host() == "music.youtube.com")
      p->page->load(u);
  }
signals:
  void Seeked(qlonglong Position);
};

class Window : public QMainWindow {
public:
  void closeEvent(QCloseEvent *event) override {
    QSettings().setValue("geometry", saveGeometry());
    QMainWindow::closeEvent(event);
  }
};

int main(int argc, char **argv) {
  // Own desktop media integration. Keep the web Media Session API available for
  // metadata, but disable Chromium's competing system media controls service.
  QString flags = QString::fromLocal8Bit(qgetenv("QTWEBENGINE_CHROMIUM_FLAGS"));
  const QRegularExpression disabled("--disable-features=([^\\s]+)");
  const auto match = disabled.match(flags);
  if (match.hasMatch()) {
    QStringList features = match.captured(1).split(',');
    if (!features.contains("HardwareMediaKeyHandling"))
      features << "HardwareMediaKeyHandling";
    flags.replace(match.capturedStart(1), match.capturedLength(1),
                  features.join(','));
  } else
    flags += " --disable-features=HardwareMediaKeyHandling";
  qputenv("QTWEBENGINE_CHROMIUM_FLAGS", flags.toLocal8Bit());
  QApplication app(argc, argv);
  app.setApplicationName(appId);
  app.setApplicationVersion(QStringLiteral(YTMUSIC_VERSION));
  app.setOrganizationName("thedoctorttv");
  app.setApplicationDisplayName("YouTube Music Desktop");
  app.setDesktopFileName(appId);
  app.setWindowIcon(QIcon(":/icons/youtubemusic.png"));
  const QString data =
      QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation);
  QDir().mkpath(data);
  QLockFile lock(data + "/app.lock");
  if (!lock.tryLock()) {
    qWarning("YouTube Music Desktop is already running.");
    return 1;
  }
  QWebEngineProfile profile("youtube-music");
  profile.setPersistentStoragePath(data + "/chromium");
  profile.setCachePath(
      QStandardPaths::writableLocation(QStandardPaths::CacheLocation) +
      "/chromium");
  profile.setPersistentCookiesPolicy(QWebEngineProfile::ForcePersistentCookies);
  Window window;
  window.setWindowTitle("YouTube Music Desktop");
  window.resize(1200, 800);
  window.restoreGeometry(QSettings().value("geometry").toByteArray());
  auto view = new QWebEngineView(&window);
  auto page = new QWebEnginePage(&profile, view);
  view->setPage(page);
  window.setCentralWidget(view);
  page->settings()->setAttribute(
      QWebEngineSettings::PlaybackRequiresUserGesture, false);
  QObject::connect(page, &QWebEnginePage::newWindowRequested, &window,
                   [page](QWebEngineNewWindowRequest &r) {
                     const QUrl u = r.requestedUrl();
                     if (u.scheme() == "https" &&
                         (u.host() == "accounts.google.com" ||
                          u.host() == "music.youtube.com"))
                       page->load(u);
                     else if (u.scheme() == "https" || u.scheme() == "http")
                       QDesktopServices::openUrl(u);
                   });
  QObject::connect(page, &QWebEnginePage::loadFinished, &window,
                   [&window](bool ok) {
                     if (ok)
                       window.statusBar()->hide();
                     else {
                       window.statusBar()->showMessage(
                           "Page could not load. Check your connection, then "
                           "press F5 to reload.");
                       window.statusBar()->show();
                     }
                   });
  // Keep keyboard controls available even when the optional menu is absent.
  auto back = window.addAction("Back", QKeySequence("Alt+Left"), view,
                               &QWebEngineView::back);
  auto reload = window.addAction("Reload", QKeySequence::Refresh, view,
                                 &QWebEngineView::reload);
  auto quit = window.addAction("Quit", QKeySequence::Quit, &window,
                               &QWidget::close);
  const bool showMenuBar = app.arguments().contains("--menubar") ||
                           app.arguments().contains("-menubar");
  if (showMenuBar) {
    auto menu = window.menuBar()->addMenu("&App");
    menu->addAction("Home", page,
                    [page] { page->load(QUrl("https://music.youtube.com")); });
    menu->addAction(back);
    menu->addAction(reload);
    menu->addAction("Graphics diagnostics", page,
                    [page] { page->load(QUrl("chrome://gpu")); });
    menu->addSeparator();
    menu->addAction(quit);
  }
  Player player(page);
  new RootAdaptor(&player, &window);
  new PlayerAdaptor(&player);
  auto bus = QDBusConnection::sessionBus();
  if (!bus.registerService("org.mpris.MediaPlayer2.ytmusicdesktop") ||
      !bus.registerObject(busPath, &player, QDBusConnection::ExportAdaptors))
    qWarning("Could not register MPRIS on the session bus.");
  QFile scriptFile(":/src/player.js");
  if (!scriptFile.open(QIODevice::ReadOnly))
    qFatal("Missing player bridge resource");
  const QString script = QString::fromUtf8(scriptFile.readAll());
  QObject::connect(page, &QWebEnginePage::loadStarted, &player, [&player] {
    ++player.navigation;
    player.update(QVariantMap{});
  });
  QTimer poll;
  QObject::connect(&poll, &QTimer::timeout, &player, [&] {
    if (player.pending)
      return;
    if (page->url().host() != "music.youtube.com" &&
        !page->url().isLocalFile()) {
      player.update(QVariantMap{});
      return;
    }
    player.pending = true;
    const auto navigation = player.navigation;
    page->runJavaScript(script, [&player, navigation](const QVariant &v) {
      player.pending = false;
      if (navigation == player.navigation)
        player.update(v);
    });
  });
  poll.start(500);
  QUrl start("https://music.youtube.com");
  // Local integration fixture, with a separate XDG profile supplied by the
  // test.
  if (app.arguments().size() == 3 && app.arguments()[1] == "--test-page")
    start =
        QUrl::fromLocalFile(QFileInfo(app.arguments()[2]).absoluteFilePath());
  page->load(start);
  window.show();
  const int result = app.exec();
  poll.stop();
  bus.unregisterObject(busPath);
  bus.unregisterService("org.mpris.MediaPlayer2.ytmusicdesktop");
  // Destroy the page before its profile and before callback receivers
  // disappear.
  delete view;
  return result;
}
#include "main.moc"
