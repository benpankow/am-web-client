import React, { Component } from "react";
import Checkbox from "./components/Checkbox";

import MusicKit from "./musickitService";
import "./style/checkbox.css";

type Props = {
  settings: {},
  adjustSetting: {}
};

type State = {};

// Settings page
class Settings extends Component<Props, State> {
  render() {
    const { adjustSetting, settings } = this.props;
    const { coloredBackground, darkTheme } = settings;
    return (
      <div className="settings_container">
        <div className="settings_inner">
          <div className="setting">
            <Checkbox
              checked={coloredBackground}
              onChange={b => {
                adjustSetting("coloredBackground", b);
              }}
            />
            Display colored backgrounds on albums
          </div>
          <div className="setting">
            <Checkbox
              checked={darkTheme}
              onChange={b => {
                adjustSetting("darkTheme", b);
              }}
            />
            Dark theme
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
