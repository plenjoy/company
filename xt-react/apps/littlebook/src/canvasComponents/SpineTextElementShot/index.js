import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { merge } from 'lodash';

import { Image, Rect, Text, Group } from 'react-konva';
import { drawImage } from './handler/events';
import * as canvasOptions from '../../contants/canvas';
import * as helperHandler from '../../utils/canvas/helper';
class SpineTextElementShot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImgLoading: false,
      imgAttrs: null
    };
  }

  componentDidMount() {
    const { element, } = this.props;
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
      if (newElement.get('text')) {
        drawImage(this, nextProps);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;
    if (!Immutable.is(oldElement, newElement) ||
      this.state.imgAttrs !== nextState.imgAttrs) {
      return true;
    }

    return false;
  }


  render() {
    const { element, actions } = this.props;
    const { imgAttrs } = this.state;
    const {
      imgUrl,
      offset,
      x,
      y,
      width,
      height,
      zIndex,
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
    };
    const isSelected = element.get('isSelected');
    const elementId = element.get('id');
    const groupAttrs = merge(
      {},
      spineTextElementAttrs
      );
    let spineFrameStyle = canvasOptions.defaultTextFrame;

    // 有文字的时候未选中不显示外框
    if (imgUrl && !isSelected) {
      spineFrameStyle = {};
    }
    // 2.2 如果是text: 就渲染空的text文本框.
    // 加上默认空的文本框的设置
    const reactAttrs = merge({}, spineTextElementAttrs, spineFrameStyle, {
      x: 0 + spineTextElementAttrs.offset.x,
      y: 0 + spineTextElementAttrs.offset.y,
      id: elementId
    });


    return (
      <Group {...groupAttrs}>
        {
        imgUrl ? <Image {...imgAttrs} /> : null
       }
        <Rect {...reactAttrs} />
      </Group>

    );
  }
}


export default SpineTextElementShot;
