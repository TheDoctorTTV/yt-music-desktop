const APP_ID = "net.thedoctorttv.ytmusicdesktop";
const APP_NAME = "youtube-music-desktop";
const APP_DISPLAY_NAME = "YouTube Music Desktop";
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
    "--icon",
    "./icons/youtubemusic.png",
    `--allow-net=${youtubeMusicHosts}`,
    "--output",
    outputPath,
    "main.ts",
  ]);
}

async function patchLauncher(appPath: string): Promise<void> {
  const launcherPath = `${appPath}/${APP_NAME}`;
  const marker = "# YouTube Music Desktop WebKitGTK runtime environment";
  const original = await Deno.readTextFile(launcherPath);

  if (original.includes(marker)) {
    return;
  }

  const anchor = `export LAUFEY_RUNTIME_PATH="$DIR/${APP_NAME}.so"\n`;
  const environment = [
    anchor.trimEnd(),
    "",
    marker,
    'export YTMUSIC_PROFILE_DIR="${YTMUSIC_PROFILE_DIR:-${XDG_STATE_HOME:-$HOME/.local/state}/net.thedoctorttv.ytmusicdesktop}"',
    'mkdir -p "$YTMUSIC_PROFILE_DIR/data" "$YTMUSIC_PROFILE_DIR/cache" "$YTMUSIC_PROFILE_DIR/config"',
    'export XDG_DATA_HOME="$YTMUSIC_PROFILE_DIR/data"',
    'export XDG_CACHE_HOME="$YTMUSIC_PROFILE_DIR/cache"',
    'export XDG_CONFIG_HOME="$YTMUSIC_PROFILE_DIR/config"',
    `export LAUFEY_APP_ID="\${LAUFEY_APP_ID:-${APP_ID}}"`,
    `export LAUFEY_APP_NAME="\${LAUFEY_APP_NAME:-${APP_DISPLAY_NAME}}"`,
    `export LAUFEY_APP_ICON="\${LAUFEY_APP_ICON:-$DIR/${APP_ICON_FILE}}"`,
    'export GDK_BACKEND="${GDK_BACKEND:-x11}"',
    'export WEBKIT_DISABLE_DMABUF_RENDERER="${WEBKIT_DISABLE_DMABUF_RENDERER:-1}"',
    "",
  ].join("\n");

  if (!original.includes(anchor)) {
    throw new Error(`Could not find LAUFEY_RUNTIME_PATH in ${launcherPath}`);
  }

  await Deno.writeTextFile(launcherPath, original.replace(anchor, environment));
}

async function patchDesktopMetadata(appPath: string): Promise<void> {
  const desktopPath = `${appPath}/${APP_ID}.desktop`;
  const iconOutputPath = `${appPath}/${APP_ICON_FILE}`;
  const legacyIconOutputPath = `${appPath}/AppIcon.png`;
  const original = await Deno.readTextFile(desktopPath);
  const patched = original
    .replace(/^Name=.*$/m, `Name=${APP_DISPLAY_NAME}`)
    .replace(/^Exec=.*$/m, `Exec=${APP_NAME}`)
    .replace(/^Icon=.*$/m, `Icon=${APP_ID}`)
    .replace(/^Categories=.*$/m, "Categories=AudioVideo;Audio;Music;Player;");

  await Deno.writeTextFile(desktopPath, patched);
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
await patchLauncher(appDirPath);
await patchDesktopMetadata(appDirPath);
await ensureAppRun(appDirPath);
await removeIfExists(appImagePath);

const appImageTool = await ensureAppImageTool();

await run(appImageTool, [appDirPath, appImagePath], {
  APPIMAGE_EXTRACT_AND_RUN: "1",
  ARCH: "x86_64",
});

console.log(`AppImage written to ${appImagePath}`);
