import React from 'react';
import PageControl from './PageControl';
import NumericValueForm from './NumericValueForm';

import '../css/PagedDataTableBar.css';

const PagedDataTableBar = ({ pageNumber = 1, pageSize = 1, numberOfPages = 1, showPageNumberForm = true, showPageSizeForm = true, onPageNumberChanged, onPageSizeChanged }) => (
  <div className="paged-data-bar mb-3">
    <PageControl className="paged-form" pageNumber={pageNumber} pageSize={pageSize} numberOfPages={numberOfPages} onPageChanged={onPageNumberChanged} />
    {showPageNumberForm &&
      <NumericValueForm className="paged-form" name="Page Number" placeholder="Page Number" action="Go To Page"
        value={pageNumber} minValue={1} maxValue={numberOfPages} onSubmit={onPageNumberChanged} />
    }
    {showPageSizeForm &&
      <NumericValueForm className="paged-form" name="Page Size" placeholder="Page Size" action="Change Page Size"
        value={pageSize} minValue={1} maxValue={500} onSubmit={onPageSizeChanged} />
    }
  </div>
);
export default PagedDataTableBar;