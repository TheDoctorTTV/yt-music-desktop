import { createDesktopHtml, YOUTUBE_MUSIC_LOGO_SVG } from "./src/custom_ui.ts";

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

    </style>
  </head>
  <body>
    <div class="splash" aria-label="YouTube Music">
      <div class="logo">${YOUTUBE_MUSIC_LOGO_SVG}</div>
    </div>
  </body>
</html>`;

const desktopHtml = createDesktopHtml();

function unwrapWebviewResult<T>(result: unknown): T {
  if (result && typeof result === "object" && "ok" in result) {
    const wrapped = result as { ok: boolean; value?: T; error?: unknown };
    if (!wrapped.ok) throw new Error(String(wrapped.error ?? "WebKit script failed."));
    return wrapped.value as T;
  }
  return result as T;
}

const officialReadyScript = `(() => {
  if (location.origin !== "https://music.youtube.com" || !document.querySelector("ytmusic-app")) {
    throw new Error("The official YouTube Music client is still loading.");
  }
  return true;
})()`;

const officialStateScript = `(() => {
  const root = document.querySelector("ytmusic-app");
  if (!root) throw new Error("The official YouTube Music client is not ready.");
  const clean = (value) => (value || "").replace(/\\s+/g, " ").trim();
  const text = (node, selectors) => {
    for (const selector of selectors) {
      const value = clean(node.querySelector(selector)?.textContent);
      if (value) return value;
    }
    return "";
  };
  const image = (node) => {
    if (!node) return "";
    const thumbnails = (value) =>
      value?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
      value?.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
      value?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
      value?.thumbnail?.thumbnails || value?.thumbnails || [];
    const candidates = [
      node,
      node.matches?.("img") ? null : node.querySelector?.("img"),
      node.matches?.("yt-img-shadow") ? null : node.querySelector?.("yt-img-shadow"),
    ].filter(Boolean);
    const urls = [
      ...thumbnails(node.data).map((entry) => entry?.url).reverse(),
      ...thumbnails(node.__data?.data).map((entry) => entry?.url).reverse(),
      node.__data?.imageUrl,
      node.__data?.src,
    ];
    for (const candidate of candidates) {
      urls.push(
        ...thumbnails(candidate.data).map((entry) => entry?.url).reverse(),
        ...thumbnails(candidate.__data?.data).map((entry) => entry?.url).reverse(),
        candidate.__data?.imageUrl,
        candidate.__data?.src,
        candidate.delayedSrc,
        candidate.getAttribute?.("delayed-src"),
        candidate.getAttribute?.("data-src"),
        candidate.photoUrl,
        candidate.currentSrc,
        candidate.src,
        candidate.getAttribute?.("src"),
      );
    }
    return urls.find((url) =>
      typeof url === "string" && url && !url.startsWith("data:image/gif") &&
      url !== location.origin + "/" && url !== location.href
    ) || "";
  };
  const accountButton = root.querySelector(
    "ytmusic-nav-bar ytmusic-settings-button, ytmusic-nav-bar #avatar, " +
      "ytmusic-nav-bar button[aria-label*='Account' i]"
  );
  const item = (node) => {
    const anchors = [...node.querySelectorAll("a[href]")];
    const primaryAnchor = anchors.find((entry) =>
      entry.matches("a.ytmusic-responsive-list-item-renderer,a.ytmusic-two-row-item-renderer")
    );
    const titleAnchor = anchors.find((entry) =>
      clean(entry.getAttribute("title")) || clean(entry.textContent)
    );
    const anchor = primaryAnchor || titleAnchor || anchors.find((entry) => entry.querySelector("img"));
    const href = anchor?.getAttribute("href") || "";
    const title = text(node, [
      ".title-column yt-formatted-string", "yt-formatted-string.title",
      "a.yt-simple-endpoint[title]", "#title", ".title"
    ]) || clean(titleAnchor?.getAttribute("title")) || clean(titleAnchor?.textContent);
    if (!title || !href) return null;
    return {
      title,
      subtitle: text(node, [
        ".secondary-flex-columns yt-formatted-string", "yt-formatted-string.subtitle",
        ".subtitle", "#subtitle", ".byline"
      ]),
      image: image(node),
      href,
    };
  };
  const runsText = (value) => clean(
    value?.simpleText || value?.runs?.map((run) => run?.text || "").join("") || ""
  );
  const queueItem = (node) => {
    const data = node.data || node.__data?.data || {};
    const renderer = data.playlistPanelVideoRenderer ||
      data.playlistPanelVideoWrapperRenderer?.primaryRenderer?.playlistPanelVideoRenderer || data;
    const endpoint = renderer.navigationEndpoint?.watchEndpoint ||
      (renderer.playlistItemData?.videoId
        ? { videoId: renderer.playlistItemData.videoId }
        : null);
    const videoId = renderer.videoId || endpoint?.videoId || node.getAttribute("video-id") || "";
    const anchor = [...node.querySelectorAll("a[href]")].find((entry) =>
      entry.getAttribute("href")?.includes("/watch")
    );
    const href = anchor?.getAttribute("href") || (videoId
      ? "/watch?v=" + encodeURIComponent(videoId)
      : "");
    const title = text(node, [
      "#song-title", ".song-title", "yt-formatted-string.title", "#title", ".title"
    ]) || runsText(renderer.title);
    if (!title || !href) return null;
    return {
      title,
      subtitle: text(node, [
        "#byline", ".byline", "#subtitle", ".subtitle", ".secondary-flex-columns"
      ]) || runsText(renderer.longBylineText) || runsText(renderer.shortBylineText),
      image: image(node),
      href,
      current: Boolean(
        renderer.selected || node.hasAttribute("selected") ||
        node.matches(".selected,.currently-playing,.is-current")
      ),
    };
  };
  const shelves = [];
  for (const shelf of root.querySelectorAll(
    "ytmusic-carousel-shelf-renderer,ytmusic-shelf-renderer,ytmusic-grid-renderer,ytmusic-playlist-shelf-renderer"
  )) {
    if (shelf.closest("ytmusic-player-queue")) continue;
    const seen = new Set();
    const items = [];
    for (const candidate of shelf.querySelectorAll(
      "ytmusic-two-row-item-renderer,ytmusic-responsive-list-item-renderer"
    )) {
      const value = item(candidate);
      if (!value || seen.has(value.href)) continue;
      seen.add(value.href);
      items.push(value);
      if (items.length >= 12) break;
    }
    if (items.length) {
      shelves.push({
        title: text(shelf, ["yt-formatted-string.title", "#title", ".title", "h2"]) || "Music for you",
        items,
      });
    }
    if (shelves.length >= 8) break;
  }
  const queue = [...root.querySelectorAll(
    "ytmusic-player-queue ytmusic-player-queue-item," +
      "ytmusic-player-queue ytmusic-player-queue-item-renderer," +
      "ytmusic-player-queue ytmusic-responsive-list-item-renderer," +
      "ytmusic-player-queue-item,ytmusic-player-queue-item-renderer"
  )].map(queueItem).filter(Boolean).slice(0, 30);
  const pageHeader = root.querySelector(
    "ytmusic-responsive-header-renderer,ytmusic-detail-header-renderer," +
      "ytmusic-immersive-header-renderer"
  );
  const pageItems = [];
  const pageSeen = new Set();
  for (const candidate of root.querySelectorAll(
    "ytmusic-browse-response ytmusic-responsive-list-item-renderer," +
      "ytmusic-search-page ytmusic-responsive-list-item-renderer"
  )) {
    if (candidate.closest("ytmusic-carousel-shelf-renderer,ytmusic-player-queue")) continue;
    const value = item(candidate);
    if (!value || pageSeen.has(value.href)) continue;
    pageSeen.add(value.href);
    pageItems.push(value);
    if (pageItems.length >= 100) break;
  }
  const volumeGuard = globalThis.__vortexVolumeGuard ||= (() => {
    const mediaPrototype = HTMLMediaElement.prototype;
    const volumeDescriptor = Object.getOwnPropertyDescriptor(mediaPrototype, "volume");
    const originalPlay = mediaPrototype.play;
    const preferredVolume = () => {
      const saved = sessionStorage.getItem("vortex-volume");
      const value = saved === null ? NaN : Number(saved);
      return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : NaN;
    };
    const applyPreferredVolume = (media) => {
      const value = preferredVolume();
      if (Number.isFinite(value) && volumeDescriptor?.set) {
        volumeDescriptor.set.call(media, value);
      }
    };
    if (volumeDescriptor?.get && volumeDescriptor.set) {
      try {
        Object.defineProperty(mediaPrototype, "volume", {
          configurable: volumeDescriptor.configurable,
          enumerable: volumeDescriptor.enumerable,
          get: volumeDescriptor.get,
          set(value) {
            const preferred = preferredVolume();
            volumeDescriptor.set.call(
              this,
              Number.isFinite(preferred) ? preferred : value,
            );
          },
        });
      } catch {
        // The play guard below still prevents a new track from starting at full volume.
      }
    }
    if (typeof originalPlay === "function") {
      mediaPrototype.play = function (...args) {
        applyPreferredVolume(this);
        return Reflect.apply(originalPlay, this, args);
      };
    }
    return { applyPreferredVolume };
  })();
  const volumeState = globalThis.__vortexVolumeState ||= {
    desired: null,
    media: new WeakSet(),
    observer: null,
  };
  const savedVolume = sessionStorage.getItem("vortex-volume");
  const parsedVolume = savedVolume === null ? NaN : Number(savedVolume);
  if (!Number.isFinite(volumeState.desired) && Number.isFinite(parsedVolume)) {
    volumeState.desired = Math.min(1, Math.max(0, parsedVolume));
  }
  const bindVolume = (media) => {
    if (!media || volumeState.media.has(media)) return;
    volumeGuard.applyPreferredVolume(media);
    if (!Number.isFinite(volumeState.desired)) {
      volumeState.desired = media.volume;
      sessionStorage.setItem("vortex-volume", String(volumeState.desired));
    }
    const preserveVolume = () => {
      if (
        Number.isFinite(volumeState.desired) &&
        Math.abs(media.volume - volumeState.desired) > .001
      ) media.volume = volumeState.desired;
    };
    volumeState.media.add(media);
    media.addEventListener("volumechange", preserveVolume);
    preserveVolume();
  };
  const videos = [...root.querySelectorAll("video")];
  videos.forEach(bindVolume);
  const video = videos.find((media) => !media.paused && !media.ended) || videos[0];
  if (!volumeState.observer) {
    volumeState.observer = new MutationObserver(() =>
      [...root.querySelectorAll("video")].forEach(bindVolume)
    );
    volumeState.observer.observe(root, { childList: true, subtree: true });
  }
  const metadata = navigator.mediaSession?.metadata;
  const playerBar = root.querySelector("ytmusic-player-bar");
  const playerBylineLinks = playerBar
    ? [...playerBar.querySelectorAll(".byline a,.subtitle a")]
    : [];
  const album = metadata?.album || (playerBylineLinks.length > 1
    ? clean(playerBylineLinks.at(-1)?.textContent)
    : "");
  const isSearchPage = location.pathname.startsWith("/search");
  return {
    path: location.pathname + location.search,
    signedIn: Boolean(accountButton),
    avatar: image(accountButton),
    shelves,
    page: pageHeader || isSearchPage ? {
      kind: isSearchPage ? "search" : "detail",
      title: isSearchPage
        ? new URLSearchParams(location.search).get("q") || "Search"
        : text(pageHeader, ["yt-formatted-string.title", "#title", ".title"]),
      subtitle: pageHeader
        ? text(pageHeader, ["yt-formatted-string.subtitle", "#subtitle", ".subtitle"])
        : "",
      description: pageHeader
        ? text(pageHeader, ["yt-formatted-string.description", "#description", ".description"])
        : "",
      artwork: pageHeader ? image(pageHeader) : "",
      items: pageItems,
    } : null,
    queue,
    player: {
      title: metadata?.title || text(playerBar || root, [".title", "#title"]),
      artist: metadata?.artist || text(playerBar || root, [".byline", ".subtitle"]),
      album,
      artwork: metadata?.artwork?.at(-1)?.src || image(playerBar || root),
      currentTime: Number.isFinite(video?.currentTime) ? video.currentTime : 0,
      duration: Number.isFinite(video?.duration) ? video.duration : 0,
      volume: Number.isFinite(video?.volume) ? video.volume : .7,
      muted: Boolean(video?.muted),
      playing: Boolean(video && !video.paused && !video.ended),
    },
  };
})()`;

function officialCommandScript(command: string, payload: Record<string, unknown> = {}): string {
  return `(() => {
    const command = ${JSON.stringify(command)};
    const payload = ${JSON.stringify(payload)};
    const root = document.querySelector("ytmusic-app");
    if (!root) throw new Error("The official YouTube Music client is not ready.");
    const click = (selectors) => {
      for (const selector of selectors) {
        const target = root.querySelector(selector);
        if (target) { target.click(); return true; }
      }
      return false;
    };
    const anchor = (href) => [...root.querySelectorAll("a[href]")].find((entry) => {
      const raw = entry.getAttribute("href");
      if (raw === href) return true;
      try {
        const url = new URL(entry.href, location.href);
        return url.pathname + url.search === href;
      } catch { return false; }
    });
    const safeHref = (value) => {
      const url = new URL(String(value || "/"), location.origin + "/");
      if (url.origin !== location.origin) throw new Error("Only YouTube Music routes are allowed.");
      return url.pathname + url.search + url.hash;
    };
    const openHref = (value) => {
      const href = safeHref(value);
      const target = anchor(href) || anchor(href.startsWith("/") ? href.slice(1) : href);
      if (target) target.click();
      else location.assign(href);
      return href;
    };
    const navigateHref = (value) => {
      const href = safeHref(value);
      const routeLabel = ({
        "/": "Home",
        "/explore": "Explore",
        "/library": "Library",
        "/playlist?list=LM": "Liked music",
      })[href];
      const guideEntry = routeLabel
        ? [...root.querySelectorAll("ytmusic-guide-entry-renderer")].find((entry) =>
          entry.textContent?.trim() === routeLabel
        )
        : null;
      const target = anchor(href) || anchor(href.startsWith("/") ? href.slice(1) : href) ||
        guideEntry?.querySelector("a,tp-yt-paper-item") || guideEntry;
      if (!target) {
        throw new Error("That YouTube Music view is not available yet.");
      }
      target.click();
      return href;
    };
    const queueNodes = () => [...root.querySelectorAll(
      "ytmusic-player-queue ytmusic-player-queue-item," +
        "ytmusic-player-queue ytmusic-player-queue-item-renderer," +
        "ytmusic-player-queue ytmusic-responsive-list-item-renderer," +
        "ytmusic-player-queue-item,ytmusic-player-queue-item-renderer"
    )];
    const queueVideoId = (node) => {
      const data = node.data || node.__data?.data || {};
      const renderer = data.playlistPanelVideoRenderer ||
        data.playlistPanelVideoWrapperRenderer?.primaryRenderer?.playlistPanelVideoRenderer || data;
      return renderer.videoId || renderer.navigationEndpoint?.watchEndpoint?.videoId ||
        renderer.playlistItemData?.videoId || node.getAttribute("video-id") || "";
    };
    const videos = [...root.querySelectorAll("video")];
    const video = videos.find((media) => !media.paused && !media.ended) || videos[0];
    if (command === "navigate") {
      return navigateHref(payload.href);
    } else if (command === "open") {
      return openHref(payload.href);
    } else if (command === "play-item") {
      const href = safeHref(payload.href);
      const target = anchor(href) || anchor(href.startsWith("/") ? href.slice(1) : href);
      const item = target?.closest(
        "ytmusic-two-row-item-renderer,ytmusic-responsive-list-item-renderer," +
          "ytmusic-grid-renderer,ytmusic-list-item-renderer"
      );
      const playButton = item?.querySelector(
        "ytmusic-play-button-renderer button,ytmusic-play-button-renderer," +
          "#play-button button,#play-button,button[aria-label*='Play' i]"
      );
      if (playButton) playButton.click();
      else if (target) target.click();
      else openHref(href);
    } else if (command === "play-page") {
      return click([
        "ytmusic-responsive-header-renderer ytmusic-play-button-renderer button",
        "ytmusic-responsive-header-renderer ytmusic-play-button-renderer",
        "ytmusic-detail-header-renderer ytmusic-play-button-renderer button",
        "ytmusic-detail-header-renderer ytmusic-play-button-renderer",
        "ytmusic-browse-response button[aria-label^='Play' i]"
      ]);
    } else if (command === "play-queue-item") {
      const href = safeHref(payload.href);
      const videoId = new URL(href, location.origin).searchParams.get("v") || "";
      const queueItem = queueNodes().find((node) => {
        if (videoId && queueVideoId(node) === videoId) return true;
        return [...node.querySelectorAll("a[href]")].some((entry) => {
          try {
            const url = new URL(entry.href, location.href);
            return url.pathname + url.search === href;
          } catch {
            return false;
          }
        });
      });
      const target = queueItem?.querySelector(
        "#content,.song-info,.content,a[href*='/watch']"
      ) || queueItem;
      if (target) {
        target.click();
        return true;
      }
      return openHref(href);
    } else if (command === "search") {
      const query = String(payload.query || "").trim();
      if (!query) return false;
      return openHref("/search?q=" + encodeURIComponent(query));
    } else if (command === "login") {
      return click([
        "ytmusic-nav-bar a[href*='accounts.google.com']",
        "ytmusic-nav-bar a[href*='ServiceLogin']",
        "ytmusic-nav-bar button[aria-label*='Sign in' i]",
        "ytmusic-nav-bar [aria-label*='Sign in' i]"
      ]);
    } else if (command === "back") history.back();
    else if (command === "forward") history.forward();
    else if (command === "play") {
      if (video) video.paused ? video.play() : video.pause();
    } else if (command === "previous") click(["ytmusic-player-bar #previous-button", "ytmusic-player-bar .previous-button"]);
    else if (command === "next") click(["ytmusic-player-bar #next-button", "ytmusic-player-bar .next-button"]);
    else if (command === "shuffle") click(["ytmusic-player-bar .shuffle", "ytmusic-player-bar button[aria-label*='shuffle' i]"]);
    else if (command === "repeat") click(["ytmusic-player-bar .repeat", "ytmusic-player-bar button[aria-label*='repeat' i]"]);
    else if (command === "like") click(["ytmusic-player-bar ytmusic-like-button-renderer button", "ytmusic-player-bar button[aria-label*='like' i]"]);
    else if (command === "mute" && video) video.muted = !video.muted;
    else if (command === "more") click(["ytmusic-player-bar button[aria-label*='More' i]", "ytmusic-player-bar #menu button"]);
    else if (command === "queue") {
      const populated = queueNodes().some((node) =>
        queueVideoId(node) || node.querySelector("a[href*='/watch']")
      );
      if (populated) return true;
      return click([
        "ytmusic-player-bar #queue-button",
        "ytmusic-player-bar ytmusic-player-queue-button",
        "ytmusic-player-bar button[aria-label*='Up next' i]",
        "ytmusic-player-bar [aria-label='Up next' i]",
        "ytmusic-player-bar [title*='Up next' i]",
        "ytmusic-player-bar #queue",
        "ytmusic-player-bar button[aria-label*='queue' i]"
      ]);
    } else if (command === "seek" && video && Number.isFinite(video.duration)) video.currentTime = video.duration * Number(payload.ratio || 0);
    else if (command === "volume" && video) {
      const value = Number(payload.value);
      if (Number.isFinite(value)) {
        const desiredVolume = Math.min(1, Math.max(0, value));
        const volumeState = globalThis.__vortexVolumeState ||= {
          desired: desiredVolume,
          media: new WeakSet(),
          observer: null,
        };
        volumeState.desired = desiredVolume;
        sessionStorage.setItem("vortex-volume", String(desiredVolume));
        video.volume = desiredVolume;
      }
      video.muted = false;
    }
    return true;
  })()`;
}

const officialWindowRef: { current?: Deno.BrowserWindow } = {};
const appWindowRef: { current?: Deno.BrowserWindow } = {};
let authenticationWindowVisible = false;
let officialOperationQueue: Promise<void> = Promise.resolve();

function runOfficialOperation<T>(operation: () => Promise<T>): Promise<T> {
  const result = officialOperationQueue.then(operation, operation);
  officialOperationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

const server = Deno.serve(async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return Response.json({
      ok: true,
      target: YOUTUBE_MUSIC_URL,
    });
  }

  if (url.pathname === "/") {
    return new Response(desktopHtml, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  if (url.pathname === "/splash") {
    return new Response(fallbackHtml, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  if (url.pathname === "/api/state") {
    const officialWindow = officialWindowRef.current;
    if (!officialWindow) return new Response("The official client is starting.", { status: 503 });
    try {
      const state = unwrapWebviewResult<{ avatar?: string }>(
        await runOfficialOperation(() => officialWindow.executeJs(officialStateScript)),
      );
      if (authenticationWindowVisible && state.avatar) {
        officialWindow.hide();
        authenticationWindowVisible = false;
        appWindowRef.current?.show();
        appWindowRef.current?.focus();
      }
      return Response.json(state, { headers: { "cache-control": "no-store" } });
    } catch (error) {
      return new Response(error instanceof Error ? error.message : String(error), { status: 503 });
    }
  }

  if (url.pathname === "/api/command" && request.method === "POST") {
    const officialWindow = officialWindowRef.current;
    if (!officialWindow) return new Response("The official client is starting.", { status: 503 });
    try {
      const body = await request.json() as {
        command?: unknown;
        payload?: unknown;
      };
      if (typeof body.command !== "string") {
        return new Response("Music command must be a string.", { status: 400 });
      }
      const command = body.command;
      const payload = body.payload && typeof body.payload === "object" &&
          !Array.isArray(body.payload)
        ? body.payload as Record<string, unknown>
        : undefined;
      if (command === "login") {
        authenticationWindowVisible = true;
        officialWindow.show();
        officialWindow.focus();
      }
      return Response.json(
        unwrapWebviewResult(
          await runOfficialOperation(() =>
            officialWindow.executeJs(officialCommandScript(command, payload))
          ),
        ),
      );
    } catch (error) {
      return new Response(error instanceof Error ? error.message : String(error), { status: 503 });
    }
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
appWindowRef.current = appWindow;

appWindow.addEventListener("close", () => {
  const officialWindow = officialWindowRef.current;
  if (officialWindow && !officialWindow.isClosed()) officialWindow.close();
  shutdownServer();
});

// The official client stays in its own hidden WebKit window. The user-facing window
// is always the in-house frontend and talks to that client through the local server.
const musicWindow = new Deno.BrowserWindow({
  title: "YouTube Music Engine",
  width: windowConfig.width,
  height: windowConfig.height,
  noActivate: true,
});
// Deno Desktop does not currently expose a hidden-at-construction option. Remove
// the engine from the desktop before navigation; it is only shown for sign-in.
musicWindow.hide();
officialWindowRef.current = musicWindow;
musicWindow.navigate(YOUTUBE_MUSIC_URL);

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function prepareOfficialClient(): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      unwrapWebviewResult(await musicWindow.executeJs(officialReadyScript));
      const state = unwrapWebviewResult<{
        signedIn?: boolean;
        avatar?: string;
        shelves?: unknown[];
      }>(await musicWindow.executeJs(officialStateScript));
      if (!state.shelves?.length) {
        await delay(500);
        continue;
      }
      console.log(
        `Official YouTube Music client connected with ${state.shelves?.length ?? 0} shelves; ` +
          `account ${state.signedIn ? "signed in" : "signed out"}; ` +
          `avatar ${state.avatar ? "available" : "unavailable"}.`,
      );
      return;
    } catch {
      await delay(500);
    }
  }
  console.warn("The official YouTube Music client did not finish loading.");
}

void prepareOfficialClient();

setTimeout(() => {
  appWindow.show();
  appWindow.focus();
}, 250);
