import React from 'react';
import '../css/Button.css';

const Button = ({ sizeClass, typeClass, className, disabled, children, ...rest }) => {
  const fullClassName = `btn ${sizeClass || 'btn-lg'} ${typeClass || 'btn-secondary'} ${className || ''} ${disabled ? 'disabled' : ''}`;
  return <Anchor className={fullClassName} {...rest}>{children}</Anchor>;
};
export default Button;

export const Anchor = ({ className, onClick, children, dropdown }) => (
  <a href="#"
    className={className}
    data-toggle={dropdown && 'dropdown'}
    onClick={e => {e.preventDefault(); e.stopPropagation(); onClick && onClick(e);}}>
    {children}
  </a>
);

export const DropdownMenu = ({ children }) => <ul className="dropdown-menu">{children}</ul>;

export const Dropdown = ({ title, children }) => (
  <div className="btn-group">
    <Button className="dropdown-toggle" dropdown> {title}</Button>
    <DropdownMenu>{children}</DropdownMenu>
  </div>
);

export const ButtonDropdown = ({ onLeadingActionClick, leadingActionName, children }) => (
  <div className="btn-group">
    <Button onClick={onLeadingActionClick}>{leadingActionName}</Button>
    {children && children.length !== 0 && <Button className="dropdown-toggle" dropdown />}
    {children && children.length !== 0 && <DropdownMenu>{children}</DropdownMenu>}
  </div>
);

export const SubmitButton = ({ className, title }) => <input type="submit" className={`btn btn-primary ${className}`} value={title} />;

export const DropdownSeparator = () => <li role="separator" className="dropdown-divider" data-noembed />;

export const HoverInput = ({ valid, tooltipText, children }) => (
  <div className={`form-group ${valid ? '' : 'has-danger'}`}>
    <div className="input-group">
      {children}
      <div className="input-group-btn" data-toggle="tooltip" data-placement="left" title={tooltipText}>
        <button type="button" className="btn btn-secondary" aria-label="Help" tabIndex={-1}>
          <span className="glyphicon glyphicon-question-sign">?</span>
        </button>
      </div>
    </div>
  </div>
);