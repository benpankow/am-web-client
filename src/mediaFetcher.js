import MusicKit from "./musickitService";

let songsCache = {};
let playlistsCache = {};
let albumList = [];
let songList = [];
let playlistList = [];
let artistList = [];

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

export function getPlaylist(playlistId) {
  const music = MusicKit.getInstance();
  const player = music.player;

  if (playlistId in playlistsCache) {
    return Promise.resolve(playlistsCache[playlistId]);
  } else {
    const promise = music.api.library.playlist(playlistId);
    promise
      .then(result => {
        playlistsCache[playlistId] = result;
      })
      .catch(err => {
        console.log(err);
      });
    return promise;
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

export function getCachedArtistList() {
  return artistList;
}

// Gets all of a user's artists
export function fetchArtistList(partialCallback, doneCallback) {
  _getArtistListInner(partialCallback, doneCallback, 0, []);
}

// Fetches groups of 100 artists, calling partialCallback as each group returns
function _getArtistListInner(
  partialCallback,
  doneCallback,
  offset,
  currentList
) {
  const music = MusicKit.getInstance();
  const player = music.player;

  music.api.library
    .artists(null, {
      offset: offset,
      limit: 100
    })
    .then(function(cloudArtists) {
      const appendedList = currentList.concat(cloudArtists);

      partialCallback(appendedList);

      if (cloudArtists.length == 100) {
        _getArtistListInner(
          partialCallback,
          doneCallback,
          offset + 100,
          appendedList
        );
      } else {
        doneCallback(appendedList);
        artistList = appendedList;
      }
    });
}

export function getCachedPlaylistList() {
  return playlistList;
}

// Gets all of a user's playlists
export function fetchPlaylistList(partialCallback, doneCallback) {
  _getPlaylistListInner(partialCallback, doneCallback, 0, []);
}

// Fetches groups of 100 playlists, calling partialCallback as each group returns
function _getPlaylistListInner(
  partialCallback,
  doneCallback,
  offset,
  currentList
) {
  const music = MusicKit.getInstance();
  const player = music.player;

  music.api.library
    .playlists(null, {
      offset: offset,
      limit: 100
    })
    .then(function(cloudPlaylists) {
      const appendedList = currentList.concat(cloudPlaylists);

      partialCallback(appendedList);

      if (cloudPlaylists.length == 100) {
        _getPlaylistListInner(
          partialCallback,
          doneCallback,
          offset + 100,
          appendedList
        );
      } else {
        doneCallback(appendedList);
        playlistList = appendedList;
      }
    });
}

export function fetchArtistAlbumList(id, partialCallback, doneCallback) {
  _fetchArtistAlbumlistInner(id, partialCallback, doneCallback, 0, []);
}

function _fetchArtistAlbumlistInner(
  id,
  partialCallback,
  doneCallback,
  offset,
  currentList
) {
  const music = MusicKit.getInstance();
  const player = music.player;
  console.log("go");
  music.api.library
    .artist(id, {
      include: "albums"
    })
    .then(function(artist) {
      const appendedList = currentList.concat(artist.relationships.albums.data);
      console.log(appendedList);
      partialCallback(appendedList);

      /*if (cloudAlbums.length == 100) {
        _getAlbumListInner(
          partialCallback,
          doneCallback,
          offset + 100,
          appendedList
        );
      } else {*/
      doneCallback(appendedList);
      /*  albumList = appendedList;
    }*/
    });
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
