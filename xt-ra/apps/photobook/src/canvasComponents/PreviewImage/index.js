import React, { Component, PropTypes } from 'react';
import { Stage, Layer, Image, Rect } from 'react-konva';
import { get } from 'lodash';
import { getShadowOffset } from '../../../../common/utils/shadow';

import './index.scss';

const VIEW_WIDTH = 80;
const VIEW_HEIGHT = 80;

const OFFSET_WIDTH = 20;
const OFFSET_HEIGHT = 20;


class PreviewImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageObj: null
    };

    this.loadImages = this.loadImages.bind(this);
  }

  loadImages(src) {
    const imageObj = new window.Image();
    imageObj.onload = () => {
      this.setState({
        imageObj
      });
    };
    imageObj.src = src;
  }

  componentWillReceiveProps(nextProps) {
    const oldSrc = get(this.props, 'src');
    const newSrc = get(nextProps, 'src');
    if (oldSrc !== newSrc) {
      this.loadImages(newSrc);
    }
  }

  componentWillMount() {
    this.loadImages(get(this.props, 'src'));
  }

  render() {
    const { imageObj } = this.state;
    const { shadow, ratio, borderProps } = this.props;

    let shadowProps = {};

    if (shadow && shadow.enable) {
        const { angle, distance, color, blur, opacity, enable } = shadow;
        const { x, y } = getShadowOffset(angle, distance * ratio);
        shadowProps = {
          shadowColor: color,
          shadowBlur: blur * ratio,
          shadowEnabled: enable,
          shadowOpacity: opacity / 100,
          shadowOffsetX: x,
          shadowOffsetY: y
        };
    }

    let width = 0;
    let height = 0;
    let x = OFFSET_WIDTH;
    let y = OFFSET_HEIGHT;

    if (imageObj) {
      if (imageObj.width > imageObj.height) {
        width = VIEW_WIDTH;
        height = VIEW_WIDTH / (imageObj.width / imageObj.height);
        y = (VIEW_HEIGHT - height) / 2 + 20;
      } else {
        height = VIEW_HEIGHT;
        width = VIEW_HEIGHT / (imageObj.height / imageObj.width);
        x = (VIEW_WIDTH - width) / 2 + 20;
      }
    }

    const stageProps = {
      ref: stage => (this.stage = stage),
      width: VIEW_WIDTH + 2 * OFFSET_WIDTH,
      height: VIEW_HEIGHT + 2 * OFFSET_HEIGHT,
      className: 'preview-image'
    };

    const imageProps = {
      ref: 'imageNode',
      image: imageObj,
      x,
      y,
      width,
      height,
      ...shadowProps
    };

    const imageRectProps = {
      ref: 'imageNode',
      x,
      y,
      width,
      height,
      ...borderProps
    };

    return (
      <Stage {...stageProps}>
        <Layer>
          <Image {...imageProps} />
          <Rect {...imageRectProps} />
        </Layer>
      </Stage>
    );
  }
}

export default PreviewImage;
