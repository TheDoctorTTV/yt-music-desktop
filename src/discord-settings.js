(() => {
  if (location.hostname !== 'music.youtube.com') return;

  const key = 'ytmd-discord-rpc';
  const style = document.createElement('style');
  style.textContent = `
    #ytmd-discord-setting {
      box-sizing: border-box;
      color: var(--ytmusic-text-primary, #fff);
      font: 16px Roboto, Arial, sans-serif;
      margin: 0 28px;
      padding: 24px 0;
      border-bottom: 1px solid rgba(255,255,255,.12);
    }
    #ytmd-discord-setting label {
      align-items: center;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }
    #ytmd-discord-setting .ytmd-discord-description {
      color: var(--ytmusic-text-secondary, #aaa);
      display: block;
      font-size: 14px;
      line-height: 21px;
      margin-top: 8px;
    }
    #ytmd-discord-setting input {
      appearance: none;
      background: #666;
      border-radius: 12px;
      cursor: pointer;
      flex: 0 0 42px;
      height: 20px;
      margin: 0 10px 0 0;
      position: relative;
    }
    #ytmd-discord-setting input::after {
      background: #bdbdbd;
      border-radius: 50%;
      content: '';
      height: 20px;
      left: 0;
      position: absolute;
      top: 0;
      width: 20px;
      transition: left .15s ease;
    }
    #ytmd-discord-setting input:checked { background: #235c80; }
    #ytmd-discord-setting input:checked::after {
      background: #3ea6ff;
      left: 22px;
    }
    #ytmd-discord-setting input:focus-visible {
      outline: 2px solid #3ea6ff;
      outline-offset: 4px;
    }
  `;
  (document.head || document.documentElement).append(style);

  function mount() {
    const page = document.querySelector('ytmusic-settings-page');
    if (!page || !page.getClientRects().length) return;
    const selected = page.querySelector('.category-menu-item.iron-selected');
    if (selected && selected.textContent.trim() !== 'General') {
      page.querySelector('#ytmd-discord-setting')?.remove();
      return;
    }
    const items = [...page.querySelectorAll(
      'ytmusic-setting-category-collection-renderer .items, ' +
      'ytmusic-setting-category-collection-renderer #items')]
      .find(node => node.getClientRects().length);
    if (!items || items.querySelector('#ytmd-discord-setting')) return;

    const row = document.createElement('div');
    row.id = 'ytmd-discord-setting';
    const label = document.createElement('label');
    const copy = document.createElement('span');
    copy.textContent = 'Discord Rich Presence';
    const description = document.createElement('span');
    description.className = 'ytmd-discord-description';
    description.textContent = 'Show the song you are listening to in Discord.';
    copy.append(description);
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-label', 'Discord Rich Presence');
    try { toggle.checked = localStorage.getItem(key) === 'on'; } catch {}
    toggle.addEventListener('change', () => {
      try { localStorage.setItem(key, toggle.checked ? 'on' : 'off'); } catch {}
    });
    label.append(copy, toggle);
    row.append(label);
    items.prepend(row);
  }

  mount();
  setInterval(mount, 500);
})();
