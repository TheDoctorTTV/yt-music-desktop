(() => {
  if (location.hostname !== 'music.youtube.com') return;
  if (window.__ytmdLyrics) return;

  const key = 'ytmd-lyrics-source';
  const animationKey = 'ytmd-lyrics-animation';
  const choices = ['auto', 'lrclib', 'simpmusic', 'kugou', 'lyricsovh', 'genius', 'youtube'];
  let choice = 'auto';
  let animate = true;
  try {
    const saved = localStorage.getItem(key);
    if (choices.includes(saved)) choice = saved;
    animate = localStorage.getItem(animationKey) !== 'off';
  } catch {}

  const style = document.createElement('style');
  style.textContent = `
    ytmusic-tab-renderer[data-ytmd-lyrics-replace] > :not(#ytmd-lyrics-root) {
      display: none !important;
    }
    #tab-renderer[data-ytmd-lyrics-replace] > :not(#ytmd-lyrics-root) {
      display: none !important;
    }
    #side-panel [data-ytmd-lyrics-enabled] {
      color: var(--ytmusic-text-secondary, #aaa) !important;
      cursor: pointer !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }
    #side-panel [data-ytmd-lyrics-enabled] * {
      pointer-events: none !important;
    }
    #side-panel [data-ytmd-lyrics-active] {
      color: var(--ytmusic-text-primary, #fff) !important;
      position: relative;
    }
    #side-panel [data-ytmd-lyrics-active]::after {
      background: var(--ytmusic-text-primary, #fff);
      bottom: 0;
      content: '';
      height: 2px;
      left: 0;
      position: absolute;
      right: 0;
    }
    #ytmd-standalone-panel {
      background: #030303;
      box-sizing: border-box;
      display: none;
      overflow: auto;
      position: fixed;
      z-index: 100;
    }
    #ytmd-standalone-panel[data-open] { display: block; }
    #ytmd-lyrics-root {
      box-sizing: border-box;
      color: var(--ytmusic-text-primary, #fff);
      font-family: Roboto, Arial, sans-serif;
      padding: 20px 32px 40px;
      width: 100%;
    }
    #ytmd-lyrics-root .ytmd-lyrics-controls {
      align-items: center;
      color: var(--ytmusic-text-secondary, #aaa);
      display: flex;
      flex-wrap: wrap;
      font-size: 13px;
      line-height: 20px;
      gap: 12px 20px;
      margin-bottom: 24px;
    }
    #ytmd-lyrics-root .ytmd-lyrics-source {
      align-items: center;
      display: inline-flex;
      gap: 10px;
      white-space: nowrap;
    }
    #ytmd-lyrics-root .ytmd-lyrics-select { position: relative; }
    #ytmd-lyrics-root .ytmd-lyrics-select::after {
      border-bottom: 1.5px solid currentColor;
      border-right: 1.5px solid currentColor;
      content: '';
      height: 6px;
      pointer-events: none;
      position: absolute;
      right: 14px;
      top: 13px;
      transform: rotate(45deg);
      width: 6px;
    }
    #ytmd-lyrics-root select {
      appearance: none;
      background: rgba(255,255,255,.1);
      border: 1px solid transparent;
      border-radius: 18px;
      color: var(--ytmusic-text-primary, #fff);
      color-scheme: dark;
      cursor: pointer;
      font: inherit;
      font-weight: 500;
      height: 36px;
      padding: 0 36px 0 14px;
      transition: background .15s ease;
    }
    #ytmd-lyrics-root select:hover { background: rgba(255,255,255,.16); }
    #ytmd-lyrics-root select option { background: #282828; color: #fff; }
    #ytmd-lyrics-root select:focus-visible,
    #ytmd-lyrics-root .ytmd-lyrics-motion input:focus-visible {
      outline: 2px solid #3ea6ff;
      outline-offset: 3px;
    }
    #ytmd-lyrics-root .ytmd-lyrics-motion {
      align-items: center;
      cursor: pointer;
      display: inline-flex;
      gap: 10px;
      min-height: 36px;
      white-space: nowrap;
    }
    #ytmd-lyrics-root .ytmd-lyrics-motion:hover { color: var(--ytmusic-text-primary, #fff); }
    #ytmd-lyrics-root .ytmd-lyrics-motion input {
      appearance: none;
      background: #555;
      border: 0;
      border-radius: 10px;
      cursor: pointer;
      flex: 0 0 32px;
      height: 18px;
      margin: 0;
      position: relative;
      transition: background .15s ease;
      width: 32px;
    }
    #ytmd-lyrics-root .ytmd-lyrics-motion input::before {
      background: #bdbdbd;
      border-radius: 50%;
      content: '';
      height: 14px;
      left: 2px;
      position: absolute;
      top: 2px;
      transition: transform .15s ease, background .15s ease;
      width: 14px;
    }
    #ytmd-lyrics-root .ytmd-lyrics-motion input:checked { background: #fff; }
    #ytmd-lyrics-root .ytmd-lyrics-motion input:checked::before {
      background: #212121;
      transform: translateX(14px);
    }
    #ytmd-lyrics-root .ytmd-lyrics-status {
      flex-basis: 100%;
      font-size: 12px;
      opacity: .7;
    }
    #ytmd-lyrics-root .ytmd-lyrics-status[hidden] { display: none !important; }
    #ytmd-lyrics-root .ytmd-lyrics-line {
      color: var(--ytmusic-text-primary, #fff);
      font-size: 22px;
      font-weight: 500;
      line-height: 1.55;
      margin: 0 0 16px;
      opacity: .52;
      overflow-wrap: anywhere;
      transition: opacity .25s ease, transform .25s ease;
      white-space: pre-wrap;
    }
    #ytmd-lyrics-root .ytmd-lyrics-line[data-timed] { cursor: pointer; }
    #ytmd-lyrics-root .ytmd-lyrics-line:not([data-timed]) { opacity: .9; }
    #ytmd-lyrics-root[data-animation="on"] .ytmd-lyrics-line[data-active] {
      opacity: 1;
      transform: translateX(4px);
    }
    #ytmd-lyrics-root[data-animation="off"] .ytmd-lyrics-line { opacity: 1; }
    #ytmd-lyrics-root[data-animation="on"] .ytmd-lyrics-line[data-timed] .ytmd-lyrics-fill {
      background: linear-gradient(to right,
        var(--ytmusic-text-primary, #fff) var(--fill, 0%),
        var(--ytmusic-text-secondary, #888) var(--fill, 0%));
      background-clip: text;
      color: transparent;
    }
    @media (prefers-reduced-motion: reduce) {
      #ytmd-lyrics-root .ytmd-lyrics-line,
      #ytmd-lyrics-root select,
      #ytmd-lyrics-root .ytmd-lyrics-motion input,
      #ytmd-lyrics-root .ytmd-lyrics-motion input::before { transition: none; }
    }
    #ytmd-lyrics-root .ytmd-lyrics-message { font-size: 16px; opacity: .7; }
  `;
  (document.head || document.documentElement).append(style);

  let host = null;
  let root = null;
  let lines = [];
  let timedLines = [];
  let active = -1;
  let current = {source: 'youtube'};
  let standalone = false;
  let standalonePanel = null;
  let lyricsTab = null;

  function findLyricsTab() {
    const tabs = document.querySelectorAll(
      'ytmusic-player-page #side-panel tp-yt-paper-tab, ' +
      'ytmusic-player-page #side-panel paper-tab, ' +
      'ytmusic-player-page #side-panel [role="tab"], ' +
      'ytmusic-player-page #side-panel .tab-header');
    return [...tabs].find(tab =>
      /^(lyrics|lyric)$/i.test(tab.textContent.trim()) ||
      /^(lyrics|lyric)$/i.test(tab.getAttribute('aria-label') || '')) || null;
  }

  function tabDisabled(tab) {
    return !!tab && (tab.hasAttribute('disabled') || tab.disabled === true ||
      tab.getAttribute('aria-disabled') === 'true' ||
      tab.classList.contains('disabled') ||
      !!tab.querySelector('[disabled], [aria-disabled="true"], .disabled'));
  }

  function updateStandalone() {
    const tab = findLyricsTab();
    if (lyricsTab && lyricsTab !== tab) {
      lyricsTab.removeAttribute('data-ytmd-lyrics-enabled');
      lyricsTab.removeAttribute('data-ytmd-lyrics-active');
    }
    lyricsTab = tab;
    if (tab) {
      const disabled = tabDisabled(tab);
      tab.toggleAttribute('data-ytmd-lyrics-enabled', disabled);
      if (disabled) tab.tabIndex = 0;
      if (standalone && !disabled) standalone = false;
      tab.toggleAttribute('data-ytmd-lyrics-active', standalone);
    }
    if (!standalonePanel) return;
    const side = tab?.closest('#side-panel');
    const header = side?.querySelector('.tab-header-container, tp-yt-paper-tabs, paper-tabs');
    const sideRect = side?.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    const visible = standalone && sideRect && sideRect.width > 0 && sideRect.height > 0;
    standalonePanel.toggleAttribute('data-open', !!visible);
    if (visible) {
      standalonePanel.style.left = `${sideRect.left}px`;
      standalonePanel.style.top = `${headerRect?.bottom || sideRect.top + 48}px`;
      standalonePanel.style.width = `${sideRect.width}px`;
      standalonePanel.style.height = `${Math.max(0, sideRect.bottom - (headerRect?.bottom || sideRect.top + 48))}px`;
    }
  }

  function openStandalone() {
    if (!standalonePanel) {
      standalonePanel = document.createElement('div');
      standalonePanel.id = 'ytmd-standalone-panel';
      document.body.append(standalonePanel);
    }
    standalone = true;
    updateStandalone();
    mount();
  }

  document.addEventListener('click', event => {
    const tab = event.target instanceof Element
      ? event.target.closest('tp-yt-paper-tab, paper-tab, [role="tab"], .tab-header') : null;
    if (!tab?.closest('ytmusic-player-page #side-panel')) return;
    const lyric = findLyricsTab();
    const onLyrics = !!lyric && (tab === lyric || lyric.contains(tab) || tab.contains(lyric));
    if (onLyrics && tabDisabled(lyric)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openStandalone();
    } else if (standalone && !onLyrics) {
      standalone = false;
      updateStandalone();
      mount();
    }
  }, true);

  document.addEventListener('keydown', event => {
    const lyric = findLyricsTab();
    if ((event.key !== 'Enter' && event.key !== ' ') || !lyric ||
        (event.target !== lyric && !lyric.contains(event.target)) ||
        !tabDisabled(lyric)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openStandalone();
  }, true);

  function findHost() {
    const candidates = document.querySelectorAll(
      'ytmusic-tab-renderer[page-type="MUSIC_PAGE_TYPE_TRACK_LYRICS"], ' +
      '#tab-renderer[page-type="MUSIC_PAGE_TYPE_TRACK_LYRICS"]');
    return [...candidates].find(node => node.getClientRects().length) ||
      candidates[0] || null;
  }

  function mount() {
    const next = standalone ? standalonePanel : findHost();
    if (!next) return;
    if (next === host && root?.isConnected) return;
    if (root?.isConnected) {
      host?.removeAttribute('data-ytmd-lyrics-replace');
      host = next;
      host.prepend(root);
      render();
      return;
    }
    host = next;
    root = document.createElement('div');
    root.id = 'ytmd-lyrics-root';
    root.dataset.animation = animate ? 'on' : 'off';
    const controls = document.createElement('div');
    controls.className = 'ytmd-lyrics-controls';
    const label = document.createElement('label');
    label.className = 'ytmd-lyrics-source';
    label.textContent = 'Lyrics source';
    const select = document.createElement('select');
    select.id = 'ytmd-lyrics-source';
    for (const [value, name] of [
      ['auto', 'Auto'], ['lrclib', 'LRCLIB'],
      ['simpmusic', 'SimpMusic'], ['kugou', 'KuGou'],
      ['lyricsovh', 'Lyrics.ovh'], ['genius', 'Genius'],
      ['youtube', 'YouTube Music']
    ]) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = name;
      select.append(option);
    }
    select.value = choice;
    select.addEventListener('change', () => {
      choice = select.value;
      try { localStorage.setItem(key, choice); } catch {}
      if (choice === 'youtube') receive({source: 'youtube'});
      else if (choice === 'auto') receive({source: 'youtube', checking: 'sources'});
      else receive({source: choice, message: 'Finding lyrics…'});
    });
    const selectWrap = document.createElement('span');
    selectWrap.className = 'ytmd-lyrics-select';
    selectWrap.append(select);
    label.append(selectWrap);
    const motionLabel = document.createElement('label');
    motionLabel.className = 'ytmd-lyrics-motion';
    const motion = document.createElement('input');
    motion.type = 'checkbox';
    motion.setAttribute('role', 'switch');
    motion.checked = animate;
    motion.addEventListener('change', () => {
      animate = motion.checked;
      root.dataset.animation = animate ? 'on' : 'off';
      try { localStorage.setItem(animationKey, animate ? 'on' : 'off'); } catch {}
      for (const row of lines) row.element.removeAttribute('data-active');
      active = -1;
      highlight();
    });
    motionLabel.append(motion, ' Sync animation');
    const status = document.createElement('span');
    status.className = 'ytmd-lyrics-status';
    status.hidden = window.__ytmdLyricsDebug !== true;
    controls.append(label, motionLabel, status);
    const content = document.createElement('div');
    content.className = 'ytmd-lyrics-content';
    root.append(controls, content);
    host.prepend(root);
    render();
  }

  function receive(value) {
    current = value && typeof value === 'object' ? value : {source: 'youtube'};
    render();
  }

  function parseSynced(text) {
    const result = [];
    for (const row of text.split(/\r?\n/)) {
      const match = row.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);
      if (!match) continue;
      const time = Number(match[1]) * 60 + Number(match[2]);
      if (!Number.isFinite(time)) continue;
      const raw = match[3].trim();
      const words = [];
      const marker = /<(\d+):(\d+(?:\.\d+)?)>/g;
      let previous = null;
      let tag;
      while ((tag = marker.exec(raw))) {
        if (previous)
          words.push({time: previous.time,
            text: raw.slice(previous.end, tag.index)});
        else if (tag.index > 0)
          words.push({time, text: raw.slice(0, tag.index)});
        previous = {time: Number(tag[1]) * 60 + Number(tag[2]), end: marker.lastIndex};
      }
      if (previous)
        words.push({time: previous.time, text: raw.slice(previous.end)});
      result.push({time, text: previous ? words.map(word => word.text).join('') : raw,
        words: words.length ? words : null});
    }
    return result.sort((a, b) => a.time - b.time);
  }

  function normalizedLine(value) {
    if (/^\[[^\]]+\]$/.test(value.trim())) return '';
    return value.normalize('NFKD').toLowerCase()
      .replace(/\p{M}/gu, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }

  function mappedWords(text, timedWords) {
    if (!timedWords?.length) return null;
    const segments = text.match(/\S+\s*/g) || [];
    if (segments.length !== timedWords.length ||
        !segments.every((segment, i) =>
          normalizedLine(segment) === normalizedLine(timedWords[i].text)))
      return null;
    return segments.map((segment, i) => ({text: segment, time: timedWords[i].time}));
  }

  function estimatedWords(text, start, nextLine) {
    const segments = text.match(/\S+\s*/g) || [];
    if (segments.length < 2) return null;
    const gap = Number.isFinite(nextLine) && nextLine > start
      ? nextLine - start : Math.min(6, Math.max(1, segments.length * .5));
    const span = Math.min(gap, 6, Math.max(.8, gap * .85));
    const weights = segments.map(segment =>
      Math.max(1, normalizedLine(segment).length));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let elapsed = 0;
    return segments.map((segment, i) => {
      const word = {text: segment, time: start + span * elapsed / total};
      elapsed += weights[i];
      word.end = start + span * elapsed / total;
      return word;
    });
  }

  function attachTiming(display, timed) {
    const a = display.map((row, index) => ({index, value: normalizedLine(row.text)}))
      .filter(row => row.value);
    const b = timed.map((row, index) => ({index, value: normalizedLine(row.text)}))
      .filter(row => row.value);
    if (!a.length || !b.length) return 0;
    const table = Array.from({length: a.length + 1},
      () => new Uint16Array(b.length + 1));
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        table[i][j] = a[i].value === b[j].value
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    let i = 0, j = 0, matches = 0;
    while (i < a.length && j < b.length) {
      if (a[i].value === b[j].value) {
        const row = display[a[i].index];
        const match = timed[b[j].index];
        row.time = match.time;
        row.words = mappedWords(row.text, match.words);
        matches++;
        i++;
        j++;
      } else if (table[i + 1][j] >= table[i][j + 1]) i++;
      else j++;
    }
    return matches;
  }

  function render() {
    if (!root || !host) return;
    const source = current.source || 'youtube';
    const native = source === 'youtube' && !standalone;
    host.toggleAttribute('data-ytmd-lyrics-replace', !native);
    const status = root.querySelector('.ytmd-lyrics-status');
    const sourceName = source === 'lrclib' ? 'LRCLIB'
      : source === 'simpmusic' ? 'SimpMusic'
      : source === 'kugou' ? 'KuGou'
      : source === 'lyricsovh' ? 'Lyrics.ovh'
      : source === 'genius' ? 'Genius' : 'YouTube Music';
    const sourceStatus = current.checking
      ? `Auto · Checking ${current.checking}` : `Text: ${sourceName}`;
    status.textContent = sourceStatus;
    const content = root.querySelector('.ytmd-lyrics-content');
    content.replaceChildren();
    lines = [];
    timedLines = [];
    active = -1;
    if (native) return;
    let rows = current.plain
      ? current.plain.split(/\r?\n/).map(text => ({text})) : [];
    if (!rows.length && current.synced)
      rows = parseSynced(current.synced).map(row => ({text: row.text}));
    const matches = current.timing
      ? attachTiming(rows, parseSynced(current.timing)) : 0;
    if (matches) {
      const timedRows = rows.filter(row => Number.isFinite(row.time));
      for (let i = 0; i < timedRows.length; i++) {
        const row = timedRows[i];
        if (row.words?.length) continue;
        row.words = estimatedWords(row.text, row.time, timedRows[i + 1]?.time);
        row.estimatedWords = !!row.words;
      }
    }
    if (rows.length) {
      const timing = current.timingChecking
        ? `Checking timing: ${current.timingChecking}`
        : matches ? `Timing: ${
          current.timingSource === 'lrclib' ? 'LRCLIB'
          : current.timingSource === 'simpmusic' ? 'SimpMusic' : 'KuGou'} · ${
          rows.some(row => row.estimatedWords) ? 'Estimated word timing'
          : rows.some(row => row.words?.length) ? 'Word timed' : 'Line timed'}`
          : current.timingMessage || 'Plain lyrics · no matching timestamps';
      status.textContent = sourceStatus ? `${sourceStatus} · ${timing}` : timing;
    }
    if (!rows.length) {
      const message = document.createElement('p');
      message.className = 'ytmd-lyrics-message';
      message.textContent = current.message || (current.checking
        ? 'Looking for lyrics…'
        : source === 'youtube' ? 'YouTube Music has no lyrics for this track.'
          : 'Lyrics were not found.');
      content.append(message);
      return;
    }
    for (const row of rows) {
      const line = document.createElement('div');
      line.className = 'ytmd-lyrics-line';
      const wordSpans = [];
      let fill = null;
      if (row.words) {
        for (const word of row.words) {
          const span = document.createElement('span');
          span.className = 'ytmd-lyrics-fill';
          span.textContent = word.text;
          line.append(span);
          wordSpans.push({element: span, time: word.time, end: word.end});
        }
      } else {
        fill = document.createElement('span');
        fill.className = 'ytmd-lyrics-fill';
        fill.textContent = row.text || '\u00a0';
        line.append(fill);
      }
      if (Number.isFinite(row.time)) {
        line.dataset.timed = '';
        line.addEventListener('click', () => {
          const video = document.querySelector('video');
          if (video) video.currentTime = row.time;
        });
      }
      content.append(line);
      lines.push({element: line, time: row.time, fill, words: wordSpans});
    }
    timedLines = lines.filter(line => Number.isFinite(line.time));
    highlight();
  }

  function highlight() {
    if (!animate || !host || !host.getClientRects().length || !timedLines.length)
      return;
    const time = document.querySelector('video')?.currentTime ?? 0;
    let index = -1;
    for (let i = 0; i < timedLines.length; i++) {
      if (timedLines[i].time > time) break;
      index = i;
    }
    if (index !== active) {
      active = index;
      for (let i = 0; i < timedLines.length; i++) {
        timedLines[i].element.toggleAttribute('data-active', i === active);
        const fill = i < active ? '100%' : '0%';
        if (timedLines[i].fill)
          timedLines[i].fill.style.setProperty('--fill', fill);
        for (const word of timedLines[i].words)
          word.element.style.setProperty('--fill', fill);
      }
      if (active >= 0)
        timedLines[active].element.scrollIntoView({block: 'center',
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto' : 'smooth'});
    }
    if (active < 0) return;
    const row = timedLines[active];
    const video = document.querySelector('video');
    const nextLine = timedLines[active + 1]?.time;
    const end = Number.isFinite(nextLine) ? nextLine
      : Number.isFinite(video?.duration) ? video.duration : row.time + 3;
    const percent = (start, finish) =>
      `${Math.max(0, Math.min(100, (time - start) / Math.max(.1, finish - start) * 100))}%`;
    if (row.words.length) {
      for (let i = 0; i < row.words.length; i++) {
        const word = row.words[i];
        const next = word.end ?? row.words[i + 1]?.time ?? end;
        word.element.style.setProperty('--fill', percent(word.time, next));
      }
    } else if (row.fill) {
      row.fill.style.setProperty('--fill', percent(row.time, end));
    }
  }

  window.__ytmdLyrics = {
    receive,
    state: () => ({
      source: choice,
      open: standalone || !!(host && host.getClientRects().length)
    })
  };
  updateStandalone();
  mount();
  setInterval(() => { updateStandalone(); mount(); }, 500);
  setInterval(highlight, 40);
})();
