import React, { Component, PropTypes } from 'react';
import loadImg from './icon/loading.svg';

import { Text, Rect, Group, Image } from 'react-konva';

class TextLoading extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageObj: null
    };
  }

  componentWillMount() {
    const imageObj = new window.Image();

    imageObj.onload = () => {
      this.setState({ imageObj });
    };

    imageObj.src = loadImg;
  }


  render() {
    const { width, height, x, y } = this.props;
    const { imageObj } = this.state;
    let imgHeight = 46;
    let imgWidth = 67;
    if(width < imgWidth){
      imgWidth = width;
      imgHeight = (width * imgHeight) / 67;
    }

    const imageProps = {
      image: imageObj,
      x: (width - imgWidth) / 2,
      y: (height - imgHeight) / 2,
      width: imgWidth,
      height: imgHeight
    };

    const rectLoadProps = {
      x: x || 0,
      y: y || 0,
      width,
      height,
      fill: '#F6F6F6',
      opacity: 0.9,
    };

    return (
      <Group>
        <Rect {...rectLoadProps} />
        <Image {...imageProps} />
      </Group>
    );
  }
}

export default TextLoading;
