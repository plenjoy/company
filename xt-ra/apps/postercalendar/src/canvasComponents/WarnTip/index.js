import React, { Component, PropTypes } from 'react';

import { Image } from 'react-konva';

import warnIcon from './icon-warn.svg';

class WarnTip extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imageObj: null
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentWillMount() {
    const imageObj = new window.Image();

    imageObj.onload = () => {
      this.setState({ imageObj });
    };

    imageObj.src = warnIcon;
  }

  onMouseEnter() {
    const { title } = this.props;

    this.imageNode.getStage().content.title = title;
  }

  onMouseLeave() {
    this.imageNode.getStage().content.title = '';
  }

  render() {
    const { parentWidth, parentHeight } = this.props;
    const { imageObj } = this.state;
    let imageProps = {
      ref: node => this.imageNode = node,
      image: imageObj,
      width: 18,
      height: 18,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    };
    if (parentWidth) {
     imageProps.x =  parentWidth - 12 - 18;
     imageProps.y = 20;
    }
    if (parentHeight) {
     imageProps.x = 8;
     imageProps.y = parentHeight - 8 - 18;
    }

    return (
      <Image {...imageProps} />
    );
  }
}

WarnTip.propTypes = {
  parentHeight: PropTypes.number,
  parentWidth: PropTypes.number,
  title: PropTypes.string.isRequired
};

export default WarnTip;
