import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import * as handler from './handler';

import { elementTypes } from '../../contants/strings';

import './index.scss';

export default class Handler extends Component {
  constructor(props) {
    super(props);

    this.onHandleMouseMove = event => handler.onHandleMouseMove(this, event);
    this.onHandleMouseUp = event => handler.onHandleMouseUp(this, event);
    this.onHandleMouseOut = event => handler.onHandleMouseOut(this, event);
    this.onHandleMouseEnter = event => handler.onHandleMouseEnter(this, event);
    this.onHandleMouseLeave = event => handler.onHandleMouseLeave(this, event);
    this.onHandleMouseOver = event => handler.onHandleMouseOver(this, event);
    this.onHandleMouseDown = event => handler.onHandleMouseDown(this, event);
    this.onHandleDblClick = event => handler.onHandleDblClick(this, event);
  }

  render() {
    const { actions, data, children } = this.props;
    const {
      handleClick,
      handleMouseOver,
      handleDrop,
      handleDragStart,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDragEnd,
      handleContextMenu
    } = actions;

    const { className, draggable, style, element } = data;

    const customClass = classNames('x-handler', className);

    const tooltipAttr = {};
    if (element.get('type') === elementTypes.photo) {
      tooltipAttr['data-tip'] = true;
    }

    return (
      <div
        style={style}
        className={customClass}
        onClick={handleClick}
        onDoubleClick={this.onHandleDblClick}
        onMouseDown={this.onHandleMouseDown}
        onMouseOver={this.onHandleMouseOver}
        onMouseOut={this.onHandleMouseOut}
        onMouseEnter={this.onHandleMouseEnter}
        onMouseLeave={this.onHandleMouseLeave}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        draggable={draggable}
        onContextMenu={handleContextMenu}
        {...tooltipAttr}
      >
        {children}
      </div>
    );
  }
}

Handler.propTypes = {
  actions: PropTypes.shape({
    handleClick: PropTypes.func,
    handleDblClick: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func,
    handleMouseEnter: PropTypes.func,
    handleDrop: PropTypes.func,
    handleDragStart: PropTypes.func,
    handleDragOver: PropTypes.func,
    handleDragEnter: PropTypes.func,
    handleDragLeave: PropTypes.func,
    handleDragEnd: PropTypes.func,
    handleContextMenu: PropTypes.func
  }),
  data: PropTypes.shape({
    className: PropTypes.string,
    draggable: PropTypes.bool,
    cursor: PropTypes.string
  })
};
