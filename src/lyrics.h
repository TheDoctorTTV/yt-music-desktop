#pragma once

#include <QHash>
#include <QByteArray>
#include <QJsonObject>
#include <QNetworkAccessManager>
#include <QObject>
#include <QPointer>
#include <QVariantMap>

class QNetworkReply;
class QUrl;
class QWebEnginePage;

class Lyrics : public QObject {
public:
  Lyrics(QWebEnginePage *page, bool debug);
  void update(const QVariantMap &state);
  void reset();

private:
  void show(const QJsonObject &result);
  void resolve();
  void request(const QString &provider, int stage = 0);
  void fetch(const QString &provider, const QUrl &url, int stage, int attempt = 0);
  void finish(const QString &provider, int stage, const QByteArray &body,
              bool ok);
  bool timingCompatible(const QJsonObject &text, const QJsonObject &timing) const;
  QJsonObject lrclib(const QByteArray &body, bool titleOnly) const;
  QJsonObject lyricsOvh(const QByteArray &body) const;
  QJsonObject simpMusic(const QByteArray &body) const;
  QJsonObject kugouDownload(const QByteArray &body) const;
  QUrl geniusSearch(const QByteArray &body) const;
  QJsonObject geniusLyrics(const QByteArray &body) const;
  QString searchTitle() const;

  QWebEnginePage *page;
  QNetworkAccessManager network;
  QPointer<QNetworkReply> reply;
  QHash<QString, QJsonObject> cache;
  QHash<QString, QString> providerErrors;
  QHash<QString, qint64> failedUntil;
  QString id, title, artist, choice = "auto";
  double duration = 0;
  bool open = false;
  bool debug = false;
  quint64 generation = 0;
};
