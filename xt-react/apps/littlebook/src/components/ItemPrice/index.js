import { Map } from 'immutable';
import { forEach, get } from 'lodash';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import * as handler from './handler';
import { elementTypes, FREE, productTypes, coverTypes, paintedTextTypes } from '../../contants/strings';

import notice from './info-normal.svg';
import './index.scss';

// 价格接口返回参数中不需要计算的值列表
const ignoreList = ['pagescope'];
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
    const { parameters, allSheets, allElements, settings, paintedTextStatus } = data;

    const html = [];
    // 折扣价格
    let disCount = 0;

    // 计算天窗元素个数
    let cameoElement = 0;
    allElements.forEach((item) => {
      if (item.get('type') === elementTypes.cameo) {
        cameoElement++;
      }
    });

    // 如果为PressBook，且Cover为Linen cover和Leatherette天窗自带不计入价格
    if (get(settings, 'spec.product') === productTypes.PS && [coverTypes.PSNC, coverTypes.PSLC].indexOf(get(settings, 'spec.cover')) >= 0) {
      cameoElement = 0;
    }

    // 计算是否有Gilding
    let gildingCount = 0;
    const gildSetting = get(settings, 'spec.gilding');
    if (gildSetting && gildSetting !== 'none') {
      gildingCount = 1;
    }

    // 计算add pages
    const sheetNumberRange = parameters ? parameters.get('sheetNumberRange') : Map({ min: 0 });
    const addPages = (allSheets.size - 1 - sheetNumberRange.get('min')) * 2;

    const countKeysInStatus = ['frontPaintedText', 'backPaintedText', 'spinePaintedText'];

    let paintedText = 0;
    forEach(paintedTextStatus, (item, index) => {
      if (countKeysInStatus.indexOf(index) >=0 && item !== paintedTextTypes.none) {
        paintedText ++;
      }
    });

    // 各部分的数量
    const countMap = {
      CAMEO: cameoElement,
      PAGEADDED: addPages,
      GILDING: gildingCount,
      PAINTEDTEXT: paintedText
    };

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
      html.push(
        <div key={keyNum++}>
          <label>{t('BOOK')}</label>
          <span>{`$${main.oriPrice.toFixed(2)}`}</span>
        </div>
      );
    }

    // 生成各部分单价html
    forEach(options, (item, key) => {
      if (ignoreList.indexOf(key) < 0) {
        let showPrice = 0;
        if (item.sPrice) {
          showPrice = item.sPrice;
        } else {
          showPrice = item.oriPrice;
        }
        const count = countMap[key.toUpperCase()] ? countMap[key.toUpperCase()] : 0;
        showPrice = count * showPrice;
        if (showPrice) {
          payPrice += showPrice;
          totalPrice += item.oriPrice * count;
          html.push(
            <div key={keyNum++}>
              <label>{t(key.toUpperCase())}</label>
              <span>{`$${(count * item.oriPrice).toFixed(2)}`}</span>
            </div>
          );
        }
      }
    });

    disCount = (totalPrice - payPrice).toFixed(2);

    // 促销价
    html.push(
      <div key={keyNum++}>
        <label>{t('DISCOUNT')}</label><span className="discount"><i>- </i>{`$${disCount}`}</span>
      </div>
    );

    // 加横线
    html.push(
      <hr key={keyNum++} />
    );

    // 总价
    html.push(
      <div key={keyNum++}>
        <label>{t('TOTAL')}</label><span>{`$${payPrice.toFixed(2)}`}</span>
      </div>
    );

    this.payPrice = payPrice;
    return html;
  }

  render() {
    const { data, t } = this.props;
    const { parameters, allSheets } = data;
    // 计算add pages
    const sheetNumberRange = parameters ? parameters.get('sheetNumberRange') : Map({ min: 0 });
    const addPages = (allSheets.size - 1 - sheetNumberRange.get('min')) * 2;

    const price = data.price.toJS();
    const { main, options } = price;
    const html = this.renderDetail(main, options);
    let showPrice = '';
    let oriPrice = '';
    let alt = '';
    if (payPrice === 0) {
      showPrice = FREE;
      oriPrice = `$${totalPrice.toFixed(2)}`;
      alt = t('GET_FREE_TRIAL');
    } else {
      if (payPrice < totalPrice) {
        oriPrice = `$${totalPrice.toFixed(2)}`;
      }
      if (payPrice !== FREE) {
        showPrice = `$${payPrice.toFixed(2)} USD`;
      } else {
        showPrice = payPrice.toFixed(2);
      }
    }
    const detailStyle = {
      display: this.state.priceDetailShow ? 'block' : 'none',
      width: addPages ? '175px' : '138px'
    };

    return (
      <div className="item-price">
        <span className="price" title={alt} alt={alt}>
          <span>{oriPrice}</span>{ showPrice }
        </span>
        <a href="javascript:void(0);" onClick={this.onReadMoreToggle}>
          <span className="notice-img"></span>
        </a>
        <div
          className="detail"
          style={detailStyle}
          tabIndex="-1"
          ref={(div) => { this.popupDetail = div; }}
          onBlur={this.hidePriceDetail}
        >
          {html}
        </div>
      </div>
    );
  }
}


export default translate('ItemPrice')(ItemPrice);
