const variant = Deno.args[1] ?? "custom";
if (variant !== "custom" && variant !== "native") {
  throw new Error(`Unknown app variant: ${variant}`);
}

const nativeUi = variant === "native";
const APP_ID = nativeUi
  ? "net.thedoctorttv.ytmusicdesktop.native"
  : "net.thedoctorttv.ytmusicdesktop";
const APP_NAME = nativeUi ? "youtube-music-desktop-native" : "youtube-music-desktop";
const APP_DISPLAY_NAME = nativeUi ? "YouTube Music Desktop Native" : "YouTube Music Desktop";
const ENTRYPOINT = nativeUi ? "main_native.ts" : "main.ts";
const DENO_CONFIG = nativeUi ? "./deno.native.json" : "./deno.json";
const APP_ICON_FILE = `${APP_ID}.png`;
const APPIMAGE_TOOL_URL =
  "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage";

const rootUrl = new URL("../", import.meta.url);
const rootPath = rootUrl.pathname;
const mode = Deno.args[0] ?? "appimage";

const appDirPath = new URL(`../dist/appimage/${APP_NAME}`, import.meta.url).pathname;
const appImagePath = new URL(`../dist/appimage/${APP_NAME}.AppImage`, import.meta.url).pathname;
const toolPath = new URL("../.tools/appimagetool-x86_64.AppImage", import.meta.url).pathname;
const iconPath = new URL("../icons/youtubemusic.png", import.meta.url).pathname;
const cookieHookSourcePath = new URL("./ytmusic_cookie_hook.c", import.meta.url).pathname;
const cookieHookBuildPath = new URL("../.tools/ytmusic-cookie-hook.so", import.meta.url).pathname;
const cookieHookFile = "ytmusic-cookie-hook.so";

const youtubeMusicHosts = [
  "127.0.0.1",
  "music.youtube.com",
  "www.youtube.com",
  "accounts.google.com",
  "google.com",
  "gstatic.com",
  "googleusercontent.com",
  "ytimg.com",
].join(",");

