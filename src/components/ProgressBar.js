import React, { Component } from "react";

type Props = {
  progress: number
};

// Stylized Slider
class ProgressBar extends Component<Props> {
  render() {
    const { progress, height } = this.props;
    return (
      <div className="progress_outer">
        <div
          className="progress"
          style={{
            width: progress + "%"
          }}
        />
      </div>
    );
  }
}

export default ProgressBar;
