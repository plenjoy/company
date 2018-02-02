import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import { productNames, productTypes } from '../../contants/strings';
import { mapParentBookSpec } from '../../utils/parentBook';

import './index.scss';

class ApprovalPageSideBar extends Component {
  constructor(props) {
    super(props);
    this.getItemLabel = this.getItemLabel.bind(this);
  }

  /**
   * Gets the item label.
   *
   * @param      {object}  allOptionMap    spec 中所有可用的 option 的集合
   * @param      {string}  keyName          需要查找的属性名， 如 size， cover 等。
   * @param      {string}  value            需要查找的option的值， 如 12X12， EP 等。
   * @return     {string}  The item label   option 的值 对应的 label。
   */
  getItemLabel(allOptionMap, keyName, value) {
    const keyMap = allOptionMap[keyName];
    if (!(keyMap instanceof Array)) return '';
    const itemObject = keyMap.find(item => item.id === value);
    const itemLabel = itemObject ? (itemObject.name || itemObject.title) : '';
    return itemLabel;
  }


  render() {
    const { setting, t, allOptionMap, parentBook } = this.props;
    const cover = this.getItemLabel(allOptionMap, 'cover', setting.get('cover'));
    const paper = this.getItemLabel(allOptionMap, 'paper', setting.get('paper'));
    const gilding = this.getItemLabel(allOptionMap, 'gilding', setting.get('gilding'));

    let size = this.getItemLabel(allOptionMap, 'size', setting.get('size'));
    let thickness = this.getItemLabel(allOptionMap, 'paperThickness', setting.get('paperThickness'));

    const product = setting.get('product');
    let productFullName = productNames[product];

    const isFMA = productTypes.FM === product;

    const { isEditParentBook } = parentBook;
    if(isEditParentBook){
      const mapParentBook = mapParentBookSpec(size);
      size = mapParentBook.size;
      thickness = mapParentBook.paperThickness;
      productFullName = mapParentBook.productFullName;
    }

    return (
      <div className="approval-sidebar-wrap">
        <div className="approval-sidebar-item">
          <p className="warning-message margin-bottom">{t('PARAGRAPH1_WARNING1')}</p>
          <p className="warning-message">{t('PARAGRAPH1_WARNING2')}</p>
        </div>
        <div className="approval-sidebar-item">
          <h2>{`${t('PARAGRAPH1_TITLE')}:`}</h2>
          <ul>
            <li>{t('PARAGRAPH1_TEXT1')}</li>
            <li>{t('PARAGRAPH1_TEXT2')}</li>
            <li>{t('PARAGRAPH1_TEXT3')}</li>
            <li>{t('PARAGRAPH1_TEXT4')}</li>
          </ul>
        </div>
        <div className="approval-sidebar-item">
          <h2>{`${t('PARAGRAPH2_TITLE')}:`}</h2>
          <ul>
            <li>{`${t('PARAGRAPH2_TEXT1')}: ${productFullName} (${cover})`}</li>
            <li>{`${t('PARAGRAPH2_TEXT2')}: ${size}`}</li>
            {
              isFMA ? (<li>{`${t('PARAGRAPH2_TEXT3')}: ${paper}`}</li>) : null
            }

            {
              isFMA ? (<li>{`${t('PARAGRAPH2_TEXT4')}: ${thickness}`}</li>) : null
            }

            {
              gilding && gilding.toLowerCase() !== 'none' ?
              ( <li>{`${t('PARAGRAPH2_TEXT5')}: ${gilding}`}</li>)
              : null
            }
          </ul>
        </div>
        <div className="approval-sidebar-item">
          <h2>{`${t('PARAGRAPH3_TITLE')}:`}</h2>
          <ul>
            <li>{t('PARAGRAPH3_TEXT1')}</li>
            <li>{t('PARAGRAPH3_TEXT2')}</li>
            <li>{t('PARAGRAPH3_TEXT3')}</li>
          </ul>
        </div>
      </div>
    );
  }
}

ApprovalPageSideBar.propTypes = {
  setting: PropTypes.object.isRequired,
  allOptionMap: PropTypes.object.isRequired
};

export default translate('ApprovalPageSideBar')(ApprovalPageSideBar);
