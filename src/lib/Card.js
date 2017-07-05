import React from 'react';
import Button from './Button';

import '../css/Card.css';

export const CardHeading = ({ title, buttonTitle, onClick}) => (
  <div className="custom-card-header">
    <h4 className="header">{title}</h4>
    <Button sizeClass="btn-md" onClick={onClick}>{buttonTitle}</Button>
  </div>
);

const Card = ({ className, showHeading = true, heading, title, table, children, footer }) => (
  <div className={`${className || ''} card`}>
    {showHeading && (heading || title) && <div className="card-header">{heading || <span><strong>{title}</strong></span>}</div>}
    {table ? children : <div className="card-block">{children}</div>}
    {footer && <div className="card-footer">{footer}</div>}
  </div>
);
export default Card;