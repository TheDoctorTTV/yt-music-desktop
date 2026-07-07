const APP_NAME = "youtube-music-desktop";
const APP_DISPLAY_NAME = "YouTube Music Desktop";

const rootUrl = new URL("../", import.meta.url);
const rootPath = rootUrl.pathname;
const distUrl = new URL("../dist/windows/", import.meta.url);
const distPath = distUrl.pathname;
const bundlePath = new URL(`./${APP_NAME}/`, distUrl).pathname;
const finalExePath = new URL(`./${APP_NAME}.exe`, distUrl).pathname;
const buildPath = new URL("./.single-exe-build/", distUrl).pathname;
const launcherSourcePath = new URL("./windows_single_exe_launcher.c", import.meta.url).pathname;
const resourceScriptPath = new URL("./resources.rc", `file://${buildPath}`).pathname;
const resourceObjectPath = new URL("./resources.o", `file://${buildPath}`).pathname;

const windowsTarget = "x86_64-pc-windows-msvc";
const iconPath = "./icons/youtubemusic.png";
const allowedHosts = [
  "127.0.0.1",
  "music.youtube.com",
  "www.youtube.com",
  "accounts.google.com",
  "google.com",
  "gstatic.com",
  "googleusercontent.com",
  "ytimg.com",
].join(",");

type BundledResource = {
  id: number;
  file: string;
};

const bundledResources: BundledResource[] = [
  { id: 101, file: "laufey_webview.exe" },
  { id: 102, file: `${APP_NAME}.dll` },
  { id: 103, file: `${APP_NAME}.bat` },
  { id: 104, file: ".deno-desktop-app" },
  { id: 105, file: ".downloaded" },
];

async function removeIfExists(path: string): Promise<void> {
  try {
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
}

async function run(command: string, args: string[]): Promise<void> {
  const child = new Deno.Command(command, {
    args,
    cwd: rootPath,
    stdout: "inherit",
    stderr: "inherit",
  });

  const status = await child.output();

  if (!status.success) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${status.code}`);
  }
}

async function ensureBundledResources(): Promise<void> {
  for (const resource of bundledResources) {
    const path = `${bundlePath}${resource.file}`;
    const stat = await Deno.stat(path);

    if (!stat.isFile) {
      throw new Error(`Expected bundled file at ${path}`);
    }
  }
}

function resourcePath(file: string): string {
  return `${bundlePath}${file}`.replaceAll("\\", "/");
}

async function writeResourceScript(): Promise<void> {
  const lines = bundledResources.map((resource) =>
    `${resource.id} RCDATA "${resourcePath(resource.file)}"`
  );

  await Deno.writeTextFile(resourceScriptPath, `${lines.join("\n")}\n`);
}

async function buildDenoDesktopBundle(): Promise<void> {
  await Deno.mkdir(distPath, { recursive: true });
  await removeIfExists(bundlePath);
  await removeIfExists(finalExePath);

  await run("deno", [
    "desktop",
    "--icon",
    iconPath,
    `--allow-net=${allowedHosts}`,
    "--target",
    windowsTarget,
    "--output",
    finalExePath,
    "main.ts",
  ]);
}

async function buildSingleExe(): Promise<void> {
  await removeIfExists(buildPath);
  await Deno.mkdir(buildPath, { recursive: true });
  await writeResourceScript();

  await run("x86_64-w64-mingw32-windres", [
    resourceScriptPath,
    resourceObjectPath,
  ]);

  await run("x86_64-w64-mingw32-gcc", [
    "-O2",
    "-municode",
    "-mwindows",
    "-o",
    finalExePath,
    launcherSourcePath,
    resourceObjectPath,
  ]);

  await run("x86_64-w64-mingw32-strip", [finalExePath]);
}

await buildDenoDesktopBundle();
await ensureBundledResources();
await buildSingleExe();
await removeIfExists(buildPath);

console.log(`${APP_DISPLAY_NAME} single-file Windows EXE written to ${finalExePath}`);