async function removeIfExists(path: string): Promise<void> {
  try {
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
}

async function run(command: string, args: string[], env?: Record<string, string>): Promise<void> {
  const child = new Deno.Command(command, {
    args,
    cwd: rootPath,
    env,
    stdout: "inherit",
    stderr: "inherit",
  });

  const status = await child.output();

  if (!status.success) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${status.code}`);
  }
}

async function buildLinuxDirectory(outputPath: string): Promise<void> {
  await removeIfExists(outputPath);

  await run(Deno.execPath(), [
    "desktop",
    "--config",
    DENO_CONFIG,
    "--exclude-unused-npm",
    "--exclude",
    "node_modules",
    "--icon",
    "./icons/youtubemusic.png",
    `--allow-net=${youtubeMusicHosts}`,
    "--output",
    outputPath,
    ENTRYPOINT,
  ]);
}

async function buildCookieHook(): Promise<void> {
  await Deno.mkdir(new URL("../.tools", import.meta.url), { recursive: true });

  await run("cc", [
    "-shared",
    "-fPIC",
    "-O2",
    "-Wall",
    "-Wextra",
    "-o",
    cookieHookBuildPath,
    cookieHookSourcePath,
    "-ldl",
  ]);
}

async function copyCookieHook(appPath: string): Promise<void> {
  await Deno.copyFile(cookieHookBuildPath, `${appPath}/${cookieHookFile}`);
}

async function createLauncherWrapper(appPath: string): Promise<void> {
  const launcherPath = `${appPath}/${APP_NAME}`;
  const binaryFile = `${APP_NAME}.bin`;
  const binaryPath = `${appPath}/${binaryFile}`;
  const wrapper = [
    "#!/bin/sh",
    "set -eu",
    "",
    'DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"',
    `export LAUFEY_RUNTIME_PATH="$DIR/${APP_NAME}.so"`,
    "",
    "# YouTube Music Desktop WebKitGTK runtime environment",
    `export YTMUSIC_PROFILE_DIR="\${YTMUSIC_PROFILE_DIR:-\${XDG_STATE_HOME:-$HOME/.local/state}/${APP_ID}}"`,
    'mkdir -p "$YTMUSIC_PROFILE_DIR/data" "$YTMUSIC_PROFILE_DIR/cache" "$YTMUSIC_PROFILE_DIR/config"',
    'export XDG_DATA_HOME="$YTMUSIC_PROFILE_DIR/data"',
    'export XDG_CACHE_HOME="$YTMUSIC_PROFILE_DIR/cache"',
    'export XDG_CONFIG_HOME="$YTMUSIC_PROFILE_DIR/config"',
    `export LD_PRELOAD="$DIR/${cookieHookFile}\${LD_PRELOAD:+:$LD_PRELOAD}"`,
    `export LAUFEY_APP_ID="\${LAUFEY_APP_ID:-${APP_ID}}"`,
    `export LAUFEY_APP_NAME="\${LAUFEY_APP_NAME:-${APP_DISPLAY_NAME}}"`,
    `export LAUFEY_APP_ICON="\${LAUFEY_APP_ICON:-$DIR/${APP_ICON_FILE}}"`,
    'export GDK_BACKEND="${GDK_BACKEND:-wayland,x11}"',
    "if [ -e /proc/driver/nvidia/version ]; then",
    '  export __NV_DISABLE_EXPLICIT_SYNC="${__NV_DISABLE_EXPLICIT_SYNC:-1}"',
    "fi",
    "",
    `exec "$DIR/${binaryFile}" "$@"`,
    "",
  ].join("\n");

  await Deno.rename(launcherPath, binaryPath);
  await Deno.writeTextFile(launcherPath, wrapper);
  await Deno.chmod(launcherPath, 0o755);
}

async function patchDesktopMetadata(appPath: string): Promise<void> {
  const desktopPath = `${appPath}/${APP_ID}.desktop`;
  const iconOutputPath = `${appPath}/${APP_ICON_FILE}`;
  const legacyIconOutputPath = `${appPath}/AppIcon.png`;
  const desktopEntries = [];
  for await (const entry of Deno.readDir(appPath)) {
    if (entry.isFile && entry.name.endsWith(".desktop")) desktopEntries.push(entry.name);
  }
  const sourceDesktopPath = desktopEntries.includes(`${APP_ID}.desktop`)
    ? desktopPath
    : desktopEntries.length === 1
    ? `${appPath}/${desktopEntries[0]}`
    : "";
  if (!sourceDesktopPath) {
    throw new Error(`Expected one desktop entry in ${appPath}`);
  }
  const original = await Deno.readTextFile(sourceDesktopPath);
  const patched = original
    .replace(/^Name=.*$/m, `Name=${APP_DISPLAY_NAME}`)
    .replace(/^Exec=.*$/m, `Exec=${APP_NAME}`)
    .replace(/^Icon=.*$/m, `Icon=${APP_ID}`)
    .replace(/^Categories=.*$/m, "Categories=AudioVideo;Audio;Music;Player;");

  await Deno.writeTextFile(desktopPath, patched);
  if (sourceDesktopPath !== desktopPath) await Deno.remove(sourceDesktopPath);
  await Deno.copyFile(iconPath, iconOutputPath);
  await Deno.copyFile(iconPath, legacyIconOutputPath);
}

async function ensureAppRun(appPath: string): Promise<void> {
  const appRunPath = `${appPath}/AppRun`;

  await removeIfExists(appRunPath);
  await Deno.copyFile(`${appPath}/${APP_NAME}`, appRunPath);
  await Deno.chmod(appRunPath, 0o755);
}

async function ensureAppImageTool(): Promise<string> {
  try {
    const file = await Deno.stat(toolPath);

    if (file.isFile) {
      return toolPath;
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  console.log("Downloading appimagetool...");

  const response = await fetch(APPIMAGE_TOOL_URL);

  if (!response.ok) {
    throw new Error(`Failed to download appimagetool: ${response.status} ${response.statusText}`);
  }

  await Deno.mkdir(new URL("../.tools", import.meta.url), { recursive: true });
  await Deno.writeFile(toolPath, response.body!);
  await Deno.chmod(toolPath, 0o755);

  return toolPath;
}

if (mode !== "appimage") {
  throw new Error(`Unknown Linux build mode: ${mode}`);
}

await buildLinuxDirectory(appDirPath);
await buildCookieHook();
await copyCookieHook(appDirPath);
await createLauncherWrapper(appDirPath);
await patchDesktopMetadata(appDirPath);
await ensureAppRun(appDirPath);
await removeIfExists(appImagePath);

const appImageTool = await ensureAppImageTool();

await run(appImageTool, [appDirPath, appImagePath], {
  APPIMAGE_EXTRACT_AND_RUN: "1",
  ARCH: "x86_64",
});

console.log(`AppImage written to ${appImagePath}`);
