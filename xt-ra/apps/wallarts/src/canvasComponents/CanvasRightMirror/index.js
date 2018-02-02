import { get } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Group, Image, Rect } from 'react-konva';
import { numberToHex } from '../../../../common/utils/colorConverter';

class CanvasRightMirror extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isColorBorder,
      canvasBorderColor,
      canvasRightMirrorImageSrc,
      size
    } = this.props;
    const rightMirrorCropParam = get(size, 'renderCanvasMirrorParams.rightMirrorCropParams');
    const rightMirrorPositionParams = get(size, 'renderCanvasMirrorParams.rightMirrorPositionParams');
    const mirrorGroupProps = {
      x: rightMirrorPositionParams.x,
      y: rightMirrorPositionParams.y,
      width: rightMirrorCropParam.width,
      height: rightMirrorCropParam.height,
      listening: false,
      offset: {
        x: rightMirrorPositionParams.offsetX,
        y: rightMirrorPositionParams.offsetY
      },
      scale: {
        x: rightMirrorPositionParams.scaleX,
        y: 1
      },
      skew: {
        x: 0,
        y: rightMirrorPositionParams.skewY
      }
    };
    const rectProps = {
      x: 0,
      y: 0,
      width: rightMirrorCropParam.width,
      height: rightMirrorCropParam.height
    };
    if (isColorBorder) {
      rectProps.fill = numberToHex(canvasBorderColor);
    } else if (canvasRightMirrorImageSrc) {
      const canvasRightMirrorImage = new window.Image();
      canvasRightMirrorImage.src = canvasRightMirrorImageSrc;
      rectProps.image = canvasRightMirrorImage;
    }
    return (<Group {...mirrorGroupProps} >
      { isColorBorder
        ? <Rect {...rectProps} />
        : <Image {...rectProps} />
      }
    </Group>);
  }
}

export default CanvasRightMirror;
