#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_root"

if [[ "${1:-}" == "--no-build" ]]; then
  shift
  if [[ ! -x build/youtube-music-desktop ]]; then
    printf '%s\n' 'No local executable found. Run ./run-local.sh once to build it.' >&2
    exit 1
  fi
else
  cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=OFF
  cmake --build build --parallel "${BUILD_JOBS:-4}"
fi

log_file="${YTMD_LOG_FILE:-/tmp/ytmd-local.log}"
printf 'Starting local app. Live log: %s\n' "$log_file"
./build/youtube-music-desktop --debug "$@" 2>&1 | tee "$log_file"
