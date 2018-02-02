import React, { Component } from 'react';
import { translate } from 'react-translate';
import { get } from 'lodash';

import * as handler from './handler';
import { FREE, productTypes } from '../../constants/strings';
import { round } from '../../../../common/utils/math';

import './index.scss';

// 总价格
let totalPrice = '';
// 支付价格
let payPrice = '';

class ItemPrice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      priceDetailShow: false,
      basicPrice: 0
    };
    this.onReadMoreToggle = event => handler.onReadMoreToggle(this, event);

    this.hidePriceDetail = this.hidePriceDetail.bind(this);
  }

  hidePriceDetail() {
    this.setState({ priceDetailShow: false });
  }

  renderDetail(main, options) {
    totalPrice = 0;
    payPrice = 0;

    const { t, data } = this.props;

    const { parameters } = data;

    const html = [];
    // 折扣价格
    let disCount = 0;

    // 基础价格
    let basicPrice = 0;
    let keyNum = 0;
    if (main) {
      if (typeof main.trialPrice !== 'undefined') {
        basicPrice = main.trialPrice;
      } else if (main.sPrice) {
        basicPrice = main.sPrice;
      } else {
        basicPrice = main.oriPrice;
      }
      totalPrice += main.oriPrice;
      payPrice += basicPrice;

      // 基础价格html
      /*html.push(
        <div key={keyNum++}>
          <label>{t('BOOK')}</label>
          <span>{`$${main.oriPrice.toFixed(2)}`}</span>
        </div>
      );*/
    }

    // 促销价
    /*html.push(
      <div key={keyNum++}>
        <label>{t('DISCOUNT')}</label><span className="discount"><i>- </i>{`$${disCount}`}</span>
      </div>
    );*/

    // 加横线
    /*html.push(
      <hr key={keyNum++} />
    );*/

    // 总价
    /*html.push(
      <div key={keyNum++}>
        <label>{t('TOTAL')}</label><span>{`$${payPrice.toFixed(2)}`}</span>
      </div>
    );*/

    this.payPrice = payPrice;
    return html;
  }

  render() {
    const { data, t } = this.props;
    const { parameters, settings } = data;
    const productType = get(settings, 'spec.product');
    const size = get(settings, 'spec.size');

    const price = data.price.toJS();
    const { main, options } = price;
    const html = this.renderDetail(main, options);

    let showPrice = '';
    let oriPrice = '';
    if (payPrice === 0) {
      showPrice = FREE;
      oriPrice = `$${(round(totalPrice)).toFixed(2)}`;
    } else {
      if (payPrice < totalPrice) {
        oriPrice = `$${(round(totalPrice)).toFixed(2)}`;
      }
      if (payPrice !== FREE) {
        showPrice = `$${(round(payPrice)).toFixed(2)} USD`;
      } else {
        showPrice = (round(payPrice)).toFixed(2);
      }
    }

    return (
      payPrice ?
        <div className="item-price">
          {
            productType === productTypes.LPS
              ? <span className="price-describtion">An easel + six double-sided photo prints.</span>
              : null
          }
          {
            productType === productTypes.LPS
              ? <span className="price">{`${size},`}&nbsp;&nbsp;</span>
              : null
          }
          <span className="price">
            {oriPrice ? <span>{oriPrice}</span> : null}{ showPrice }
          </span>
        </div>
        : null
    );
  }
}


export default translate('ItemPrice')(ItemPrice);
