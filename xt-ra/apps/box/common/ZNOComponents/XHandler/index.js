import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XHandler extends Component {
  constructor(props) {
    super(props);
  }

  handleMouseDown(event) {
    const { handleMouseDown } = this.props;
    const _this = this;
    handleMouseDown && handleMouseDown(event || window.event);
    document.onmousemove = function (e) {
      _this.handleMouseMove(e || window.event);
    };
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
      _this.handleMouseUp(e || window.event);
    };
  }

  handleMouseMove(event) {
    const { handleMouseMove } = this.props;
    handleMouseMove && handleMouseMove(event || window.event);
  }

  handleMouseUp(event) {
    const { handleMouseUp } = this.props;
    handleMouseUp && handleMouseUp(event || window.event);
  }

  handleMouseOut(event) {
    const { handleMouseOut } = this.props;
    handleMouseOut && handleMouseOut(event || window.event);
  }

  handleMouseOver(event) {
    const { handleMouseOver } = this.props;
    handleMouseOver && handleMouseOver(event || window.event);
  }

  render() {
    const {
            className,
            children,
            handleClick,
            handleDblClick,
            handleMouseOver,
            handleDrop,
            handleDragStart,
            handleDragOver,
            handleDragEnter,
            handleDragLeave,
            handleDragEnd,
            draggable,
            cursor,
            title
          } = this.props;
    const customClass = classNames('x-handler', className);
    const cursorStyle = {
      cursor
    };
    return (
      <div
        className={customClass}
        onClick={handleClick}
        onDoubleClick={handleDblClick}
        onMouseDown={this.handleMouseDown.bind(this)}
        onMouseOver={this.handleMouseOver.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        draggable={draggable}
        style={cursorStyle}
        title={title}
      >
        {children}
      </div>
    );
  }
}

XHandler.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func,
  handleDblClick: PropTypes.func,
  handleMouseDown: PropTypes.func,
  handleMouseOver: PropTypes.func,
  handleMouseOut: PropTypes.func,
  handleDrop: PropTypes.func,
  handleDragStart: PropTypes.func,
  handleDragOver: PropTypes.func,
  handleDragEnter: PropTypes.func,
  handleDragLeave: PropTypes.func,
  handleDragEnd: PropTypes.func,
  draggable: PropTypes.bool,
  cursor: PropTypes.string
};
