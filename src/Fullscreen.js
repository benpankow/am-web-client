import React, { Component } from "react";
import MusicKit from "./musickitService";
import { fetchSongList, getCachedSongList } from "./mediaFetcher";
import { playMedia, formatTimeMs, playParams } from "./playerUtils";
import { getLSValueWithDefault, setLSValue } from "./localStorage";

type Props = {
  music: MusicKit,
  settings: {}
};

type State = {
  queue: {},
  curQueuePos: number,

  lastQueuePos: number
};

class Fullscreen extends Component<Props, State> {
  state = {
    queue: {},
    curQueuePos: 0,
    lastQueuePos: 0
  };

  componentDidMount() {
    const { music } = this.props;

    music.addEventListener("queueItemsDidChange", this.queueUpdate);
    music.addEventListener("queuePositionDidChange", this.queueUpdate);

    this.queueUpdate = this.queueUpdate.bind(this);
    this.queueUpdate();
  }

  componentWillUnmount() {
    const { music } = this.props;
    music.removeEventListener("queueItemsDidChange", this.queueUpdate);
    music.removeEventListener("queuePositionDidChange", this.queueUpdate);
  }

  queueUpdate = () => {
    const { music } = this.props;
    const { queue, curQueuePos } = this.state;

    this.setState({
      queue: music.player.queue,
      curQueuePos: music.player.queue._position,
      lastQueuePos: curQueuePos
    });
  };

  renderSong = (i, key, song, buffer) => {
    const { queue, lastQueuePos } = this.state;

    const url = song.attributes.artwork.url;
    const urlFormatted = url.replace("{w}", 500).replace("{h}", 500);

    const size = i == 0 ? 500 : 400 - Math.abs(i) * 25;
    const top = i == 0 ? 0 : (500 - size) / 2;
    const position =
      -(size / 2) +
      Math.pow(Math.abs(i), 0.7) * Math.sign(i) * 125 +
      500 +
      Math.sign(i) * 125;

    const zindex = 10 - Math.abs(i);
    const hidden = Math.abs(i) == buffer;

    let side = "";
    if (Math.sign(i) == 1) {
      side = " left";
    } else if (Math.sign(i) == -1) {
      side = " right";
    }

    return (
      <img
        className={
          "fullscreen_album_art" +
          (hidden ? " hidden" : "") +
          side +
          (lastQueuePos > queue._position ? " decreasing" : "")
        }
        key={key}
        src={urlFormatted}
        style={{
          width: size,
          height: size,
          position: "absolute",
          left: position,
          top: top,
          zIndex: zindex,
          boxShadow: "2px 2px 10px 0px rgba(0, 0, 0, 0.5)"
        }}
      />
    );
  };

  render() {
    const { music, settings } = this.props;
    const { queue } = this.state;

    if (!queue || !queue._items) {
      return "";
    }

    const albumsToDisplay = [];

    const buffer = 5;
    const baseIdx = queue._position - buffer;
    for (let i = 0; i < buffer * 2 + 1; i++) {
      let value = "";
      if (baseIdx + i >= 0 && baseIdx + i < queue._items.length) {
        const song = queue._items[baseIdx + i];
        value = this.renderSong(i - buffer, baseIdx + i, song, buffer);
      }
      albumsToDisplay.push(value);
    }

    const currentSong = queue._items[queue._position];
    console.log(currentSong);

    return (
      <div className="fullscreen_container">
        <div className="fullscreen_container_inner">
          <div>{albumsToDisplay}</div>
        </div>
      </div>
    );
  }
}

export default Fullscreen;
