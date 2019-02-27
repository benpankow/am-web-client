import React, { Component } from "react";
import {
  playMedia,
  formatTimeMs,
  playCollection,
  shuffleCollection
} from "./playerUtils";
import { getAlbum } from "./mediaFetcher";

type Props = {
  album: {},
  url: string,
  music: string,
  currentSong: ?string,
  settings: {}
};

type State = {
  selectedSong: number,
  songs: []
};

class AlbumSongsInner extends Component<Props, State> {
  state = {
    songs: [],
    selectedSong: null
  };

  componentDidMount() {
    const { music, album } = this.props;

    const self = this;

    getAlbum(album.id).then(result => {
      const songs = result.relationships.tracks.data;
      self.setState({ songs: songs });
    });
  }

  // When song clicked, either set it selected or play it
  clickSong = idx => {
    const { songs, selectedSong } = this.state;
    if (idx == selectedSong) {
      playCollection(songs.slice(idx));
    } else {
      this.setState({ selectedSong: idx });
    }
  };

  renderDummySongs = () => {
    const { songs, selectedSong } = this.state;
    const { album, url, currentSong, settings } = this.props;

    const dummySongs = [];
    for (let idx = 0; idx < album.attributes.trackCount; idx++) {
      const duration = 0;

      // Display track number, unless song is playing, then show
      // speaker icon
      const trackNumber = idx + 1;

      const className = "song noselect";

      dummySongs.push(
        <div key={"dummySong" + idx} className={className}>
          <span className="song_number">{trackNumber}</span>
          Loading...
          <span className="song_length">{formatTimeMs(duration)}</span>
        </div>
      );
    }

    return dummySongs;
  };

  renderSong = (song, idx) => {
    const { songs, selectedSong } = this.state;
    const { album, url, currentSong, settings } = this.props;

    const duration = song.attributes.durationInMillis;

    // Display track number, unless song is playing, then show
    // speaker icon
    const trackNumber =
      currentSong && song.id == currentSong._container.id ? (
        <i className="material-icons">volume_up</i>
      ) : (
        song.attributes.trackNumber
      );

    const className =
      idx == selectedSong ? "song selected noselect" : "song noselect";

    return (
      <div
        key={album.id + " " + song.id}
        className={className}
        onMouseDown={() => {
          this.clickSong(idx);
        }}
      >
        <span className="song_number">{trackNumber}</span>
        {song.attributes.name}
        <span className="song_length">{formatTimeMs(duration)}</span>
      </div>
    );
  };

  render() {
    const { songs, selectedSong } = this.state;
    const { album, url, currentSong, settings } = this.props;

    return (
      <div className="song_list_inner">
        <div className={"song_list_l padding10"}>
          <div className="album_title_detail">
            {album.attributes.name}
            <div
              className="play_album_detail"
              onMouseDown={() => {
                playCollection(songs);
              }}
            >
              <i className="material-icons">play_arrow</i>
            </div>
            <div
              className="shuffle_album_detail"
              onMouseDown={() => {
                shuffleCollection(songs);
              }}
            >
              <i className="material-icons">shuffle</i>
            </div>
          </div>
          <div className="album_artist_detail">
            {album.attributes.artistName}
          </div>
          <div className="divider" />
          <div className="song_container">
            {songs.length == 0
              ? this.renderDummySongs()
              : songs.map(this.renderSong)}
          </div>
        </div>
        <div className="song_list_r">
          <img className="album_art_lg" src={url} />
        </div>
      </div>
    );
  }
}

export default AlbumSongsInner;
