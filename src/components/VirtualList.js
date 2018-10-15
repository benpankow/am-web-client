import React, { Component } from "react";

const PADDING_ELEMS = 10;

type Props = {
  elementHeight: number,
  rows: [],
  renderRow: {},
  parentRef: {}
};

type State = {
  parentSize: number,
  scrollPos: number
};

// Renders a large list of elements in an efficient manner by only showing those
// that appear in the viewport
class VirtualList extends Component<Props, State> {
  state = {
    parentSize: 0,
    scrollPos: 0
  };

  componentDidMount() {
    const { elementHeight, rows, renderRow, parentRef } = this.props;
  }

  componentDidUpdate(prevProps) {
    const { elementHeight, rows, renderRow, parentRef } = this.props;
    const { parentSize } = this.state;

    if (parentSize == 0 && parentRef) {
      console.log(parentRef.offsetHeight);
      this.setState({ parentSize: parentRef.offsetHeight });
      parentRef.addEventListener("scroll", this.scroll);
      window.addEventListener("resize", this.recalculateParentSize);
    }
  }

  recalculateParentSize = e => {
    const { parentRef } = this.props;
    console.log(parentRef.offsetHeight);
    this.setState({ parentSize: parentRef.offsetHeight });
  };

  scroll = e => {
    const { parentRef } = this.props;

    this.setState({ scrollPos: parentRef.scrollTop });
  };

  render() {
    const { elementHeight, rows, renderRow, parentRef } = this.props;
    const { parentSize, scrollPos } = this.state;

    // Calculate number of rows to render to fill the window
    const numberVisibleRows = Math.ceil(parentSize / elementHeight);

    // Find index of first element to render, and offset to show it at
    const startPos = Math.floor(scrollPos / elementHeight);
    const offset = ((scrollPos / elementHeight) % 1) * elementHeight;

    const numPrecedingElements = Math.min(startPos, PADDING_ELEMS);

    const numToRender = numberVisibleRows + PADDING_ELEMS;

    // Attempt to render enough elements to fit the screen, plus some padding
    // elements on either end to account for fast scrolling
    const startRender = startPos - numPrecedingElements;
    const endRender = startPos + numToRender;

    let renderedRows = [];
    for (let i = startRender; i < endRender && i < rows.length; i++) {
      renderedRows.push(renderRow(i, rows[i]));
    }

    return (
      <div
        style={{
          height: rows.length * elementHeight
        }}
        className="virtual_list_outer"
      >
        <div
          style={{
            top: scrollPos - offset - numPrecedingElements * elementHeight
          }}
          className="virtual_list_inner"
        >
          {renderedRows}
        </div>
      </div>
    );
  }
}

export default VirtualList;
