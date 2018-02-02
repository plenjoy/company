import React, { Component, PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import { translate } from 'react-translate';
import { Group, Image, Rect, Text } from 'react-konva';

import { RESIZE_LIMIT, shapeType, downloadStatus } from '../../contants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import { getCropRect } from '../../utils/crop';

class PhotoElementShot extends Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    if (!Immutable.is(oldElement, newElement) ||
      this.props.imageObj !== nextProps.imageObj ||
      this.props.downloadStatus !== nextProps.downloadStatus) {
      return true;
    }

    return false;
  }

  render() {
    const { element, imageObj, isPreview, t, actions } = this.props;
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
      rotation: element.get('rot'),
      draggable: false,
      name: 'element'
    };

    const childrenProps = {
      x: 0,
      y: 0,
      width,
      height,
    };

    const imageProps = {
      ...childrenProps,
      ...shadow,
      image: imageObj,
      id: elementId,
      crop
    };

    if (isSelected) {
      imageProps.stroke = '#4CC1FC';
      imageProps.strokeWidth = 1;
    }

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

    return (
      <Group {...photoElementGroupProps}>
        {
          hasImage
          ? <Image {...imageProps} />
          : null
        }
        {
          hasImage
          ? <Rect {...imageBorderRectProps} />
          : null
        }
      </Group>
    );
  }
}

PhotoElementShot.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  isPreview: PropTypes.bool.isRequired,
  imageObj: PropTypes.object.isRequired,
  downloadStatus: PropTypes.number.isRequired
};

export default translate('PhotoElementShot')(PhotoElementShot);
