# YouTube Music Desktop 1.0.0

An unofficial YouTube Music app using **Qt 6 WebEngine (Chromium)** and a native
Linux MPRIS service. The official website provides browsing, login and playback.
Qt WebEngine embeds Chromium directly; CEF is not an additional dependency.

## Build packages

Use the same entry point for either format:

```sh
./build.sh all       # Arch package and compatible AppImage
./build.sh arch      # Arch package only (also the default for ./build.sh)
./build.sh appimage  # Compatible AppImage in Ubuntu 22.04 container
./build.sh appimage-local  # AppImage against this system (development only)
```

Outputs:

- Arch: `dist/arch/yt-music-desktop-*.pkg.tar.zst`
- AppImage: `dist/qt/youtube-music-desktop.AppImage`
- Local development AppImage: `dist/qt/youtube-music-desktop.local.AppImage`

Neither build installs or launches the app or runs tests. AppImage packaging
may download its build tools/runtime; Arch packaging uses installed system
libraries. `BUILD_JOBS=8 ./build.sh all` changes the build parallelism.

### Install build requirements

On Linux with apt, nala, dnf, or pacman, run:

```sh
./scripts/install_build_requirements.sh
```

The installer asks for `sudo` for system packages and prints the build command
when it finishes. It uses the distribution's Qt if it is at least 6.8. On older
distributions such as Ubuntu 24.04, it downloads Qt 6.8.3 into `.tools/qt/`
on x86_64; the AppImage build uses that copy automatically. Qt WebEngine is a
large download. Use `./build.sh arch` on pacman systems or
`./build.sh appimage-local` for a local development build on apt/nala and dnf.

### Compatible AppImage release build

For an AppImage intended to run on older distributions, build in the Ubuntu
22.04 x86_64 container with Podman or Docker:

```sh
./build.sh appimage
```

This uses glibc 2.35 as the build baseline and bundles Qt 6.8.3. It checks the
bundled binaries' glibc requirements before accepting the AppImage in
`dist/qt/youtube-music-desktop.AppImage`. The first run downloads
the container image and Qt, so it needs network access and several gigabytes
of free space. `./build.sh appimage-local` uses the current system's libraries
and should be treated as a local build. Test the release
AppImage on Ubuntu 22.04 and newer systems before publishing it.

### Arch/CachyOS package

From this project directory, run one command:

```sh
./build.sh
```

This builds a native `yt-music-desktop-*.pkg.tar.zst` package in `dist/arch/`
from the current source, including uncommitted edits. It uses system Qt packages
instead of bundling Chromium/Qt. The package contains the executable, application
menu entry, and icon. The build does not install anything, run tests, or launch
the app.

Install the result with:

```sh
sudo pacman -U dist/arch/yt-music-desktop-1.0.0-1-x86_64.pkg.tar.zst
```

The package is named `yt-music-desktop` to avoid colliding with an unrelated AUR
package named `youtube-music-desktop`. It replaces this project's earlier local
packages with that old name.

Then launch **YouTube Music Desktop** from your application menu, or run
`youtube-music-desktop`. It shares the same profile as the Qt AppImage, so close
that instance first. Existing Chromium login data is preserved.

On a fresh Arch/CachyOS system, install build dependencies once:

```sh
sudo pacman -S --needed base-devel cmake qt6-base qt6-webengine qt6-wayland
```

Runtime dependencies are recorded in the package and managed by pacman. They
still occupy disk space but are shared with other applications. Run `./build.sh`
again after source changes. The recipe is `packaging/arch/PKGBUILD`;
`build.sh` generates a checksummed local source archive for it.

## Development build and run

