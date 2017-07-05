import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { addQuery } from './history';
import NetworkComponent from './NetworkComponent';
import Card from './Card';
import DataTable from './DataTable';
import ErrorPanel from './ErrorPanel';
import PagedDataTableBar from './PagedDataTableBar';

export default class PagedDataTable extends Component {
  state = {};
  
  static get defaultProps() { return {defaultOrderDescending: true}; }

  // Load the up-to-date list each time the page is refreshed or loaded.
  componentDidMount = () => this.handleFetch() || this.setState({listener: browserHistory.listen(this.handleFetch)});
  componentWillUnmount = () => this.state.listener && this.state.listener();

  getDescending = () => {
    const { descending } = browserHistory.getCurrentLocation().query;
    return descending === undefined ? this.props.defaultOrderDescending : descending === 'true';
  }

  handleFetch = () => {
    const { pageNumber, pageSize, orderingKey } = browserHistory.getCurrentLocation().query;
    this.props.onFetch(pageNumber, pageSize, orderingKey || this.props.defaultOrderingKey, this.getDescending());
  }

  handleOrderingChanged = (orderingKey, descending) => addQuery({orderingKey, descending});

  render() {
    const { pageNumber, pageSize, orderingKey } = browserHistory.getCurrentLocation().query;
    const { mapping, rows, errorMessage, emptyTitle, onRowSelected, defaultOrderingKey, alwaysShowPaginationBar } = this.props;

    if (rows.data && !rows.data.length) {
      return <ErrorPanel title={emptyTitle} />;
    }
    
    const actualPageNumber = pageNumber < 1 || pageNumber > rows.numberOfPages ? 1 : pageNumber;
    const actualPageSize = pageSize < 1 || pageNumber > 10000 ? 50 : pageSize;

    return (
      <span>
        {rows.numberOfPages && (!rows.data || rows.totalCount > rows.data.length || alwaysShowPaginationBar) &&
        <PagedDataTableBar pageNumber={actualPageNumber} pageSize={actualPageSize} numberOfPages={rows.numberOfPages}
          onPageSizeChanged={pageSize => addQuery({pageSize})}
          onPageNumberChanged={pageNumber => addQuery({pageNumber})} />
        }
        <NetworkComponent errorMessage={errorMessage} data={rows.data}>
          <Card showHeading={false} table>
            <DataTable {...this.props} responsive startIndex={rows.startItemIndex + 1}
              mapping={mapping} data={rows.data} onRowSelected={onRowSelected}
              orderingKey={orderingKey || defaultOrderingKey} orderDescending={this.getDescending()} onOrderingChanged={this.handleOrderingChanged} />
          </Card>
        </NetworkComponent>
      </span>
    );
  }
}