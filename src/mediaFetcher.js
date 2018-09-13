import MusicKit from './musickitService';

let songsCache = {};

export function cacheAlbums(albumIds) {
  let ctr = 0;
  for (let i = 0; i < albumIds.length; i++) {
    cacheAlbum(albumIds[i]).then(() => {
      ctr++;
    });
  }
}

export function cacheAlbum(albumId) {
  if (albumId in songsCache) {
    return Promise.resolve(0);
  } else {
    return getAlbum(albumId);
  }
}

export function getAlbum(albumId) {
  const music = MusicKit.getInstance();
  const player = music.player;

  if (albumId in songsCache) {
    return Promise.resolve(songsCache[albumId]);
  } else {
    const promise = music.api.library.album(albumId);
    promise.then((result) => {
      songsCache[albumId] = result;
    });
    return promise;
  }
}
