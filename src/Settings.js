import React, { Component } from "react";
import Checkbox from "./components/Checkbox";
import VirtualList from "./components/VirtualList";

import MusicKit from "./musickitService";
import "./style/checkbox.css";

type Props = {
  settings: {},
  adjustSetting: {}
};

type State = {
  parentRef: {}
};

const rows = [];
for (var i = 0; i <= 1000; i++) {
  rows.push(i);
}
// Settings page
class Settings extends Component<Props, State> {
  state = {
    parentRef: null
  };

  constructor(props) {
    super(props);
  }

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
          <div
            style={{ height: "200px", overflowY: "scroll", resize: "both" }}
            ref={c => {
              if (!this.state.parentRef) {
                console.log("setState");
                this.setState({ parentRef: c });
              }
            }}
          >
            <VirtualList
              elementHeight={20}
              rows={rows}
              renderRow={row => {
                return (
                  <div style={{ height: "20px" }} key={row}>
                    {row}
                  </div>
                );
              }}
              parentRef={this.state.parentRef}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
