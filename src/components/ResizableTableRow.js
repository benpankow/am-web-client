import React, { Component } from "react";

type Props = {
  columns: [],
  onMouseDown: {},
  row: {},
  selected: boolean
};

// Individual row in resizable table
class ResizableTableRow extends Component<Props> {
  render() {
    const { row, columns, onMouseDown, selected } = this.props;

    const className = selected ? "selected" : "";

    const values = columns.map(col => {
      return <td>{row[col]}</td>;
    });

    return (
      <tr onMouseDown={onMouseDown} className={className}>
        {values}
      </tr>
    );
  }
}

export default ResizableTableRow;
