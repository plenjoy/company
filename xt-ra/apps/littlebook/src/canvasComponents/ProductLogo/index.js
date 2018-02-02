import React, { Component, PropTypes } from 'react';
import { Image } from 'react-konva';

import whiteLogo from './icons/logo-white.svg';
import blackLogo from './icons/logo-black.svg';


class ProductLogo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageObj: null
    };
  }
  componentDidMount() {
    const imageObj = new window.Image();

    imageObj.onload = () => {
      this.setState({ imageObj });
    };
    imageObj.src = (this.props.logoType === 1 ? whiteLogo : blackLogo);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.logoType !== this.props.logoType) {
      const imageObj = new window.Image();
      imageObj.onload = () => {
        this.setState({ imageObj });
      };
      imageObj.src = (nextProps.logoType === 1 ? whiteLogo : blackLogo);
    }
  }

  render() {
    const { x, y, width, height} = this.props;
    const { imageObj } = this.state;
    const imageProps = {
      ref: 'imageNode',
      image: imageObj,
      x,
      y,
      width,
      height
    };

    return (
      <Image {...imageProps} />
    );
  }
}

ProductLogo.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  logoType: PropTypes.number.isRequired
};

export default ProductLogo;
