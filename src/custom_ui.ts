/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import youtubeMusicLogo from "../icons/youtubemusic.svg" with { type: "text" };

export const YOUTUBE_MUSIC_LOGO_SVG = youtubeMusicLogo;

const icon = (body: string): string =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M0 0h24v24H0z" fill="none" stroke="none"></path>${body}</svg>`;

// These paths are copied from @tabler/icons 3.44.0. Keeping the small subset here
// lets the injected UI work inside music.youtube.com without loading another origin.
export const TABLER_ICONS: Record<string, string> = {
  youtubeMusic: YOUTUBE_MUSIC_LOGO_SVG,
  home: icon(
    '<path d="M5 12l-2 0l9 -9l9 9l-2 0"></path><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>',
  ),
  compass: icon(
    '<path d="M8 16l2 -6l6 -2l-2 6l-6 2"></path><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 3v2M12 19v2M3 12h2M19 12h2"></path>',
  ),
  library: icon(
    '<path d="M7 5.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667v-8.666"></path><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1"></path><path d="M11 7h5M11 10h6M11 13h3"></path>',
  ),
  search: icon(
    '<path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path>',
  ),
  sun: icon(
    '<path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>',
  ),
  moon: icon(
    '<path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454v.008"></path>',
  ),
  play: icon('<path d="M7 4v16l13 -8l-13 -8"></path>'),
  pause: icon(
    '<path d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-12"></path><path d="M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-12"></path>',
  ),
  previous: icon('<path d="M20 5v14l-12 -7l12 -7"></path><path d="M4 5v14"></path>'),
  next: icon('<path d="M4 5v14l12 -7l-12 -7"></path><path d="M20 5v14"></path>'),
  repeat: icon(
    '<path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>',
  ),
  shuffle: icon(
    '<path d="M18 4l3 3l-3 3M18 20l3 -3l-3 -3"></path><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5"></path><path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3"></path>',
  ),
  queue: icon(
    '<path d="M9 6h11M9 12h11M9 18h11"></path><path d="M5 6v.01M5 12v.01M5 18v.01"></path>',
  ),
  heart: icon(
    '<path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>',
  ),
  dots: icon(
    '<path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>',
  ),
  volume: icon(
    '<path d="M15 8a5 5 0 0 1 0 8"></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path>',
  ),
  back: icon('<path d="M15 6l-6 6l6 6"></path>'),
  forward: icon('<path d="M9 6l6 6l-6 6"></path>'),
  music: icon(
    '<path d="M9 18v-12l12 -2v12"></path><path d="M6 21a3 3 0 1 0 0 -6a3 3 0 0 0 0 6M18 19a3 3 0 1 0 0 -6a3 3 0 0 0 0 6"></path>',
  ),
  close: icon('<path d="M18 6l-12 12M6 6l12 12"></path>'),
};

