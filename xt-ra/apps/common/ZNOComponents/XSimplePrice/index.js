import React, { Component } from 'react';
import classNames from 'classnames';
import { round } from '../../utils/math';

import './index.scss';

class XSimplePrice extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      style,
      coverName = '-',
      price = 0.0,
      productSize = '-'
    } = this.props;

    const newClassName = classNames('x-simple-price', className);
    const newStyle = style;

    return (
      <div
        className={newClassName}
        style={newStyle}
      >
        { `${productSize.toLowerCase()}, ${coverName}, $${(round(price)).toFixed(2)} USD` }
      </div>
    );
  }
}

XSimplePrice.defaultProps = {
  price: '0',
  coverName: 'Hard Cover'
};

export default XSimplePrice;
