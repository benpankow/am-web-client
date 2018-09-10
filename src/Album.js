import React, { Component } from 'react';
import SongList from './SongList';
import './Album.css';

type Props = {
  album: {},
  onSelected: string,
  isSelected: boolean,
}

class Album extends Component<Props> {
  render() {
    const {album, onSelected, isSelected} = this.props;
    const url = album.attributes.artwork.url;
    let urlFormatted = url.replace('{w}', 500);
    urlFormatted = urlFormatted.replace('{h}', 500);

    let title = album.attributes.name;

    return (
      <div className='album' onClick={onSelected}>
        <img className='album_art' src={urlFormatted}/>
        <div className='album_title'>{title}</div>
        <div className='album_artist'>{album.attributes.artistName}</div>
        {isSelected ?
          <SongList album={album} url={urlFormatted}/>
          : ''
        }
      </div>
    );
  }
}

export default Album;
