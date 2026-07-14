# yt-music-desktop

An unofficial YouTube Music desktop app built with Deno Desktop and WebKit. It keeps the official
`music.youtube.com` client responsible for authentication, catalog data, account state, and playback
while presenting a separate, fully custom desktop interface. The visible local WebKit window talks
to a hidden official-client WebKit window through a loopback-only Deno bridge.

The repository also provides a native-UI edition that displays the official `music.youtube.com`
interface directly. It uses a separate application ID and profile, so the custom and native editions
can be installed side by side.

## Development

```sh
deno task dev
```

Run the native YouTube Music interface instead with:

```sh
deno task dev:native
```

The dev task prefers WebKitGTK's native Wayland backend, falls back to X11 when Wayland is
unavailable, and uses a persistent development profile. The DMA-BUF renderer remains enabled so
WebKitGTK can use GPU-backed rendering. NVIDIA explicit sync is disabled to avoid WebKitGTK's
Wayland protocol-error crash while retaining GPU rendering.

## Frontend Preview

The custom interface includes a local mock-data preview for working on layout, responsive behavior,
and light/dark themes without requiring a signed-in YouTube Music session.

```sh
deno task preview
```

Open `http://127.0.0.1:4176/` after starting the preview server. The production interface uses the
same components and styles, with recommendation shelves, search, navigation, the queue, and player
state relayed from the official YouTube Music client over local `/api/state` and `/api/command`
routes. Those routes are bound to Deno Desktop's loopback server and are not exposed to the network.

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

Build the native-UI AppImage with:

```sh
deno task build:native
```

Its artifact is written to `dist/appimage/youtube-music-desktop-native.AppImage`.

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

The native-UI Windows build uses `deno task build:native:windows` and writes
`dist/windows/youtube-music-desktop-native.exe`.

## Icon Credit

Interface icons are from [Tabler Icons](https://github.com/tabler/tabler-icons), copyright Paweł
Kuna and contributors, and are used under the
[MIT License](https://github.com/tabler/tabler-icons/blob/main/LICENSE).
