#!/usr/bin/env bash
# Common entry point for the native Arch package and portable AppImage.
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
usage() {
  printf '%s\n' \
    'Usage: ./build.sh [arch|appimage|appimage-local|all]' \
    '  arch      Build the native Arch package (default).' \
    '  appimage  Build the compatible AppImage in Ubuntu 22.04.' \
    '  appimage-local  Build an AppImage against this system (development only).' \
    '  all       Build the Arch package and compatible AppImage.'
}
if (( $# > 1 )); then
  usage >&2
  exit 2
fi
case "${1:-arch}" in
  arch) exec "$project_root/scripts/build_arch.sh" ;;
  appimage) exec "$project_root/scripts/build_appimage_compatible.sh" ;;
  appimage-local) exec "$project_root/scripts/build_linux.sh" ;;
  all)
    "$project_root/scripts/build_arch.sh"
    "$project_root/scripts/build_appimage_compatible.sh"
    ;;
  -h|--help) usage ;;
  *) usage >&2; exit 2 ;;
esac
