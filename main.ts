const YOUTUBE_MUSIC_URL = "https://music.youtube.com";

type DesktopWindowConfig = {
  title: string;
  width: number;
  height: number;
};

// TypeScript keeps this value honest: the window config must contain the fields above.
const windowConfig: DesktopWindowConfig = {
  title: "YouTube Music Desktop",
  width: 1200,
  height: 800,
};

const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${windowConfig.title}</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: system-ui, sans-serif;
      }

      body {
        display: grid;
        min-height: 100vh;
        margin: 0;
        place-items: center;
        overflow: hidden;
        background:
          radial-gradient(circle at center, rgba(255, 0, 0, 0.12), transparent 18rem),
          #030303;
      }

      .splash {
        position: relative;
        display: grid;
        width: 12rem;
        aspect-ratio: 1;
        place-items: center;
      }

      .splash::before,
      .splash::after {
        position: absolute;
        inset: 0;
        border: 2px solid rgba(255, 255, 255, 0.16);
        border-radius: 50%;
        content: "";
        animation: pulse 1.8s ease-out infinite;
      }

      .splash::after {
        animation-delay: 0.9s;
      }

      .logo {
        position: relative;
        z-index: 1;
        width: 7.5rem;
        height: 7.5rem;
        animation: breathe 1.8s ease-in-out infinite;
        filter: drop-shadow(0 1.5rem 3rem rgba(255, 0, 0, 0.3));
      }

      .orbit {
        animation: spin 2.8s linear infinite;
        transform-origin: 50% 50%;
      }

      @keyframes pulse {
        0% {
          opacity: 0;
          transform: scale(0.64);
        }

        35% {
          opacity: 1;
        }

        100% {
          opacity: 0;
          transform: scale(1.15);
        }
      }

      @keyframes breathe {
        0%,
        100% {
          transform: scale(0.96);
        }

        50% {
          transform: scale(1.04);
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  <body>
    <div class="splash" aria-label="YouTube Music">
      <svg class="logo" viewBox="0 0 128 128" role="img" aria-hidden="true">
        <circle cx="64" cy="64" r="58" fill="#ff0000"/>
        <circle cx="64" cy="64" r="43" fill="#ff3333"/>
        <circle cx="64" cy="64" r="31" fill="#ffffff"/>
        <circle cx="64" cy="64" r="24" fill="#ff0000"/>
        <path fill="#ffffff" d="M57 48l27 16-27 16z"/>
        <g class="orbit" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="4">
          <path d="M64 6a58 58 0 0 1 58 58"/>
          <path d="M64 122A58 58 0 0 1 6 64"/>
        </g>
      </svg>
    </div>
  </body>
</html>`;

const clientCss = `
  html {
    scrollbar-width: thin;
    scrollbar-color: #606060 #0f0f0f;
  }

  body::-webkit-scrollbar,
  ytmusic-app::-webkit-scrollbar {
    width: 10px;
  }

  body::-webkit-scrollbar-thumb,
  ytmusic-app::-webkit-scrollbar-thumb {
    background: #606060;
    border-radius: 8px;
  }

  ytmusic-app {
    background: #0f0f0f;
  }
`;

const clientReadyScript = `(() => {
  const styleId = "deno-youtube-music-desktop-style";
  const supportedOrigins = new Set([
    "https://music.youtube.com",
    "https://accounts.google.com",
  ]);

  if (!supportedOrigins.has(globalThis.location.origin) || document.readyState === "loading") {
    throw new Error("YouTube Music has not loaded yet.");
  }

  const hasVisibleSurface =
    globalThis.location.origin === "https://music.youtube.com"
      ? document.querySelector("ytmusic-app") !== null
      : document.querySelector("form, input[type=email], input[type=password]") !== null;

  if (!hasVisibleSurface) {
    throw new Error("YouTube Music is not ready yet.");
  }

  const applyStyle = () => {
    if (
      globalThis.location.origin !== "https://music.youtube.com" ||
      document.getElementById(styleId)
    ) {
      return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = ${JSON.stringify(clientCss)};

    document.documentElement.append(style);
  };

  applyStyle();
})();`;

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForClientReady(window: Deno.BrowserWindow): Promise<boolean> {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      // executeJs runs inside the loaded webview page, not inside the Deno runtime.
      await window.executeJs(clientReadyScript);
      return true;
    } catch {
      await delay(500);
    }
  }

  console.warn("Timed out while waiting for YouTube Music to load.");
  return false;
}

const server = Deno.serve((request: Request): Response => {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return Response.json({
      ok: true,
      target: YOUTUBE_MUSIC_URL,
    });
  }

  if (url.pathname === "/") {
    return new Response(fallbackHtml, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  return new Response("Not found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});

let serverShutdownStarted = false;

function shutdownServer(): void {
  if (serverShutdownStarted) {
    return;
  }

  serverShutdownStarted = true;
  void server.shutdown();
}

// This BrowserWindow adopts the startup window created by Deno Desktop. Keep using
// it when the splash finishes so the operating-system window never gets replaced.
const appWindow = new Deno.BrowserWindow({
  title: windowConfig.title,
  width: windowConfig.width,
  height: windowConfig.height,
});

appWindow.addEventListener("close", () => {
  shutdownServer();
});

// Let the startup animation become visible, then navigate that same window to YouTube Music.
setTimeout(() => {
  appWindow.navigate(YOUTUBE_MUSIC_URL);
  void waitForClientReady(appWindow);
}, 750);
