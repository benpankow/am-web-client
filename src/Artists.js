import React, { Component } from "react";
import MusicKit from "./musickitService";
import {
  fetchArtistList,
  getCachedArtistList,
  fetchArtistAlbumList
} from "./mediaFetcher";
import {
  playMedia,
  formatTimeMs,
  playParams,
  playCollection,
  shuffleCollection,
  formatRuntimeMs
} from "./playerUtils";
import AlbumSongsArtist from "./AlbumSongsArtist";

type Props = {
  music: MusicKit,
  currentSong: ?string,
  settings: {},
  filter: string
};

type State = {
  artists: [],
  width: number,
  selectedArtist: string,
  albums: []
};

// List of all a user's artists
class Artists extends Component<Props, State> {
  state = {
    artists: [],
    width: 250,
    selectedArtist: null,
    albums: []
  };

  componentDidMount() {
    this.fetchArtists();
  }

  fetchArtists = () => {
    const { music } = this.props;
    const self = this;

    self.setState({ artists: getCachedArtistList() });

    fetchArtistList(
      currentList => {
        if (self.state.selectedArtist == null) {
          self.setState({ selectedArtist: currentList[0].attributes.name });
        }
        self.setState({ artists: currentList });
      },
      () => {}
    );
  };

  artistClicked = artist => {
    const self = this;

    this.setState({ selectedArtist: artist.attributes.name });

    fetchArtistAlbumList(
      artist.id,
      currentList => {
        self.setState({ albums: currentList });
      },
      () => {}
    );
  };

  renderArtists = () => {
    const { artists, width, selectedArtist } = this.state;

    return (
      <div>
        {artists.map(artist => {
          let className = "artist";
          if (artist.attributes.name == selectedArtist) {
            className += " selected";
          }
          return (
            <div
              className={className}
              onMouseDown={() => {
                this.artistClicked(artist);
              }}
              key={artist.id}
            >
              {artist.attributes.name}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { artists, width, albums } = this.state;
    const { music, currentSong, settings, filter } = this.props;

    return (
      <div className="artists_container">
        <div
          className="artists_sidebar"
          style={{
            flex: "0 0 " + width + "px"
          }}
        >
          {this.renderArtists()}
        </div>
        <div className="artist_details">
          {albums.map((album, idx) => {
            return (
              <AlbumSongsArtist
                album={album}
                music={music}
                currentSong={currentSong}
                settings={settings}
                key={album.id}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Artists;
