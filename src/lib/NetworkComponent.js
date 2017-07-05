import React from 'react';
import ErrorPanel from './ErrorPanel';
import LoadingIndicator from './LoadingIndicator';

const NetworkComponent = ({ className, data, errorMessage, children }) => (
  <span className={className}>
    {errorMessage ? <ErrorPanel message={errorMessage} /> : data ? children : <LoadingIndicator />}
  </span>
);
export default NetworkComponent;