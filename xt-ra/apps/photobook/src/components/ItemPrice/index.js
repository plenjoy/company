import { Map } from 'immutable';
import { forEach, get } from 'lodash';
import React, { Component } from 'react';
import { translate } from 'react-translate';
import {
  computedPrice,
  getAccessoriesCount
} from '../../../../common/utils/price';

import * as handler from './handler';
import {
  elementTypes,
  FREE,
  productTypes,
  coverTypes,
  paintedTextTypes,
  productNames,
  coverTypeNames
} from '../../contants/strings';

import notice from './info-normal.svg';
import ToolTip from 'react-portal-tooltip';
import './index.scss';

class ItemPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      priceDetailShow: false,
      basicPrice: 0,
      isShowToolTip: false
    };
    this.onReadMoreToggle = event => handler.onReadMoreToggle(this, event);
    this.hideReadMore = event => handler.hideReadMore(this, event);

    this.hidePriceDetail = this.hidePriceDetail.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  showTooltip() {
    this.setState({ isShowToolTip: true });
  }

  hideTooltip() {
    this.setState({ isShowToolTip: false });
  }

  hidePriceDetail() {
    this.setState({ priceDetailShow: false });
  }

  renderDetail(base, accessories, total) {
    const { t } = this.props;
    const html = [];
    let keyNum = 0;

    // 1. 基础价格html
    html.push(
      <div key={keyNum++} className="book-item">
        <label>{t('BOOK')}</label>
        <span>{`$${base.oriPrice.toFixed(2)}`}</span>
      </div>
    );

    // 2. 生成各配件单价html
    for (const key in accessories) {
      const accessory = accessories[key];

      html.push(
        <div key={keyNum++}>
          <label>{t(key.toUpperCase())}</label>
          <span>{`$${accessory.oriPrice.toFixed(2)}`}</span>
        </div>
      );
    }

    // 3. 促销价
    html.push(
      <div key={keyNum++}>
        <label>{t('DISCOUNT')}</label>
        <span className="discount">
          <i>- </i>
          {`$${total.discount.toFixed(2)}`}
        </span>
      </div>
    );

    // 加横线
    html.push(<hr key={keyNum++} />);

    // 总价
    html.push(
      <div key={keyNum++} className="total">
        <label>{t('TOTAL')}</label>
        <span>{`$${total.sPrice.toFixed(2)}`}</span>
      </div>
    );

    return html;
  }

  render() {
    const { data, t } = this.props;
    const {
      parameters,
      allSheets,
      containers,
      settings,
      paintedTextStatus
    } = data;

    // 计算add pages
    const sheetNumberRange = parameters.size
      ? parameters.get('sheetNumberRange')
      : Map({ min: 0 });
    const addPages = (allSheets.size - 1 - sheetNumberRange.get('min')) * 2;

    const spec = get(settings, 'spec');
    const product = productNames[get(spec, 'product')];
    const cover = coverTypeNames[get(spec, 'cover')];
    const size = get(spec, 'size');

    const price = data.price.toJS();
    const { main, options } = price;

    const coupon = data.coupon.toJS();
    const { couponCode, description = '' } = coupon;

    const desArr = description.split(/\s?\|\s?/);

    const endDateString = desArr.length >= 4 ? desArr[3].replace(/(\s*\}.*|\s*)$/, '') : '';

    const toolTipStyle = {
      style: {
        fontSize: 12,
        color: '#3a3a3a',
        backgroundColor: '#fff',
        padding: '6px 10px',
        borderRadius: 0,
        whiteSpace: 'nowrap',
        zIndex: 99999,
        lineHeight: '20px',
        marginTop: '-10px'
      },
      arrowStyle: {
        color: '#fff',
        borderColor: false
      }
    };

    // 计算新增的配件数量.
    const accessoriesCount = getAccessoriesCount({
      containers,
      settings: get(settings, 'spec'),
      paintedTextStatus,
      currentSheetCount: allSheets.size - 1,
      baseSheetCount: sheetNumberRange.get('min')
    });

    // 计算总价和各个配件的价格.
    const { base, accessories, total } = computedPrice(
      main,
      options,
      accessoriesCount
    );

    const html = this.renderDetail(base, accessories, total);

    let showPrice = '';
    let oriPrice = '';
    let alt = '';

    if (!total.sPrice) {
      showPrice = FREE;
      oriPrice = `$${total.oriPrice.toFixed(2)}`;
      alt = t('GET_FREE_TRIAL');
    } else {
      oriPrice = `$${total.oriPrice.toFixed(2)}`;
      showPrice = `$${total.sPrice.toFixed(2)} USD`;
    }
    const detailStyle = {
      display: this.state.priceDetailShow ? 'block' : 'none',
      width: addPages ? '264px' : '227px'
    };

    const codeStyle = {
      fontWeight: '500'
    };

    return (
      <div className="item-price">
        <span className="price" title={alt} alt={alt}>
          <span
            id="oriPrice"
            onMouseOver={this.showTooltip}
            onMouseOut={this.hideTooltip}
          >
            {oriPrice}
          </span>
          {showPrice}
        </span>
        <a
          href="javascript:void(0);"
          onMouseOver={this.onReadMoreToggle}
          onMouseOut={this.hideReadMore}
        >
          <span className="notice-img" />
        </a>
        <div
          className="detail"
          style={detailStyle}
          tabIndex="-1"
          ref={div => {
            this.popupDetail = div;
          }}
          onBlur={this.hidePriceDetail}
        >
          <div className="product-info">
            <h3>{product}</h3>
            <h5>{`${size}, ${cover}`}</h5>
          </div>
          <hr />
          {html}
        </div>
        {couponCode ? (
          <ToolTip
            active={this.state.isShowToolTip}
            position="bottom"
            arrow="center"
            parent="#oriPrice"
            style={toolTipStyle}
            tooltipTimeout={0}
          >
            {t('USE_COUPON')}
            <strong style={codeStyle}>
              {t('COUPON_CODE', {
                couponCode
              })}
            </strong>
            {t('GET_PRICE', {
              sellPrice: total.sPrice.toFixed(2)
            })}
            <br />
            {t('END_DATE', {
              endDate: endDateString
            })}
          </ToolTip>
        ) : null}
      </div>
    );
  }
}

export default translate('ItemPrice')(ItemPrice);
