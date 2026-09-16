#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"
qt_dir="$project_root/.tools/qt/6.8.3/gcc_64"
system_qt="$(pkg-config --modversion Qt6WebEngineWidgets 2>/dev/null || true)"
if [[ -z "${CMAKE_PREFIX_PATH:-}" && -d "$qt_dir/lib/cmake/Qt6" ]] &&
   { [[ -z "$system_qt" ]] || [[ "$(printf '%s\n' 6.8 "$system_qt" | sort -V | head -n 1)" != 6.8 ]]; }; then
  export CMAKE_PREFIX_PATH="$qt_dir${CMAKE_PREFIX_PATH:+:$CMAKE_PREFIX_PATH}"
  if [[ -x "$qt_dir/bin/qmake6" ]]; then
    export QMAKE="${QMAKE:-$qt_dir/bin/qmake6}"
  else
    export QMAKE="${QMAKE:-$qt_dir/bin/qmake}"
  fi
fi
mkdir -p dist/qt
exec 9>"$project_root/dist/qt/.build.lock"
flock -n 9 || { printf '%s\n' 'An AppImage build is already running.' >&2; exit 1; }
build_dir="${BUILD_DIR:-build}"
cmake -S . -B "$build_dir" -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF
cmake --build "$build_dir" --parallel "${BUILD_JOBS:-4}"
# Stage a new AppDir without overwriting previous Deno release artifacts.
appdir="$project_root/dist/qt/AppDir"
rm -rf -- "$appdir"
tool_dir="${LINUXDEPLOY_DIR:-$project_root/.tools}"
mkdir -p "$appdir" "$tool_dir"
DESTDIR="$appdir" cmake --install "$build_dir" --prefix /usr
for tool in linuxdeploy linuxdeploy-plugin-qt; do
  path="$tool_dir/$tool-x86_64.AppImage"
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
qt_libs="$($QMAKE -query QT_INSTALL_LIBS)"
export LD_LIBRARY_PATH="$qt_libs${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
qt_plugins="$($QMAKE -query QT_INSTALL_PLUGINS)"
# Qt 6.10+ combines the Wayland platform plugins into libqwayland.so.
if [[ -f "$qt_plugins/platforms/libqwayland.so" ]]; then
  export EXTRA_PLATFORM_PLUGINS=libqwayland.so
else
  export EXTRA_PLATFORM_PLUGINS='libqwayland-egl.so;libqwayland-generic.so'
fi
# Build to a separate file: never overwrite a currently mounted AppImage in place.
export OUTPUT="$project_root/dist/qt/youtube-music-desktop.next.AppImage"
"$tool_dir/linuxdeploy-x86_64.AppImage" --appdir "$appdir"
# A music player does not use serial GPS receivers. Exclude the optional NMEA
# plugin, which can be installed without its optional QtSerialPort dependency.
"$tool_dir/linuxdeploy-plugin-qt-x86_64.AppImage" --appdir "$appdir" --exclude-library=libqtposition_nmea.so
# linuxdeploy-plugin-qt omits this dynamically loaded Qt Wayland plugin family.
# The platform plugin alone can create a taskbar entry but cannot draw a window.
wayland_graphics="$appdir/usr/plugins/wayland-graphics-integration-client"
mkdir -p "$wayland_graphics"
cp -a "$qt_plugins/wayland-graphics-integration-client/." "$wayland_graphics/"
"$tool_dir/linuxdeploy-x86_64.AppImage" --appdir "$appdir" \
  --deploy-deps-only "$wayland_graphics" --output appimage
mv -f "$OUTPUT" "$project_root/dist/qt/youtube-music-desktop.AppImage"
OUTPUT="$project_root/dist/qt/youtube-music-desktop.AppImage"
printf 'AppImage: %s\n' "$OUTPUT"
