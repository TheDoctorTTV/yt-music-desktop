# Changelog

## 1.0.0 — 2026-09-10

First stable Qt release. This is the cumulative release changelog from the
`v0.2.0` Git tag to 1.0.0, including changes made during the intervening beta work.

### Application and interface

- Replaced the Deno Desktop/TypeScript shell and WebKitGTK engine with a C++17
  application using Qt 6 WebEngine, which embeds Chromium directly.
- Kept the official YouTube Music interface for browsing, authentication,
  libraries, playlists and playback.
- Open the website directly, removing the local HTTP splash server and startup
  animation.
- Hide the native App menu by default. Enable it with `--menubar` or `-menubar`.
- Keep reload, back and quit keyboard shortcuts available without the menu bar.
- Add Home, Back, Reload, Graphics diagnostics and Quit to the optional menu.
- Show a connection-error message with a reload instruction when a page fails
  to load.
- Save and restore window geometry; prevent simultaneous instances from using
  the same browser profile.
- Handle supported Google sign-in/YouTube Music popup URLs in the application
  and open other HTTP(S) popup links in the external browser.
- Use a persistent Chromium profile for cookies and browser storage through
  supported Qt APIs, replacing the WebKit cookie preload hook.

### Media controls and artwork

- Add an application-owned MPRIS service for Linux desktop media controls.
- Publish track title, artist, album when available, duration, position and
  playback state independently of Chromium's system media controls.
- Support play, pause, play/pause, stop, next, previous, seeking, volume, raise
  and quit; reject SetPosition requests for stale track IDs.
- Disable Chromium's competing hardware-media-key integration to avoid duplicate
  media player entries.
- Prefer album artwork and request a 1200-pixel version when the Google image URL
  supports the recognized size parameters; retain the original as a fallback.
- Fall back to the video's maximum-resolution thumbnail, then its high-quality
  thumbnail, when artwork is absent or fails to download.
- Cache artwork without downscaling and expose the full-size local image through
  `mpris:artUrl`. Reject failed downloads and tiny placeholder images.
- Limit artwork download time and size, restrict image hosts, and trim the cache
  at startup.
- Prevent late artwork downloads or old page callbacks from overwriting the
  current track's metadata after a track change or navigation.

### Linux builds and fixes

- Add native Arch/CachyOS packaging with system Qt dependencies, an application
  launcher and icon. This avoids embedding Chromium and Qt in the native package.
- Replace Deno build tasks with CMake and a common build entry point:
  `./build.sh arch`, `./build.sh appimage`, or `./build.sh all`.
  Plain `./build.sh` continues to select the Arch build.
- Package Qt WebEngine's helper process, resources, translations and desktop
  plugins in the AppImage.
- Fix the AppImage appearing on the taskbar without drawing a window by bundling
  the missing Wayland graphics integration plugins and their dependencies.
- Support native Wayland and X11 with the same Qt executable, replacing separate
  Deno Wayland and X11 compatibility editions.
- Remove WebKit-specific NVIDIA explicit-sync, compositing and shared-memory
  fallback overrides. The Qt rendering stack now selects its graphics path.
- Exclude an unused serial-GPS plugin from the AppImage to avoid a missing
  optional QtSerialPort dependency during packaging.
- Avoid the deployer's outdated stripping tool, which could not process modern
  RELR sections in the system Qt libraries.
- Replace completed AppImages atomically so a running mounted image is not
  overwritten in place; prevent concurrent builds of the same package format.
- Add bridge and MPRIS integration checks, including artwork fallback and Qt
  rendering-error detection. Normal build commands do not run these tests,
  install packages, or launch the application.
- Prepare a separate tagged-source AUR recipe and submission instructions.

### Migration and compatibility

- Requires Qt 6.8 or newer; Qt 6.11 or newer is recommended for the current NVIDIA
  graphics integration.
- WebKit cookies are not imported into Chromium. Existing WebKit data is left
  untouched, and users upgrading from the Deno version must sign in again.
- The Qt AppImage and native Arch package share the same application profile;
  close one before launching the other.
- An old per-user AppImage launcher or KDE menu exclusion can override/hide the
  installed launcher. Remove that stale override if upgrading from such a setup.
- The former Windows Deno build is removed. This release provides Linux AppImage
  and Arch package build workflows; a Qt Windows package is not provided.
- Hardware-accelerated rendering was observed on NVIDIA/Wayland. The tested Qt
  build reports software video decoding; GPU rendering does not imply hardware
  video decoding. Artwork quality remains limited by the available source.
