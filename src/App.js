import React, {Component} from 'react';
import MusicKit from './musickitService';
import AlbumList from './AlbumList';
import MediaBar from './MediaBar';
import './App.css';
import {DEVELOPER_TOKEN} from './secrets'

type State = {
  authorized: boolean,
  currentSong: ?string
}

class App extends Component<State> {
  state = {
    authorized: false,
    currentSong: null
  };

  componentDidMount() {
    const dis = this;
    /* document.addEventListener('musickitloaded', function() { */
    MusicKit.configure({
      developerToken: DEVELOPER_TOKEN,
      app: {
        name: 'Apple Music Web Player',
        build: '0.0.1'
      }
    });
    let music = MusicKit.getInstance();

    music.authorize().then(function() {
      dis.setState({authorized: true});
    });
    /* }); */

    music.addEventListener('mediaItemDidChange', function(event) {
      console.log(event.item);
      dis.setState({currentSong: event.item});
    });
  }

  render() {
    const {authorized, currentSong} = this.state;
    return (<div className="App">
      {
        authorized
          ? (<div>
            <MediaBar music={MusicKit.getInstance()}/>
            <AlbumList music={MusicKit.getInstance()} currentSong={currentSong}/>
          </div>)
          : 'false'
      }
    </div>);
  }
}

export default App;
