import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      children,
      className,
      onClicked,
      width,
      height,
      disabled
    } = this.props;
    const customClass = classNames('button', className, {
      disabled
    });

    return (
      <button
        className={customClass}
        onClick={ onClicked }
        style={{
          width: width ? width + 'px' : "",
          height: height ? height + 'px' : ""
        }}
        disabled={disabled}
      >
        { children }
      </button>
    );
  }
}

XButton.propTypes = {
  onClicked: PropTypes.func,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  disabled: PropTypes.bool
};
