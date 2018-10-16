timport React, { Component } from "react";
import Checkbox from "./components/Checkbox";

import MusicKit from "./musickitService";
import "./style/checkbox.css";

type Props = {};

type State = {
  decibels: number
};

class Viz extends Component<Props> {
  state = {
    decibels: 0
  };

  refresh = () => {
    const max = this.analyser.maxDecibels;
    const min = this.analyser.minDecibels;
    this.analyser.getByteFrequencyData(this.frequencyData);

    var totalLoudness = 0;
    for (var i = 0; i < this.frequencyData.length; i++) {
      totalLoudness += this.frequencyData[i];
    }

    //Average loudness of all frequencies in frequencyData on scale from 0 to 255
    var averageLoudness = totalLoudness / this.frequencyData.length / 255;

    //Decibels
    var decibels = min + averageLoudness * Math.abs(min - max);
    this.setState({ decibels: decibels });
  };

  render() {
    const audioElement = document.getElementsByTagName("audio")[0];
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioSrc = audioCtx.createMediaElementSource(audioElement);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", audioElement.src, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(e) {
      console.log(this.status);
      if (this.status == 200) {
        audioCtx.decodeAudioData(
          this.response,
          buf => {
            console.log(buf);
          },
          g => {
            console.log(g);
          }
        );
      }
    };
    xhr.send();
    console.log("sent");

    return <div>{this.state.decibels}</div>;
  }
}

export default Viz;
