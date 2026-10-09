#include "../src/discord.h"

#include <QCoreApplication>
#include <QElapsedTimer>
#include <QJsonDocument>
#include <QLocalServer>
#include <QTemporaryDir>
#include <QThread>
#include <cassert>
#include <functional>

namespace {
void append32(QByteArray &bytes, quint32 value) {
  for (int shift = 0; shift < 32; shift += 8)
    bytes.append(char((value >> shift) & 0xff));
}

quint32 read32(const char *bytes) {
  return quint32(quint8(bytes[0])) | (quint32(quint8(bytes[1])) << 8) |
         (quint32(quint8(bytes[2])) << 16) |
         (quint32(quint8(bytes[3])) << 24);
}

void until(const std::function<bool()> &condition) {
  QElapsedTimer timeout;
  timeout.start();
  while (!condition() && timeout.elapsed() < 3000) {
    QCoreApplication::processEvents();
    QThread::msleep(5);
  }
  assert(condition());
}

QJsonObject nextFrame(QLocalSocket *socket) {
  QByteArray bytes;
  until([&] {
    bytes.append(socket->readAll());
    return bytes.size() >= 8 && bytes.size() >= 8 + int(read32(bytes.data() + 4));
  });
  assert(read32(bytes.data()) == 0 || read32(bytes.data()) == 1);
  return QJsonDocument::fromJson(bytes.mid(8, int(read32(bytes.data() + 4)))).object();
}

void sendReady(QLocalSocket *socket) {
  const QByteArray json = R"({"cmd":"DISPATCH","evt":"READY","data":{}})";
  QByteArray frame;
  append32(frame, 1);
  append32(frame, quint32(json.size()));
  frame.append(json);
  socket->write(frame);
  socket->flush();
}
} // namespace

int main(int argc, char **argv) {
  QCoreApplication app(argc, argv);
  QTemporaryDir dir;
  assert(dir.isValid());
  qputenv("XDG_RUNTIME_DIR", dir.path().toUtf8());
  QLocalServer server;
  assert(server.listen(dir.filePath("discord-ipc-0")));
  DiscordPresence presence;
  QVariantMap track{{"discordEnabled", true},
                    {"id", "abcdefghijk"},
                    {"title", "A test song"},
                    {"artist", "Test artist"},
                    {"status", "Playing"},
                    {"position", 10},
                    {"duration", 120}};
  presence.update(track);
  until([&] { return server.hasPendingConnections(); });
  auto *client = server.nextPendingConnection();
  const auto handshake = nextFrame(client);
  assert(handshake.value("client_id").toString() == "1558206362809274408");
  sendReady(client);
  const auto playing = nextFrame(client).value("args").toObject()
                           .value("activity").toObject();
  assert(playing.value("type").toInt() == 2);
  assert(playing.value("name").toString() == "YT Music");
  assert(playing.value("details").toString() == "A test song");
  assert(playing.value("state").toString() == "Test artist · 0:10 / 2:00");
  assert(playing.value("assets").toObject().value("small_image").toString() ==
         "yt-music-playing");
  assert(playing.value("assets").toObject().value("small_text").toString() ==
         "Playing");
  assert(playing.value("timestamps").isObject());
  const auto timestamps = playing.value("timestamps").toObject();
  assert(timestamps.value("start").toDouble() > 1000000000000.0);
  assert(!timestamps.contains("end"));
  assert(playing.value("assets").toObject().value("large_image").toString() ==
         "yt-music-discord-rpc");
  track["discordArtwork"] = QStringList{"https://lh3.googleusercontent.com/cover=w1200"};
  presence.update(track);
  const auto withArt = nextFrame(client).value("args").toObject()
                           .value("activity").toObject();
  assert(withArt.value("assets").toObject().value("large_image").toString() ==
         "https://lh3.googleusercontent.com/cover=w1200");
  track["duration"] = 0;
  presence.update(track);
  const auto awaitingDuration = nextFrame(client).value("args").toObject()
                                    .value("activity");
  assert(awaitingDuration.isNull());
  track["duration"] = 120;
  presence.update(track);
  const auto durationArrived = nextFrame(client).value("args").toObject()
                                   .value("activity").toObject();
  assert(durationArrived.value("timestamps").toObject().value("start") ==
         timestamps.value("start"));
  track["position"] = 30;
  presence.update(track);
  const auto seeked = nextFrame(client).value("args").toObject()
                          .value("activity").toObject();
  assert(seeked.value("state").toString() == "Test artist · 0:30 / 2:00");
  assert(seeked.value("timestamps").toObject().value("start") ==
         timestamps.value("start"));
  track["status"] = "Paused";
  presence.update(track);
  const auto paused = nextFrame(client).value("args").toObject()
                          .value("activity").toObject();
  assert(paused.value("state").toString() == "Test artist · 0:30 / 2:00");
  assert(paused.value("assets").toObject().value("small_image").toString() ==
         "yt-music-paused");
  assert(paused.value("assets").toObject().value("small_text").toString() ==
         "Paused");
  assert(paused.value("timestamps").toObject().value("start") ==
         timestamps.value("start"));
  assert(!paused.value("timestamps").toObject().contains("end"));
  track["position"] = 75;
  presence.update(track);
  const auto pausedSeek = nextFrame(client).value("args").toObject()
                              .value("activity").toObject();
  assert(pausedSeek.value("state").toString() == "Test artist · 1:15 / 2:00");
  assert(pausedSeek.value("timestamps").toObject().value("start") ==
         timestamps.value("start"));
  track["status"] = "Playing";
  presence.update(track);
  const auto resumed = nextFrame(client).value("args").toObject()
                           .value("activity").toObject();
  assert(resumed.value("state").toString() == "Test artist · 1:15 / 2:00");
  assert(resumed.value("assets").toObject().value("small_image").toString() ==
         "yt-music-playing");
  assert(resumed.value("timestamps").toObject().value("start") ==
         timestamps.value("start"));
  QThread::msleep(5100);
  track["position"] = 80;
  presence.update(track);
  const auto advanced = nextFrame(client).value("args").toObject()
                            .value("activity").toObject();
  assert(advanced.value("state").toString() == "Test artist · 1:20 / 2:00");
  assert(advanced.value("timestamps").toObject().value("start") ==
         timestamps.value("start"));
  track["discordEnabled"] = false;
  presence.update(track);
  const auto cleared = nextFrame(client).value("args").toObject()
                           .value("activity");
  assert(cleared.isNull());
  return 0;
}
