import React, { Component } from "react";
import MusicKit from "./musickitService";
import { fetchSongList, getCachedSongList } from "./mediaFetcher";
import { playMedia, formatTimeMs, playParams } from "./playerUtils";
import ResizableTable from "./components/ResizableTable";

type Props = {
  music: MusicKit,
  currentSong: ?string,
  settings: {},
  filter: string
};

type State = {
  songs: []
};

// List of all a user's songs
class SongsList extends Component<Props, State> {
  state = {
    songs: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { music } = this.props;
    const self = this;

    const cachedList = getCachedSongList();
    self.setState({ songs: cachedList });

    let updateFunc =
      cachedList.length > 0
        ? () => {}
        : currentList => {
            self.setState({ songs: currentList });
          };

    fetchSongList(updateFunc, list => {});
  }

  songClicked = song => {
    if (song.id == this.state.selected) {
      playMedia(song);
    } else {
      this.setState({ selected: song.id });
    }
  };

  render() {
    const { songs, selected, columnSizes } = this.state;
    const { music, currentSong, settings, filter } = this.props;

    const filterLower = filter.toLowerCase();

    // Filter list of songs to display only those that match
    const validSongs = songs.filter(song => {
      const title = song.attributes.name;
      let artist = song.attributes.artistName;
      if (!artist) {
        artist = "Unknown Artist";
      }
      let album = song.attributes.albumName;
      if (!album) {
        album = "Unknown";
      }

      if (filterLower.length > 0) {
        return (
          title.toLowerCase().includes(filterLower) ||
          artist.toLowerCase().includes(filterLower) ||
          album.toLowerCase().includes(filterLower)
        );
      }
      return true;
    });

    const rows = validSongs.map((song, idx) => {
      return {
        id: idx,
        name: song.attributes.name,
        time: formatTimeMs(song.attributes.durationInMillis),
        artist: song.attributes.artistName,
        album: song.attributes.albumName,
        playParams: song.attributes.playParams
      };
    });

    return (
      <div className="songs_container">
        <ResizableTable
          onClicked={row => {
            playParams(row.playParams);
          }}
          initialColumnSizes={[45, 5, 20, 30]}
          columns={["name", "time", "artist", "album"]}
          columnNames={["Name", "Time", "Artist", "Album"]}
          rows={rows}
        />
      </div>
    );
  }
}

export default SongsList;
