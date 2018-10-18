import React, { Component } from "react";
import "../style/slider.scss";

type Props = {
  progress: {},
  onChange: {},
  width: number,
  min: number,
  max: number
};

// Stylized Slider
class Slider extends Component<Props> {
  render() {
    const { progress, onChange, min, max } = this.props;
    return (
      <input
        type="range"
        min={min}
        max={max}
        value={progress}
        onChange={onChange}
      />
    );
  }
}

export default Slider;
