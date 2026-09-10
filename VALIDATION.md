# Local validation — 2026-09-10

Built with Qt 6.11.2 on CachyOS, running native Wayland with an NVIDIA RTX 5070
(driver 610.57.04).

- Release build and bridge tests passed.
- The bundled AppImage passed the same isolated MPRIS integration test as the
  development binary: play/pause, stop, volume, seeking, rejection of a stale
  SetPosition track ID, next/previous, D-Bus metadata types, and clean shutdown.
- Exactly one MPRIS player was registered on the isolated test bus.
- A failed album-image request fell back to a downloaded **1280 × 720** video
  thumbnail; MPRIS referenced the full-size cached PNG.
- The real YouTube Music homepage rendered, and a public playback page reached
  an advancing media position with `paused=false` and `readyState=4`. Playback
  was muted for the smoke test.
- Live playback metadata also reached MPRIS: “She Wants to Dance” by Rick
  Astley, with matching track ID, duration, and cached artwork URL.
- Chromium's `chrome://gpu` reported hardware-accelerated compositing,
  rasterization, Canvas, WebGL and WebGL2; Vulkan was enabled and the RTX 5070
  was the active GPU.
- Video decode and encode were reported as **software only** by this Qt build.

These checks do not establish long-session stability, Google account sign-in,
hardware video decoding, or compatibility with older distributions/other CPUs.
The AppImage was built against the local CachyOS libraries; it is a local test
build, not a claim of universal Linux compatibility.
