import { merge, get } from 'lodash';
import classNames from 'classnames';
import { DraggableCore } from 'react-draggable';
import React, { Component, PropTypes } from 'react';

// 导入组件
import Handler from '../Handler';
import * as events from './handler/events';

import './index.scss';


export default class Element extends Component {
  constructor(props) {
    super(props);

    // dragable处理函数
    this.onDragStart = e => events.onDragStart(this, e);
    this.onDrag = (e, draggableData) => events.onDrag(this, e, draggableData);
    this.onDragStop = e => events.onDragStop(this, e);

    // 缩放的处理函数
    this.onResizeStart = e => events.onResizeStart(this, e);
    this.onResize = (dir, e, draggableData) => events.onResize(this, dir, e, draggableData);
    this.onResizeStop = e => events.onResizeStop(this, e);

    // 旋转的处理函数
    this.onRotateStart = e => events.onRotateStart(this, e);
    this.onRotate = (e, draggableData) => events.onRotate(this, e, draggableData);
    this.onRotateStop = e => events.onRotateStop(this, e);

    this.onMouseDown = e => events.onMouseDown(this, e);

    this.onClick = e => events.onClick(this, e);
  }

  render() {
    const { data, actions, children } = this.props;
    const { className, style, handlerStyle, elementAttrs } = data;
    const elementClassName = classNames('element', className);

    const { element, title } = data;
    const guid = get(element, 'id');


    // 定义接收事件层的数据和处理函数.
    const handlerData = {
      style: merge({}, handlerStyle, { cursor: 'pointer' }),
      element
    };
    const handlerActions = merge({}, actions, {
      handleContextMenu: this.onContextMenu,
      handleClick: this.onClick }
    );

    return (
      <div className="element-container" title={title}>
        <DraggableCore
          axis="both"
          disabled={false}
          onStart={this.onDragStart}
          onDrag={this.onDrag}
          onStop={this.onDragStop}
          onMouseDown={this.onMouseDown}
        >
          <div
            className={elementClassName}
            style={style}
            data-guid={guid}
            ref={(div) => { this.element = div; }}
            {...elementAttrs}
          >
            {children}

            {/* 接收事件层 */}
            <Handler data={handlerData} actions={handlerActions} />
          </div>
        </DraggableCore>
      </div>
    );
  }
}

Element.propTypes = {
};
