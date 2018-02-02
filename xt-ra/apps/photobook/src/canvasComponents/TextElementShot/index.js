import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import { Group, Image, Rect, Text } from 'react-konva';

import { downloadStatus } from '../../contants/strings';
import * as helperHandler from '../../utils/canvas/helper';

class TextElementShot extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    if (!Immutable.is(oldElement, newElement) ||
      this.props.imageObj !== nextProps.imageObj ||
      this.props.isShowTextNotFit !== nextProps.isShowTextNotFit ||
      this.props.downloadStatus !== nextProps.downloadStatus) {
      return true;
    }

    return false;
  }

  render() {
    const { element, isPreview, imageObj, isShowTextNotFit, actions } = this.props;
    const {
      imgUrl,
      offset,
      x,
      y,
      width,
      height,
      zIndex,
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
    const textLoadProps = {
      width,
      height
    };

    const imageProps = {
      ...childrenProps,
      image: imageObj,
      id: elementId
    };

    if (isSelected) {
      imageProps.stroke = '#4CC1FC';
      imageProps.strokeWidth = 1;
    }

    const rectProps = {
      ...childrenProps,
      // 虚线: 10px长, 5px的间隔.
      dash: [4, 4],
      strokeWidth: 1,
      id: elementId
    };

    if (!isSelected) {
      rectProps.stroke = '#7b7b7b';
    } else {
      rectProps.stroke = '#4CC1FC';
    }

    return (
      <Group {...textElementGroupProps}>
        {
          hasImage
          ? <Image {...imageProps} />
          : null
        }

      </Group>
    );
  }
}

TextElementShot.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  isPreview: PropTypes.bool.isRequired,
  imageObj: PropTypes.object.isRequired,
  isShowTextNotFit: PropTypes.bool.isRequired,
  downloadStatus: PropTypes.number.isRequired
};

export default TextElementShot;
