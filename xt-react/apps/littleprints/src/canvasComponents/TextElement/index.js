import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import { Group, Image, Rect, Text } from 'react-konva';

import TextWarnTip from '../TextWarnTip';
import { downloadStatus } from '../../constants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import TextLoading from '../TextLoading';
import LoadFailed from '../LoadFailed';

class TextElement extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    if (
      !Immutable.is(oldElement, newElement) ||
      this.props.imageObj !== nextProps.imageObj ||
      this.props.isShowTextNotFit !== nextProps.isShowTextNotFit ||
      this.props.isShowTextOverflow !== nextProps.isShowTextOverflow ||
      this.props.downloadStatus !== nextProps.downloadStatus
    ) {
      return true;
    }

    return false;
  }

  render() {
    const {
      element,
      isPreview,
      imageObj,
      isShowTextNotFit,
      isShowTextOverflow,
      actions,
      tryToDownload,
      isScreenshot
    } = this.props;

    const {
      imgUrl,
      offset,
      x,
      y,
      width,
      height,
      zIndex
    } = helperHandler.getRenderElementOptions(element);

    const hasImage = Boolean(imgUrl);
    const isSelected = element.get('isSelected');
    const elementId = element.get('id');

    const textElementGroupProps = {
      x,
      y,
      width,
      height,
      offset,
      zIndex,
      ref: node => (this.elementGroupNode = node),
      rotation: element.get('rot'),
      draggable: false,
      name: 'element',
      onMouseDown: (e) => {
        this.isSelecting = true;
      },
      onMouseUp: (e) => {
        if (this.isSelecting) {
          this.isSelecting = false;
          actions.onMouseUp(element, e);
        }
      },
      onMouseEnter: (e) => {
        actions.onMouseEnter(element, e);
      },
      onMouseLeave: (e) => {
        actions.onMouseLeave(element, e);
      },
      onMouseOver: (e) => {
        actions.onMouseOver(this.elementGroupNode, element, e);
      },
      onMouseOut: (e) => {
        actions.onMouseOut(this.elementGroupNode, e);
      },
      onMouseMove: (e) => {
        actions.onMouseMove(element, e);
      }
    };

    const childrenProps = {
      x: 0,
      y: 0,
      width,
      height
    };
    const textLoadProps = {
      width,
      height
    };
    const loadFailProps = {
      width,
      height,
      tryToDownload
    };

    const imageProps = {
      ...childrenProps,
      image: imageObj,
      id: elementId
    };

    const selectedBorderProps = {
      ...childrenProps,
      stroke: '#4CC1FC',
      strokeWidth: 1
    };

    const blackRectProps = {
      ...childrenProps,
      // 虚线: 10px长, 5px的间隔.
      dash: [4, 4],
      strokeWidth: 1,
      id: elementId
    };

    const whiteRectProps = {
      ...childrenProps,
      strokeWidth: 1,
      stroke: '#fff'
    };

    if (!isSelected) {
      blackRectProps.stroke = '#000';
    } else {
      blackRectProps.stroke = '#4CC1FC';
    }

    const TextWarnTipProps = {
      parentHeight: height,
      isShowTextNotFit,
      isShowTextOverflow
    };
    return (
      <Group {...textElementGroupProps}>
        {isSelected && hasImage ? <Rect {...selectedBorderProps} /> : null }

        {hasImage ? <Image {...imageProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...whiteRectProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...blackRectProps} /> : null}

        {hasImage && !isPreview && (isShowTextNotFit || isShowTextOverflow) && !isScreenshot ? (
          <TextWarnTip {...TextWarnTipProps} />
        ) : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOADING && !isScreenshot ? (
          <TextLoading {...textLoadProps} />
        ) : null}
        {this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL && !isScreenshot ? (
          <LoadFailed {...loadFailProps} />
        ) : null}
      </Group>
    );
  }
}

TextElement.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map),
  isPreview: PropTypes.bool,
  imageObj: PropTypes.object,
  isShowTextNotFit: PropTypes.bool,
  isShowTextOverflow: PropTypes.bool,
  downloadStatus: PropTypes.number
};

export default TextElement;
