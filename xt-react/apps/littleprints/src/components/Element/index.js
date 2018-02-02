import { merge } from 'lodash';
import classNames from 'classnames';
import React, { Component } from 'react';
import { elementTypes } from '../../constants/strings';
// 导入组件
import Handler from '../Handler';
import * as events from './handler/events';

import './index.scss';

export default class Element extends Component {
  constructor(props) {
    super(props);

    this.onMouseUp = e => events.onMouseUp(this, e);
    this.onMouseEnter = e => events.onMouseEnter(this, e);
    this.onMouseOut = e => events.onMouseOut(this, e);
    this.onMouseOver = e => events.onMouseOver(this, e);
    this.onMouseLeave = e => events.onMouseLeave(this, e);

  }

  stopEvent(e) {
    e.stopPropagation();
  }
  render() {
    const { data, actions, children } = this.props;
    const { className, style, handlerStyle, setCursorDefault } = data;
    const elementClassName = classNames('element', className);

    const { element, product } = data;
    const guid = element.get('id');
    const { removeImage } = actions;

    // 定义接收事件层的数据和处理函数.
    const handlerData = {
      style: merge({}, handlerStyle, { cursor: element.get('encImgId') || element.get('type') === elementTypes.text ? 'pointer' : 'auto' }),
      element,
      product
    };
    setCursorDefault ? handlerData.style.cursor = 'default' : null;
    const handlerActions = merge({}, actions, {
      handleMouseUp: this.onMouseUp,
      handleMouseEnter: this.onMouseEnter,
      handleMouseOut: this.onMouseOut,
      handleMouseLeave: this.onMouseLeave,
      handleMouseOver: this.onMouseOver
    });

    // (element.get('type') === elementTypes.photo && !element.get('encImgId')
    const snapshotAttributes = {};
    const text = element.get('text');
    if ((element.get('type') === elementTypes.text && !text) ||
        (element.get('type') === elementTypes.photo && !element.get('encImgId')) ||
        (element.get('type') === elementTypes.paintedText && !text)
      ) {
      snapshotAttributes['data-html2canvas-ignore'] = true;
    }

    return (
      <div
        {...snapshotAttributes}
        className={elementClassName}
        style={style}
        data-guid={guid}
        ref={(div) => { this.element = div; }}
        onMouseUp={this.stopEvent}
      >
        {/* 选中样式 */}
        <div className="selected-border" data-html2canvas-ignore="true" />

        {children}

        {/* 接收事件层 */}
        <Handler data={handlerData} actions={handlerActions} />
      </div>
    );
  }
}

Element.propTypes = {
};
