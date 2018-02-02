import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { merge } from 'lodash';

import { Image, Rect, Text, Group } from 'react-konva';
import { drawImage } from './handler/events';
import * as canvasOptions from '../../contants/canvas';
import * as helperHandler from '../../utils/canvas/helper';

class SpineTextElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImgLoading: false,
      imgAttrs: null
    };
  }

  componentDidMount() {
    const { element } = this.props;
    const imgUrl = element.getIn(['computed', 'imgUrl']);
    if (imgUrl) {
      drawImage(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    const oldImgUrl = oldElement.getIn(['computed', 'imgUrl']);
    const newImgUrl = newElement.getIn(['computed', 'imgUrl']);

    if (oldImgUrl !== newImgUrl) {
      drawImage(this, nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;
    if (
      !Immutable.is(oldElement, newElement) ||
      this.state.imgAttrs !== nextState.imgAttrs
    ) {
      return true;
    }

    return false;
  }

  setCursor(cursorStyle) {
    if (this.elementGroupNode) {
      this.elementGroupNode.getStage().content.style.cursor = cursorStyle;
    }
  }

  render() {
    const { element, actions, isPreview } = this.props;
    const { imgAttrs } = this.state;
    const {
      imgUrl,
      offset,
      x,
      y,
      width,
      height,
      zIndex
    } = helperHandler.getRenderElementOptions(element);
    const spineTextElementAttrs = {
      x,
      y,
      width,
      height,
      offset,
      zIndex,
      rotation: 0,
      draggable: false,
      name: 'element',
      ref: node => (this.elementGroupNode = node)
    };

    const hasImage = Boolean(imgUrl);
    const isSelected = element.get('isSelected');
    const elementId = element.get('id');
    const groupAttrs = merge({}, spineTextElementAttrs, {
      onClick: () => {
        actions.onClick(element);
      },
      onMouseEnter: (e) => {
        actions.onMouseEnter(element, e);
        this.setCursor('pointer');
      },
      onMouseLeave: (e) => {
        actions.onMouseLeave(element, e);
        this.setCursor('default');
      }
    });
    // //litterbook不显示 虚线
    // let spineFrameStyle = canvasOptions.defaultTextFrame;

    // // 有文字的时候未选中不显示外框
    // if (imgUrl && !isSelected) {
    //   spineFrameStyle = {};
    // }
    // 2.2 如果是text: 就渲染空的text文本框.
    // 加上默认空的文本框的设置
    const reactAttrs = merge({}, spineTextElementAttrs, {
      x: 0 + spineTextElementAttrs.offset.x,
      y: 0 + spineTextElementAttrs.offset.y,
      id: elementId
    });

    const childrenProps = {
      x: 0,
      y: 0,
      width: reactAttrs.width,
      height: reactAttrs.height
    };

    const blackRectProps = {
      ...childrenProps,
      // 虚线: 10px长, 5px的间隔.
      dash: [4, 4],
      strokeWidth: 1,
      stroke: '#000',
      id: elementId
    };

    const whiteRectProps = {
      ...childrenProps,
      strokeWidth: 1,
      stroke: '#fff'
    };

    return (
      <Group {...groupAttrs}>
        {imgUrl ? <Image {...imgAttrs} /> : null}
        <Rect {...reactAttrs} />

        {!hasImage && !isPreview ? <Rect {...whiteRectProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...blackRectProps} /> : null}
      </Group>
    );
  }
}

export default SpineTextElement;
