import React, { Component, PropTypes } from 'react';
import './index.scss';
import whiteLogo from './icons/logo-white.png';
import blackLogo from './icons/logo-black.png';

// 导入组件
import Element from '../Element';

class ProductLogo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const { title, logoType, style } = data;
    const src = logoType === 1 ? whiteLogo : blackLogo;

    return (
      <img className="product-logo" style={style} src={src} alt="logo" title={title} />
    );
  }
}

ProductLogo.propTypes = {
};

ProductLogo.defaultProps = {
  title: 'ZNO',
  logoType: 1
};

export default ProductLogo;
