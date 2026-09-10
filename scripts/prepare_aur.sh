#!/usr/bin/env bash
# Prepare release-source AUR metadata after the matching GitHub tag is public.
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
version="$(sed -n 's/^project(yt_music_desktop VERSION \([^ ]*\) LANGUAGES CXX)$/\1/p' "$project_root/CMakeLists.txt")"
[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { printf '%s\n' 'Cannot determine release version.' >&2; exit 1; }
command -v makepkg >/dev/null
output="$project_root/dist/aur"
mkdir -p "$output"
archive="$output/yt-music-desktop-$version.tar.gz"
printf 'Fetching published source tag v%s...\n' "$version"
if ! curl --fail --location --retry 2 \
  "https://github.com/TheDoctorTTV/yt-music-desktop/archive/refs/tags/v$version.tar.gz" -o "$archive.tmp"; then
  rm -f "$archive.tmp"
  printf 'Push the release commit and tag v%s to GitHub first. No AUR metadata was generated.\n' "$version" >&2
  exit 1
fi
mv "$archive.tmp" "$archive"
checksum="$(sha256sum "$archive")"
checksum="${checksum%% *}"
sed -e "s/@VERSION@/$version/g" -e "s/@SHA256@/$checksum/g" \
  "$project_root/packaging/aur/PKGBUILD.in" > "$output/PKGBUILD"
(cd "$output" && makepkg --printsrcinfo > .SRCINFO)
printf 'Prepared %s/PKGBUILD and %s/.SRCINFO\n' "$output" "$output"
printf '%s\n' 'Only submit PKGBUILD and .SRCINFO to AUR; do not commit the archive or built binaries.'
