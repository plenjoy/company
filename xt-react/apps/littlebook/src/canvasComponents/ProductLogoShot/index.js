import React, { Component, PropTypes } from 'react';
import { Image } from 'react-konva';
import './index.scss';
import whiteLogo from './icons/logo-white.png';
import blackLogo from './icons/logo-black.png';

const ICO_WIDTH = 378;
const ICO_HEIGHT = 156;


class ProductLogoShot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whiteImageObj: null,
      blackImageObj: null
    };
  }

  componentWillMount() {
    const whiteImageObj = new window.Image();
    whiteImageObj.src = whiteLogo;

    whiteImageObj.onload = () => {
      this.setState({ whiteImageObj });
    };

    const blackImageObj = new window.Image();
    blackImageObj.src = blackLogo;

    blackImageObj.onload = () => {
      this.setState({ blackImageObj });
    };
  }

  render() {
    const { data } = this.props;
    const { whiteImageObj, blackImageObj } = this.state;
    const { logoType, position } = data;
    const { x, y, width, height } = position;
    const imageObj = logoType === 1 ? whiteImageObj : blackImageObj;

    const imageProps = {
      x,
      y,
      width,
      height,
      image: imageObj
    };

    return (
      <Image {...imageProps} />
    );
  }
}

ProductLogoShot.propTypes = {
};

ProductLogoShot.defaultProps = {
  title: 'ZNO',
  logoType: 1
};

export default ProductLogoShot;
