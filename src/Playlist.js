import React, { Component } from "react";
import MusicKit from "./musickitService";
import { getPlaylist } from "./mediaFetcher";
import {
  playMedia,
  formatTimeMs,
  playParams,
  playCollection,
  shuffleCollection,
  formatRuntimeMs
} from "./playerUtils";

type Props = {
  music: MusicKit,
  currentSong: ?string,
  settings: {},
  id: string
};

type State = {
  playlist: null,
  selectedSong: number
};

// List of all a user's songs
class Playlist extends Component<Props, State> {
  state = {
    playlist: null,
    selectedSong: 0
  };

  componentDidMount() {
    const { music, id } = this.props;

    const self = this;
    getPlaylist(id).then(result => {
      self.setState({ playlist: result });
    });
  }

  componentDidUpdate(prevProps) {
    const { music, id } = this.props;

    if (prevProps.id != id) {
      const self = this;
      self.setState({ playlist: null });
      getPlaylist(id).then(result => {
        self.setState({ playlist: result });
      });
    }
  }

  songClicked = song => {
    if (song.id == this.state.selectedSong) {
      playMedia(song);
    } else {
      this.setState({ selectedSong: song.id });
    }
  };

  renderSong = song => {
    const name = song.attributes.name;
    const albumName = song.attributes.albumName;

    const artist = song.attributes.artistName;
    const duration = formatTimeMs(song.attributes.durationInMillis);
    const url = song.attributes.artwork.url;
    const urlFormatted = url.replace("{w}", 500).replace("{h}", 500);

    return (
      <tr
        className={this.state.selectedSong == song.id ? "selected" : ""}
        onMouseDown={() => {
          this.songClicked(song);
        }}
      >
        <td>
          <img src={urlFormatted} />
        </td>
        <td>
          <div className="playlist_song_title">{name}</div>
          <div className="playlist_album_title">{albumName}</div>
        </td>
        <td>{artist}</td>
        <td>{duration}</td>
        <td />
      </tr>
    );
  };

  renderPlaylistSongs = () => {
    const { playlist } = this.state;

    if (!playlist) {
      return null;
    }

    const songs = playlist.relationships.tracks.data;
    return (
      <div className="playlist_table_wrapper">
        <table className="playlist_table">
          <colgroup>
            <col style={{ width: "50px" }} />
            <col style={{ width: "50%" }} />
            <col style={{ width: "50%" }} />
            <col style={{ width: "50px" }} />
            <col style={{ width: "50px" }} />
          </colgroup>
          {songs.map(this.renderSong)}
        </table>
      </div>
    );
  };

  // Gets a list of unique song artwork in this playlist
  getUniqueSongArt = () => {
    const { playlist } = this.state;

    if (!playlist) {
      return [];
    }

    const songs = playlist.relationships.tracks.data;
    const list = [];
    const albumList = [];

    songs.forEach(song => {
      const url = song.attributes.artwork.url;
      const urlFormatted = url.replace("{w}", 500).replace("{h}", 500);
      const albumName = song.attributes.albumName;

      if (!albumList.includes(albumName)) {
        list.push(urlFormatted);
        albumList.push(albumName);
      }
    });
    return list;
  };

  // Renders the artwork for this playlist - either its custom icon, or
  // a collage of artwork from songs in this playlist
  renderPlaylistArtwork = () => {
    const { playlist } = this.state;

    let url =
      playlist && playlist.attributes.artwork
        ? playlist.attributes.artwork.url
        : null;

    if (url && url.includes("mzstatic.com")) {
      url = null;
    }

    if (url) {
      const urlFormatted = url.replace("{w}", 500).replace("{h}", 500);
      return (
        <div className="playlist_artwork">
          <div
            style={{ backgroundImage: "url(" + urlFormatted + ")" }}
            className="playlist_artwork_inner"
          />
        </div>
      );
    } else {
      const songArtworks = this.getUniqueSongArt();
      const numArtworks = songArtworks.length;

      const artImages = [];
      let ctr = 0;
      for (let i = 0; i < 11; i++) {
        artImages.push(<img src={songArtworks[ctr % numArtworks]} />);
        ctr++;
      }

      if (numArtworks > 0) {
        return (
          <div className="playlist_artwork">
            <div className="playlist_artwork_collage"> {artImages}</div>
          </div>
        );
      } else {
        return <div className="playlist_artwork" />;
      }
    }
  };

  render() {
    const { id } = this.props;
    const { playlist } = this.state;

    const title =
      playlist && playlist.attributes.name
        ? playlist.attributes.name
        : "Loading...";

    const numSongs =
      playlist && playlist.relationships.tracks
        ? playlist.relationships.tracks.data.length
        : 0;

    const totalRuntime =
      playlist && playlist.relationships.tracks
        ? playlist.relationships.tracks.data.reduce((total, song) => {
            return (
              total + (song.attributes ? song.attributes.durationInMillis : 0)
            );
          }, 0)
        : 0;

    const description =
      playlist && playlist.attributes.description
        ? playlist.attributes.description.standard
        : null;

    return (
      <div className="playlist_container">
        <div class="playlist_header">
          {this.renderPlaylistArtwork()}
          <div class="playlist_title">
            {title}
            <div
              className="play_album_detail"
              onMouseDown={() => {
                playCollection(playlist.relationships.tracks.data);
              }}
            >
              <i className="material-icons">play_arrow</i>
            </div>
            <div
              className="shuffle_album_detail"
              onMouseDown={() => {
                shuffleCollection(playlist.relationships.tracks.data);
              }}
            >
              <i className="material-icons">shuffle</i>
            </div>
          </div>
          <div class="playlist_details">
            {numSongs} songs &bull; {formatRuntimeMs(totalRuntime)}
          </div>
          <div className="light_divider" />
          {description}
          {description ? <div className="light_divider" /> : null}
        </div>
        {this.renderPlaylistSongs()}
      </div>
    );
  }
}

export default Playlist;
