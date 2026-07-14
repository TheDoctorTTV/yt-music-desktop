const YOUTUBE_MUSIC_URL = "https://music.youtube.com";

const window = new Deno.BrowserWindow({
  title: "YouTube Music Desktop Native",
  width: 1200,
  height: 800,
});

window.navigate(YOUTUBE_MUSIC_URL);

setTimeout(() => {
  window.show();
  window.focus();
}, 250);
