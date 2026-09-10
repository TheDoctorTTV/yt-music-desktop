#!/usr/bin/env python3
"""Run under dbus-run-session with a real display; uses an isolated profile."""
import base64, io, os, pathlib, re, struct, subprocess, sys, tempfile, time, wave
from urllib.parse import unquote, urlparse
binary = pathlib.Path(sys.argv[1]).resolve()
with tempfile.TemporaryDirectory(prefix='ytmusic-qt-test-') as root:
    root = pathlib.Path(root)
    wav = io.BytesIO()
    with wave.open(wav, 'wb') as out:
        out.setparams((1, 2, 8000, 0, 'NONE', 'not compressed'))
        out.writeframes(b'\0\0' * 8000 * 30)
    fixture = root/'player.html'
    fixture.write_text('''<video loop src="data:audio/wav;base64,'''+base64.b64encode(wav.getvalue()).decode()+'''"></video>
<div id="movie_player"></div><ytmusic-player-bar><button class="next-button" onclick="setTrack('Next')">Next</button><button class="previous-button" onclick="setTrack('Previous')">Previous</button></ytmusic-player-bar>
<script>
let title='Fixture'; document.querySelector('#movie_player').getVideoData=()=>({video_id:'dQw4w9WgXcQ',title,author:'Test Artist'});
function setTrack(t) { title=t; navigator.mediaSession.metadata=new MediaMetadata({title:t,artist:'Test Artist',artwork:[{src:'https://lh3.googleusercontent.com/ytmusic-missing-artwork-test=w60-h60'}]}); }
setTrack(title);
</script>''')
    env = dict(os.environ, QT_QPA_PLATFORM='wayland', NO_AT_BRIDGE='1', XDG_DATA_HOME=str(root/'data'), XDG_CACHE_HOME=str(root/'cache'), XDG_CONFIG_HOME=str(root/'config'))
    with (root/'app.log').open('w+') as log:
        proc = subprocess.Popen([str(binary), '--test-page', str(fixture)], env=env, stdout=log, stderr=log)
        def call(method, *args):
            return subprocess.check_output(['gdbus','call','--session','--dest','org.mpris.MediaPlayer2.ytmusicdesktop','--object-path','/org/mpris/MediaPlayer2','--method',method,*args],stderr=subprocess.DEVNULL,text=True)
        def get(prop): return call('org.freedesktop.DBus.Properties.Get','org.mpris.MediaPlayer2.Player',prop)
        def wait_for(prop, value):
            for _ in range(80):
                if proc.poll() is not None: raise RuntimeError('App exited')
                try:
                    if value in get(prop): return
                except subprocess.CalledProcessError: pass
                time.sleep(.25)
            raise AssertionError(f'{prop}: expected {value}, got {get(prop)}')
        try:
            wait_for('Metadata','Fixture')
            assert 'objectpath' in get('Metadata')
            wait_for('Metadata', 'mpris:artUrl')
            art = re.search(r"file://[^'\s>]+", get('Metadata')).group()
            image = pathlib.Path(unquote(urlparse(art).path)).read_bytes()
            width, height = struct.unpack('>II',image[16:24])
            assert width >= 480 and height >= 360, (width,height)
            print(f'PASS: missing artwork falls back to cached {width}x{height} video thumbnail')
            call('org.mpris.MediaPlayer2.Player.Play'); wait_for('PlaybackStatus','Playing')
            call('org.mpris.MediaPlayer2.Player.Pause'); wait_for('PlaybackStatus','Paused')
            call('org.mpris.MediaPlayer2.Player.Seek','5000000')
            time.sleep(.8); assert int(get('Position').split('int64 ')[1].split('>')[0]) >= 5000000
            call('org.mpris.MediaPlayer2.Player.SetPosition','/net/thedoctorttv/track/stale','0')
            time.sleep(.6); assert int(get('Position').split('int64 ')[1].split('>')[0]) >= 5000000
            call('org.mpris.MediaPlayer2.Player.Stop'); wait_for('PlaybackStatus','Stopped')
            call('org.freedesktop.DBus.Properties.Set','org.mpris.MediaPlayer2.Player','Volume','<0.25>')
            wait_for('Volume','0.25')
            call('org.mpris.MediaPlayer2.Player.Next'); wait_for('Metadata','Next')
            call('org.mpris.MediaPlayer2.Player.Previous'); wait_for('Metadata','Previous')
            names = call('org.freedesktop.DBus.Properties.GetAll','org.mpris.MediaPlayer2.Player')
            assert 'CanSeek' in names and 'Volume' in names
            bus_names = subprocess.check_output(['gdbus','call','--session','--dest','org.freedesktop.DBus','--object-path','/org/freedesktop/DBus','--method','org.freedesktop.DBus.ListNames'],text=True)
            assert bus_names.count('org.mpris.MediaPlayer2.') == 1, bus_names
            call('org.mpris.MediaPlayer2.Quit'); proc.wait(timeout=10)
            assert proc.returncode == 0
            log.flush(); log.seek(0)
            errors = re.findall(r'^.*(?:Failed to load client buffer integration|Failed to create (?:a )?(?:QRhi|RHI)|no QRhi|no rhi|Failed to create temporary context).*$' , log.read(), re.MULTILINE)
            assert not errors, 'Qt rendering failed despite functioning MPRIS:\n' + '\n'.join(errors)
            print('PASS: MPRIS controls, artwork, single player, clean exit, no Qt rendering errors')
        finally:
            if proc.poll() is None: proc.terminate(); proc.wait(timeout=10)
            log.seek(0); print(log.read())