export const CUSTOM_UI_CSS = String.raw`
  :root {
    color-scheme: light dark;
  }

  html.vortex-music-active,
  html.vortex-music-active body {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    overflow: hidden !important;
    background: #171719 !important;
  }

  html.vortex-music-active ytmusic-app,
  html.vortex-music-active tp-yt-app-drawer,
  html.vortex-music-active ytmusic-popup-container {
    position: fixed !important;
    inset: 0 !important;
    z-index: -1 !important;
    width: 100vw !important;
    height: 100vh !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  #vortex-music-app,
  #vortex-music-app * {
    box-sizing: border-box;
  }

  #vortex-music-app {
    --accent-a: #d727f4;
    --accent-b: #ff315f;
    --accent-c: #9a55d1;
    --header-a: #4a1165;
    --header-b: #701623;
    --page: #161618;
    --page-raised: #1b1b1e;
    --surface: rgba(43, 42, 45, 0.94);
    --surface-strong: #303033;
    --surface-hover: #3a383d;
    --loading-base: #2b2a2d;
    --loading-sheen: rgba(255, 255, 255, 0.1);
    --line: rgba(255, 255, 255, 0.32);
    --line-soft: rgba(255, 255, 255, 0.1);
    --text: #fbf8fc;
    --muted: #b7b1ba;
    --quiet: #858089;
    --shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
    --player-height: 96px;
    --rail-width: 220px;
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: grid;
    width: 100vw;
    max-width: 100vw;
    min-width: 0;
    height: 100vh;
    min-height: 0;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 78px minmax(0, 1fr) var(--player-height);
    color: var(--text);
    overflow: hidden;
    background: var(--page);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    isolation: isolate;
    animation: vortex-shell-in 420ms cubic-bezier(.2, .8, .2, 1) both;
  }

  .vm-startup {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: grid;
    place-items: center;
    overflow: hidden;
    background:
      radial-gradient(circle at center, rgba(255, 0, 0, 0.13), transparent 19rem),
      #030303;
    opacity: 1;
    transition: opacity 320ms ease, visibility 320ms ease;
  }

  .vm-startup.is-ready {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }

  .vm-startup-mark {
    position: relative;
    display: grid;
    width: 12rem;
    aspect-ratio: 1;
    place-items: center;
  }

  .vm-startup-mark::before,
  .vm-startup-mark::after {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(255, 255, 255, 0.16);
    border-radius: 50%;
    content: "";
    animation: vortex-startup-pulse 1.8s ease-out infinite;
  }

  .vm-startup-mark::after {
    animation-delay: 0.9s;
  }

  .vm-startup-logo {
    position: relative;
    z-index: 1;
    width: 7.5rem;
    height: 7.5rem;
    animation: vortex-startup-breathe 1.8s ease-in-out infinite;
    filter: drop-shadow(0 1.5rem 3rem rgba(255, 0, 0, 0.3));
  }

  .vm-startup-logo svg {
    width: 100% !important;
    height: 100% !important;
    stroke: none !important;
  }

  @keyframes vortex-startup-pulse {
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

  @keyframes vortex-startup-breathe {
    0%,
    100% {
      transform: scale(0.96);
    }

    50% {
      transform: scale(1.04);
    }
  }

  #vortex-music-app[data-theme="light"] {
    color-scheme: light;
    --header-a: #b58bd2;
    --header-b: #d08f91;
    --page: #cfcfcf;
    --page-raised: #dadada;
    --surface: rgba(224, 224, 224, 0.95);
    --surface-strong: #e8e8e8;
    --surface-hover: #f1f1f1;
    --loading-base: #dedede;
    --loading-sheen: rgba(45, 41, 48, 0.11);
    --line: rgba(49, 46, 51, 0.42);
    --line-soft: rgba(49, 46, 51, 0.13);
    --text: #2c2930;
    --muted: #5c5760;
    --quiet: #777178;
    --shadow: 0 18px 44px rgba(42, 37, 44, 0.17);
    background: var(--page);
  }

  @media (prefers-color-scheme: light) {
    #vortex-music-app:not([data-theme]) {
      color-scheme: light;
      --header-a: #b58bd2;
      --header-b: #d08f91;
      --page: #cfcfcf;
      --page-raised: #dadada;
      --surface: rgba(224, 224, 224, 0.95);
      --surface-strong: #e8e8e8;
      --surface-hover: #f1f1f1;
      --loading-base: #dedede;
      --loading-sheen: rgba(45, 41, 48, 0.11);
      --line: rgba(49, 46, 51, 0.42);
      --line-soft: rgba(49, 46, 51, 0.13);
      --text: #2c2930;
      --muted: #5c5760;
      --quiet: #777178;
      --shadow: 0 18px 44px rgba(42, 37, 44, 0.17);
    }
  }

  #vortex-music-app button,
  #vortex-music-app input {
    font: inherit;
  }

  #vortex-music-app button {
    color: inherit;
  }

  #vortex-music-app svg {
    display: block;
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .vm-topbar {
    display: grid;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    grid-template-columns: minmax(190px, var(--rail-width)) minmax(280px, 680px) 1fr;
    align-items: center;
    gap: 28px;
    padding: 0 26px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.64);
    border-radius: 0 0 6px 6px;
    background: linear-gradient(112deg, var(--header-a), var(--header-b));
    box-shadow: 0 8px 24px rgba(20, 10, 20, 0.24);
  }

  .vm-brand {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
    color: #fff;
    font-weight: 760;
    font-size: 17px;
    letter-spacing: -0.025em;
    white-space: nowrap;
  }

  .vm-brand-mark {
    display: grid;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    place-items: center;
  }

  .vm-brand-mark svg {
    width: 36px !important;
    height: 36px !important;
    stroke: none;
    filter: drop-shadow(0 5px 12px rgba(54, 0, 14, 0.24));
  }

  .vm-search {
    position: relative;
    display: flex;
    width: 100%;
    min-width: 0;
    align-items: center;
    height: 44px;
  }

  .vm-search > svg {
    position: absolute;
    left: 16px;
    z-index: 1;
    width: 19px !important;
    height: 19px !important;
    color: rgba(255, 255, 255, 0.82);
    pointer-events: none;
  }

  .vm-search input {
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 0 18px 0 45px;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.37);
    border-radius: 999px;
    outline: none;
    background: rgba(20, 10, 21, 0.34);
    transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
  }

  .vm-search input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .vm-search input:focus {
    border-color: rgba(255, 255, 255, 0.84);
    background: rgba(20, 10, 21, 0.5);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.12);
  }

  .vm-top-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

  .vm-icon-button,
  .vm-player-button,
  .vm-shelf-arrow {
    display: inline-grid;
    place-items: center;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    cursor: pointer;
    transition: color 150ms ease, background 150ms ease, transform 150ms ease, opacity 150ms ease;
  }

  .vm-icon-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .vm-top-actions .vm-icon-button {
    color: rgba(255, 255, 255, 0.9);
  }

  .vm-icon-button:hover,
  .vm-player-button:hover,
  .vm-shelf-arrow:hover {
    background: rgba(255, 255, 255, 0.11);
  }

  .vm-icon-button:active,
  .vm-player-button:active,
  .vm-shelf-arrow:active {
    transform: scale(0.94);
  }

  .vm-avatar {
    width: 34px;
    height: 34px;
    margin-left: 5px;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 50%;
    object-fit: cover;
    background: rgba(255, 255, 255, 0.14);
  }

  .vm-login-button {
    min-width: 72px;
    height: 38px;
    margin-left: 5px;
    padding: 0 18px;
    color: #301027 !important;
    border: 1px solid rgba(255, 255, 255, 0.58);
    border-radius: 999px;
    background: #fff;
    font-size: 14px;
    font-weight: 760;
    cursor: pointer;
    box-shadow: 0 7px 18px rgba(32, 5, 24, 0.2);
    transition: background 150ms ease, box-shadow 150ms ease, transform 150ms ease;
  }

  .vm-login-button:hover {
    background: #fff5fb;
    box-shadow: 0 9px 22px rgba(32, 5, 24, 0.28);
    transform: translateY(-1px);
  }

  .vm-login-button:active {
    transform: scale(0.96);
  }

  .vm-login-button.is-loading {
    cursor: wait;
    opacity: 0.72;
  }

  .vm-workspace {
    display: grid;
    grid-template-columns: var(--rail-width) minmax(0, 1fr);
    min-height: 0;
  }

  .vm-rail {
    display: flex;
    min-height: 0;
    flex-direction: column;
    gap: 7px;
    padding: 28px 18px 20px;
    border-right: 1px solid var(--line-soft);
    background: color-mix(in srgb, var(--page-raised) 82%, transparent);
    backdrop-filter: blur(18px);
  }

  .vm-nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 13px;
    width: 100%;
    min-height: 46px;
    padding: 0 15px;
    color: var(--muted);
    border: 0;
    border-radius: 14px;
    background: transparent;
    font-weight: 650;
    text-align: left;
    cursor: pointer;
    transition: color 160ms ease, background 160ms ease, transform 160ms ease;
  }

  .vm-nav-item:hover {
    color: var(--text);
    background: var(--line-soft);
  }

  .vm-nav-item[aria-current="page"] {
    color: var(--text);
    background: linear-gradient(100deg, rgba(215, 39, 244, 0.18), rgba(255, 49, 95, 0.12));
  }

  .vm-nav-item[aria-current="page"]::before {
    position: absolute;
    top: 11px;
    bottom: 11px;
    left: 0;
    width: 3px;
    border-radius: 99px;
    content: "";
    background: linear-gradient(var(--accent-a), var(--accent-b));
  }

  .vm-nav-item svg {
    width: 20px !important;
    height: 20px !important;
  }

  .vm-rail-rule {
    height: 1px;
    margin: 14px 12px;
    background: var(--line-soft);
  }

  .vm-rail-label {
    margin: 0 15px 5px;
    color: var(--quiet);
    font-size: 11px;
    font-weight: 760;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .vm-rail-note {
    margin: auto 14px 0;
    color: var(--quiet);
    font-size: 11px;
    line-height: 1.55;
  }

  .vm-main {
    position: relative;
    min-width: 0;
    min-height: 0;
    overflow: hidden auto;
    scrollbar-color: var(--line) transparent;
    scrollbar-width: thin;
  }

  .vm-content {
    width: min(100%, 1540px);
    min-height: 100%;
    margin: 0 auto;
    padding: 32px clamp(24px, 4vw, 64px) 62px;
  }

  .vm-view-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }

  .vm-eyebrow {
    margin: 0 0 6px;
    color: var(--muted);
    font-size: 12px;
    font-weight: 760;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .vm-view-title {
    margin: 0;
    color: var(--text);
    font-size: clamp(28px, 3vw, 46px);
    font-weight: 790;
    letter-spacing: -0.045em;
    line-height: 1;
  }

  .vm-hero {
    position: relative;
    display: grid;
    min-height: clamp(230px, 30vw, 360px);
    margin: 0 0 44px;
    overflow: hidden;
    align-items: end;
    border: 1px solid var(--line);
    border-radius: 32px;
    background: var(--surface-strong);
    box-shadow: var(--shadow);
  }

  .vm-hero-media,
  .vm-hero-shade {
    position: absolute;
    inset: 0;
  }

  .vm-hero-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.035);
    transition: transform 700ms cubic-bezier(.2, .8, .2, 1);
  }

  .vm-hero:hover .vm-hero-media {
    transform: scale(1);
  }

  .vm-hero-shade {
    background:
      linear-gradient(90deg, rgba(14, 12, 16, 0.9) 0%, rgba(14, 12, 16, 0.58) 46%, rgba(14, 12, 16, 0.08) 80%),
      linear-gradient(0deg, rgba(14, 12, 16, 0.54), transparent 55%);
  }

  .vm-hero-copy {
    position: relative;
    z-index: 1;
    width: min(560px, 72%);
    padding: clamp(26px, 4vw, 54px);
    color: #fff;
  }

  .vm-hero-kicker {
    margin: 0 0 8px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 12px;
    font-weight: 780;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .vm-hero-title {
    margin: 0;
    font-size: clamp(30px, 4vw, 60px);
    font-weight: 800;
    letter-spacing: -0.055em;
    line-height: 0.98;
  }

  .vm-hero-subtitle {
    max-width: 46ch;
    margin: 13px 0 22px;
    color: rgba(255, 255, 255, 0.74);
    font-size: 14px;
    line-height: 1.55;
  }

  .vm-detail {
    display: grid;
    grid-template-columns: minmax(180px, 280px) minmax(0, 1fr);
    align-items: end;
    gap: clamp(24px, 4vw, 56px);
    margin-bottom: 42px;
  }

  .vm-detail-art {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 32px;
    object-fit: cover;
    box-shadow: var(--shadow);
  }

  .vm-detail-copy {
    min-width: 0;
    padding-bottom: 8px;
  }

  .vm-detail-title {
    max-width: 18ch;
    margin: 8px 0 12px;
    font-size: clamp(32px, 5vw, 70px);
    line-height: .96;
    letter-spacing: -.055em;
  }

  .vm-detail-description,
  .vm-detail-subtitle {
    max-width: 70ch;
    margin: 0 0 10px;
    color: var(--muted);
    line-height: 1.5;
  }

  .vm-track-list {
    display: grid;
    gap: 2px;
    margin: 0 0 44px;
  }

  .vm-track-row {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) minmax(120px, .7fr) 36px;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-width: 0;
    padding: 10px 12px;
    border: 0;
    border-radius: 8px;
    color: inherit;
    text-align: left;
    background: transparent;
    cursor: pointer;
  }

  .vm-track-row:hover,
  .vm-track-row:focus-visible {
    background: var(--surface-hover);
    outline: none;
  }

  .vm-track-art {
    display: block;
    width: 40px;
    height: 40px;
    aspect-ratio: 1;
    border-radius: 20px;
    object-fit: cover;
  }

  .vm-track-title,
  .vm-track-subtitle {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vm-track-title {
    font-weight: 680;
  }

  .vm-track-subtitle {
    color: var(--muted);
    font-size: 13px;
  }

  .vm-primary-action {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    color: #fff;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(100deg, var(--accent-a), var(--accent-b));
    box-shadow: 0 10px 24px rgba(215, 39, 244, 0.22);
    font-weight: 740;
    cursor: pointer;
    transition: transform 160ms ease, box-shadow 160ms ease;
  }

  .vm-primary-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(215, 39, 244, 0.3);
  }

  .vm-primary-action svg {
    width: 18px !important;
    height: 18px !important;
  }

  .vm-shelf {
    margin: 0 0 38px;
    animation: vortex-section-in 420ms cubic-bezier(.2, .8, .2, 1) both;
  }

  .vm-shelf-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 16px;
  }

  .vm-shelf-title {
    margin: 0;
    font-size: clamp(20px, 2vw, 27px);
    font-weight: 760;
    letter-spacing: -0.035em;
  }

  .vm-shelf-actions {
    display: flex;
    gap: 5px;
  }

  .vm-shelf-arrow {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    color: var(--muted);
  }

  .vm-shelf-arrow svg {
    width: 18px !important;
    height: 18px !important;
  }

  .vm-media-row {
    display: grid;
    grid-auto-columns: minmax(150px, 1fr);
    grid-auto-flow: column;
    gap: clamp(14px, 1.6vw, 24px);
    overflow: hidden;
    scroll-behavior: smooth;
  }

  .vm-media-card {
    min-width: 0;
    color: inherit;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .vm-artwork-wrap {
    position: relative;
    overflow: hidden;
    display: block;
    width: 100%;
    aspect-ratio: 1;
    margin-bottom: 12px;
    border-radius: 28px;
    background: transparent;
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.14);
    transform: translateZ(0);
  }

  .vm-artwork {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    border-radius: inherit;
    object-fit: cover;
    transition: transform 380ms cubic-bezier(.2, .8, .2, 1), filter 220ms ease;
  }

  .vm-card-play {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    color: #fff;
    border: 0;
    border-radius: 50%;
    opacity: 0;
    background: linear-gradient(100deg, var(--accent-a), var(--accent-b));
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34);
    transform: translateY(8px);
    transition: opacity 180ms ease, transform 180ms ease;
    pointer-events: none;
  }

  .vm-card-play svg {
    width: 19px !important;
    height: 19px !important;
  }

  .vm-media-card:hover .vm-artwork {
    transform: scale(1.045);
    filter: saturate(1.08);
  }

  .vm-media-card:hover .vm-card-play,
  .vm-media-card:focus-visible .vm-card-play {
    opacity: 1;
    transform: translateY(0);
  }

  .vm-media-title,
  .vm-media-subtitle {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .vm-media-title {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 690;
    line-height: 1.35;
    -webkit-line-clamp: 2;
  }

  .vm-media-subtitle {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.35;
    -webkit-line-clamp: 2;
  }

  .vm-empty,
  .vm-loading {
    display: grid;
    min-height: 280px;
    place-items: center;
    padding: 42px;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 28px;
    background: var(--surface);
    text-align: center;
  }

  .vm-loading-inner {
    display: grid;
    justify-items: center;
    gap: 15px;
  }

  .vm-loader {
    width: 38px;
    height: 38px;
    border: 2px solid var(--line-soft);
    border-top-color: var(--accent-a);
    border-right-color: var(--accent-b);
    border-radius: 50%;
    animation: vortex-spin 900ms linear infinite;
  }

  .vm-loading-surface {
    position: relative;
    min-height: 280px;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 28px;
    background: var(--loading-base);
  }

  .vm-loading-surface::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 20%,
      var(--loading-sheen) 42%,
      var(--loading-sheen) 58%,
      transparent 80%
    );
    content: "";
    transform: translateX(-100%);
    will-change: transform;
    animation: vortex-loading-sweep 1.55s cubic-bezier(.4, 0, .2, 1) infinite;
  }

  .vm-player {
    position: relative;
    z-index: 4;
    display: grid;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    grid-template-columns: minmax(220px, 1fr) minmax(360px, 1.25fr) minmax(220px, 1fr);
    align-items: center;
    gap: 20px;
    padding: 12px 24px;
    border-top: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface-strong) 92%, transparent);
    box-shadow: 0 -12px 34px rgba(0, 0, 0, 0.14);
    backdrop-filter: blur(24px);
  }

  .vm-player > * {
    min-width: 0;
  }

  .vm-now-playing {
    display: grid;
    min-width: 0;
    grid-template-columns: 58px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }

  .vm-player-art[data-action="expand-player"],
  .vm-player-copy[data-action="expand-player"] {
    cursor: pointer;
  }

  .vm-player-expanded {
    position: fixed;
    inset: 0 0 var(--player-height);
    z-index: 80;
    display: grid;
    place-items: center;
    padding: clamp(28px, 6vw, 88px);
    overflow: hidden;
    visibility: hidden;
    opacity: 0;
    background: #111;
    pointer-events: none;
    transition: opacity 240ms ease, visibility 240ms ease;
  }

  #vortex-music-app.player-expanded .vm-player-expanded {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }

  .vm-expanded-backdrop {
    position: absolute;
    inset: -8%;
    width: 116%;
    height: 116%;
    object-fit: cover;
    opacity: .22;
    filter: blur(52px) saturate(1.25);
    transform: scale(1.08);
  }

  .vm-expanded-close {
    position: absolute;
    top: 28px;
    right: 28px;
    z-index: 2;
  }

  .vm-expanded-content {
    position: relative;
    z-index: 1;
    display: grid;
    width: min(1100px, 100%);
    grid-template-columns: minmax(260px, 560px) minmax(260px, 1fr);
    align-items: center;
    gap: clamp(36px, 7vw, 96px);
  }

  .vm-expanded-art {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 40px;
    object-fit: cover;
    box-shadow: 0 32px 90px rgba(0, 0, 0, .48);
  }

  .vm-expanded-kicker {
    margin: 0 0 12px;
    color: var(--muted);
    font-size: 12px;
    font-weight: 760;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .vm-expanded-title {
    margin: 0 0 14px;
    font-size: clamp(38px, 6vw, 78px);
    line-height: .96;
    letter-spacing: -.055em;
  }

  .vm-expanded-artist {
    margin: 0 0 10px;
    color: var(--muted);
    font-size: clamp(17px, 2vw, 24px);
  }

  .vm-expanded-album {
    margin: 0;
    color: var(--quiet);
    font-size: clamp(14px, 1.4vw, 18px);
  }

  .vm-expanded-controls {
    display: none;
    align-items: center;
    gap: 14px;
  }

  .vm-player-art {
    display: block;
    width: 58px;
    height: 58px;
    aspect-ratio: 1;
    border-radius: 20px;
    object-fit: cover;
  }

  .vm-player-copy {
    min-width: 0;
  }

  .vm-player-title,
  .vm-player-artist {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vm-player-title {
    font-size: 13px;
    font-weight: 700;
  }

  .vm-player-artist {
    margin-top: 3px;
    color: var(--muted);
    font-size: 11px;
  }

  .vm-player-center {
    display: grid;
    gap: 7px;
  }

  .vm-player-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .vm-player-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: var(--muted);
  }

  .vm-player-button.is-active {
    color: var(--accent-a);
  }

  .vm-player-button.vm-play-toggle {
    width: 42px;
    height: 42px;
    margin: 0 7px;
    color: #fff;
    background: linear-gradient(100deg, var(--accent-a), var(--accent-b));
    box-shadow: 0 8px 20px rgba(215, 39, 244, 0.24);
  }

  .vm-player-button.vm-play-toggle:hover {
    background: linear-gradient(100deg, #df38f6, #ff426d);
    transform: scale(1.04);
  }

  .vm-player-button svg {
    width: 19px !important;
    height: 19px !important;
  }

  .vm-play-toggle svg {
    width: 20px !important;
    height: 20px !important;
  }

  .vm-progress-row {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr) 38px;
    align-items: center;
    gap: 9px;
    color: var(--quiet);
    font-size: 10px;
    font-variant-numeric: tabular-nums;
  }

  .vm-range {
    width: 100%;
    height: 3px;
    margin: 0;
    border-radius: 99px;
    outline: none;
    appearance: none;
    background: linear-gradient(90deg, var(--accent-a) 0 var(--range-progress, 0%), var(--line-soft) var(--range-progress, 0%) 100%);
    cursor: pointer;
  }

  .vm-range::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    border: 2px solid var(--surface-strong);
    border-radius: 50%;
    appearance: none;
    background: var(--accent-b);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
  }

  .vm-player-right {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .vm-volume {
    width: min(110px, 9vw);
  }

  .vm-queue-drawer {
    position: absolute;
    top: 78px;
    right: 0;
    bottom: var(--player-height);
    z-index: 8;
    display: grid;
    width: min(410px, 92vw);
    grid-template-rows: auto minmax(0, 1fr);
    border-left: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface-strong) 96%, transparent);
    box-shadow: -20px 0 45px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(24px);
    transform: translateX(104%);
    transition: transform 260ms cubic-bezier(.2, .8, .2, 1);
  }

  #vortex-music-app.queue-open .vm-queue-drawer {
    transform: translateX(0);
  }

  .vm-queue-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 22px 16px;
    border-bottom: 1px solid var(--line-soft);
  }

  .vm-queue-title {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.03em;
  }

  .vm-queue-list {
    overflow: auto;
    padding: 10px 12px 22px;
  }

  .vm-queue-item {
    display: grid;
    width: 100%;
    grid-template-columns: 46px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 9px 10px;
    color: inherit;
    border: 0;
    border-radius: 14px;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .vm-queue-item:hover,
  .vm-queue-item.is-current {
    background: var(--line-soft);
  }

  .vm-queue-item.is-current {
    color: var(--accent-b);
  }

  .vm-queue-art {
    display: block;
    width: 46px;
    height: 46px;
    aspect-ratio: 1;
    border-radius: 20px;
    object-fit: cover;
  }

  .vm-queue-copy {
    min-width: 0;
  }

  .vm-queue-name,
  .vm-queue-byline {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vm-queue-name {
    color: var(--text);
    font-size: 12px;
    font-weight: 680;
  }

  .vm-queue-byline {
    margin-top: 3px;
    color: var(--muted);
    font-size: 11px;
  }

  .vm-toast {
    position: absolute;
    right: 24px;
    bottom: calc(var(--player-height) + 18px);
    z-index: 12;
    max-width: min(360px, calc(100vw - 48px));
    padding: 11px 15px;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 13px;
    opacity: 0;
    background: rgba(27, 25, 29, 0.94);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.25);
    font-size: 12px;
    pointer-events: none;
    transform: translateY(7px);
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .vm-toast.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes vortex-shell-in {
    from { opacity: 0; transform: scale(.996); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes vortex-section-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes vortex-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes vortex-loading-sweep {
    to { transform: translateX(100%); }
  }

  @media (max-width: 980px) {
    #vortex-music-app {
      --rail-width: 76px;
    }

    .vm-topbar {
      grid-template-columns: 54px minmax(220px, 1fr) auto;
      gap: 16px;
      padding: 0 18px;
    }

    .vm-brand-wordmark,
    .vm-nav-label,
    .vm-rail-label,
    .vm-rail-note {
      display: none;
    }

    .vm-rail {
      align-items: center;
      padding-inline: 10px;
    }

    .vm-nav-item {
      justify-content: center;
      padding: 0;
    }

    .vm-nav-item[aria-current="page"]::before {
      top: 12px;
      bottom: 12px;
    }

    .vm-player {
      grid-template-columns: minmax(180px, .8fr) minmax(330px, 1.2fr) auto;
      padding-inline: 16px;
    }

    .vm-volume,
    .vm-player-right > .vm-icon-button:first-child {
      display: none;
    }
  }

  @media (max-width: 700px) {
    #vortex-music-app {
      --player-height: 82px;
      --rail-width: 0px;
      grid-template-rows: 68px minmax(0, 1fr) var(--player-height);
    }

    .vm-topbar {
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 10px;
      padding: 0 12px;
    }

    .vm-brand-mark {
      width: 32px;
      height: 32px;
      flex-basis: 32px;
    }

    .vm-brand-mark svg {
      width: 32px !important;
      height: 32px !important;
    }

    .vm-search {
      height: 40px;
    }

    .vm-search input {
      padding-right: 12px;
    }

    .vm-top-actions .vm-icon-button[data-action="back"],
    .vm-top-actions .vm-icon-button[data-action="forward"] {
      display: none;
    }

    .vm-login-button {
      min-width: 62px;
      height: 34px;
      padding-inline: 13px;
      font-size: 13px;
    }

    .vm-workspace {
      display: block;
    }

    .vm-rail {
      position: absolute;
      right: 12px;
      bottom: calc(var(--player-height) + 10px);
      left: 12px;
      z-index: 5;
      display: grid;
      min-height: 56px;
      grid-template-columns: repeat(4, 1fr);
      padding: 6px;
      border: 1px solid var(--line);
      border-radius: 20px;
      background: color-mix(in srgb, var(--surface-strong) 94%, transparent);
      box-shadow: var(--shadow);
    }

    .vm-rail-rule,
    .vm-rail .vm-nav-item[data-route^="/playlist"] {
      display: none;
    }

    .vm-nav-item {
      min-height: 44px;
    }

    .vm-content {
      padding: 24px 16px 100px;
    }

    .vm-view-header {
      margin-bottom: 18px;
    }

    .vm-view-title {
      font-size: 30px;
    }

    .vm-hero {
      min-height: 300px;
      margin-bottom: 34px;
      border-radius: 24px;
    }

    .vm-hero-shade {
      background: linear-gradient(0deg, rgba(14, 12, 16, .94), rgba(14, 12, 16, .16) 90%);
    }

    .vm-hero-copy {
      width: 100%;
      padding: 26px 22px;
    }

    .vm-media-row {
      grid-auto-columns: minmax(140px, 46vw);
      overflow: auto hidden;
      scrollbar-width: none;
    }

    .vm-player {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      padding: 10px 12px;
    }

    .vm-player-center {
      display: block;
    }

    .vm-player-controls > :not(.vm-play-toggle),
    .vm-progress-row,
    .vm-player-right {
      display: none;
    }

    .vm-player-controls {
      justify-content: end;
    }

    .vm-play-toggle {
      margin: 0 !important;
    }

    .vm-now-playing {
      grid-template-columns: 50px minmax(0, 1fr);
    }

    .vm-player-art {
      width: 50px;
      height: 50px;
      border-radius: 20px;
    }

    .vm-now-playing > .vm-icon-button {
      display: none;
    }

    .vm-detail,
    .vm-expanded-content {
      grid-template-columns: minmax(0, 1fr);
    }

    .vm-detail-art,
    .vm-expanded-art {
      width: min(62vw, 340px);
      justify-self: center;
    }

    .vm-expanded-copy {
      text-align: center;
    }

    .vm-expanded-controls {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }

    .vm-track-row {
      grid-template-columns: 40px minmax(0, 1fr) 30px;
    }

    .vm-track-subtitle {
      display: none;
    }

    .vm-queue-drawer {
      top: 68px;
      bottom: var(--player-height);
      width: 100vw;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #vortex-music-app,
    #vortex-music-app *,
    #vortex-music-app *::before,
    #vortex-music-app *::after {
      scroll-behavior: auto !important;
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
    }
  }
`;

