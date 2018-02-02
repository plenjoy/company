import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import { Group, Image, Rect, Text } from 'react-konva';

import TextWarnTip from '../TextWarnTip';
import { downloadStatus } from '../../contants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import TextLoading from '../TextLoading';
import LoadFailed from '../LoadFailed';

class TextElement extends Component {
  shouldComponentUpdate(nextProps) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    if (
      !Immutable.is(oldElement, newElement) ||
      this.props.imageObj !== nextProps.imageObj ||
      this.props.isShowTextNotFit !== nextProps.isShowTextNotFit ||
      this.props.downloadStatus !== nextProps.downloadStatus
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
    const {
      element,
      isPreview,
      imageObj,
      isShowTextNotFit,
      actions,
      tryToDownload
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
      onMouseEnter: (e) => {
        actions.onMouseEnter(element, e);
        this.setCursor('pointer');
      },
      onMouseLeave: (e) => {
        actions.onMouseLeave(element, e);
        this.setCursor('default');
      },
      onClick: (e) => {
        actions.onClick(element, e);
      },
      onMouseOver: (e) => {
        actions.onMouseOver(this.elementGroupNode, e);
      },
      onMouseOut: (e) => {
        actions.onMouseOut(this.elementGroupNode, e);
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
      <Group {...textElementGroupProps}>
        {hasImage ? <Image {...imageProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...whiteRectProps} /> : null}

        {!hasImage && !isPreview ? <Rect {...blackRectProps} /> : null}

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

TextElement.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  isPreview: PropTypes.bool.isRequired,
  imageObj: PropTypes.object.isRequired,
  isShowTextNotFit: PropTypes.bool.isRequired,
  downloadStatus: PropTypes.number.isRequired
};

export default TextElement;
