import React, { Component } from "react";
import ResizableTableRow from "./ResizableTableRow";
import VirtualList from "./VirtualList";

// Fraction of a percentage of total table width that resizing precision goes to
const RESIZE_FRAC = 15;

type Props = {
  columns: [], // List of column labels
  columnNames: [], // List of column display names corresponding to labels
  initialColumnSizes: [], // Initial percentage sizes of each column
  onClicked: {}, // Method to call when a row is clicked
  rows: [] // Rows
};

type State = {
  selected: ?string,
  columnSizes: [],
  sortColumn: number,
  sortInverted: boolean,
  listContainerRef: {}
};

// Table whose columns can be resized
class ResizableTable extends Component<Props, State> {
  state = {
    selected: null,
    columnSizes: [],
    sortColumn: 0,
    sortInverted: false,
    listContainerRef: null
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
    const { initialColumnSizes } = this.props;
    this.setState({ columnSizes: initialColumnSizes });
  }

  // Start resizing this column - bind mouse move/mouseup events
  beginResize = (idx, e) => {
    e.stopPropagation();
    this.dragStartX = e.clientX;
    document.body.onmousemove = e => {
      this.resize(idx, e);
    };
    document.body.onmouseup = e => {
      this.resizeDone(idx, e);
    };
  };

  // When mouse up, unbind mouse move/up events
  resizeDone = (idx, e) => {
    document.body.onmousemove = null;
    document.body.onmouseup = null;
  };

  // Recalculate column widths when mouse moves during resize
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

    // Compute change in this column's width
    let deltaWidth = e.clientX - left - widths[idx];
    deltaWidth = Math.min(deltaWidth, widths[idx + 1]);
    deltaWidth = Math.max(deltaWidth, -widths[idx]);

    widths[idx] += deltaWidth;
    widths[idx + 1] -= deltaWidth;

    // Round column size to nearest fraction of a percent
    let columnSizes = this.state.columnSizes;
    columnSizes[idx] =
      Math.ceil((RESIZE_FRAC * 100 * widths[idx]) / totalSize) / RESIZE_FRAC;

    // Total all columns, resize adjacent col to match
    let totalColumnSizes = 0;
    for (let i = 0; i < this.columnRefs.length; i++) {
      if (i != idx + 1) {
        totalColumnSizes += columnSizes[i];
      }
    }
    columnSizes[idx + 1] = 100 - totalColumnSizes;

    this.setState({ columnSizes: columnSizes });
  };

  // Select a given row - if that row is selected, process a click event
  selectOrClick = row => {
    const { onClicked } = this.props;
    const { selected } = this.state;

    if (selected == row.id) {
      onClicked(row);
    } else {
      this.setState({ selected: row.id });
    }
  };

  // Given a column index, update the sorting column/direction
  // If this column is already the current sorting column, invert direction
  updateSort = idx => {
    const { sortColumn, sortInverted } = this.state;
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
  };

  render() {
    const { selected, columnSizes, sortColumn, sortInverted } = this.state;
    let { rows, columns, columnNames, onClicked } = this.props;

    const sortColumnName = columns[sortColumn];

    // Sort rows based on chosen column
    rows.sort((row1, row2) => {
      let v1 = row1[sortColumnName];
      let v2 = row2[sortColumnName];
      if (v1 && v2 && typeof v1 == "string") {
        v1 = v1.toLowerCase();
        v2 = v2.toLowerCase();
      }
      if (v1 == v2) {
        return row1 > row2 ? 1 : -1;
      }
      if (sortInverted) {
        return v2 > v1 ? 1 : -1;
      } else {
        return v1 > v2 ? 1 : -1;
      }
    });

    return (
      <div>
        <table className="header">
          <thead>
            <tr>
              {columns.map((col, idx) => {
                const name = columnNames[idx];
                const resize = e => {
                  this.beginResize(idx, e);
                };
                const changeSort = e => {
                  this.updateSort(idx);
                };
                const width = columnSizes[idx] + "%";

                // If this column is used to sort, show sorting arrow
                let sortArrow = "";
                if (sortColumn == idx) {
                  if (sortInverted) {
                    sortArrow = <i className="material-icons">expand_more</i>;
                  } else {
                    sortArrow = <i className="material-icons">expand_less</i>;
                  }
                }

                return (
                  <th
                    key={col}
                    style={{
                      width: width
                    }}
                    ref={this.columnRefs[idx]}
                    onMouseDown={changeSort}
                  >
                    {name}
                    {sortArrow}
                    <div className="drag_bar" onMouseDown={resize} />
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>
        <div
          className="resizable_table_container"
          ref={c => {
            if (!this.state.listContainerRef) {
              this.setState({ listContainerRef: c });
              console.log("updatestate");
            }
          }}
        >
          <table className="resizable_table">
            <tbody>
              <VirtualList
                elementHeight={22}
                rows={rows}
                renderRow={(idx, row) => {
                  // Render each row
                  const click = () => {
                    this.selectOrClick(row);
                  };

                  return (
                    <ResizableTableRow
                      columns={columns}
                      row={row}
                      onMouseDown={click}
                      selected={row.id == selected}
                      key={"$_" + row.id + "_" + row.name}
                      widths={columnSizes}
                      highlight={idx % 2 == 0}
                    />
                  );
                }}
                parentRef={this.state.listContainerRef}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ResizableTable;
