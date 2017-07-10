import React, { Component } from 'react';
import Card, { CardHeading } from './Card';
import DataTable from './DataTable';
import ErrorPanel from './ErrorPanel';
import NetworkComponent from './NetworkComponent';
import { arraysEqual } from './Utilities';

class SelectionList extends Component {
  constructor(props) {
    super(props);

    this.state = {defaultSelection: props.defaultSelection, selectedRows: []};  
  }

  // The user can provide a list of the initally selected rows. If none is provided, select all rows by default.
  componentDidMount = () => this.selectAll();

  // If the list of rows changed, select them all.
  componentDidUpdate = (prevProps) => {
    !arraysEqual(this.props.data, prevProps.data, this.isEqual) && this.selectAll();
  }

  isEqual = (a, b) => {
    // The user can supply a custom equality function.
    if (this.props.equalityFunction) {
      return this.props.equalityFunction(a, b);
    }

    // If no equality function is provided, fall back to a strict equality check.
    return a === b;
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const errorMessage = [];
    if (this.state.selectedRows.length === 0) {
      errorMessage.push(<p key='selection-empty'>Nothing was selected.</p>);
    }

    if (errorMessage.length === 0) {
      this.props.onSubmit(this.state.selectedRows);
      return true;
    }

    alert(errorMessage);
  }

  handleCardClicked = () => this.setRows(this.state.selectedRows.length ? [] : undefined);
  selectAll = () => {
    const data = this.props.data || [];
    if (this.state.defaultSelection) {
      const selectedRows = data.filter(d => this.state.defaultSelection.some(other => this.isEqual(d, other)));
      this.setState({selectedRows});
    } else {
      this.setState({selectedRows: data});
    }
  }

  isRowSelected = (row) => this.state.selectedRows.findIndex(other => this.isEqual(row, other)) !== -1;

  handleRowSelected = (row) => {
    // Selected: remove from the list of selected rows.
    // Not selected: add to the list of selected rows.
    this.setRows(this.isRowSelected(row)
      ? this.state.selectedRows.filter(other => !this.isEqual(row, other))
      : this.state.selectedRows.concat([row]));
  }

  setRows = (selectedRows) => {
    this.setState({selectedRows: selectedRows || this.props.data});
    this.props.onSelectionChanged && this.props.onSelectionChanged(selectedRows);
  }

  render() {
    const { title, emptyTitle, className, data, mapping, errorMessage, onSubmit } = this.props;

    // If nothing is selected, show a "Select All" button. Else show a "Clear" button.
    const cardButtonTitle = this.state.selectedRows.length === 0 ? 'All' : 'Clear';
    const cardHeading = <CardHeading title={this.props.title} buttonTitle={cardButtonTitle} onClick={this.handleCardClicked} />;

    return (
      <div className={`selection-list ${className}`}>
        <Card table heading={cardHeading}>
          {!data || data.length ?
          <form onSubmit={this.handleSubmit}>
            <NetworkComponent errorMessage={errorMessage} data={data}>
              <DataTable minSize={5} showIndex={false} showHeader={false} selectionChecker={this.isRowSelected}
                mapping={mapping} data={data} onRowSelected={this.handleRowSelected} />
            </NetworkComponent>
            {onSubmit &&
            <div className="card-footer">
              <input type="submit" className="btn btn-primary btn-block" value={title} />
            </div>
            }
          </form>
          :
          <ErrorPanel title={emptyTitle} />
          }
        </Card>
      </div>
    );
  }
}
export default SelectionList;