#pragma once

#include <QByteArray>
#include <QElapsedTimer>
#include <QJsonObject>
#include <QLocalSocket>
#include <QObject>
#include <QTimer>
#include <QVariantMap>

class DiscordPresence : public QObject {
  Q_OBJECT
public:
  explicit DiscordPresence(QObject *parent = nullptr);
  ~DiscordPresence() override;
  void update(const QVariantMap &player);
  void clear();

private:
  void connectIfNeeded();
  void receive();
  void sendFrame(quint32 opcode, const QJsonObject &payload);
  void publish();
  QJsonObject activity(const QVariantMap &player) const;

  QLocalSocket socket;
  QTimer reconnect;
  QByteArray incoming;
  QJsonObject desired;
  QString lastKey;
  QElapsedTimer lastUpdate;
  double lastPosition = 0;
  QString currentTrackId;
  qint64 activityStartedAtMs = 0;
  bool enabled = false;
  bool ready = false;
  bool published = false;
};
