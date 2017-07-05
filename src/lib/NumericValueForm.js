import React, { Component } from 'react';

export default class NumericValueForm extends Component {
  static get defaultProps() { return {required: true}; }

  constructor(props) {
    super(props);
    this.state = {value: props.value};
  }

  componentWillReceiveProps(nextProps) {
    // The user can directly set the value of the input to display.
    this.setState({value: nextProps.value, began: true});
  }

  handleChange = (event) => this.setState({value: event.target.value, began: true});

  handleSubmit = (event) => {
    event.preventDefault();
    const value = typeof this.state.value === 'string' ? this.state.value.trim() : this.state.value;

    const errorMessage = [];
    const pageSize = parseInt(value, 10);
    if (isNaN(pageSize)) {
      errorMessage.push(<p key='not-int'>{this.props.name} must be an integer.</p>);
    } else if (this.props.minValue && pageSize < this.props.minValue) {
      errorMessage.push(<p key='too-small'>{this.props.name} must be greater than or equal to {this.props.minValue}.</p>);
    } else if (this.props.maxValue && pageSize > this.props.maxValue) {
      errorMessage.push(<p key='too-big'>{this.props.name} must be less than or equal to {this.props.maxValue}.</p>);
    }
    
    if (errorMessage.length === 0) {
      if (this.props.onSubmit) {
        this.props.onSubmit(value);
      }
      return true;
    }

    alert(errorMessage);
  }

  isValid = () => {
    if (!this.state.began) {
      return true;
    }

    const value = this.state.value;
    return !isNaN(parseInt(value, 10)) &&
           (!this.props.minValue || value >= this.props.minValue) &&
           (!this.props.maxValue || value <= this.props.maxValue);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={`form-inline ${this.props.className || ''}`}>
        <div className={'input-group ' + (this.isValid() ? '' : 'has-danger')}>
          <input type="number" className="form-control" placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} min={this.props.minValue} max={this.props.maxValue} required={this.props.required} />
          <span className="input-group-btn" role="group">
            <input type="submit" className="btn btn-primary" value={this.props.action}/>
          </span>
        </div>
      </form>
    );
  }
}