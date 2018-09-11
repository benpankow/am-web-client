import React, {Component} from 'react';
import MusicKit from './musickitService';

type Props = {
  settings: {},
  adjustSetting: {}
}

type State = {}

class Settings extends Component<Props, State> {
  render() {
    const {adjustSetting, settings} = this.props;
    const {coloredBackground, darkTheme} = settings;
    return <div className='settings_container'>
      <div className='settings_inner'>
        <input type="checkbox" checked={coloredBackground} onChange={(e) => {
            adjustSetting('coloredBackground', e.target.checked)
          }}/> Display colored backgrounds on albums
      </div>
    </div>;
  }
}

export default Settings;
