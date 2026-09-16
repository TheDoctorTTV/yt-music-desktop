#!/usr/bin/env bash
# Reject a release AppImage if staged binaries need a newer glibc than Ubuntu 22.04.
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
appdir="$project_root/dist/qt/AppDir"
if [[ ! -d "$appdir/usr" ]]; then
  printf '%s\n' 'AppImage staging directory is missing.' >&2
  exit 1
fi
for module in libnssutil3.so libsoftokn3.so libfreeblpriv3.so; do
  if [[ ! -f "$appdir/usr/lib/$module" ]]; then
    printf 'AppImage is missing NSS library/module: %s\n' "$module" >&2
    exit 1
  fi
done
versions="$(find "$appdir/usr" -type f -exec readelf -W --version-info {} + 2>/dev/null || true)"
max_glibc="$(printf '%s\n' "$versions" | grep -oE 'GLIBC_[0-9]+\.[0-9]+' | sort -Vu | tail -n 1)"
if [[ -z "$max_glibc" ]] || [[ "$(printf '%s\n' GLIBC_2.35 "$max_glibc" | sort -V | tail -n 1)" != GLIBC_2.35 ]]; then
  printf 'AppImage requires %s; Ubuntu 22.04 baseline is GLIBC_2.35.\n' "${max_glibc:-unknown}" >&2
  exit 1
fi
printf 'AppImage baseline check passed: maximum required %s\n' "$max_glibc"
