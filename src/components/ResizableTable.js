import React, {Component} from 'react';
import ResizableTableRow from './ResizableTableRow';

type Props = {
  columns: [],
  columnNames: [],
  initialColumnSizes: [],
  onClicked: {},
  rows: []
}

type State = {
  selected:
    ?string,
  columnSizes: [],
  sortColumn: number,
  sortInverted: boolean
}

class ResizableTable extends Component<Props, State> {
  state = {
    selected: null,
    columnSizes: [],
    sortColumn: 0,
    sortInverted: false
  };
  dragStartX = 0;
  baseWidths = 0;

  constructor(props) {
    super(props);
    this.columnRefs = [];
    for (let i = 0; i < this.props.columns.length; i++) {
      this.columnRefs.push(React.createRef());
    }
  }

  componentDidMount() {
    const {initialColumnSizes} = this.props;
    this.setState({columnSizes: initialColumnSizes});
  }

  resize = (idx, e) => {
    let left = 0;
    let currentElem = this.columnRefs[idx].current;
    while (currentElem != null) {
      left += currentElem.offsetLeft;
      currentElem = currentElem.parentElement;
    }

    let totalSize = 0;
    let widths = [];
    for (let i = 0; i < this.columnRefs.length; i++) {
      const w = this.columnRefs[i].current.offsetWidth;
      totalSize += w;
      widths.push(w);
    }

    let deltaWidth = (e.clientX - left) - widths[idx];
    deltaWidth = Math.min(deltaWidth, widths[idx + 1]);
    deltaWidth = Math.max(deltaWidth, -widths[idx]);

    widths[idx] += deltaWidth;
    widths[idx + 1] -= deltaWidth;

    let columnSizes = this.state.columnSizes;
    columnSizes[idx] = Math.ceil(15 * 100. * widths[idx] / totalSize) / 15;

    let totalColumnSizes = 0;
    for (let i = 0; i < this.columnRefs.length; i++) {
      if (i != idx + 1) {
        totalColumnSizes += columnSizes[i];
      }
    }
    columnSizes[idx + 1] = 100 - totalColumnSizes;

    this.setState({columnSizes: columnSizes});
  }

  resizeDone = (idx, e) => {
    document.body.onmousemove = null;
    document.body.onmouseup = null;
  }

  beginResize = (idx, e) => {
    this.dragStartX = e.clientX;
    document.body.onmousemove = (e) => {
      this.resize(idx, e);
    };
    document.body.onmouseup = (e) => {
      this.resizeDone(idx, e);
    };
  }

  selectOrClick = (row) => {
    const {onClicked} = this.props;
    const {selected} = this.state;

    if (selected == row.id) {
      onClicked(row);
    } else {
      this.setState({selected: row.id});
    }
  }

  updateSort = (idx) => {
    const {sortColumn, sortInverted} = this.state;
    if (sortColumn == idx) {
      this.setState({
        sortInverted: !sortInverted
      });
    } else {
      this.setState({
        sortColumn: idx,
        sortInverted: false
      });
    }
  }

  render() {
    const {selected, columnSizes, sortColumn, sortInverted} = this.state;
    let {rows, columns, columnNames, onClicked} = this.props;

    const sortColumnName = columns[sortColumn];
    rows.sort((row1, row2) => {
      let v1 = row1[sortColumnName];
      let v2 = row2[sortColumnName];
      if (v1 && v2 && typeof v1 == 'string') {
        v1 = v1.toLowerCase();
        v2 = v2.toLowerCase();
      }
      if (v1 == v2) {
        return (row1 > row2 ? 1 : -1);
      }
      if (sortInverted) {
        return (v2 > v1 ? 1 : -1)
      } else {
        return (v1 > v2 ? 1 : -1);
      }
    });

    return (<div>
      <table className='header'>
        <thead>
          <tr>
            {
              columns.map((col, idx) => {
                const name = columnNames[idx];
                const resize = (e) => {
                  this.beginResize(idx, e)
                };
                const changeSort = (e) => {
                  this.updateSort(idx);
                };
                const width = columnSizes[idx] + '%';

                return (<th key={col} style={{
                    width: width
                  }} ref={this.columnRefs[idx]} onMouseDown={changeSort}>{name}
                  <div className='drag_bar' onMouseDown={resize}/>
                </th>);
              })
            }
          </tr>
        </thead>
      </table>
      <div className='resizable_table_container'>
        <table className='resizable_table'>
          <colgroup>
            {
              columns.map((col, idx) => {
                const width = columnSizes[idx] + '%';

                return (<col style={{
                    width: width
                  }}/>);
              })
            }
          </colgroup>
          <tbody>
            {
              rows.map((row, idx) => {
                const click = () => {
                  this.selectOrClick(row)
                };
                return (<ResizableTableRow columns={columns} row={row} onMouseDown={click} selected={row.id == selected}/>);
              })
            }</tbody>
        </table>
      </div>
    </div>);

  }
}

export default ResizableTable;
