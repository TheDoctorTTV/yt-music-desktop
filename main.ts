import youtubeMusicLogo from "./icons/youtubemusic.svg" with { type: "text" };

const YOUTUBE_MUSIC_URL = "https://music.youtube.com";
const SPLASH_DURATION_MS = 1200;

const splashHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <title>YouTube Music Desktop</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: system-ui, sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
      }

      body {
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at center, rgb(255 0 0 / 14%), transparent 19rem),
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
        border: 2px solid rgb(255 255 255 / 16%);
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
        filter: drop-shadow(0 1.5rem 3rem rgb(255 0 0 / 30%));
      }

      .logo svg {
        display: block;
        width: 100%;
        height: 100%;
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

      @media (prefers-reduced-motion: reduce) {
        .splash::before,
        .splash::after,
        .logo {
          animation: none;
        }
      }
    </style>
  </head>
  <body>
    <main class="splash" aria-label="YouTube Music is starting">
      <div class="logo">${youtubeMusicLogo}</div>
    </main>
  </body>
</html>`;

let resolveSplashPort: (port: number) => void;
const splashListening = new Promise<number>((resolve) => {
  resolveSplashPort = resolve;
});

const splashServer = Deno.serve(
  {
    hostname: "127.0.0.1",
    port: 0,
    onListen: ({ port }) => resolveSplashPort(port),
  },
  () =>
    new Response(splashHtml, {
      headers: {
        "cache-control": "no-store",
        "content-type": "text/html; charset=utf-8",
      },
    }),
);

const splashPort = await splashListening;
const window = new Deno.BrowserWindow({
  title: "YouTube Music Desktop",
  width: 1200,
  height: 800,
});

window.navigate(`http://127.0.0.1:${splashPort}/`);

setTimeout(() => {
  window.show();
  window.focus();
}, 100);

setTimeout(() => {
  if (!window.isClosed()) window.navigate(YOUTUBE_MUSIC_URL);
  void splashServer.shutdown();
}, SPLASH_DURATION_MS);
