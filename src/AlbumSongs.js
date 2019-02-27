import React, { Component } from "react";
import {
  playMedia,
  formatTimeMs,
  playCollection,
  shuffleCollection
} from "./playerUtils";
import { getAlbum } from "./mediaFetcher";
import AlbumSongsInner from "./AlbumSongsInner";

type Props = {
  album: {},
  url: string,
  music: string,
  currentSong: ?string,
  settings: {}
};

type State = {
  height: number
};

// Displays song list for a particular album
class AlbumSongs extends Component<Props, State> {
  state = {
    height: 0
  };
  updatingHeight = false;

  constructor(props) {
    super(props);
    this.songListRef = React.createRef();
  }

  componentDidMount() {
    const { music, album } = this.props;

    const self = this;

    this.updatingHeight = true;
    this.setState({ height: this.songListRef.current.offsetHeight });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.updatingHeight) {
      this.updatingHeight = true;
      this.setState({ height: this.songListRef.current.offsetHeight });
    } else {
      this.updatingHeight = false;
    }
  }

  render() {
    const { height, songs, selectedSong } = this.state;
    const { album, url, music, currentSong, settings } = this.props;

    return (
      <div>
        <div
          ref={this.songListRef}
          className={
            "song_list" + (settings.coloredBackground ? "" : " no_blur")
          }
        >
          <div
            className="blur"
            style={{
              backgroundImage: "url(" + url + ")"
            }}
          />
          <AlbumSongsInner
            album={album}
            url={url}
            music={music}
            currentSong={currentSong}
            settings={settings}
          />
        </div>
        <div
          className="song_list_spacer"
          style={{
            height: height
          }}
        >
          <div className="trapezoid" />
          <div className="trapezoid_r" />
          <div className="left_bar" />
          <div className="right_bar" />
        </div>
      </div>
    );
  }
}

export default AlbumSongs;
