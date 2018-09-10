import React, {Component} from 'react';

type Props = {
  album: {},
  url: string,
  music: string
}

type State = {
  height: number
}

class SongList extends Component<Props, State> {
  state = {
    height: 0
  };

  constructor(props) {
    super(props);
    this.songListRef = React.createRef();
  }

  componentDidMount() {
    const {music, album} = this.props;
    music.api.library.album(album.id).then(function(result) {
      console.log(result);
    });
    this.setState({height: this.songListRef.current.offsetHeight});
  }

  render() {
    const {height} = this.state;
    const {album, url} = this.props;

    return (<div>
      <div ref={this.songListRef} className='song_list'>
        <div className={'align_left padding10'}>
          <span className='title'>{album.attributes.name}</span>
        </div>
        <div className='align_right'>
          <img className='album_art_lg' src={url}/>
        </div>
      </div>
      <div className='song_list_spacer' style={{
          height: height
        }}>
        <div className='triangle'>
          <div className='inner_triangle'/>
        </div>
      </div>
    </div>);
  }
}

export default SongList;
