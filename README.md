# yt-music-desktop

An unofficial YouTube Music desktop app built with Deno Desktop.

## Development

```sh
deno task dev
```

The dev task uses WebKitGTK through XWayland, disables the DMABUF renderer, and points WebKitGTK at
the same persistent app profile paths used by the AppImage build.

## AppImage Build

```sh
deno task build:appimage
```

The AppImage task builds an unpacked Deno Desktop app first, patches the generated Linux launcher
with the WebKitGTK runtime environment needed on KDE Wayland/NVIDIA, then packages that patched app
directory with `appimagetool`. On the first run it downloads `appimagetool` into `.tools/`.

The AppImage is written to:

```text
dist/appimage/youtube-music-desktop.AppImage
```

`deno task build` points at the AppImage build. The temporary AppDir used for packaging stays in
`dist/appimage/youtube-music-desktop/`; the `.AppImage` file is the one to distribute.

The launcher stores WebKitGTK data under `~/.local/state/net.thedoctorttv.ytmusicdesktop/`, so
YouTube Music cookies and login state persist between app launches.

## Windows Build

```sh
deno task build:windows
```

The Windows build is written to:

```text
dist/windows/youtube-music-desktop.exe
```

