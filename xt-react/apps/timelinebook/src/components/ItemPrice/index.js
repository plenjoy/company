import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';

import './index.scss';

class ItemPrice extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { t, data, actions } = this.props;

    const { price, count } = data;
    const totalPrice = price.getIn(['oriPrice']) * count;

    return (
      <div className="item-price">
        <span>${totalPrice.toFixed(2)} </span>
        <span>{t('USD')}</span>
      </div>
    );
  }
}

ItemPrice.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('ItemPrice')(ItemPrice);
