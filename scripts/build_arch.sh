#!/usr/bin/env bash
# Build a native Arch package from the current checkout, including unsaved-to-Git edits.
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
if ! command -v makepkg >/dev/null; then
  printf '%s\n' 'This command requires Arch Linux/CachyOS and makepkg (pacman).' >&2
  exit 1
fi
if (( EUID == 0 )); then
  printf '%s\n' 'Run ./build.sh as your normal user, without sudo.' >&2
  exit 1
fi
output="$project_root/dist/arch"
mkdir -p "$output"
exec 9>"$output/.build.lock"
flock -n 9 || { printf '%s\n' 'An Arch package build is already running.' >&2; exit 1; }
work="$output/work"
mkdir -p "$work"
archive="$work/youtube-music-desktop-source.tar.gz"
# Explicit inputs keep browser profiles, node_modules, old bundles and .git out.
tar -czf "$archive" --transform='s,^,youtube-music-desktop/,' \
  -C "$project_root" CMakeLists.txt src icons \
  packaging/net.thedoctorttv.ytmusicdesktop.desktop
checksum="$(sha256sum "$archive")"
checksum="${checksum%% *}"
sed "s/^sha256sums=.*/sha256sums=('$checksum')/" \
  "$project_root/packaging/arch/PKGBUILD" > "$work/PKGBUILD"
cd "$work"
# Do not install packages or launch the app. makepkg reports any missing dependencies.
PKGDEST="$output" SRCDEST="$work" BUILDDIR="$work" \
  makepkg --force --cleanbuild --clean --nocheck
printf '\nNative package built in: %s\n' "$output"
mapfile -t packages < <(PKGDEST="$output" makepkg --packagelist)
printf 'Install with: sudo pacman -U'
printf ' %q' "${packages[@]}"
printf '\n' 
