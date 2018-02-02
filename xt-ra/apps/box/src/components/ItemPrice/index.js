import { forEach, get } from 'lodash';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import * as handler from './handler';
import { elementTypes, FREE, productTypes, coverTypes, pageTypes } from '../../contants/strings';

import notice from './notice.png';
import './index.scss';
import { round } from '../../../common/utils/math';

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

  calcTextElementCount(page) {
    let textElementCount = 0;
    const { t, data } = this.props;
    const { allElements } = data;
    
    page.elements.forEach(elementId => {
      const element = allElements.find(element => element.id === elementId);

      if(element && element.type === elementTypes.paintedText && element.text !== '') {
        textElementCount++;
      } else if(element && element.type === elementTypes.usbText && element.text !== '') {
        textElementCount++;
      }
    });

    return textElementCount;
  }

  renderDetail(main, options) {
    totalPrice = 0;
    payPrice = 0;

    const { t, data } = this.props;
    const { parameters, allElements, settings, allCovers, allPages } = data;

    const html = [];
    // 折扣价格
    let disCount = 0;

    // 计算天窗元素个数
    let cameoElement = 0;
    let frontPaintedTextElement = 0;
    let backPaintedTextElement = 0;
    let spinePaintedTextElement = 0;
    let usbTextElement = 0;

    allElements.forEach((item) => {
      if (item.type === elementTypes.cameo) {
        cameoElement++;
      }
    });

    allCovers.containers.forEach(container => {
      switch(container.type) {
        case pageTypes.front: {
          frontPaintedTextElement = this.calcTextElementCount(container);
          frontPaintedTextElement = frontPaintedTextElement > 0 ? 1 : 0;
          break;
        }
        case pageTypes.back: {
          backPaintedTextElement = this.calcTextElementCount(container);
          backPaintedTextElement = backPaintedTextElement > 0 ? 1 : 0;
          break;
        }
        case pageTypes.spine: {
          spinePaintedTextElement = this.calcTextElementCount(container);
          spinePaintedTextElement = spinePaintedTextElement > 0 ? 1 : 0;
          break;
        }
        // case pageTypes.usb: {
        //   usbTextElement = this.calcTextElementCount(container);
        //   break;
        // }
        default:
        break;
      }
    });

    allPages.forEach(page => {
      switch(page.type) {
        case pageTypes.usb: {
          usbTextElement = this.calcTextElementCount(page);
          break;
        }
        default:
        break;
      }
    });

    // 各部分的数量
    const countMap = {
      CAMEO: cameoElement
    };

    const printTextMap = {
      // FULL_COVER: fullCoverTextElement,
      FRONT_COVER: frontPaintedTextElement,
      BACK_COVER: backPaintedTextElement,
      SPINE_COVER: spinePaintedTextElement,
      USB: usbTextElement
    }

    // 基础价格
    let basicPrice = 0;
    if (main) {
      if (typeof main.trialPrice !== 'undefined') {
        basicPrice = (+main.trialPrice);
      } else if (+main.sPrice) {
        basicPrice = (+main.sPrice);
      } else {
        basicPrice = (+main.oriPrice);
      }
      totalPrice += (+main.oriPrice);
      payPrice += basicPrice;

      // 基础价格html
      html.push(
        <div key={html.length}>
          <label>{t('BOX')}</label>
          <span>{`$${round(+main.oriPrice, 2)}`}</span>
        </div>
      );
    }

    forEach(options, (item, key) => {
      if (ignoreList.indexOf(key) < 0) {
        let showPrice = 0;
        if (+item.sPrice) {
          showPrice = (+item.sPrice);
        } else {
          showPrice = (+item.oriPrice);
        }
        const count = countMap[key.toUpperCase()] ? countMap[key.toUpperCase()] : 0;
        showPrice = count * showPrice;
        if (showPrice) {
          payPrice += showPrice;
          totalPrice += (+item.oriPrice) * count;
          html.push(
            <div key={html.length + key}>
              <label>{t(key.toUpperCase())}</label>
              <span>{`$${round(count * (+item.oriPrice), 2)}`}</span>
            </div>
          );
        }
      }
    });

    // 生成各部分单价html
    forEach(options, (item, key) => {
      if (ignoreList.indexOf(key) < 0) {
        if(key === 'paintedText') {
          Object.keys(printTextMap).forEach((printTextType, index) => {
            let showPrice = 0;
            if (+item.sPrice) {
              showPrice = (+item.sPrice);
            } else {
              showPrice = (+item.oriPrice);
            }

            const count = printTextMap[printTextType];
            showPrice = count * showPrice;

            if (showPrice) {
              payPrice += showPrice;
              totalPrice += (+item.oriPrice) * count;

              html.push(
                <div key={html.length + key + index}>
                  <label>{t(printTextType)}</label>
                  <span>{`$${round(count * (+item.oriPrice), 2)}`}</span>
                </div>
              );
            }
          });
        }
      }
    });

    disCount = round((+totalPrice) - (+payPrice), 2);

    // 促销价
    html.push(
      <div key={html.length}>
        <label>{t('DISCOUNT')}</label><span className="discount"><i>- </i>{`$${disCount}`}</span>
      </div>
    );

    // 加横线
    html.push(
      <hr key={html.length} />
    );

    // 总价
    html.push(
      <div key={html.length}>
        <label>{t('TOTAL')}</label><span>{`$${round(+payPrice, 2)}`}</span>
      </div>
    );

    this.payPrice = payPrice;
    return html;
  }

  render() {
    const { data, t } = this.props;
    const { parameters } = data;

    const price = data.price;
    const { main, options } = price;
    const html = this.renderDetail(main, options);
    let showPrice = '';
    let oriPrice = '';
    let alt = '';
    if (payPrice === 0) {
      showPrice = FREE;
      oriPrice = `$${round(+totalPrice, 2)}`;
      alt = t('GET_FREE_TRIAL');
    } else {
      if (payPrice < totalPrice) {
        oriPrice = `$${round(+totalPrice, 2)}`;
      }
      if (payPrice !== FREE) {
        showPrice = `$${round(+payPrice, 2)} USD`;
      } else {
        showPrice = round(+payPrice, 2);
      }
    }
    const detailStyle = {
      display: this.state.priceDetailShow ? 'block' : 'none'
    };
    return (
      <div className="item-price">
        <div className="item-price-container">
          <span className="price" title={alt} alt={alt}>
            <span>{oriPrice}</span>{ showPrice }
          </span>
          <a href="javascript:void(0);" onClick={this.onReadMoreToggle}>
            <img src={notice} />
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
      </div>
    );
  }
}


export default translate('ItemPrice')(ItemPrice);
