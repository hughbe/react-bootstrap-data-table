import React, { Component } from 'react';

import '../css/DataTable.css';

const getUnknownKeys = (rows) => Object.keys(rows).filter(key => key !== 'orderingKey' && key !== 'cellClassName' && key !== 'displayMapping');

const getHeader = (row) => {
  if (row.name) {
    return row.name;
  }

  const keys = getUnknownKeys(row);
  if (keys.length === 1) {
    return keys[0];
  }

  return row;
};

const DataTableHeader = ({ showIndex, mapping, selectionChecker, orderingKey, orderDescending, onOrderingChanged }) => (
  <thead>
    <tr>
      {showIndex && <th>#</th>}
      {mapping.map(row => {
        const rowName = getHeader(row);
        const rowValue = row.displayMapping ? row.displayMapping(rowName) : rowName;

        // The user can allow this column to be ordered by providing the field 'orderingKey'
        // in the mapping.
        if (row.orderingKey) {
          const handleClicked = event => {
            event.preventDefault();
            event.stopPropagation();

            // Toggle the ordering type or set it to descending by default.
            const descendingOrder = row.orderingKey === orderingKey ? !orderDescending : orderDescending;
            onOrderingChanged(row.orderingKey, descendingOrder);
          };

          // Emphasize the column if it is column we are currently using to order.
          const extra = row.orderingKey === orderingKey && (orderDescending ? '▼' : '▲');
          return <th key={rowName}><a href="#" onClick={handleClicked}>{rowValue}{extra}</a></th>;
        } else {
          return <th key={rowName}>{rowValue}</th>;
        }
      })}
      {selectionChecker && <th />}
    </tr>
  </thead>
);

const getValue = (row, data) => {
  // The user can pass a key selector, e.g. [{name: 'Name1', key: ...}].
  if (row.key) {
    // The user can pass a key function, e.g. [{name: 'Name1', key: d => d.otherName}].
    if (typeof row.key === 'function') {
      const returnValueKeyFunction = row.key(data);
      if (returnValueKeyFunction !== undefined) {
        return returnValueKeyFunction;
      }
    }

    // The user can pass a key identifier, e.g. [{name: 'Name1', key: 'otherName'}].
    const rowKeyString = String(row.key);
    if (rowKeyString) {
      const returnValueKeyIndexer = data[rowKeyString.trim()];
      if (returnValueKeyIndexer !== undefined) {
        return returnValueKeyIndexer;
      }

      const returnValueKeyIndexerLower = data[rowKeyString.toLowerCase().trim()];
      if (returnValueKeyIndexerLower !== undefined) {
        return returnValueKeyIndexerLower;
      }
    }
  }

  // The user can pass a name: e.g. [{name: 'Name1'}, {name: 'Name2'}].
  if (row.name) {
    const returnValueNameIndexer = data[row.name.trim()];
    if (returnValueNameIndexer !== undefined) {
      return returnValueNameIndexer;
    }

    const returnValueNameIndexerLower = data[row.name.toLowerCase().trim()];
    if (returnValueNameIndexerLower !== undefined) {
      return returnValueNameIndexerLower;
    }
  }

  // The user can pass a name directly, e.g. ['Name1', 'Name2'].
  const rowString = String(row);
  if (rowString) {
    const returnValueStringIndexer = data[rowString.trim()];
    if (returnValueStringIndexer !== undefined) {
      return returnValueStringIndexer;
    }

    const returnValueStringIndexerLower = data[rowString.toLowerCase().trim()];
    if (returnValueStringIndexerLower !== undefined) {
      return returnValueStringIndexerLower;
    }
  }

  // The use can pass a name and a function, e.g. [{'Name1': d => d.otherName}].
  const rowKeys = getUnknownKeys(row);
  if (rowKeys.length === 1) {
    const rowKeyFunction = row[rowKeys[0]];
    if (rowKeyFunction !== undefined) {
      return rowKeyFunction(data);
    }
  }

  // The user can pass a function, e.g. [d => d.otherName].
  if (typeof row === 'function') {
    return row(data);
  }

  // If we can't resolve it, try converting the current data object to a string.
  return String(data) || 'No Data';
};

const DataTableRow = ({ mapping, data, showIndex, index, rowClass, onRowSelected, isSelectable, onRowHovered, selectionChecker, selectedIndex, onMouseDown, tabIndex, startIndex }) => {
  // The user can provide a handler that is triggered each time a row is clicked.
  const selectableClass = isSelectable || onRowHovered ? 'selectable-row' : '';
  const handleRowClicked = (event) => {
    event && event.currentTarget.blur();
    event && event.stopPropagation();
    onRowSelected(data, index);
  };

  // The user can provide information as to whether a row is selected or not.
  const selectedCell = selectionChecker ? (selectionChecker(data, index) ? <td><span className="selected-cell">✓</span></td> : <td />) : undefined;
  const selectedClass = selectedIndex === index ? 'selected-row' : '';
  const actualTabIndex = tabIndex || (isSelectable || onRowSelected ? undefined : 0);

  // If the user pressed enter on the element, select it.
  const handleKeyPressed = (event) => event.key === 'Enter' && handleRowClicked();

  // The user can provide a custom class to the row.
  const customizedRowClass = (rowClass && rowClass(data, index)) || '';
  const rowClassName = `${selectableClass} ${selectedClass} ${customizedRowClass}`;

  // We need to add extra cells if we're showing the index on the left or the selection indicator on the right.
  return (
    <tr className={rowClassName} onMouseOver={() => onRowHovered && onRowHovered(data, index, true)} onMouseOut={() => onRowHovered && onRowHovered(data, index, false)}
      onMouseDown={() => onMouseDown(index)} onClick={handleRowClicked} tabIndex={actualTabIndex} onKeyPress={handleKeyPressed}>
      {showIndex && <td>{index + (startIndex || 1)}</td>}
      {mapping.map((row, index) => <td key={row.key || index} className={row.cellClassName}>{getValue(row, data)}</td>)}
      {selectedCell}
    </tr>
  );
};

class DataTable extends Component {
  state = {};

  static get defaultProps() {
    return {
      className: '',
      showHeader: true,
      showIndex: true,
      mapping: ['Data'],
      data: []
    };
  }

  handleRowSelected = (data, index) => {
    this.setState({selectedIndex: undefined});
    this.props.onRowSelected && this.props.onRowSelected(data, index);
  }
  
  // If the user starts clicking on the table, don't select it.
  handleRowMouseDown = (index) => this.props.onRowSelected && this.setState({selectedIndex: index});

  rows = () => {
    // Loop through the data and create rows.
    const rows = this.props.data.map((data, index) => (
      <DataTableRow key={index} {...this.props} data={data} index={index} selectedIndex={this.state.selectedIndex} onRowSelected={this.handleRowSelected} isSelectable={this.props.onRowSelected} onMouseDown={this.handleRowMouseDown} />
    ));

    // The user can provide a minimum size. Rows created adjust for whether we show the index or selection checker.
    const minPageSize = this.props.minSize;
    if (minPageSize && rows.length < minPageSize) {
      for (var i = rows.length; i < minPageSize; i++) {
        rows.push(<tr key={i} className='blank-row'>
          {this.props.showIndex && <td /> }
          {this.props.mapping.map((row, index) => <td key={row.key || index} />)}
          {this.props.selectionChecker && <td /> }
        </tr>);
      }
    }

    return rows;
  }

  render() {
    const { striped, responsive, className, containerClassName, title, showHeader } = this.props;

    // The user can customize whether the table is striped or not and provide additional styles to the table.
    const tableClassName = `table ${striped ? 'table-striped' : ''} ${className || ''}`;

    // Render the title, column names and then the rows.
    return (
      <section className={`data-table ${containerClassName || ''}`} >
        {title && <h2>{title}</h2>}
        <div className={responsive ? 'table-responsive' : ''}>
          <table className={tableClassName}>
            {showHeader && <DataTableHeader {...this.props} />}
            <tbody>
              {this.rows()}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
}
export default DataTable;