import MusicKit from './musickitService';

export function playCollection(items) {
  const music = MusicKit.getInstance();
  const player = music.player;

  music.setQueue({
    items: items.map((item) => {
      console.log(item);
      return {
        attributes: item.attributes,
        id: item.id,
        container: {
          id: item.id
        }
      }
    })
  }).then(queue => {
    music.play();
  }, err => {});
}

export function playMedia(item) {
  const music = MusicKit.getInstance();

  const params = item.attributes.playParams;
  music.setQueue({
    [params.kind]: params.id
  }).then(queue => {
    music.play();
  }, err => {});
}

export function formatTimeMs(timeInMs) {
  return formatTime(timeInMs / 1000);
}

export function formatTime(timeInSec) {
  let secs = '' + Math.floor(timeInSec % 60);
  while (secs.length < 2) {
    secs = '0' + secs;
  }
  const mins = Math.floor(timeInSec / 60);

  return mins + ':' + secs;
}

export function playPause() {
  const music = MusicKit.getInstance();
  const player = music.player;
  if (player.isPlaying) {
    player.pause();
  } else {
    player.play();
  }
}

export function isPlaying() {
  const music = MusicKit.getInstance();
  const player = music.player;
  return player.isPlaying;
}

export function nextItem() {
  const music = MusicKit.getInstance();
  const player = music.player;
  player.skipToNextItem();
}

export function prevItem() {
  const music = MusicKit.getInstance();
  const player = music.player;
  player.skipToPreviousItem();
}
