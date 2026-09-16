#!/usr/bin/env bash
# Build the AppImage against Ubuntu 22.04 libraries, independent of host distro.
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ "$(uname -m)" != x86_64 ]]; then
  printf '%s\n' 'The compatible AppImage build currently supports x86_64 only.' >&2
  exit 1
fi
if command -v podman >/dev/null 2>&1; then
  runtime=podman
  mount="$project_root:/work:Z"
elif command -v docker >/dev/null 2>&1; then
  runtime=docker
  mount="$project_root:/work"
else
  printf '%s\n' 'Install Podman or Docker to build the compatible AppImage.' >&2
  exit 1
fi

if ! "$runtime" info >/dev/null 2>&1; then
  if [[ "$runtime" == docker ]]; then
    printf '%s\n' \
      'Docker is installed, but this user cannot access its daemon.' \
      'Add your user to the docker group, then sign out and back in:' \
      '  sudo usermod -aG docker "$USER"' >&2
  else
    printf '%s\n' 'Podman is installed but unavailable for this user.' >&2
  fi
  exit 1
fi

image=yt-music-desktop-appimage:ubuntu-22.04
"$runtime" build -t "$image" -f "$project_root/packaging/appimage/Dockerfile" "$project_root"
"$runtime" run --rm --user "$(id -u):$(id -g)" \
  --volume "$mount" \
  -e HOME=/tmp -e BUILD_DIR=.build-appimage-ubuntu2204 \
  -e LINUXDEPLOY_DIR=/work/.tools/ubuntu2204 \
  -w /work -e APPIMAGE_BASENAME=youtube-music-desktop \
  -e CHECK_APPIMAGE_BASELINE=1 \
  "$image" ./scripts/build_linux.sh
