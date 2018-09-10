import React, {Component} from 'react';
import MusicKit from './musickitService';
import {formatTime, playPause, isPlaying, nextItem, prevItem} from './utils';

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
    const pct = (music.player.currentPlaybackTime / music.player.currentPlaybackDuration) * 100;

    const queue = music.player.queue;
    let url = 'https://is4-ssl.mzstatic.com/image/thumb/Features19/v4/50/f0/d1/50f0d1ac-cf2d-de77-c5c2-73a3170c098e/source/500x500bb.jpeg';
    let title = null;
    let artist = null;
    let album = null;

    const timeRemaining = music.player.currentPlaybackTimeRemaining;
    const time = music.player.currentPlaybackTime;

    if (queue._items.length > 0) {
      const currentSong = queue._items[queue._position];
      url = currentSong.attributes.artwork.url;
      url = url.replace('{w}', 500);
      url = url.replace('{h}', 500);
      title = currentSong.attributes.name;
      artist = currentSong.attributes.artistName;
      album = currentSong.attributes.albumName;
    }

    return (<div>
      <div className='media_bar'>
        <div className='controls'>
          <div className='media_button_small' onClick={prevItem}>
            <i className={'material-icons'}>fast_rewind</i>
          </div>
          <div className='media_button' onClick={playPause}>
            <i className={'material-icons'}>{
                isPlaying()
                  ? 'pause'
                  : 'play_arrow'
              }</i>
          </div>
          <div className='media_button_small' onClick={nextItem}>
            <i className={'material-icons'}>fast_forward</i>
          </div>
        </div>
        <div className='playing_details_wrap'>
          <div className='playing_details'>
            <img className='media_bar_art' src={url
                ? url
                : ''}/>

            <div className='media_bar_right'>
              <div className='current_song_title'>{title}</div>
              <div className='current_song_info'>{
                  artist
                    ? artist + ' - ' + album
                    : ''
                }</div>
              <div className='current_song_time'>{formatTime(time)}</div>
              <div className='current_song_time_left'>-{formatTime(timeRemaining)}</div>
              <div className='progress_outer'>
                <div className='progress' style={{
                    width: pct + "%"
                  }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='media_bar_padding'/>
    </div>);
  }
}

export default MediaBar;