Requires C++17, CMake 3.24+, Qt 6.8+ Widgets, WebEngineWidgets, Network and D-Bus.
Qt 6.11+ is recommended for the current NVIDIA graphics integration.
On Arch/CachyOS, the relevant packages are `base-devel cmake qt6-base
qt6-webengine qt6-wayland`. Node.js is used only by the bridge tests.

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --parallel 4
./build/youtube-music-desktop
```

The menu bar is hidden by default. To show the **App** menu, start with:

```sh
youtube-music-desktop --menubar
```

`-menubar` is also accepted. Close any running instance before changing startup
flags. F5 (reload), Alt+Left (back), and Ctrl+Q (quit) remain available with the
menu hidden.

Qt selects the desktop platform automatically. To explicitly test native Wayland:

```sh
QT_QPA_PLATFORM=wayland ./build/youtube-music-desktop
```

The same executable supports X11 with `QT_QPA_PLATFORM=xcb`. No WebKit environment
variables, NVIDIA explicit-sync override, software-rendering flag, or cookie
preload hook is installed. With `--menubar`, **App → Graphics diagnostics** opens `chrome://gpu`.
Hardware rendering and hardware video decoding are separate; inspect diagnostics
and actual playback on the target driver before assuming either is accelerated.
Chromium's sandbox remains enabled.

## Desktop media controls and artwork

The app owns `org.mpris.MediaPlayer2.ytmusicdesktop` on the session bus. It exposes
track information, playback state, volume, position, play/pause, next/previous,
and seeking. Chromium's hardware media key integration is disabled to avoid a
competing desktop player; the website's Media Session API remains available.

The bridge reads YouTube Music's Media Session metadata and current video data:

1. Prefer album artwork, requesting a 1200-pixel version when the Google image URL
   has a recognized size parameter; retain its original URL as a fallback.
2. If album artwork is absent or cannot be downloaded, request the current video's
   `maxresdefault.jpg`, then `hqdefault.jpg`. Original video-image URLs are a final fallback.
3. Reject failed downloads and tiny placeholder images, cache the decoded image
   without downscaling, and publish a local `file:` URL as `mpris:artUrl`.

Artwork resolution depends on the available source. This does not upscale small
images. Downloads have size/time limits and are restricted to YouTube/Google
image hosts. Track changes invalidate old requests so artwork cannot arrive late
and overwrite another track. The cache is trimmed to the latest 128 files at
startup. Desktop widgets can still choose their own display size.

The website bridge is in `src/player.js`. YouTube can change its page structure;
this adapter may need maintenance. No account credentials are exposed over D-Bus.

## Profile and migration

Qt stores the new profile under its standard application data directory, normally
`~/.local/share/thedoctorttv/net.thedoctorttv.ytmusicdesktop/chromium/`, with cache
under the corresponding `~/.cache/` directory. Window geometry is saved through
QSettings. Only one instance may use the profile at a time.

The old Deno/WebKit profile is left untouched. Chromium cannot directly reuse its
cookie database: sign in again. Google sign-in compatibility must be verified
with your account; no authentication bypass or browser identity spoofing is used.

## Tests

```sh
cmake -S . -B build -DBUILD_TESTING=ON
ctest --test-dir build --output-on-failure
# Requires Python 3, gdbus, dbus-run-session, a Wayland display and network access:
dbus-run-session -- python3 tests/integration.py build/youtube-music-desktop
```

The integration test uses a temporary profile, private D-Bus session, a local
silent-media fixture and a public YouTube thumbnail. It checks MPRIS commands,
metadata types, artwork fallback/dimensions, and absence of a duplicate player.
It does not sign in or claim to verify production YouTube playback.

## Other install and packaging options

```sh
cmake --install build --prefix "$HOME/.local"
# Build an AppImage (downloads linuxdeploy and its Qt plugin to .tools/):
./build.sh appimage-local
```

The new AppImage is written to `dist/qt/youtube-music-desktop.AppImage`. The Qt
plugin bundles WebEngine resources and its helper process as well as Qt plugins.
Build release packages on the oldest supported distribution; building on rolling
Arch does not make the result compatible with older glibc systems. Test a package
on a clean target system before publishing it. Old files in `dist/appimage/` are
Deno builds and are not updated by this build.

# Disclaimer
This project was made with the assistance of AI.
