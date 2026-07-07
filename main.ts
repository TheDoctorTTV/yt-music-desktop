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

const youtubeMusicUrlJson = JSON.stringify(YOUTUBE_MUSIC_URL);

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
        background: #0f0f0f;
        color: #fff;
      }

      main {
        width: min(32rem, calc(100vw - 3rem));
        text-align: center;
      }

      a {
        color: #ff5a5f;
      }
    </style>
    <script>
      setTimeout(() => {
        globalThis.location.replace(${youtubeMusicUrlJson});
      }, 100);
    </script>
  </head>
  <body>
    <main>
      <h1>YouTube Music Desktop</h1>
      <p>The native window is starting and will navigate to YouTube Music.</p>
      <p><a href="${YOUTUBE_MUSIC_URL}">Open YouTube Music</a></p>
    </main>
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

const clientTweakScript = `(() => {
  if (globalThis.location.origin !== "https://music.youtube.com") {
    throw new Error("YouTube Music has not loaded yet.");
  }

  const styleId = "deno-youtube-music-desktop-style";

  const applyStyle = () => {
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = ${JSON.stringify(clientCss)};

    document.documentElement.append(style);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyStyle, { once: true });
  } else {
    applyStyle();
  }
})();`;

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function injectClientTweaks(window: Deno.BrowserWindow): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      // executeJs runs inside the loaded webview page, not inside the Deno runtime.
      await window.executeJs(clientTweakScript);
      return;
    } catch {
      await delay(500);
    }
  }

  console.warn("Timed out while waiting to inject YouTube Music client tweaks.");
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

// The first BrowserWindow adopts the startup window created by deno desktop.
const window = new Deno.BrowserWindow({
  title: windowConfig.title,
  width: windowConfig.width,
  height: windowConfig.height,
});

window.addEventListener("close", () => {
  // Closing the local server lets the Deno runtime exit after the last window closes.
  void server.shutdown();
});

// deno desktop first auto-loads the local Deno.serve() root. Navigate after that
// startup navigation has a chance to finish so it does not overwrite this URL.
setTimeout(() => {
  window.navigate(YOUTUBE_MUSIC_URL);
  void injectClientTweaks(window);
}, 750);
