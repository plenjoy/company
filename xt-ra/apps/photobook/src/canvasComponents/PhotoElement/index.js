import React, { Component, PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import { translate } from 'react-translate';
import { Group, Image, Rect, Text } from 'react-konva';

import PhotoWarnTip from '../PhotoWarnTip';
import {
  RESIZE_LIMIT,
  shapeType,
  downloadStatus
} from '../../contants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import TextLoading from '../TextLoading';
import LoadFailed from '../LoadFailed';
import { getCropRect } from '../../utils/crop';

class PhotoElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMouseOver: false
    }
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
      isBookCoverInnerWarp
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
    const { isMouseOver } = this.state;
    const hasImage = Boolean(imgUrl);
    const isSelected = element.get('isSelected');
    const elementId = element.get('id');

    const border = element.getIn(['computed', 'border']);
    const gradient = element.getIn(['style', 'gradient']);
    const shadow = (element.getIn(['computed', 'shadow']) || fromJS({})).toJS();

    const borderSize = border ? border.get('size') : 0;
    const isGradientEnable = gradient && gradient.get('gradientEnable');

    const imageWidth = imageObj ? imageObj.width : 0;
    const imageHeight = imageObj ? imageObj.height : 0;

    let crop = {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight
    };

    if (!isGradientEnable && this.props.downloadStatus) {
      crop = getCropRect(element.toJS(), imageObj);
    }

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
      onMouseDown: e => {
        this.isSelecting = true;
      },
      onMouseUp: e => {
        if (this.isSelecting) {
          this.isSelecting = false;
          actions.onMouseUp(element, e);
        }
      },
      onMouseOver: e => {
        actions.onMouseOver(this.elementGroupNode, e);
      },
      onMouseOut: e => {
        actions.onMouseOut(this.elementGroupNode, e);
      },
      onMouseMove: e => {
        actions.onMouseMove(element, e);
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
      ...shadow,
      image: imageObj,
      id: elementId,
      crop,
      ref: 'imageRef'
    };
    const selectedBorderProps = {
      ...childrenProps,
      stroke: '#4CC1FC',
      strokeWidth: 1
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
      width,
      height
    };
    const loadFailProps = {
      width,
      height,
      tryToDownload
    };

    const scale = element.getIn(['computed', 'scale']);
    const isShowWarnTip = scale > RESIZE_LIMIT;

    return (
      <Group {...photoElementGroupProps}>
        {isSelected && hasImage ? <Rect {...selectedBorderProps} /> : null}

        {hasImage ? <Image {...imageProps} /> : null}
        {hasImage ? <Rect {...imageBorderRectProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...rectProps} /> : null}

        {hasImage && !isPreview && isShowWarnTip && !isBookCoverInnerWarp ? (
          <PhotoWarnTip parentHeight={height} />
        ) : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOADING ? (
          <TextLoading {...textLoadProps} />
        ) : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL ? (
          <LoadFailed {...loadFailProps} />
        ) : null}
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
