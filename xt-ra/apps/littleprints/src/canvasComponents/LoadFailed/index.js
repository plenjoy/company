import React, { Component, PropTypes } from 'react';
import { Image, Group, Text, Rect } from 'react-konva';


import failedIcon from './retry.svg';

class LoadFailed extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imageObj: null
    };

    this.onMouseDown = this.onMouseDown.bind(this);
  }
  onMouseDown() {
    const { tryToDownload } = this.props;
    tryToDownload();
  }
  componentWillMount() {
    const imageObj = new window.Image();
    imageObj.src = failedIcon;

    imageObj.onload = () => {
      this.setState({ imageObj });
    };
  }


  render() {
    const { width, height, x, y } = this.props;
    const computedImgHeight = ((height / 6) > 30) ? (height / 6) : 30;
    const imgWidth = computedImgHeight * 0.8;
    const imgHeight = computedImgHeight;
    const { imageObj } = this.state;
    const loadFontSize = 12;
    const groupProps = {
      ref: node => this.imageNode = node,
      onMouseDown: this.onMouseDown,
      width,
      height,
      x: 0,
      y: 0
    };
    let hideText = false;
    if (width <= 80 || height <= 80) {
      hideText = true;
    }
    const textLoadProps = {
      x: 0,
      y: (height - loadFontSize) / 2 + imgHeight / 2,
      width,
      fill: '#7B7B7B',
      fontFamily: 'Gotham SSm A',
      align: 'center',
      text: 'Photo load failed. \n Click to retry',
      fontSize: loadFontSize
    };

    const imageProps = {
      image: imageObj,
      x: (width - imgWidth) / 2,
      y: hideText ? (height - imgHeight) / 2 : ((height - imgHeight) / 2 - imgHeight / 2),
      width: imgWidth,
      height: imgHeight
    };
    const rectProps = {
      width,
      height,
      x: 0,
      y: 0,
      fill: '#f6f6f6',
      stroke: '#dfdfdf',
      strokeWidth: 1,
    };

    return (
      <Group {...groupProps}>
        <Rect {...rectProps} />
        <Image {...imageProps} />
        {
          hideText ? null : <Text {...textLoadProps} />
        }
      </Group>

    );
  }
}


export default LoadFailed;
