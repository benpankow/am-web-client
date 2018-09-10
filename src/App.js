import React, {Component} from 'react';
import MusicKit from './musickitService';
import AlbumList from './AlbumList';
import MediaBar from './MediaBar';
import './App.css';
import {DEVELOPER_TOKEN} from './secrets'

type State = {
  authorized: boolean
}

class App extends Component<State> {
  state = {
    authorized: false
  };

  componentDidMount() {
    console.log('bule');
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
    console.log('befool');
    // This ensures user authorization before calling play():
    music.authorize().then(function() {
      dis.setState({authorized: true});
    });
    /* }); */
  }

  render() {
    const {authorized} = this.state;
    return (<div className="App">
      {
        authorized
          ? (<div>
            <MediaBar music={MusicKit.getInstance()}/>
            <AlbumList music={MusicKit.getInstance()}/>
          </div>)
          : 'false'
      }
    </div>);
  }
}

export default App;
