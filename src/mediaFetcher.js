import MusicKit from "./musickitService";

let songsCache = {};
let albumList = [];
let songList = [];

// Load and cache a set of albums
export function cacheAlbums(albumIds) {
  for (let i = 0; i < albumIds.length; i++) {
    cacheAlbum(albumIds[i]);
  }
}

// Cache a particular album
export function cacheAlbum(albumId) {
  if (albumId in songsCache) {
    return Promise.resolve(0);
  } else {
    return getAlbum(albumId);
  }
}

// Get data for a particular album - returns cached version if possible
export function getAlbum(albumId) {
  const music = MusicKit.getInstance();
  const player = music.player;

  if (albumId in songsCache) {
    return Promise.resolve(songsCache[albumId]);
  } else {
    const promise = music.api.library.album(albumId);
    promise
      .then(result => {
        songsCache[albumId] = result;
      })
      .catch(err => {
        console.log(err);
      });
    return promise;
  }
}

export function getCachedAlbumList() {
  return albumList;
}

// Gets all of a user's albums
export function fetchAlbumList(partialCallback, doneCallback) {
  _getAlbumListInner(partialCallback, doneCallback, 0, []);
}

// Fetches groups of 100 albums, calling partialCallback as each group returns
function _getAlbumListInner(
  partialCallback,
  doneCallback,
  offset,
  currentList
) {
  const music = MusicKit.getInstance();
  const player = music.player;

  music.api.library
    .albums(null, {
      offset: offset,
      limit: 100
    })
    .then(function(cloudAlbums) {
      const appendedList = currentList.concat(cloudAlbums);

      partialCallback(appendedList);

      if (cloudAlbums.length == 100) {
        _getAlbumListInner(
          partialCallback,
          doneCallback,
          offset + 100,
          appendedList
        );
      } else {
        doneCallback(appendedList);
        albumList = appendedList;
      }
    });
}

export function getCachedSongList() {
  return songList;
}

// Gets all of a user's songs
export function fetchSongList(partialCallback, doneCallback) {
  _fetchSongListInner(partialCallback, doneCallback, 0, []);
}

// Fetches groups of 100 songs, calling partialCallback when each group completes
function _fetchSongListInner(
  partialCallback,
  doneCallback,
  offset,
  currentList
) {
  const music = MusicKit.getInstance();
  const player = music.player;

  music.api.library
    .songs(null, {
      offset: offset,
      limit: 100
    })
    .then(cloudAlbums => {
      console.log(cloudAlbums);
      const appendedList = currentList.concat(cloudAlbums);

      partialCallback(appendedList);

      if (cloudAlbums.length > 0) {
        _fetchSongListInner(
          partialCallback,
          doneCallback,
          offset + cloudAlbums.length,
          appendedList
        );
      } else {
        doneCallback(appendedList);
        songList = appendedList;
      }
    })
    .catch(err => {
      console.log(err);
    });
}
