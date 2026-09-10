const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const script = readFileSync(`${__dirname}/../src/player.js`, 'utf8');
function snapshot({meta, data = {}, video = null, cover = null, url = 'https://music.youtube.com/'} = {}) {
 return JSON.parse(JSON.stringify(vm.runInNewContext(script, {
  URL, location: {href: url}, navigator: {mediaSession: {metadata: meta}},
  document: {querySelector: s => s === 'video' ? video : s === '#movie_player' ? {getVideoData: () => data} : cover}
 })));
}
const video = {currentTime: 42, duration: 200, paused: false, volume: .5};
let s = snapshot({video, data: {video_id: 'abcdefghijk', title: 'Video', author: 'Artist'}});
assert.equal(s.status, 'Playing');
assert.equal(s.position,42);
assert.equal(s.artwork[0],'https://i.ytimg.com/vi/abcdefghijk/maxresdefault.jpg');
assert.equal(s.artwork[1],'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg');
s = snapshot({video, data:{video_id:'abcdefghijk'}, meta:{title:'Song', artist:'Singer', artwork:[{src:'https://lh3.googleusercontent.com/cover=w60-h60-l90-rj',sizes:'60x60'}]}});
assert.equal(s.artwork[0], 'https://lh3.googleusercontent.com/cover=w1200-h1200-l90-rj');
assert.equal(s.title,'Song');
s = snapshot({video, data:{video_id:'abcdefghijk'},meta:{artwork:[{src:'https://i.ytimg.com/vi/abcdefghijk/default.jpg'}]}});
assert.ok(s.artwork.indexOf('https://i.ytimg.com/vi/abcdefghijk/maxresdefault.jpg') < s.artwork.indexOf('https://i.ytimg.com/vi/abcdefghijk/default.jpg'));
s = snapshot({video:{...video,paused:true,duration:Infinity},meta:{artwork:[{src:'file:///etc/passwd'},{src:'broken'}]}});
assert.equal(s.status,'Paused'); assert.equal(s.duration,0); assert.deepEqual(s.artwork,[]);
s = snapshot(); assert.equal(s.status,'Stopped'); assert.equal(s.available,false);
console.log('PASS: album art, thumbnail fallback, thumbnail priority, missing media, invalid URLs, playback state');
