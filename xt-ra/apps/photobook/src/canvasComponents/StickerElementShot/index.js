import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
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

class StickerElement extends Component {
  constructor(props) {
    super(props);
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
      name: 'element'
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

    return (
      <Group {...photoElementGroupProps}>
        {isSelected && hasImage ? <Rect {...selectedBorderProps} /> : null}

        {hasImage ? <Image {...imageProps} /> : null}
        {hasImage ? <Rect {...imageBorderRectProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...rectProps} /> : null}
      </Group>
    );
  }
}

export default translate('PhotoElement')(StickerElement);
