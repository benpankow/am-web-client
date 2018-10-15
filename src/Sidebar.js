import React, { Component } from "react";
import SidebarEntry from "./SidebarEntry";

const MAX_SIDEBAR_SIZE = 500;

type Props = {
  setPage: {},
  page: string
};

type State = {
  width: ?number
};

// Sidebar with access to library, settings, sign out etc
class Sidebar extends Component<Props, State> {
  state = {
    width: 160
  };

  // Resizes sidebar while dragging
  resize = e => {
    const newWidth = Math.min(MAX_SIDEBAR_SIZE, e.clientX + 2);
    this.setState({ width: newWidth });
  };

  resizeDone = e => {
    document.body.onmousemove = null;
    document.body.onmouseup = null;
  };

  beginResize = e => {
    document.body.onmousemove = this.resize;
    document.body.onmouseup = this.resizeDone;
  };

  // Log out current user
  unauthorize = () => {
    MusicKit.getInstance().unauthorize();
    location.reload();
  };

  render() {
    const { setPage, page } = this.props;
    return (
      <div
        className="sidebar"
        style={{
          flex: "0 0 " + this.state.width + "px"
        }}
      >
        <div className="sidebar_entries">
          <div className="sidebar_category">Library</div>
          <SidebarEntry
            onClick={() => {
              setPage("albums");
            }}
            iconName="album"
            text="Albums"
            page="albums"
            currentPage={page}
          />
          <SidebarEntry
            onClick={() => {
              setPage("artists");
            }}
            iconName="people"
            text="Artists"
            page="artists"
            currentPage={page}
          />
          <SidebarEntry
            onClick={() => {
              setPage("songs");
            }}
            iconName="music_note"
            text="Songs"
            page="songs"
            currentPage={page}
          />
          <SidebarEntry
            onClick={() => {
              setPage("genres");
            }}
            iconName="language"
            text="Genres"
            page="genres"
            currentPage={page}
          />
        </div>
        <div className={"sidebar_entries bottom"}>
          <div className="sidebar_category">Settings</div>
          <SidebarEntry
            onClick={() => {
              setPage("settings");
            }}
            iconName="settings"
            text="Settings"
            page="settings"
            currentPage={page}
          />
          <SidebarEntry
            onClick={this.unauthorize}
            iconName="account_circle"
            text="Sign Out"
          />
        </div>
        <div className="drag_bar" onMouseDown={this.beginResize} />
      </div>
    );
  }
}

export default Sidebar;
