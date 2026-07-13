# yt-music-desktop

An unofficial YouTube Music desktop app built with Deno Desktop.

## Development

```sh
deno task dev
```

The dev task prefers WebKitGTK's native Wayland backend, falls back to X11 when Wayland is
unavailable, and points WebKitGTK at the same persistent app profile paths used by the AppImage
build. The DMA-BUF renderer remains enabled so WebKitGTK can use GPU-backed rendering. NVIDIA
explicit sync is disabled to avoid WebKitGTK's Wayland protocol-error crash while retaining GPU
rendering.

## AppImage Build

```sh
deno task build:appimage
```

The AppImage task builds an unpacked Deno Desktop app first, adds a launcher that prefers native
Wayland with an X11 fallback and keeps WebKitGTK's DMA-BUF renderer enabled, then packages that app
directory with `appimagetool`. On NVIDIA systems, the launcher applies the explicit-sync workaround
required by WebKitGTK; other GPUs are unaffected. On the first run it downloads `appimagetool` into
`.tools/`.

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

The Windows task first builds Deno Desktop's normal Windows folder bundle, then packages that bundle
into one launcher `.exe`. The single-file Windows build is written to:

```text
dist/windows/youtube-music-desktop.exe
```

The intermediate Deno Desktop folder remains in `dist/windows/youtube-music-desktop/` for
inspection, but the top-level `.exe` is the file to distribute.
