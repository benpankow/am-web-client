import React, { Component } from "react";
import AlbumSongsInner from "./AlbumSongsInner";

type Props = {
  album: {},
  music: string,
  currentSong: ?string,
  settings: {}
};

class AlbumSongsArtist extends Component<Props, State> {
  render() {
    const { album, currentSong, music, settings } = this.props;
    const url = album.attributes.artwork.url;
    let urlFormatted = url.replace("{w}", 500).replace("{h}", 500);

    return (
      <div className="song_list_artist">
        <div
          className="blur"
          style={{
            backgroundImage: "url(" + urlFormatted + ")"
          }}
        />
        <AlbumSongsInner
          album={album}
          url={urlFormatted}
          music={music}
          currentSong={currentSong}
          settings={settings}
        />
      </div>
    );
  }
}

export default AlbumSongsArtist;
