import React, {Component} from 'react';
import SongList from './SongList';
import MusicKit from './musickitService';

type Props = {
  album: {},
  onSelected: string,
  isSelected: boolean,
  music: string,
  currentSong: ?string
}

class Album extends Component<Props> {

  renderSongList = (urlFormatted) => {
    const {album, onSelected, isSelected, music, currentSong} = this.props;

    return <SongList album={album} url={urlFormatted} music={music} currentSong={currentSong}/>
  }

  render() {
    const {album, onSelected, isSelected, music} = this.props;
    const url = album.attributes.artwork.url;
    let urlFormatted = url.replace('{w}', 500);
    urlFormatted = urlFormatted.replace('{h}', 500);

    let title = album.attributes.name;

    return (<div className='album'>
      <img className='album_art' src={urlFormatted} onClick={onSelected}/>
      <div className='album_title'>{title}</div>
      <div className='album_artist'>{album.attributes.artistName}</div>
      {
        isSelected
          ? this.renderSongList(urlFormatted)
          : ''
      }
    </div>);
  }
}

export default Album;
