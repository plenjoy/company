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
    const { parentWith } = this.props;
    const { imageObj } = this.state;
    const imageProps = {
      ref: node => this.imageNode = node,
      image: imageObj,
      x: parentWith - 12 - 18,
      y: 20,
      width: 18,
      height: 18,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    };

    return (
      <Image {...imageProps} />
    );
  }
}

WarnTip.propTypes = {
  parentHeight: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

export default WarnTip;
