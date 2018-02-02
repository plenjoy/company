import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import './index.scss';

export default class XPopover extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, children, shown, offset } = this.props;
    const customClass = classNames('x-popover', className, { 'show': shown });
    const style = {
      top: `${offset.top}px`,
      left: `${offset.left}px`
    };

    return (
      <div className={customClass} style={style}>
        {children}
      </div>
    );
  }
}

XPopover.propTypes = {
  className: PropTypes.string,

  // Popover是否显示, true为显示
  shown: PropTypes.bool,

  // 触发Popover显示的事件, 默认为click
  event: PropTypes.string,

  // Popover显示时所在的位置.
  offset: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  })
};
