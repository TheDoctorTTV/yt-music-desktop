# yt-music-desktop

An unofficial YouTube Music desktop app built with Deno Desktop and WebKit. The app displays the
official `music.youtube.com` interface directly, so YouTube Music remains responsible for the UI,
authentication, catalog data, account state, and playback.

## Linux Beta Downloads

Each Linux beta release is published in two editions:

| Edition           | Release file                         | Choose this when                                                                      |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| Wayland (regular) | `youtube-music-desktop.AppImage`     | You use a Wayland session. This is the default and recommended edition.               |
| X11 compatibility | `youtube-music-desktop-x11.AppImage` | You use an X11 session, or want to run the app through XWayland in a Wayland session. |

Start with the regular Wayland release. Use the X11 compatibility release if the regular edition has
compositor or graphics-driver problems on your system. The compatibility edition forces the X11
backend; on a Wayland desktop, it therefore runs through XWayland.

Both editions use the same application identity and profile, so login state and preferences are
shared. Fully close one edition before opening the other. The most recently launched edition becomes
the target of the desktop launcher.

## Development

```sh
deno task dev
```

The development task prefers WebKitGTK's native Wayland backend and falls back to X11 when Wayland
is unavailable. It uses a persistent development profile so cookies and login state survive app
restarts. Accelerated compositing and the DMA-BUF renderer remain enabled so WebKitGTK can keep
rendering and presentation on the GPU. On NVIDIA, explicit sync is disabled to avoid WebKitGTK's
Wayland protocol-error and low-frame-rate failure mode.

At startup, the app displays a short local YouTube Music splash before navigating the same window to
the official client. Video decoding is left to WebKitGTK and GStreamer, which automatically prefer
an available hardware decoder without making the app depend on a particular GPU vendor.

## Linux AppImage Builds

The two Linux build tasks produce the pair of AppImages attached to each beta release.

Build the regular native Wayland edition:

```sh
deno task build:linux
```

The build task creates an unpacked Deno Desktop app, adds a launcher with the Wayland/X11 and NVIDIA
workarounds above, and then packages it with `appimagetool`. On the first run it downloads
`appimagetool` into `.tools/`.

The regular release file is written to:

```text
dist/appimage/youtube-music-desktop.AppImage
```

Build the X11 compatibility edition:

```sh
deno task build:linux-x11
```

The compatibility release file is written to:

```text
dist/appimage/youtube-music-desktop-x11.AppImage
```

On NVIDIA, the X11 launcher uses WebKitGTK's shared-memory presentation fallback to avoid blank
windows caused by failed GBM buffer allocation under XWayland.

The temporary AppDirs remain in `dist/appimage/youtube-music-desktop/` and
`dist/appimage/youtube-music-desktop-x11/`. Both launchers store WebKitGTK data under
`~/.local/state/net.thedoctorttv.ytmusicdesktop/`, so YouTube Music cookies and login state persist
between app launches.
