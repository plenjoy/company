import { get } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Group, Image, Rect } from 'react-konva';
import { numberToHex } from '../../../../common/utils/colorConverter';

class CanvasTopMirror extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isColorBorder,
      canvasBorderColor,
      canvasTopMirrorImageSrc,
      size
    } = this.props;
    const topMirrorCropParam = get(size, 'renderCanvasMirrorParams.topMirrorCropParams');
    const topMirrorPositionParams = get(size, 'renderCanvasMirrorParams.topMirrorPositionParams');
    const mirrorGroupProps = {
      x: topMirrorPositionParams.x,
      y: topMirrorPositionParams.y,
      width: topMirrorCropParam.width,
      height: topMirrorCropParam.height,
      listening: false,
      offset: {
        x: topMirrorPositionParams.offsetX,
        y: topMirrorPositionParams.offsetY
      },

      scale: {
        x: 1,
        y: topMirrorPositionParams.scaleY
      },
      skew: {
        x: topMirrorPositionParams.skewX,
        y: 0
      }
    };
    const rectProps = {
      x: 0,
      y: 0,
      width: topMirrorCropParam.width,
      height: topMirrorCropParam.height
    };
    if (isColorBorder) {
      rectProps.fill = numberToHex(canvasBorderColor);
    } else if (canvasTopMirrorImageSrc) {
      const canvasTopMirrorImage = new window.Image();
      canvasTopMirrorImage.src = canvasTopMirrorImageSrc;
      rectProps.image = canvasTopMirrorImage;
    }
    return (<Group {...mirrorGroupProps} >
      { isColorBorder
        ? <Rect {...rectProps} />
        : <Image {...rectProps} />
      }
    </Group>);
  }
}

export default CanvasTopMirror;
