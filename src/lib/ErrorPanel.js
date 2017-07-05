import React from 'react';

import '../css/ErrorPanel.css';

const ErrorPanel = ({ fullWidth = true, title, message, children }) => (
  <div className={`error-panel ${fullWidth ? 'container-fluid' : 'container'}`}>
    <div className="jumbotron">
      <h1>{title || 'Something went wrong'}</h1>
      <p>{message}</p>
      {children}
    </div>
  </div>
);
export default ErrorPanel;