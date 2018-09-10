import React, { Component } from 'react';
import MusicKit from './musickitService';
import Album from './Album';
import './AlbumList.css';

type Props = {
  music: MusicKit,
}

type State = {
  albums: [],
  selected: ?number,
}

class AlbumList extends Component<Props, State> {
  state = {
    albums: [],
    selected: null,
  };

  componentDidMount() {
    this.fetchAlbums(0, []);
  }

  fetchAlbums = (offset, currentList) => {
    const {music} = this.props;
    const self = this;

    music.api.library.albums(null, { offset: offset, limit: 100 }).then(function(cloudAlbums) {
      const appendedList = currentList.concat(cloudAlbums);

      self.setState({
        albums: appendedList
      });

      console.log(appendedList);

      if (cloudAlbums.length == 100) {
        self.fetchAlbums(offset + 100, appendedList);
      }
    });
  }

  onSelected = (idx) => {
    if (idx == this.state.selected) {
      this.setState({
        selected: null
      });
    } else {
      if (this.state.selected !== null) {
        this.setState({
          selected: idx
        });
      } else {
        this.setState({
          selected: idx
        });
      }
    }

  }

  render() {
    const {albums, selected} = this.state;
    return (
      <div className='container'>
        {albums.length > 0 ? albums.map(
          (album, idx) => {
            return (
              <Album
                key={album.id}
                album={album}
                onSelected={() => {this.onSelected(idx)}}
                isSelected={selected == idx}/>
            );
          }
        ) : 'Loading albums...'}
      </div>
    );
  }
}

export default AlbumList;
