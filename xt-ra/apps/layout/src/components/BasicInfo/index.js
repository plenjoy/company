import React, { Component, PropTypes } from 'react';
import { pick } from 'lodash';
import { STATUS } from '../../constants/strings';
import './index.scss';

class BasicInfo extends Component {

  constructor(props) {
    super(props);
  }

  getShowParamKey() {
    return [
      'sheetType',
      'size',
      'status',
      'imageNum',
      'frameHorizonNum',
      'frameVertialNum',
      'frameSquareNum',
      'coverDefault',
      'pressBookSheet',
      'textFrameTotalNum'
    ];
  }

  getCustomKey() {
    return {
      sheetType: 'Type',
      imageNum: 'Images Total',
      frameHorizonNum: 'Horizontals',
      frameVertialNum: 'Verticals',
      frameSquareNum: 'Square',
      pressBookSheet: 'PressBookSheet',
      coverDefault: 'IsCoverDefault',
      textFrameTotalNum: 'textFrame Total',
      textFrameHorizonNum: 'Horiz textFrame',
      textFrameVertialNum: 'Verti textFrame',
      bestChosen: 'Chosen For app',
      shareFlag: 'If Share'
    };
  }

  getBasicInfoHtml() {
    const { setting } = this.props;
    const showPramKey = this.getShowParamKey();
    const customLabel = this.getCustomKey();
    const info = pick(setting, showPramKey);
    let basicInfo = [],
      i = 0;
    for (const key in info) {
      let index = key;
      let item = info[index];

      // 对status的数字做文本转换.
      if (index.toLowerCase() === 'status') {
        const s = STATUS.find(m => m.value === item);
        if (s) {
          item = s.text;
        }
      }

      item = item == null ? '' : item;
      index = customLabel[index] ? customLabel[index] : index.replace(/([A-Z]+)/g, ' $1');
      const itemHtml = `
        <div class="col-md-2 text-right">${index}:</div>
        <div class="col-md-2 text-left"><strong id="detail-sheettype">${item}</strong></div>
      `;

      if (i % 3 === 0) {
        basicInfo.push(`<div class="row">${itemHtml}`);
      } else if (i % 3 === 2) {
        basicInfo.push(`${itemHtml}</div>`);
      } else {
        basicInfo.push(itemHtml);
      }
      i++;
    }
    return basicInfo.join('');
  }

  render() {
    const { setting } = this.props;
    const { size, sheetType } = setting;
    return (
      <div>
        <div className="title">
          Editing Layout |
          <span className="color-highlight" id="book-type"> {sheetType}</span> |
          <span className="color-highlight" id="book-size"> {size}</span>
        </div>
        <div className="basic-info" dangerouslySetInnerHTML={{ __html: this.getBasicInfoHtml() }} />
      </div>
    );
  }
}

BasicInfo.propTypes = {
  setting: PropTypes.object.isRequired
};

export default BasicInfo;
