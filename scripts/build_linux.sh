#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"
mkdir -p dist/qt
exec 9>"$project_root/dist/qt/.build.lock"
flock -n 9 || { printf '%s\n' 'An AppImage build is already running.' >&2; exit 1; }
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF
cmake --build build --parallel "${BUILD_JOBS:-4}"
# Stage a new AppDir without overwriting previous Deno release artifacts.
appdir="$project_root/dist/qt/AppDir"
mkdir -p "$appdir" .tools
DESTDIR="$appdir" cmake --install build --prefix /usr
for tool in linuxdeploy linuxdeploy-plugin-qt; do
  path="$project_root/.tools/$tool-x86_64.AppImage"
  if [[ ! -x "$path" ]]; then
    curl --fail --location --retry 3 "https://github.com/linuxdeploy/$tool/releases/download/continuous/$tool-x86_64.AppImage" -o "$path.tmp"
    chmod +x "$path.tmp"
    mv "$path.tmp" "$path"
  fi
done
export APPIMAGE_EXTRACT_AND_RUN=1
# The deployer's bundled strip can predate modern RELR sections in system Qt.
export NO_STRIP=1
export QMAKE="${QMAKE:-/usr/bin/qmake6}"
qt_plugins="$($QMAKE -query QT_INSTALL_PLUGINS)"
# Qt 6.10+ combines the Wayland platform plugins into libqwayland.so.
if [[ -f "$qt_plugins/platforms/libqwayland.so" ]]; then
  export EXTRA_PLATFORM_PLUGINS=libqwayland.so
else
  export EXTRA_PLATFORM_PLUGINS='libqwayland-egl.so;libqwayland-generic.so'
fi
# Build to a separate file: never overwrite a currently mounted AppImage in place.
export OUTPUT="$project_root/dist/qt/youtube-music-desktop.next.AppImage"
"$project_root/.tools/linuxdeploy-x86_64.AppImage" --appdir "$appdir"
# A music player does not use serial GPS receivers. Exclude the optional NMEA
# plugin, which can be installed without its optional QtSerialPort dependency.
"$project_root/.tools/linuxdeploy-plugin-qt-x86_64.AppImage" --appdir "$appdir" --exclude-library=libqtposition_nmea.so
# linuxdeploy-plugin-qt omits this dynamically loaded Qt Wayland plugin family.
# The platform plugin alone can create a taskbar entry but cannot draw a window.
wayland_graphics="$appdir/usr/plugins/wayland-graphics-integration-client"
mkdir -p "$wayland_graphics"
cp -a "$qt_plugins/wayland-graphics-integration-client/." "$wayland_graphics/"
"$project_root/.tools/linuxdeploy-x86_64.AppImage" --appdir "$appdir" \
  --deploy-deps-only "$wayland_graphics" --output appimage
mv -f "$OUTPUT" "$project_root/dist/qt/youtube-music-desktop.AppImage"
OUTPUT="$project_root/dist/qt/youtube-music-desktop.AppImage"
printf 'AppImage: %s\n' "$OUTPUT"
