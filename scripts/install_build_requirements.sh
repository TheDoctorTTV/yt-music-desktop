#!/usr/bin/env bash
# Install build dependencies on apt/nala, dnf, or pacman systems.
set -euo pipefail

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
qt_version=6.8.3
qt_root="$project_root/.tools/qt"
qt_dir="$qt_root/$qt_version/gcc_64"

if [[ "$(uname -s)" != Linux ]]; then
  printf '%s\n' 'This installer supports Linux only.' >&2
  exit 1
fi
if (( EUID == 0 )); then
  printf '%s\n' 'Run this script as your normal user; it will request sudo for system packages.' >&2
  exit 1
fi

if command -v pacman >/dev/null 2>&1; then
  manager=pacman
  sudo pacman -Syu --needed base-devel cmake curl mesa pkgconf python qt6-base qt6-webengine qt6-wayland
elif command -v dnf >/dev/null 2>&1; then
  manager=dnf
  sudo dnf install -y gcc-c++ make cmake curl mesa-libGL-devel pkgconf-pkg-config \
    python3 qt6-qtbase-devel qt6-qtwebengine-devel qt6-qtwayland-devel
elif command -v nala >/dev/null 2>&1 || command -v apt-get >/dev/null 2>&1; then
  if command -v nala >/dev/null 2>&1; then
    manager=nala
  else
    manager=apt-get
  fi
  sudo "$manager" update
  sudo "$manager" install -y build-essential cmake curl libgl1-mesa-dev pkg-config \
    python3 python3-venv qt6-base-dev qt6-webengine-dev qt6-wayland-dev
else
  printf '%s\n' 'No supported package manager found (pacman, dnf, nala, apt-get).' >&2
  exit 1
fi

# Prefer the distribution's Qt when it satisfies CMakeLists.txt's minimum.
system_qt="$(pkg-config --modversion Qt6WebEngineWidgets 2>/dev/null || true)"
if [[ -n "$system_qt" ]] && [[ "$(printf '%s\n' 6.8 "$system_qt" | sort -V | head -n 1)" == 6.8 ]]; then
  if [[ "$manager" == pacman ]]; then build_target=arch; else build_target=appimage-local; fi
  printf '\n%s installed Qt %s. Build with:\n  ./build.sh %s\n' \
    "$manager" "$system_qt" "$build_target"
  exit 0
fi

if [[ "$(uname -m)" != x86_64 ]]; then
  printf 'System Qt %s is below 6.8; automatic Qt installation currently requires x86_64.\n' "${system_qt:-unknown}" >&2
  exit 1
fi

# Older distributions, including Ubuntu 24.04, need newer Qt than their repos.
venv="$project_root/.tools/aqt-venv"
python3 -m venv "$venv"
"$venv/bin/python" -m pip install --upgrade pip aqtinstall
if [[ ! -f "$qt_dir/lib/cmake/Qt6WebEngineWidgets/Qt6WebEngineWidgetsConfig.cmake" ]]; then
  "$venv/bin/aqt" install-qt linux desktop "$qt_version" linux_gcc_64 \
    -O "$qt_root" -m qtwebengine qtwebchannel qtpositioning
fi
if [[ ! -f "$qt_dir/lib/cmake/Qt6WebEngineWidgets/Qt6WebEngineWidgetsConfig.cmake" ]]; then
  printf '%s\n' 'Qt WebEngineWidgets was not installed successfully.' >&2
  exit 1
fi
printf '\nLocal Qt %s installed. Build with:\n  ./build.sh appimage-local\n' "$qt_version"
