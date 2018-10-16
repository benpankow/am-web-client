import MusicKit from "./musickitService";

export function shuffleCollection(items) {
  const shuffled = items.slice().sort(() => Math.random() - 0.5);
  playCollection(shuffled);
}

// Plays a given collection of itmes (songs, etc)
export function playCollection(items) {
  const music = MusicKit.getInstance();
  const player = music.player;

  music
    .setQueue({
      items: items.map(item => {
        console.log(item);
        return {
          attributes: item.attributes,
          id: item.id,
          container: {
            id: item.id
          }
        };
      })
    })
    .then(
      queue => {
        music.play();
      },
      err => {}
    );
}

// Plays some media based on its params field
export function playParams(params) {
  const music = MusicKit.getInstance();

  music
    .setQueue({
      [params.kind]: params.id
    })
    .then(
      queue => {
        music.play();
      },
      err => {}
    );
}

// Plays a particular media item (song, etc)
export function playMedia(item) {
  const music = MusicKit.getInstance();

  const params = item.attributes.playParams;
  playParams(params);
}

// Given some time in milliseconds, format it for display
export function formatTimeMs(timeInMs) {
  return formatTime(timeInMs / 1000);
}

// Given a time in seconds, format it for display (ie 5:30)
export function formatTime(timeInSec) {
  let secs = "" + Math.floor(timeInSec % 60);
  while (secs.length < 2) {
    secs = "0" + secs;
  }
  const mins = Math.floor(timeInSec / 60);

  return mins + ":" + secs;
}

// Plays or pauses the current media
export function playPause() {
  const music = MusicKit.getInstance();
  const player = music.player;
  if (player.isPlaying) {
    player.pause();
  } else {
    player.play();
  }
}

// Whether a song is playing
export function isPlaying() {
  const music = MusicKit.getInstance();
  const player = music.player;
  return player.isPlaying;
}

// Goes to next song
export function nextItem() {
  const music = MusicKit.getInstance();
  const player = music.player;
  player.skipToNextItem();
}

// Goes to previous song / restarts current song
export function prevItem() {
  const music = MusicKit.getInstance();
  const player = music.player;
  player.skipToPreviousItem();
}

export function getVolume() {
  const music = MusicKit.getInstance();
  const player = music.player;
  return player.volume;
}

export function setVolume(newVolume) {
  const music = MusicKit.getInstance();
  const player = music.player;
  player.volume = newVolume;
}
