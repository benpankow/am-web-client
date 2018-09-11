import React, {Component} from 'react';
import MusicKit from './musickitService';
import AlbumList from './AlbumList';
import MediaBar from './MediaBar';
import Settings from './Settings';
import Sidebar from './Sidebar';
import './App.css';
import {DEVELOPER_TOKEN} from './secrets'

type State = {
  authorized: boolean,
  currentSong:
    ?string,
  page: string,
  settings: {
    coloredBackground: boolean,
    darkTheme: boolean,
  }
}

class App extends Component<State> {
  state = {
    authorized: false,
    currentSong: null,
    page: 'albums',
    settings: {
      coloredBackground: true,
      darkTheme: false
    }
  };

  authorize = () => {
    const music = MusicKit.getInstance();
    const app = this;
    music.authorize().then(function() {
      app.setState({authorized: true});
      location.reload();
    });
  }

  componentDidMount() {
    const app = this;
    /* document.addEventListener('musickitloaded', function() { */
    MusicKit.configure({
      developerToken: DEVELOPER_TOKEN,
      app: {
        name: 'Apple Music Web Player',
        build: '0.0.1'
      }
    });
    const music = MusicKit.getInstance();

    app.setState({authorized: music.isAuthorized});
    /* }); */

    music.addEventListener('mediaItemDidChange', function(event) {
      console.log(event.item);
      app.setState({currentSong: event.item});
    });
  }

  setPage = (page) => {
    this.setState({page: page});
  }

  adjustSetting = (name, value) => {
    let {settings} = this.state;
    settings[name] = value;
    this.setState({settings: settings});
  }

  renderPage = () => {
    const {authorized, currentSong, page, settings} = this.state;
    if (page == 'albums') {
      return (<AlbumList music={MusicKit.getInstance()} currentSong={currentSong} settings={settings}/>);
    } else if (page == 'settings') {
      return (<Settings settings={settings} adjustSetting={this.adjustSetting}/>);
    } else {
      return '';
    }
  }

  render() {
    const {authorized, currentSong, page} = this.state;
    return (<div className="App">
      <div className={'fullheight noselect'}>
        {
          authorized
            ? <MediaBar music={MusicKit.getInstance()}/>
            : ''
        }
        <div className='main_cols'>
          <Sidebar page={page} setPage={this.setPage}/> {
            authorized
              ? this.renderPage()
              : <div className='sign_in_container'>
                  <div className='sign_in_container_inner'>
                    <div className='sign_in_text'>Sign in to access your music.</div>
                    <div className='button' onClick={this.authorize}>Sign In</div>
                  </div>
                </div>
          }
        </div>
      </div>
    </div>);
  }
}

export default App;