export function customClientBootstrap(
  styles: string,
  icons: Record<string, string>,
  previewMode = false,
): void {
  const bridgeMode = previewMode &&
    (globalThis as typeof globalThis & { __vortexBridgeMode?: boolean }).__vortexBridgeMode ===
      true;
  const bridge = bridgeMode
    ? {
      async musicState(): Promise<unknown> {
        const controller = new AbortController();
        const timeout = globalThis.setTimeout(() => controller.abort(), 7000);
        try {
          const response = await fetch("/api/state", {
            cache: "no-store",
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(await response.text());
          return await response.json();
        } catch (error) {
          if (controller.signal.aborted) {
            throw new Error("The music engine did not respond in time.");
          }
          throw error;
        } finally {
          globalThis.clearTimeout(timeout);
        }
      },
      async musicCommand(
        command: string,
        payload: Record<string, unknown> = {},
      ): Promise<unknown> {
        const controller = new AbortController();
        const timeout = globalThis.setTimeout(() => controller.abort(), 7000);
        try {
          const response = await fetch("/api/command", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ command, payload }),
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(await response.text());
          return await response.json();
        } catch (error) {
          if (controller.signal.aborted) {
            throw new Error("The music engine did not respond in time.");
          }
          throw error;
        } finally {
          globalThis.clearTimeout(timeout);
        }
      },
    }
    : null;
  let style = document.getElementById("vortex-music-style") as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = "vortex-music-style";
    document.documentElement.append(style);
  }
  style.textContent = styles;

  const existingRoot = document.getElementById("vortex-music-app");
  if (existingRoot) {
    document.documentElement.classList.add("vortex-music-active");
    document.documentElement.append(existingRoot);
    return;
  }

  const officialRoot = previewMode ? null : document.querySelector("ytmusic-app");
  if (!previewMode && !officialRoot) {
    throw new Error("The official YouTube Music application is not ready.");
  }

  const cleanText = (value: string | null | undefined): string =>
    (value ?? "").replace(/\s+/g, " ").trim();
  const firstText = (root: ParentNode, selectors: string[]): string => {
    for (const selector of selectors) {
      const value = cleanText(root.querySelector(selector)?.textContent);
      if (value) return value;
    }
    return "";
  };
  const firstImage = (root: ParentNode): string => {
    const image = root.querySelector("img") as HTMLImageElement | null;
    return image?.currentSrc || image?.src || image?.getAttribute("src") || "";
  };
  const root = document.createElement("div");
  root.id = "vortex-music-app";
  root.setAttribute("data-preview", String(previewMode));
  const themeStorageKey = "vortex-music-theme";
  const isTheme = (value: string | null): value is "light" | "dark" =>
    value === "light" || value === "dark";
  const cookieTheme =
    document.cookie.split(";").map((entry) => entry.trim()).find((entry) =>
      entry.startsWith(`${themeStorageKey}=`)
    )?.slice(themeStorageKey.length + 1) ?? null;
  const savedTheme = isTheme(cookieTheme) ? cookieTheme : localStorage.getItem(themeStorageKey);
  root.dataset.theme = isTheme(savedTheme) ? savedTheme : "dark";
  localStorage.setItem(themeStorageKey, root.dataset.theme);

  const persistTheme = (theme: "light" | "dark"): void => {
    localStorage.setItem(themeStorageKey, theme);
    // Deno Desktop serves the UI from a random loopback port on each launch.
    // Cookies are host-scoped instead of port-scoped, so this survives relaunches.
    document.cookie = `${themeStorageKey}=${theme}; Path=/; Max-Age=315360000; SameSite=Strict`;
  };

  document.documentElement.classList.add("vortex-music-active");

  root.innerHTML = `
    ${
    bridgeMode
      ? `<div class="vm-startup" role="status" aria-live="polite" aria-label="Loading YouTube Music">
      <div class="vm-startup-mark">
        <div class="vm-startup-logo">${icons.youtubeMusic}</div>
      </div>
    </div>`
      : ""
  }
    <header class="vm-topbar">
      <div class="vm-brand" aria-label="YouTube Music Desktop">
        <span class="vm-brand-mark">${icons.youtubeMusic}</span>
        <span class="vm-brand-wordmark">YouTube Music</span>
      </div>
      <form class="vm-search" role="search">
        ${icons.search}
        <input type="search" aria-label="Search YouTube Music" placeholder="Search songs, albums, artists, and podcasts" autocomplete="off">
      </form>
      <div class="vm-top-actions">
        <button class="vm-icon-button" type="button" data-action="back" aria-label="Go back">${icons.back}</button>
        <button class="vm-icon-button" type="button" data-action="forward" aria-label="Go forward">${icons.forward}</button>
        <button class="vm-icon-button" type="button" data-action="theme" aria-label="Change color theme">${icons.moon}</button>
        <button class="vm-login-button" type="button" data-action="login">Login</button>
        <img class="vm-avatar" alt="Account" hidden>
      </div>
    </header>
    <div class="vm-workspace">
      <nav class="vm-rail" aria-label="Main navigation">
        <button class="vm-nav-item" type="button" data-route="/" aria-label="Home" aria-current="page">${icons.home}<span class="vm-nav-label">Home</span></button>
        <button class="vm-nav-item" type="button" data-route="/explore" aria-label="Explore">${icons.compass}<span class="vm-nav-label">Explore</span></button>
        <button class="vm-nav-item" type="button" data-route="/library" aria-label="Library">${icons.library}<span class="vm-nav-label">Library</span></button>
        <div class="vm-rail-rule"></div>
        <p class="vm-rail-label">Your music</p>
        <button class="vm-nav-item" type="button" data-route="/playlist?list=LM" aria-label="Liked music">${icons.heart}<span class="vm-nav-label">Liked music</span></button>
        <button class="vm-nav-item" type="button" data-action="queue" aria-label="Up next">${icons.queue}<span class="vm-nav-label">Up next</span></button>
        <p class="vm-rail-note">Unofficial YouTube Music Desktop App Made by TheDoctorTTV.</p>
        
      </nav>
      <main class="vm-main" tabindex="-1">
        <div class="vm-content">
          <div class="vm-loading">
            <div class="vm-loading-inner"><span class="vm-loader"></span><span>Preparing your music…</span></div>
          </div>
        </div>
      </main>
    </div>
    <aside class="vm-player-expanded" aria-label="Now playing" aria-hidden="true">
      <img class="vm-expanded-backdrop" alt="">
      <button class="vm-icon-button vm-expanded-close" type="button" data-action="collapse-player" aria-label="Close now playing">${icons.close}</button>
      <div class="vm-expanded-content">
        <img class="vm-expanded-art" alt="Current track artwork">
        <div class="vm-expanded-copy">
          <p class="vm-expanded-kicker">Now playing</p>
          <h2 class="vm-expanded-title">Nothing playing</h2>
          <p class="vm-expanded-artist">Choose something to listen to</p>
          <p class="vm-expanded-album">Album unavailable</p>
          <div class="vm-expanded-controls">
            <button class="vm-player-button" type="button" data-action="previous" aria-label="Previous track">${icons.previous}</button>
            <button class="vm-player-button vm-play-toggle" type="button" data-action="play" aria-label="Play">${icons.play}</button>
            <button class="vm-player-button" type="button" data-action="next" aria-label="Next track">${icons.next}</button>
          </div>
        </div>
      </div>
    </aside>
    <aside class="vm-queue-drawer" aria-label="Up next" aria-hidden="true">
      <div class="vm-queue-head"><h2 class="vm-queue-title">Up next</h2><button class="vm-icon-button" type="button" data-action="close-queue" aria-label="Close queue">${icons.close}</button></div>
      <div class="vm-queue-list"></div>
    </aside>
    <footer class="vm-player">
      <div class="vm-now-playing">
        <img class="vm-player-art" data-action="expand-player" alt="Current track artwork">
        <div class="vm-player-copy" data-action="expand-player" role="button" tabindex="0" aria-label="Open now playing"><p class="vm-player-title">Nothing playing</p><p class="vm-player-artist">Choose something to listen to</p></div>
        <button class="vm-icon-button" type="button" data-action="like" aria-label="Like current track">${icons.heart}</button>
      </div>
      <div class="vm-player-center">
        <div class="vm-player-controls">
          <button class="vm-player-button" type="button" data-action="shuffle" aria-label="Shuffle">${icons.shuffle}</button>
          <button class="vm-player-button" type="button" data-action="previous" aria-label="Previous track">${icons.previous}</button>
          <button class="vm-player-button vm-play-toggle" type="button" data-action="play" aria-label="Play">${icons.play}</button>
          <button class="vm-player-button" type="button" data-action="next" aria-label="Next track">${icons.next}</button>
          <button class="vm-player-button" type="button" data-action="repeat" aria-label="Repeat">${icons.repeat}</button>
        </div>
        <div class="vm-progress-row"><span class="vm-elapsed">0:00</span><input class="vm-range vm-progress" type="range" min="0" max="1000" value="0" aria-label="Track position"><span class="vm-duration">0:00</span></div>
      </div>
      <div class="vm-player-right">
        <button class="vm-icon-button" type="button" data-action="more" aria-label="More options">${icons.dots}</button>
        <button class="vm-icon-button" type="button" data-action="queue" aria-label="Open queue">${icons.queue}</button>
        <button class="vm-icon-button" type="button" data-action="mute" aria-label="Mute">${icons.volume}</button>
        <input class="vm-range vm-volume" type="range" min="0" max="100" value="70" aria-label="Volume">
      </div>
    </footer>
    <div class="vm-toast" role="status" aria-live="polite"></div>
  `;
  document.documentElement.append(root);

  const initialTheme = root.dataset.theme;
  const initialThemeButton = root.querySelector('[data-action="theme"]') as HTMLButtonElement;
  initialThemeButton.innerHTML = initialTheme === "light" ? icons.moon : icons.sun;
  initialThemeButton.setAttribute(
    "aria-label",
    `Use ${initialTheme === "light" ? "dark" : "light"} mode`,
  );

  type MediaItem = {
    title: string;
    subtitle: string;
    image: string;
    href: string;
    current?: boolean;
    source?: Element;
  };
  type Shelf = { title: string; items: MediaItem[] };
  type PageDetail = {
    kind?: "detail" | "search";
    title?: string;
    subtitle?: string;
    description?: string;
    artwork?: string;
    items?: MediaItem[];
  };
  type BridgeState = {
    path?: string;
    signedIn?: boolean;
    avatar?: string;
    shelves?: Shelf[];
    page?: PageDetail | null;
    queue?: MediaItem[];
    player?: {
      title?: string;
      artist?: string;
      album?: string;
      artwork?: string;
      currentTime?: number;
      duration?: number;
      volume?: number;
      muted?: boolean;
      playing?: boolean;
    };
  };
  let currentShelves: Shelf[] = [];
  let bridgeState: BridgeState | null = null;
  let pendingRoute: string | null = null;
  let pendingRouteTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let mockPlaying = false;
  let mockTime = 34;
  const mockDuration = 236;
  let renderTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let toastTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let volumeCommandTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let volumeCommandInFlight = false;
  let queuedVolume: number | null = null;
  let pendingVolume: number | null = null;
  let preferredVolume: number | null = null;
  let lastVolumeCorrection = 0;
  let refreshBridgeState: () => Promise<void> = async () => {};

  const content = root.querySelector(".vm-content") as HTMLElement;
  const searchInput = root.querySelector(".vm-search input") as HTMLInputElement;
  const queueDrawer = root.querySelector(".vm-queue-drawer") as HTMLElement;
  const queueList = root.querySelector(".vm-queue-list") as HTMLElement;
  const playButton = root.querySelector('[data-action="play"]') as HTMLButtonElement;
  const progress = root.querySelector(".vm-progress") as HTMLInputElement;
  const volume = root.querySelector(".vm-volume") as HTMLInputElement;

  const revealDesktop = (): void => {
    const startup = root.querySelector(".vm-startup") as HTMLElement | null;
    if (!startup || startup.classList.contains("is-ready")) return;
    startup.classList.add("is-ready");
    globalThis.setTimeout(() => startup.remove(), 340);
  };

  const showToast = (message: string): void => {
    const toast = root.querySelector(".vm-toast") as HTMLElement;
    toast.textContent = message;
    toast.classList.add("is-visible");
    if (toastTimer !== undefined) globalThis.clearTimeout(toastTimer);
    toastTimer = globalThis.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  };

  const clearPendingRoute = (): void => {
    pendingRoute = null;
    if (pendingRouteTimer !== undefined) {
      globalThis.clearTimeout(pendingRouteTimer);
      pendingRouteTimer = undefined;
    }
  };

  const beginPendingRoute = (href: string): void => {
    clearPendingRoute();
    pendingRoute = href;
    pendingRouteTimer = globalThis.setTimeout(() => {
      if (pendingRoute !== href) return;
      clearPendingRoute();
      root.dataset.renderSignature = "";
      render();
      showToast("YouTube Music could not load that page. Try again.");
      void refreshBridgeState();
    }, 8000);
  };

  const sendCommand = async (
    command: string,
    payload: Record<string, unknown> = {},
  ): Promise<unknown> => {
    if (!bridge) return undefined;
    try {
      const result = await bridge.musicCommand(command, payload);
      if (command !== "seek" && command !== "volume") void refreshBridgeState();
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`YouTube Music: ${message}`);
      throw error;
    }
  };

  const flushVolumeCommand = async (): Promise<void> => {
    if (!bridgeMode || volumeCommandInFlight || queuedVolume === null) return;
    const value = queuedVolume;
    queuedVolume = null;
    volumeCommandInFlight = true;
    try {
      await sendCommand("volume", { value });
    } catch {
      if (queuedVolume === null && pendingVolume === value) {
        pendingVolume = null;
        updatePlayer();
      }
    } finally {
      volumeCommandInFlight = false;
      if (queuedVolume !== null) void flushVolumeCommand();
    }
  };

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  };

  const setRangeFill = (input: HTMLInputElement): void => {
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const value = Number(input.value) || 0;
    const percentage = ((value - min) / Math.max(1, max - min)) * 100;
    input.style.setProperty("--range-progress", `${percentage}%`);
  };

  const mockShelves: Shelf[] = [
    {
      title: "Made for you",
      items: [
        {
          title: "Midnight circuitry",
          subtitle: "A neon focus mix",
          image: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
          href: "#midnight",
        },
        {
          title: "Deep space radio",
          subtitle: "Ambient and downtempo",
          image: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
          href: "#space",
        },
        {
          title: "Afterglow",
          subtitle: "Dream pop essentials",
          image: "https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg",
          href: "#afterglow",
        },
        {
          title: "Night drive",
          subtitle: "Synthwave and electronic",
          image: "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg",
          href: "#drive",
        },
        {
          title: "Quiet orbit",
          subtitle: "Instrumental focus",
          image: "https://i.ytimg.com/vi/rUxyKA_-grg/hqdefault.jpg",
          href: "#orbit",
        },
        {
          title: "Signals",
          subtitle: "Indie discoveries",
          image: "https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg",
          href: "#signals",
        },
      ],
    },
    {
      title: "Listen again",
      items: [
        {
          title: "Lofi hip hop radio",
          subtitle: "Lofi Girl",
          image: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
          href: "#lofi",
        },
        {
          title: "Chillhop essentials",
          subtitle: "Chillhop Music",
          image: "https://i.ytimg.com/vi/5yx6BWlEVcY/hqdefault.jpg",
          href: "#chillhop",
        },
        {
          title: "Synthwave radio",
          subtitle: "The Prime Thanatos",
          image: "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg",
          href: "#synthwave",
        },
        {
          title: "Coffee shop ambience",
          subtitle: "Calm Café",
          image: "https://i.ytimg.com/vi/h2zkV-l_TbY/hqdefault.jpg",
          href: "#coffee",
        },
        {
          title: "Late night jazz",
          subtitle: "Coffee Relaxing Jazz",
          image: "https://i.ytimg.com/vi/Dx5qFachd3A/hqdefault.jpg",
          href: "#jazz",
        },
        {
          title: "Space ambience",
          subtitle: "Relaxation Ambient",
          image: "https://i.ytimg.com/vi/tNkZsRW7h2c/hqdefault.jpg",
          href: "#ambient",
        },
      ],
    },
  ];

  const extractItem = (element: Element): MediaItem | null => {
    const anchors = Array.from(element.querySelectorAll("a[href]"));
    const primaryAnchor = anchors.find((candidate) =>
      candidate.matches(
        "a.ytmusic-responsive-list-item-renderer,a.ytmusic-two-row-item-renderer",
      )
    );
    const titleAnchor = anchors.find((candidate) =>
      cleanText(candidate.getAttribute("title")) || cleanText(candidate.textContent)
    );
    const anchor = primaryAnchor || titleAnchor ||
      anchors.find((candidate) => candidate.querySelector("img"));
    const href = anchor?.getAttribute("href") || "";
    const title = firstText(element, [
      ".title-column yt-formatted-string",
      "yt-formatted-string.title",
      "a.yt-simple-endpoint[title]",
      "#title",
      ".title",
    ]) || cleanText(titleAnchor?.getAttribute("title")) || cleanText(titleAnchor?.textContent);
    if (!title || !href) return null;
    const subtitle = firstText(element, [
      ".secondary-flex-columns yt-formatted-string",
      "yt-formatted-string.subtitle",
      ".subtitle",
      "#subtitle",
      ".byline",
    ]);
    return { title, subtitle, image: firstImage(element), href, source: element };
  };

  const extractShelves = (): Shelf[] => {
    if (bridgeMode) return bridgeState?.shelves ?? [];
    if (previewMode) return mockShelves;
    const selectors = [
      "ytmusic-carousel-shelf-renderer",
      "ytmusic-shelf-renderer",
      "ytmusic-grid-renderer",
      "ytmusic-playlist-shelf-renderer",
    ];
    const shelves: Shelf[] = [];
    for (const shelfElement of officialRoot!.querySelectorAll(selectors.join(","))) {
      if (shelfElement.closest("ytmusic-player-queue")) continue;
      const title = firstText(shelfElement, [
        "yt-formatted-string.title",
        "#title",
        ".title",
        "h2",
      ]);
      const candidates = shelfElement.querySelectorAll([
        "ytmusic-two-row-item-renderer",
        "ytmusic-responsive-list-item-renderer",
        "ytmusic-grid-renderer ytmusic-two-row-item-renderer",
      ].join(","));
      const seen = new Set<string>();
      const items: MediaItem[] = [];
      for (const candidate of candidates) {
        const item = extractItem(candidate);
        if (!item || seen.has(item.href)) continue;
        seen.add(item.href);
        items.push(item);
        if (items.length >= 12) break;
      }
      if (items.length) shelves.push({ title: title || "Music for you", items });
      if (shelves.length >= 8) break;
    }
    return shelves;
  };

  const pathTitle = (): { eyebrow: string; title: string } => {
    const pathname = bridgeMode ? pendingRoute ?? bridgeState?.path ?? "/" : location.pathname;
    if (previewMode && !bridgeMode) return { eyebrow: "Good evening", title: "Your soundtrack" };
    if (pathname.startsWith("/explore")) {
      return { eyebrow: "Browse something new", title: "Explore" };
    }
    if (pathname.startsWith("/library")) {
      return { eyebrow: "Saved for later", title: "Library" };
    }
    if (pathname.startsWith("/search")) {
      return {
        eyebrow: "Search results",
        title: "Search",
      };
    }
    if (pathname.startsWith("/playlist")) {
      return { eyebrow: "Your collection", title: "Playlist" };
    }
    return { eyebrow: "Good evening", title: "Your soundtrack" };
  };

  const createMediaCard = (item: MediaItem): HTMLButtonElement => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "vm-media-card";
    card.dataset.href = item.href;
    const artWrap = document.createElement("span");
    artWrap.className = "vm-artwork-wrap";
    if (item.image) {
      const image = document.createElement("img");
      image.className = "vm-artwork";
      image.src = item.image;
      image.alt = "";
      image.loading = "lazy";
      artWrap.append(image);
    }
    const play = document.createElement("span");
    play.className = "vm-card-play";
    play.dataset.playHref = item.href;
    play.innerHTML = icons.play;
    artWrap.append(play);
    const title = document.createElement("p");
    title.className = "vm-media-title";
    title.textContent = item.title;
    const subtitle = document.createElement("p");
    subtitle.className = "vm-media-subtitle";
    subtitle.textContent = item.subtitle;
    card.append(artWrap, title, subtitle);
    return card;
  };

  const renderPageDetail = (page: PageDetail): void => {
    content.replaceChildren();
    if (page.kind === "search") {
      const header = document.createElement("header");
      header.className = "vm-view-header";
      header.innerHTML = `<div><p class="vm-eyebrow"></p><h1 class="vm-view-title"></h1></div>`;
      (header.querySelector(".vm-eyebrow") as HTMLElement).textContent = "Search results";
      (header.querySelector(".vm-view-title") as HTMLElement).textContent = page.title
        ? `Results for “${page.title}”`
        : "Search";
      content.append(header);
    } else {
      const detail = document.createElement("section");
      detail.className = "vm-detail";
      if (page.artwork) {
        const artwork = document.createElement("img");
        artwork.className = "vm-detail-art";
        artwork.src = page.artwork;
        artwork.alt = "";
        detail.append(artwork);
      }
      const copy = document.createElement("div");
      copy.className = "vm-detail-copy";
      const eyebrow = document.createElement("p");
      eyebrow.className = "vm-eyebrow";
      eyebrow.textContent = "YouTube Music";
      const title = document.createElement("h1");
      title.className = "vm-detail-title vm-view-title";
      title.textContent = page.title || pathTitle().title;
      const subtitle = document.createElement("p");
      subtitle.className = "vm-detail-subtitle";
      subtitle.textContent = page.subtitle || "";
      const description = document.createElement("p");
      description.className = "vm-detail-description";
      description.textContent = page.description || "";
      const play = document.createElement("button");
      play.type = "button";
      play.className = "vm-primary-action";
      play.dataset.action = "play-page";
      play.innerHTML = `${icons.play}<span>Play</span>`;
      copy.append(eyebrow, title);
      if (subtitle.textContent) copy.append(subtitle);
      if (description.textContent) copy.append(description);
      copy.append(play);
      detail.append(copy);
      content.append(detail);
    }

    if (page.items?.length) {
      const list = document.createElement("section");
      list.className = "vm-track-list";
      list.setAttribute("aria-label", page.kind === "search" ? "Search results" : "Tracks");
      page.items.forEach((item) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "vm-track-row";
        row.dataset.playHref = item.href;
        const art = document.createElement("img");
        art.className = "vm-track-art";
        art.src = item.image;
        art.alt = "";
        const name = document.createElement("p");
        name.className = "vm-track-title";
        name.textContent = item.title;
        const byline = document.createElement("p");
        byline.className = "vm-track-subtitle";
        byline.textContent = item.subtitle;
        const glyph = document.createElement("span");
        glyph.innerHTML = icons.play;
        row.append(art, name, byline, glyph);
        list.append(row);
      });
      content.append(list);
    }
  };

  const renderShelves = (shelves: Shelf[]): void => {
    const heading = pathTitle();
    content.replaceChildren();
    const header = document.createElement("header");
    header.className = "vm-view-header";
    header.innerHTML = `<div><p class="vm-eyebrow"></p><h1 class="vm-view-title"></h1></div>`;
    (header.querySelector(".vm-eyebrow") as HTMLElement).textContent = heading.eyebrow;
    (header.querySelector(".vm-view-title") as HTMLElement).textContent = heading.title;
    content.append(header);

    if (!shelves.length) {
      const empty = document.createElement("div");
      empty.className = "vm-loading-surface";
      empty.setAttribute("role", "status");
      empty.setAttribute("aria-label", "Loading YouTube Music");
      content.append(empty);
      return;
    }

    const heroItem = shelves[0].items[0];
    if (heroItem) {
      const hero = document.createElement("section");
      hero.className = "vm-hero";
      hero.dataset.href = heroItem.href;
      if (heroItem.image) {
        const media = document.createElement("img");
        media.className = "vm-hero-media";
        media.src = heroItem.image;
        media.alt = "";
        hero.append(media);
      }
      const shade = document.createElement("div");
      shade.className = "vm-hero-shade";
      const copy = document.createElement("div");
      copy.className = "vm-hero-copy";
      copy.innerHTML =
        `<p class="vm-hero-kicker"></p><h2 class="vm-hero-title"></h2><p class="vm-hero-subtitle"></p><button class="vm-primary-action" type="button">${icons.play}<span>Play now</span></button>`;
      (copy.querySelector(".vm-hero-kicker") as HTMLElement).textContent = shelves[0].title;
      (copy.querySelector(".vm-hero-title") as HTMLElement).textContent = heroItem.title;
      (copy.querySelector(".vm-hero-subtitle") as HTMLElement).textContent = heroItem.subtitle ||
        "A fresh selection from YouTube Music, ready when you are.";
      hero.append(shade, copy);
      content.append(hero);
    }

    shelves.forEach((shelf, shelfIndex) => {
      const section = document.createElement("section");
      section.className = "vm-shelf";
      section.style.animationDelay = `${Math.min(shelfIndex * 45, 240)}ms`;
      const head = document.createElement("div");
      head.className = "vm-shelf-head";
      const title = document.createElement("h2");
      title.className = "vm-shelf-title";
      title.textContent = shelf.title;
      const actions = document.createElement("div");
      actions.className = "vm-shelf-actions";
      actions.innerHTML =
        `<button class="vm-shelf-arrow" type="button" data-scroll="back" aria-label="Scroll left">${icons.back}</button><button class="vm-shelf-arrow" type="button" data-scroll="forward" aria-label="Scroll right">${icons.forward}</button>`;
      head.append(title, actions);
      const row = document.createElement("div");
      row.className = "vm-media-row";
      shelf.items.forEach((item) => row.append(createMediaCard(item)));
      section.append(head, row);
      content.append(section);
    });
  };

  const render = (): void => {
    if (bridgeMode && pendingRoute) {
      const currentUrl = new URL(bridgeState?.path ?? "/", "http://localhost");
      const pendingUrl = new URL(pendingRoute, "http://localhost");
      if (
        currentUrl.pathname === pendingUrl.pathname &&
        currentUrl.searchParams.toString() === pendingUrl.searchParams.toString()
      ) {
        clearPendingRoute();
      } else {
        updateRoute();
        return;
      }
    }
    const nextShelves = extractShelves();
    const page = bridgeMode ? bridgeState?.page : null;
    const signature = JSON.stringify(
      [
        bridgeMode ? bridgeState?.path : location.pathname + location.search,
        page?.title,
        page?.items?.map((item) => item.href),
        nextShelves.map((shelf) => [shelf.title, shelf.items.map((item) => item.href)]),
      ],
    );
    updateRoute();
    updateAvatar();
    if (signature === root.dataset.renderSignature && content.querySelector(".vm-view-title")) {
      return;
    }
    root.dataset.renderSignature = signature;
    currentShelves = nextShelves;
    if (page?.title) renderPageDetail(page);
    else renderShelves(currentShelves);
  };

  const scheduleRender = (): void => {
    if (renderTimer !== undefined) globalThis.clearTimeout(renderTimer);
    renderTimer = globalThis.setTimeout(render, 180);
  };

  const officialAnchor = (href: string): HTMLAnchorElement | null => {
    if (!officialRoot) return null;
    const anchors = Array.from(officialRoot.querySelectorAll("a[href]")) as HTMLAnchorElement[];
    return anchors.find((anchor) => {
      const raw = anchor.getAttribute("href");
      if (raw === href) return true;
      try {
        return new URL(anchor.href, location.href).pathname +
            new URL(anchor.href, location.href).search === href;
      } catch {
        return false;
      }
    }) || null;
  };

  const navigate = (href: string): void => {
    if (bridgeMode) {
      beginPendingRoute(href);
      root.dataset.renderSignature = "";
      updateRoute();
      renderShelves([]);
      void sendCommand("navigate", { href }).catch(() => {
        clearPendingRoute();
        root.dataset.renderSignature = "";
        updateRoute();
        render();
      });
      return;
    }
    if (previewMode) {
      showToast(
        `${
          href === "/" ? "Home" : href.slice(1)
        } is powered by the official page in the desktop app.`,
      );
      return;
    }
    const anchor = officialAnchor(href);
    if (anchor) {
      anchor.click();
      globalThis.setTimeout(scheduleRender, 350);
      return;
    }
    showToast("That YouTube Music view is not available yet.");
  };

  const activateItem = (href: string): void => {
    if (bridgeMode) {
      root.dataset.renderSignature = "";
      void sendCommand("open", { href }).catch(() => undefined);
      return;
    }
    if (previewMode) {
      mockPlaying = true;
      const item = currentShelves.flatMap((shelf) => shelf.items).find((candidate) =>
        candidate.href === href
      );
      if (item) updateMockPlayer(item);
      return;
    }
    const anchor = officialAnchor(href);
    if (anchor) anchor.click();
    else showToast("YouTube Music could not open that item.");
  };

  const submitSearch = (query: string): void => {
    const cleaned = query.trim();
    if (!cleaned) return;
    if (bridgeMode) {
      beginPendingRoute(`/search?q=${encodeURIComponent(cleaned)}`);
      root.dataset.renderSignature = "";
      renderPageDetail({ kind: "search", title: cleaned, items: [] });
      void sendCommand("search", { query: cleaned }).catch(() => {
        clearPendingRoute();
        root.dataset.renderSignature = "";
        updateRoute();
        render();
      });
      return;
    }
    if (previewMode) {
      showToast(`Search for “${cleaned}” will use YouTube Music in the desktop app.`);
      return;
    }
    const input = officialRoot!.querySelector("ytmusic-search-box input, input#input") as
      | HTMLInputElement
      | null;
    if (!input) {
      showToast("YouTube Music search is not ready yet.");
      return;
    }
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, cleaned);
    input.dispatchEvent(
      new InputEvent("input", { bubbles: true, inputType: "insertText", data: cleaned }),
    );
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }),
    );
    input.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true }));
    globalThis.setTimeout(scheduleRender, 500);
  };

  const clickOfficial = (selectors: string[]): boolean => {
    if (previewMode) return false;
    for (const selector of selectors) {
      const element = officialRoot!.querySelector(selector) as HTMLElement | null;
      if (element) {
        element.click();
        return true;
      }
    }
    return false;
  };

  const getVideo = (): HTMLVideoElement | null =>
    previewMode ? null : officialRoot!.querySelector("video") as HTMLVideoElement | null;

  const updateMockPlayer = (item?: MediaItem): void => {
    if (item) {
      for (
        const art of root.querySelectorAll<HTMLImageElement>(
          ".vm-player-art,.vm-expanded-art,.vm-expanded-backdrop",
        )
      ) art.src = item.image;
      for (
        const title of root.querySelectorAll<HTMLElement>(
          ".vm-player-title,.vm-expanded-title",
        )
      ) title.textContent = item.title;
      for (
        const artist of root.querySelectorAll<HTMLElement>(
          ".vm-player-artist,.vm-expanded-artist",
        )
      ) artist.textContent = item.subtitle;
      (root.querySelector(".vm-expanded-album") as HTMLElement).textContent = "Preview album";
    }
    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-action="play"]')) {
      button.innerHTML = mockPlaying ? icons.pause : icons.play;
      button.setAttribute("aria-label", mockPlaying ? "Pause" : "Play");
    }
  };

  const updatePlayer = (): void => {
    const video = getVideo();
    if (bridgeMode) {
      const player = bridgeState?.player;
      if (!player) return;
      if (player.title) {
        for (
          const title of root.querySelectorAll<HTMLElement>(
            ".vm-player-title,.vm-expanded-title",
          )
        ) title.textContent = player.title;
      }
      if (player.artist) {
        for (
          const artist of root.querySelectorAll<HTMLElement>(
            ".vm-player-artist,.vm-expanded-artist",
          )
        ) artist.textContent = player.artist;
      }
      (root.querySelector(".vm-expanded-album") as HTMLElement).textContent = player.album ||
        "Album unavailable";
      if (player.artwork) {
        for (
          const art of root.querySelectorAll<HTMLImageElement>(
            ".vm-player-art,.vm-expanded-art,.vm-expanded-backdrop",
          )
        ) art.src = player.artwork;
      }
      for (const button of root.querySelectorAll<HTMLButtonElement>('[data-action="play"]')) {
        button.innerHTML = player.playing ? icons.pause : icons.play;
        button.setAttribute("aria-label", player.playing ? "Pause" : "Play");
      }
      const duration = player.duration ?? 0;
      const currentTime = player.currentTime ?? 0;
      progress.value = duration ? String(Math.round((currentTime / duration) * 1000)) : "0";
      setRangeFill(progress);
      (root.querySelector(".vm-elapsed") as HTMLElement).textContent = formatTime(currentTime);
      (root.querySelector(".vm-duration") as HTMLElement).textContent = formatTime(duration);
      const reportedVolume = Math.min(1, Math.max(0, player.volume ?? .7));
      if (preferredVolume === null) preferredVolume = reportedVolume;
      if (pendingVolume !== null && Math.abs(reportedVolume - pendingVolume) < .005) {
        pendingVolume = null;
      }
      const displayedVolume = pendingVolume ?? preferredVolume;
      volume.value = String(Math.round(displayedVolume * 100));
      setRangeFill(volume);
      if (
        pendingVolume === null &&
        queuedVolume === null &&
        !volumeCommandInFlight &&
        Math.abs(reportedVolume - preferredVolume) >= .005 &&
        Date.now() - lastVolumeCorrection >= 1000
      ) {
        pendingVolume = preferredVolume;
        queuedVolume = preferredVolume;
        lastVolumeCorrection = Date.now();
        bridgeState!.player!.volume = preferredVolume;
        void flushVolumeCommand();
      }
      return;
    }
    if (previewMode) {
      if (mockPlaying) mockTime = Math.min(mockDuration, mockTime + .5);
      progress.value = String(Math.round((mockTime / mockDuration) * 1000));
      setRangeFill(progress);
      (root.querySelector(".vm-elapsed") as HTMLElement).textContent = formatTime(mockTime);
      (root.querySelector(".vm-duration") as HTMLElement).textContent = formatTime(mockDuration);
      return;
    }
    const metadata = navigator.mediaSession?.metadata;
    const title = metadata?.title ||
      firstText(officialRoot!, ["ytmusic-player-bar .title", "ytmusic-player-bar #title"]);
    const artist = metadata?.artist ||
      firstText(officialRoot!, ["ytmusic-player-bar .byline", "ytmusic-player-bar .subtitle"]);
    const album = metadata?.album || "Album unavailable";
    const artwork = metadata?.artwork?.at(-1)?.src ||
      firstImage(officialRoot!.querySelector("ytmusic-player-bar") || officialRoot!);
    if (title) {
      for (
        const target of root.querySelectorAll<HTMLElement>(
          ".vm-player-title,.vm-expanded-title",
        )
      ) target.textContent = title;
    }
    if (artist) {
      for (
        const target of root.querySelectorAll<HTMLElement>(
          ".vm-player-artist,.vm-expanded-artist",
        )
      ) target.textContent = artist;
    }
    (root.querySelector(".vm-expanded-album") as HTMLElement).textContent = album;
    if (artwork) {
      for (
        const target of root.querySelectorAll<HTMLImageElement>(
          ".vm-player-art,.vm-expanded-art,.vm-expanded-backdrop",
        )
      ) target.src = artwork;
    }
    const isPlaying = Boolean(video && !video.paused && !video.ended);
    playButton.innerHTML = isPlaying ? icons.pause : icons.play;
    playButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
    if (video) {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      progress.value = duration ? String(Math.round((video.currentTime / duration) * 1000)) : "0";
      setRangeFill(progress);
      (root.querySelector(".vm-elapsed") as HTMLElement).textContent = formatTime(
        video.currentTime,
      );
      (root.querySelector(".vm-duration") as HTMLElement).textContent = formatTime(duration);
      volume.value = String(Math.round(video.volume * 100));
      setRangeFill(volume);
    }
  };

  const updateAvatar = (): void => {
    const target = root.querySelector(".vm-avatar") as HTMLImageElement;
    const login = root.querySelector(".vm-login-button") as HTMLButtonElement;
    const showAvatar = (avatar: string): void => {
      if (avatar) {
        target.src = avatar;
        target.hidden = false;
        login.hidden = true;
      } else {
        target.removeAttribute("src");
        target.hidden = true;
        login.hidden = false;
      }
    };
    if (bridgeMode) {
      showAvatar(bridgeState?.avatar ?? "");
      return;
    }
    if (previewMode) {
      showAvatar("");
      return;
    }
    const source = officialRoot!.querySelector(
      "ytmusic-nav-bar ytmusic-settings-button, ytmusic-nav-bar #avatar, " +
        "ytmusic-nav-bar button[aria-label*='Account' i]",
    ) as HTMLElement | null;
    const image = source?.matches("img")
      ? source as HTMLImageElement
      : source?.querySelector("img") as HTMLImageElement | null;
    const shadow = source?.querySelector("yt-img-shadow") as HTMLElement | null;
    showAvatar(
      image?.currentSrc || image?.src || shadow?.getAttribute("delayed-src") ||
        source?.getAttribute("photo-url") || "",
    );
  };

  const updateRoute = (): void => {
    const pathname = bridgeMode
      ? pendingRoute ?? bridgeState?.path ?? "/"
      : previewMode
      ? "/"
      : location.pathname;
    for (const button of root.querySelectorAll<HTMLElement>("[data-route]")) {
      const route = button.dataset.route || "/";
      const active = route === "/"
        ? pathname === "/" || pathname === "/home"
        : pathname.startsWith(route.split("?")[0]);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  };

  const extractQueue = (): MediaItem[] => {
    if (bridgeMode) return bridgeState?.queue ?? [];
    if (previewMode) return mockShelves.flatMap((shelf) => shelf.items).slice(0, 10);
    const queueItems = officialRoot!.querySelectorAll(
      "ytmusic-player-queue-item, ytmusic-player-queue-item-renderer",
    );
    return Array.from(queueItems).map(extractItem).filter((item): item is MediaItem =>
      Boolean(item)
    );
  };

  const renderQueue = (): void => {
    const items = extractQueue();
    queueList.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "vm-empty";
      empty.textContent = "Your queue will appear here once playback starts.";
      queueList.append(empty);
      return;
    }
    items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      const isCurrent = item.current ||
        (!items.some((entry) => entry.current) && index === 0);
      button.className = `vm-queue-item${isCurrent ? " is-current" : ""}`;
      button.dataset.queueHref = item.href;
      const image = document.createElement("img");
      image.className = "vm-queue-art";
      image.src = item.image;
      image.alt = "";
      const copy = document.createElement("span");
      copy.className = "vm-queue-copy";
      const name = document.createElement("p");
      name.className = "vm-queue-name";
      name.textContent = item.title;
      const byline = document.createElement("p");
      byline.className = "vm-queue-byline";
      byline.textContent = item.subtitle;
      copy.append(name, byline);
      const more = document.createElement("span");
      more.innerHTML = icons.dots;
      button.append(image, copy, more);
      queueList.append(button);
    });
  };

  const setQueueOpen = (open: boolean): void => {
    root.classList.toggle("queue-open", open);
    queueDrawer.setAttribute("aria-hidden", String(!open));
    for (const button of root.querySelectorAll<HTMLElement>('[data-action="queue"]')) {
      button.setAttribute("aria-expanded", String(open));
    }
    if (open) renderQueue();
    if (open && bridgeMode) {
      void sendCommand("queue").catch(() => undefined);
    } else if (open && !previewMode) {
      clickOfficial([
        "ytmusic-player-bar #queue",
        "ytmusic-player-bar button[aria-label*='queue' i]",
      ]);
    }
    if (open) globalThis.setTimeout(renderQueue, previewMode ? 0 : 220);
  };

  const toggleTheme = (): void => {
    const current = root.dataset.theme || "dark";
    const next = current === "light" ? "dark" : "light";
    root.dataset.theme = next;
    persistTheme(next);
    const button = root.querySelector('[data-action="theme"]') as HTMLButtonElement;
    button.innerHTML = next === "light" ? icons.moon : icons.sun;
    button.setAttribute("aria-label", `Use ${next === "light" ? "dark" : "light"} mode`);
  };

  root.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const route = target.closest<HTMLElement>("[data-route]")?.dataset.route;
    if (route) {
      navigate(route);
      return;
    }
    const scrollButton = target.closest<HTMLElement>("[data-scroll]");
    if (scrollButton) {
      const row = scrollButton.closest(".vm-shelf")?.querySelector(".vm-media-row");
      row?.scrollBy({
        left: (scrollButton.dataset.scroll === "back" ? -1 : 1) * row.clientWidth * .78,
        behavior: "smooth",
      });
      return;
    }
    const playHref = target.closest<HTMLElement>("[data-play-href]")?.dataset.playHref;
    if (playHref) {
      if (bridgeMode) {
        await sendCommand("play-item", { href: playHref }).catch(() => undefined);
      } else activateItem(playHref);
      return;
    }
    const queueHref = target.closest<HTMLElement>("[data-queue-href]")?.dataset.queueHref;
    if (queueHref) {
      if (bridgeMode) {
        await sendCommand("play-queue-item", { href: queueHref }).catch(() => undefined);
      } else activateItem(queueHref);
      return;
    }
    const media = target.closest<HTMLElement>("[data-href]");
    if (media?.dataset.href) {
      activateItem(media.dataset.href);
      return;
    }
    const action = target.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "theme") toggleTheme();
    else if (action === "login") {
      const button = target.closest("button") as HTMLButtonElement;
      button.classList.add("is-loading");
      button.disabled = true;
      try {
        if (bridgeMode) await sendCommand("login");
        else if (previewMode) showToast("Login opens the official YouTube Music sign-in window.");
        else {
          clickOfficial([
            "ytmusic-nav-bar a[href*='accounts.google.com']",
            "ytmusic-nav-bar a[href*='ServiceLogin']",
            "ytmusic-nav-bar button[aria-label*='Sign in' i]",
          ]);
        }
      } finally {
        button.classList.remove("is-loading");
        button.disabled = false;
      }
    } else if (action === "queue") setQueueOpen(!root.classList.contains("queue-open"));
    else if (action === "close-queue") setQueueOpen(false);
    else if (action === "expand-player") {
      root.classList.add("player-expanded");
      (root.querySelector(".vm-player-expanded") as HTMLElement).setAttribute(
        "aria-hidden",
        "false",
      );
    } else if (action === "collapse-player") {
      root.classList.remove("player-expanded");
      (root.querySelector(".vm-player-expanded") as HTMLElement).setAttribute(
        "aria-hidden",
        "true",
      );
    } else if (action === "play-page") {
      if (bridgeMode) await sendCommand("play-page").catch(() => undefined);
      else if (previewMode) showToast("Play this collection");
    } else if (action === "back") {
      bridgeMode
        ? void sendCommand("back").catch(() => undefined)
        : previewMode
        ? showToast("Navigation history is available in the desktop app.")
        : history.back();
    } else if (action === "forward") {
      bridgeMode
        ? void sendCommand("forward").catch(() => undefined)
        : previewMode
        ? showToast("Navigation history is available in the desktop app.")
        : history.forward();
    } else if (action === "play") {
      if (bridgeMode) {
        if (bridgeState?.player) {
          bridgeState.player.playing = !bridgeState.player.playing;
          updatePlayer();
        }
        void sendCommand("play").catch(() => undefined);
      } else if (previewMode) {
        mockPlaying = !mockPlaying;
        updateMockPlayer();
      } else {
        const video = getVideo();
        if (video) video.paused ? await video.play() : video.pause();
        else showToast("Choose something to play first.");
      }
    } else if (action === "previous") {
      bridgeMode
        ? void sendCommand("previous").catch(() => undefined)
        : previewMode
        ? showToast("Previous track")
        : clickOfficial([
          "ytmusic-player-bar #previous-button",
          "ytmusic-player-bar .previous-button",
        ]);
    } else if (action === "next") {
      bridgeMode
        ? void sendCommand("next").catch(() => undefined)
        : previewMode
        ? showToast("Next track")
        : clickOfficial(["ytmusic-player-bar #next-button", "ytmusic-player-bar .next-button"]);
    } else if (action === "shuffle") {
      const button = target.closest("button")!;
      button.classList.toggle("is-active");
      if (bridgeMode) {
        void sendCommand("shuffle").catch(() => undefined);
      } else if (!previewMode) {
        clickOfficial([
          "ytmusic-player-bar .shuffle",
          "ytmusic-player-bar button[aria-label*='shuffle' i]",
        ]);
      }
    } else if (action === "repeat") {
      const button = target.closest("button")!;
      button.classList.toggle("is-active");
      if (bridgeMode) {
        void sendCommand("repeat").catch(() => undefined);
      } else if (!previewMode) {
        clickOfficial([
          "ytmusic-player-bar .repeat",
          "ytmusic-player-bar button[aria-label*='repeat' i]",
        ]);
      }
    } else if (action === "like") {
      const button = target.closest("button")!;
      button.classList.toggle("is-active");
      if (bridgeMode) {
        void sendCommand("like").catch(() => undefined);
      } else if (!previewMode) {
        clickOfficial([
          "ytmusic-player-bar ytmusic-like-button-renderer button",
          "ytmusic-player-bar button[aria-label*='like' i]",
        ]);
      }
    } else if (action === "mute") {
      if (bridgeMode) void sendCommand("mute").catch(() => undefined);
      else {
        const video = getVideo();
        if (video) video.muted = !video.muted;
        else if (previewMode) showToast("Volume muted");
      }
    } else if (action === "more") {
      if (bridgeMode) {
        void sendCommand("more").catch(() => undefined);
      } else if (
        !previewMode &&
        !clickOfficial([
          "ytmusic-player-bar button[aria-label*='More' i]",
          "ytmusic-player-bar #menu button",
        ])
      ) showToast("No track options are available.");
      else if (previewMode) showToast("Track options are provided by YouTube Music.");
    }
    updatePlayer();
  });

  root.querySelector(".vm-search")?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitSearch(searchInput.value);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submitSearch(searchInput.value);
  });

  progress.addEventListener("input", () => {
    setRangeFill(progress);
    const ratio = Number(progress.value) / 1000;
    if (bridgeMode) void sendCommand("seek", { ratio }).catch(() => undefined);
    else if (previewMode) mockTime = mockDuration * ratio;
    else {
      const video = getVideo();
      if (video && Number.isFinite(video.duration)) video.currentTime = video.duration * ratio;
    }
    updatePlayer();
  });

  volume.addEventListener("input", () => {
    setRangeFill(volume);
    if (bridgeMode) {
      pendingVolume = Math.min(1, Math.max(0, Number(volume.value) / 100));
      preferredVolume = pendingVolume;
      queuedVolume = pendingVolume;
      if (bridgeState?.player) {
        bridgeState.player.volume = pendingVolume;
        bridgeState.player.muted = false;
      }
      if (volumeCommandTimer !== undefined) globalThis.clearTimeout(volumeCommandTimer);
      volumeCommandTimer = globalThis.setTimeout(() => void flushVolumeCommand(), 80);
      return;
    }
    const video = getVideo();
    if (video) {
      video.volume = Number(volume.value) / 100;
      video.muted = false;
    }
  });

  volume.addEventListener("change", () => {
    if (!bridgeMode || queuedVolume === null) return;
    if (volumeCommandTimer !== undefined) globalThis.clearTimeout(volumeCommandTimer);
    void flushVolumeCommand();
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }
    if (event.key === "Escape" && root.classList.contains("queue-open")) setQueueOpen(false);
    else if (event.key === "Escape" && root.classList.contains("player-expanded")) {
      root.classList.remove("player-expanded");
      (root.querySelector(".vm-player-expanded") as HTMLElement).setAttribute(
        "aria-hidden",
        "true",
      );
    }
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target instanceof HTMLElement &&
      event.target.matches('.vm-player-copy[data-action="expand-player"]')
    ) {
      event.preventDefault();
      event.target.click();
      return;
    }
    if (event.code === "Space" && !(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
      playButton.click();
    }
  });

  if (!previewMode) {
    const observer = new MutationObserver(scheduleRender);
    observer.observe(officialRoot!, { childList: true, subtree: true });
  }

  let bridgeRefreshInFlight = false;
  let bridgeRefreshQueued = false;
  refreshBridgeState = async (): Promise<void> => {
    if (!bridgeMode) return;
    if (bridgeRefreshInFlight) {
      bridgeRefreshQueued = true;
      return;
    }
    bridgeRefreshInFlight = true;
    try {
      do {
        bridgeRefreshQueued = false;
        try {
          const result = await bridge!.musicState() as
            | BridgeState
            | { ok?: boolean; value?: BridgeState };
          bridgeState = result && typeof result === "object" && "ok" in result
            ? result.value ?? null
            : result as BridgeState;
          render();
          updatePlayer();
          if (root.classList.contains("queue-open")) renderQueue();
          revealDesktop();
        } catch (error) {
          if (!content.querySelector(".vm-view-title")) renderShelves([]);
          const message = typeof error === "object" && error && "message" in error
            ? String(error.message)
            : String(error);
          const loadingSurface = content.querySelector(".vm-loading-surface");
          loadingSurface?.setAttribute(
            "aria-label",
            `Waiting for YouTube Music: ${message}`,
          );
        }
      } while (bridgeRefreshQueued);
    } finally {
      bridgeRefreshInFlight = false;
    }
  };

  if (bridgeMode) {
    renderShelves([]);
    void refreshBridgeState();
    globalThis.setInterval(() => void refreshBridgeState(), 1000);
  } else if (previewMode) {
    currentShelves = mockShelves;
    renderShelves(mockShelves);
    updateMockPlayer(mockShelves[1].items[0]);
    const art = root.querySelector(".vm-avatar") as HTMLImageElement;
    art.hidden = true;
  } else {
    scheduleRender();
  }
  setRangeFill(progress);
  setRangeFill(volume);
  globalThis.setInterval(updatePlayer, 500);
  globalThis.setInterval(() => {
    if (!previewMode || bridgeMode) updateRoute();
  }, 700);
}

export function createCustomClientScript(previewMode = false): string {
  return `(${customClientBootstrap.toString()})(${JSON.stringify(CUSTOM_UI_CSS)},${
    JSON.stringify(TABLER_ICONS)
  },${previewMode});`;
}

export function createPreviewHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>YouTube Music Desktop — UI Preview</title>
  </head>
  <body>
    <script>${createCustomClientScript(true)}<\/script>
  </body>
</html>`;
}

export function createDesktopHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>YouTube Music Desktop</title>
  </head>
  <body>
    <script>globalThis.__vortexBridgeMode = true;${createCustomClientScript(true)}<\/script>
  </body>
</html>`;
}
