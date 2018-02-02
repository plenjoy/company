import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';

import './index.scss';

class FontUrl extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(event) {
    const { onSelect, option } = this.props;
    onSelect(option, event);
    event.preventDefault();
    event.stopPropagation();
  }

  handleMouseEnter(event) {
    const { onFocus, option } = this.props;
    onFocus(option, event);
  }

  handleMouseMove(event) {
    const { onFocus, option } = this.props;
    onFocus(option, event);
  }

  render() {
    const { className } = this.props;
    const { label, title, fontThumbnailUrl, disabled } = this.props.option;

    const fontOptionStyle = classNames(className, {
      'font-option-disabled': disabled
    });
    return (
      <div
        className={fontOptionStyle}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={title}
      >
        <img src={fontThumbnailUrl} alt="" />
      </div>
    );
  }
}

FontUrl.propTypes = {
  option: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string.isRequired,
    fontThumbnailUrl: PropTypes.string.isRequire
  }).isRequired,
};

export default FontUrl;
