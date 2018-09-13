import React, {Component} from 'react';
import MusicKit from './musickitService';
import Album from './Album';
import {cacheAlbums} from './mediaFetcher';

type Props = {
  music: MusicKit,
  currentSong:
    ?string,
  settings: {},
  filter: string
}

type State = {
  albums: [],
  selected:
    ?string
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
      } else {
        const albumIds = appendedList.map(album => {
          return album.id
        });
        console.log(albumIds);
        cacheAlbums(albumIds);
      }
    });
  }

  onSelected = (idx) => {
    const {music} = this.props;
    const {selected, albums} = this.state;

    if (idx == selected) {
      this.setState({selected: null});
    } else {
      this.setState({selected: idx});
    }
  }

  render() {
    const {albums, selected} = this.state;
    const {music, currentSong, settings, filter} = this.props;

    const filterLower = filter.toLowerCase();

    const validAlbums = albums.filter(album => {
      const title = album.attributes.name;
      let artist = album.attributes.artistName;
      if (!artist) {
        artist = 'Unknown Artist';
      }

      if (filterLower.length > 0) {
        return title.toLowerCase().includes(filterLower) || artist.toLowerCase().includes(filterLower);
      }
      return true;
    });

    return (<div className='container'>
      {
        albums.length > 0
          ? validAlbums.map((album, idx) => {
            return (<Album key={album.id} music={music} album={album} onSelected={() => {
                this.onSelected(album.id)
              }} isSelected={selected == album.id} currentSong={currentSong} settings={settings}/>);
          })
          : <div className="center">
              <div className="centerInner">
                <span className="loading">Loading Albums</span>
              </div>
            </div>
      }
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
      <div className='dummy_album'/>
    </div>);
  }
}

export default AlbumList;
