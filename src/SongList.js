import React, {Component} from 'react';
import {playMedia} from './utils';

type Props = {
  album: {},
  url: string,
  music: string
}

type State = {
  height: number,
  songs: []
}

class SongList extends Component<Props, State> {
  state = {
    height: 0,
    songs: []
  };
  updatingHeight = false;

  constructor(props) {
    super(props);
    this.songListRef = React.createRef();
  }

  componentDidMount() {
    const {music, album} = this.props;

    const self = this;

    music.api.library.album(album.id).then(function(result) {
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

  render() {
    const {height, songs} = this.state;
    const {album, url} = this.props;

    console.log('Rerender' + songs.length);

    return (<div>
      <div ref={this.songListRef} className='song_list'>
        <div className='blur' style={{
            backgroundImage: "url(" + url + ")"
          }}/>
        <div className={'song_list_l padding10'}>
          <div className='title'>{album.attributes.name}</div>
          <div className='divider'/>
          <div className='song_container'>
            {
              songs.map((song) => {
                const duration = song.attributes.durationInMillis;
                let secs = '' + Math.floor((duration / 1000) % 60);
                while (secs.length < 2) {
                  secs = '0' + secs;
                }
                const mins = Math.floor((duration / 1000) / 60);

                return (<div key={song.id} className='song' onClick={() => {
                    playMedia(song)
                  }}>
                  <span className='song_number'>{song.attributes.trackNumber}</span>
                  {song.attributes.name}
                  <span className='song_length'>{mins}:{secs}</span>
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
        }}></div>
    </div>);
  }
}

/*
<div className='triangle'>
  <div className='inner_triangle'/>
</div>
*/

export default SongList;
