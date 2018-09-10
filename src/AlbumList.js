import React, {Component} from 'react';
import MusicKit from './musickitService';
import Album from './Album';

type Props = {
  music: MusicKit
}

type State = {
  albums: [],
  selected:
    ?number
}

class AlbumList extends Component<Props, State> {
  state = {
    albums: [],
    selected: null
  };

  componentDidMount() {
    this.fetchAlbums(0, []);
  }

  fetchAlbums = (offset, currentList) => {
    const {music} = this.props;
    const self = this;

    music.api.library.albums(null, {
      offset: offset,
      limit: 100
    }).then(function(cloudAlbums) {
      const appendedList = currentList.concat(cloudAlbums);

      self.setState({albums: appendedList});

      console.log(appendedList);

      if (cloudAlbums.length == 100) {
        self.fetchAlbums(offset + 100, appendedList);
      }
    });
  }

  onSelected = (idx) => {
    const {music} = this.props;
    const {selected, albums} = this.state;

    if (idx == selected) {
      this.setState({selected: null});
      music.stop();
    } else {
      this.setState({selected: idx});
    }

  }

  render() {
    const {albums, selected} = this.state;
    const {music} = this.props;
    return (<div className='container'>
      {
        albums.length > 0
          ? albums.map((album, idx) => {
            return (<Album key={album.id} music={music} album={album} onSelected={() => {
                this.onSelected(idx)
              }} isSelected={selected == idx}/>);
          })
          : <div className="center">
              <div className="centerInner">
                <span className="loading">Loading Albums</span>
              </div>
            </div>
      }
    </div>);
  }
}

export default AlbumList;
