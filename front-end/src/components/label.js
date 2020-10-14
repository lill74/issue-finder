import React, { Component } from 'react';

class Label extends Component {
  state = {
    colorState: 'disabled',
    colorSet: {
      enabled: '#32a852',
      disabled: '#adb5bd',
    },

    [this.props.Bkey]: false,
  };

  handleOnClick = (e) => {
    if (!this.state[this.props.Bkey]) {
      this.setState({ [this.props.Bkey]: true });
      this.setState({ colorState: 'enabled' }, () =>
        this.handleStateCallback()
      );
    } else if (this.state[this.props.Bkey]) {
      this.setState({ [this.props.Bkey]: false });
      this.setState({ colorState: 'disabled' }, () =>
        this.handleStateCallback()
      );
    }
  };

  handleStateCallback = () => {
    this.props.onLabelClick(
      { [this.props.Bkey]: this.state[this.props.Bkey] },
      this.props.Bkey
    );
  };

  render() {
    return (
      <span
        className="badge badge-pill badge-primary search-tag"
        style={{ backgroundColor: this.state.colorSet[this.state.colorState] }}
        onClick={this.handleOnClick}
      >
        {this.props.text}
      </span>
    );
  }
}

export default Label;
