import React, {Component} from 'react';

type Props = {
  columns: [],
  onMouseDown: {},
  row: {},
  selected: boolean
}

class ResizableTableRow extends Component<Props> {

  render() {
    const {row, columns, onMouseDown, selected} = this.props;

    const className = selected
      ? 'selected'
      : '';

    const values = columns.map((col) => {
      return (<td>{row[col]}</td>);
    });

    return (<tr onMouseDown={onMouseDown} className={className}>
      {values}
    </tr>);
  }
}

export default ResizableTableRow;
