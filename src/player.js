(() => {
  const video = document.querySelector('video');
  const player = document.querySelector('#movie_player');
  const data = player?.getVideoData?.() || {};
  const meta = navigator.mediaSession?.metadata;
  const id = data.video_id || new URL(location.href).searchParams.get('v') || '';
  const thumbs = [...(meta?.artwork || [])].sort((a,b) =>
    (parseInt(b.sizes) || 0) - (parseInt(a.sizes) || 0)).map(x => x.src);
  const cover = document.querySelector('ytmusic-player-bar img');
  if (cover?.src) thumbs.push(cover.src);
  const candidates = [];
  const videoThumbs = [];
  for (const src of thumbs) {
    try {
      const u = new URL(src);
      if (u.protocol !== 'https:') continue;
      // Google image servers expose size-qualified originals. Keep the original
      // URL as a fallback rather than assuming every image supports resizing.
      if (/(^|\.)(googleusercontent\.com|ggpht\.com)$/.test(u.hostname)) {
        candidates.push(u.href.replace(/=w\d+[^?#]*|=s\d+[^?#]*/, '=w1200-h1200-l90-rj'));
      }
      if (/(^|\.)ytimg\.com$/.test(u.hostname)) videoThumbs.push(u.href);
      else candidates.push(u.href);
    } catch {}
  }
  if (/^[\w-]{11}$/.test(id)) {
    candidates.push(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  }
  candidates.push(...videoThumbs);
  return {
    id, title: meta?.title || data.title || '',
    artist: meta?.artist || data.author || '', album: meta?.album || '',
    artwork: [...new Set(candidates)],
    status: !video || video.ended ? 'Stopped' : video.paused ? 'Paused' : 'Playing',
    position: Number.isFinite(video?.currentTime) ? video.currentTime : 0,
    duration: Number.isFinite(video?.duration) ? video.duration : 0,
    volume: video?.volume ?? 1, available: !!video && !!id,
    seeking: !!video?.seeking
  };
})()
