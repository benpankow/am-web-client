import React, { Component } from "react";

type Props = {
  columns: [],
  onMouseDown: {},
  row: {},
  selected: boolean,
  widths: [],
  highlight: boolean
};

// Individual row in resizable table
class ResizableTableRow extends Component<Props> {
  render() {
    const {
      row,
      columns,
      onMouseDown,
      selected,
      widths,
      highlight
    } = this.props;

    const className = selected ? "selected" : "";

    const values = columns.map((col, idx) => {
      const width = widths[idx] + "%";
      return (
        <td
          style={{
            width: width,
            maxWidth: 0
          }}
        >
          {row[col]}
        </td>
      );
    });

    return (
      <tr
        onMouseDown={onMouseDown}
        className={highlight ? className + " highlight" : className}
      >
        {values}
      </tr>
    );
  }
}

export default ResizableTableRow;
