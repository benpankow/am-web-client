import React, {Component} from 'react';
import {playMedia, formatTimeMs, playCollection} from './playerUtils';
import {getAlbum} from './mediaFetcher';

type Props = {
  album: {},
  url: string,
  music: string,
  currentSong:
    ?string,
  settings: {}
}

type State = {
  height: number,
  selectedSong: number,
  songs: []
}

class SongList extends Component<Props, State> {
  state = {
    height: 0,
    songs: [],
    selectedSong: null
  };
  updatingHeight = false;

  constructor(props) {
    super(props);
    this.songListRef = React.createRef();
  }

  componentDidMount() {
    const {music, album} = this.props;

    const self = this;

    getAlbum(album.id).then((result) => {
      const songs = result.relationships.tracks.data;
      console.log(songs);
      self.setState({songs: songs});
    });
    this.updatingHeight = true;
    this.setState({height: this.songListRef.current.offsetHeight});
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.updatingHeight) {
      this.updatingHeight = true;
      this.setState({height: this.songListRef.current.offsetHeight});
    } else {
      this.updatingHeight = false;
    }
  }

  clickSong = (idx) => {
    const {songs, selectedSong} = this.state;
    if (idx == selectedSong) {
      playCollection(songs.slice(idx));
    } else {
      this.setState({selectedSong: idx});
    }
  }

  render() {
    const {height, songs, selectedSong} = this.state;
    const {album, url, currentSong, settings} = this.props;

    return (<div>
      <div ref={this.songListRef} className={'song_list' + (
          settings.coloredBackground
          ? ''
          : ' no_blur')}>
        <div className='blur' style={{
            backgroundImage: "url(" + url + ")"
          }}/>
        <div className={'song_list_l padding10'}>
          <div className='album_title_detail'>{album.attributes.name}</div>
          <div className='album_artist_detail'>{album.attributes.artistName}</div>
          <div className='divider'/>
          <div className='song_container'>
            {
              songs.map((song, idx) => {
                const duration = song.attributes.durationInMillis;

                return (<div key={song.id} className={idx == selectedSong
                    ? 'song selected noselect'
                    : 'song noselect'} onMouseDown={() => {
                    this.clickSong(idx)
                  }}>

                  <span className='song_number'>{
                      currentSong && song.id == currentSong._container.id
                        ? <i className='material-icons'>volume_up</i>
                        : song.attributes.trackNumber
                    }</span>
                  {song.attributes.name}
                  <span className='song_length'>{formatTimeMs(duration)}</span>
                </div>);
              })
            }
          </div>
        </div>
        <div className='song_list_r'>
          <img className='album_art_lg' src={url}/>
        </div>

      </div>
      <div className='song_list_spacer' style={{
          height: height
        }}>
        <div className='trapezoid'/>
        <div className='trapezoid_r'/>
        <div className='left_bar'/>
        <div className='right_bar'/>
      </div>
    </div>);
  }
}

/*
<div className='triangle'>
  <div className='inner_triangle'/>
</div>
*/

export default SongList;
