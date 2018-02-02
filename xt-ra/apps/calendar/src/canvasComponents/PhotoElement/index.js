import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { Group, Image, Rect, Text } from 'react-konva';

import PhotoWarnTip from '../PhotoWarnTip';
import {
  RESIZE_LIMIT,
  shapeType,
  downloadStatus
} from '../../constants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import TextLoading from '../TextLoading';
import LoadFailed from '../LoadFailed';

class PhotoElement extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    if (
      !Immutable.is(oldElement, newElement) ||
      this.props.imageObj !== nextProps.imageObj ||
      this.props.downloadStatus !== nextProps.downloadStatus
    ) {
      return true;
    }

    return false;
  }

  render() {
    const {
      element,
      imageObj,
      isPreview,
      t,
      actions,
      tryToDownload,
      isBookCoverInnerWarp,
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
    const border = element.getIn(['computed', 'border']);
    const borderSize = border ? border.get('size') : 0;

    const photoElementGroupProps = {
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
      onMouseEnter: e => {
        actions.onMouseEnter(element, e);
      },
      onMouseDown: (e) => {
        this.isSelecting = true;
      },
      onMouseUp: (e) => {
        if (this.isSelecting) {
          this.isSelecting = false;
          actions.onMouseUp(element, e);
        }
      },
      onMouseOver: (e) => {
        actions.onMouseOver(this.elementGroupNode, element, e);
      },
      onMouseOut: (e) => {
        actions.onMouseOut(this.elementGroupNode, e);
      },
      onMouseMove: (e) => {
        actions.onMouseMove(element, e);
      },
      onMouseLeave: (e) => {
        actions.onMouseLeave(element, e);
      }
    };

    const childrenProps = {
      x: 0,
      y: 0,
      width,
      height
    };

    const imageProps = {
      ...childrenProps,
      image: imageObj,
      id: elementId
    };

    const selectedBorderProps = {
      ...childrenProps,
      stroke: '#4CC1FC',
      strokeWidth: 0
    };

    const imageBorderRectProps = {
      x: borderSize / 2,
      y: borderSize / 2,
      width: width - borderSize,
      height: height - borderSize,
      id: shapeType.elementBorder
    };

    if (borderSize) {
      imageBorderRectProps.stroke = border.get('color');
      imageBorderRectProps.strokeWidth = borderSize;
    }

    const rectProps = {
      ...childrenProps,
      fill: '#f6f6f6',
      stroke: isSelected ? '#4CC1FC' : '#dfdfdf',
      strokeWidth: 1,
      id: elementId
    };

    const textLoadProps = {
      width: width - borderSize,
      height: height - borderSize
    };
    const loadFailProps = {
      width: width - borderSize,
      height: height - borderSize,
      tryToDownload
    };

    const scale = element.getIn(['computed', 'scale']);
    const isShowWarnTip = scale > RESIZE_LIMIT;

    return (
      <Group {...photoElementGroupProps}>
        {/* isSelected && hasImage ? <Rect {...selectedBorderProps} /> : null */}

        {hasImage && this.props.downloadStatus !== downloadStatus.DOWNLOADING? <Image {...imageProps} /> : null}
        {hasImage ? <Rect {...imageBorderRectProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...rectProps} /> : null}

        {hasImage && !isPreview && isShowWarnTip && !isBookCoverInnerWarp && !isScreenshot
          ? <PhotoWarnTip parentWidth={width} />
          : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOADING && !isScreenshot
          ? <TextLoading {...textLoadProps} />
          : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL && !isScreenshot
          ? <LoadFailed {...loadFailProps} />
          : null}
      </Group>
    );
  }
}

PhotoElement.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  isPreview: PropTypes.bool,
  imageObj: PropTypes.object,
  downloadStatus: PropTypes.number
};

export default translate('PhotoElement')(PhotoElement);
