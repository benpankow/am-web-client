import React, {Component} from 'react';
import MusicKit from './musickitService';

type Props = {
  music: MusicKit
}

type State = {}

class MediaBar extends Component<Props, State> {
  state = {}

  componentDidMount() {
    setInterval(() => {
      this.setState(this.state)
    }, 1);
  }

  render() {
    const {music} = this.props;
    const pct = music.player.currentPlaybackProgress * 100;

    const queue = music.player.queue._items;
    let url = null;
    let title = null;
    let artist = null;
    let album = null;

    if (queue.length > 0) {
      const currentSong = queue[0];
      url = currentSong.attributes.artwork.url;
      url = url.replace('{w}', 500);
      url = url.replace('{h}', 500);
      title = currentSong.attributes.name;
      artist = currentSong.attributes.artistName;
      album = currentSong.attributes.albumName;
    }

    return (<div>
      <div className='media_bar'>
        <img className='media_bar_art' src={url
            ? url
            : ''}/>

        <div className='media_bar_right'>
          <div className='current_song_title'>{title}</div>
          <div className='current_song_info'>{artist}
            - {album}</div>
          <div className='progress_outer'>
            <div className='progress' style={{
                width: pct + "%"
              }}/>
          </div>
        </div>
      </div>
      <div className='media_bar_padding'/>
    </div>);
  }
}

export default MediaBar;
