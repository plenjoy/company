import React, { Component } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { isEqual, template, get } from 'lodash';

import XSelect from '../../../../common/ZNOComponents/XSelect';
import { DOWNLOAD_BOOKSPEC_URL } from '../../contants/apiUrl.js';
import { productTypes } from '../../contants/strings.js';
import ColorSelectOption from '../../components/ColorSelectOption';
import './index.scss';
import downloadIcon from './download.svg';

// 导入处理函数.
import * as handler from './handler';

class OptionsBar extends Component {
  constructor(props) {
    super(props);

    const { actions, data } = this.props;
    const { setting, selectMap } = data;

    this.state = {
      oldSetting: {},
      textShowInPage: handler.getSettingLabel(setting, selectMap),
      isInEdit: false
    };

    this.handleChange = () => handler.handleChange(this);
    this.getCoverName = () => handler.getCoverName(this);
    this.downLoadSpec = () => handler.downLoadSpec(this);
    this.routerClickHandle = (event) => handler.routerClickHandle(this, event);
    this.addRouterClickListener = () => handler.addRouterClickListener(this);
    this.removeRouterClickListener = () => handler.removeRouterClickListener(this);
    this.getSettingLabel = (setting, selectMap) => handler.getSettingLabel(setting, selectMap);
    this.getItemLabel = (value, map) => handler.getItemLabel(value, map);
    this.handleProductChange = (event) => handler.handleProductChange(this, event);
    this.handleOptionChange = (event) => handler.handleOptionChange(this, event);
    this.handleCoverChange = (event) => handler.handleCoverChange(this, event);
    this.handleColorChange = (event) => handler.handleColorChange(this, event);
    this.handleSizeChange = (event) => handler.handleSizeChange(this, event);
    this.handlePaperChange = (event) => handler.handlePaperChange(this, event);
    this.handlePaperThicknessChange = (event) => handler.handlePaperThicknessChange(this, event);
    this.handleGildingChange = (event) => handler.handleGildingChange(this, event);
  }

  componentWillReceiveProps(nextProps) {
    const oldSetting = this.props.data.setting;
    const newSetting = nextProps.data.setting;
    const oldSelectMap = this.props.data.selectMap;
    const newSelectMap = nextProps.data.selectMap;

    if ( !isEqual(oldSetting, newSetting) && newSelectMap) {
      this.setState({
        textShowInPage: this.getSettingLabel(newSetting, newSelectMap)
      });
    }
  }

  render() {
    const { data, t } = this.props;
    const { setting, selectMap, settingLabels, isProCustomer } = data;
    const { textShowInPage, isInEdit } = this.state;
    const { product, cover, leatherColor, size, paper, paperThickness, gilding } = setting;
    const { productMap, coverMap, colorMap, sizeMap, paperMap, paperThicknessMap, gildingMap } = selectMap;
    const { productLabel, coverLabel, colorLabel, sizeLabel, paperLabel, paperThicknessLabel, gildingLabel } = settingLabels;

    const itemValueClassName = classNames('options-item-value', { 'hide': isInEdit });
    const itemSelectClassName = classNames('options-item-select', { 'hide': !isInEdit });

    // TODO, 如果是pressbook, 暂时先屏蔽下载book spec的功能. 因为该书的book spec还没有制作好.
    const productType = get(setting, 'product');
    const isPressBook = productTypes.PS === productType;
    const isLayflat = productTypes.LF === productType;
    const isFMA = productTypes.FM === productType;
    //由于 图片的名字可能一模一样 colorMap 里面我添加一个 cover 区分是哪个cover里面的图片
    if(colorMap){
      colorMap.forEach((v) => {
        v.cover = coverLabel;
      })
    }

    return (
      <div className="options-bar">
        <button className="options-switch" onClick={this.handleChange} >
          {isInEdit ? t('DONE') : t('CHANGE') }
        </button>
        <div className={productMap.length === 1 && productMap[0].value === 'none' ? "options-item hide" : "options-item"}>
          <div className="options-item-label">{`${t('PRODUCT')}:`}</div>
          <div className={itemValueClassName}>{productLabel}</div>
          <div className={itemSelectClassName}>
            <XSelect
              options={productMap}
              searchable={false}
              onChanged={this.handleProductChange}
              value={product}
            />
          </div>
        </div>
        <div className={coverMap.length === 1 && coverMap[0].value === 'none' ? "options-item hide" : "options-item"}>
          <div className="options-item-label">{`${t('COVER')}:`}</div>
          <div className={itemValueClassName}>{coverLabel}</div>
          <div className={itemSelectClassName}>
            <XSelect
              options={coverMap}
              searchable={false}
              onChanged={this.handleCoverChange}
              value={cover}
            />
          </div>
        </div>
        <div className={colorMap.length === 1 && colorMap[0].value === 'none' ? "options-item hide" : "options-item"}>
          <div className="options-item-label">{`${t('COLOR')}:`}</div>
          <div className={itemValueClassName}>{colorLabel}</div>
          <div className={itemSelectClassName}>
            <XSelect
              options={colorMap}
              searchable={false}
              onChanged={this.handleColorChange}
              value={leatherColor}
              optionComponent={ColorSelectOption}
            />
          </div>
        </div>
        <div className={sizeMap.length === 1 && sizeMap[0].value === 'none' ? "options-item hide" : "options-item"}>
          <div className="options-item-label">{`${t('SIZE')}:`}</div>
          <div className={itemValueClassName}>{sizeLabel}</div>
          <div className={itemSelectClassName}>
            <XSelect
              options={sizeMap}
              searchable={false}
              onChanged={this.handleSizeChange}
              value={size}
            />
          </div>
        </div>

        {
          isFMA ? (
            <div className={paperMap.length === 1 && paperMap[0].value === 'none' ? "options-item hide" : "options-item"}>
              <div className="options-item-label">{`${t('PAPER')}:`}</div>
              <div className={itemValueClassName}>{paperLabel}</div>
              <div className={itemSelectClassName}>
                <XSelect
                  options={paperMap}
                  searchable={false}
                  onChanged={this.handlePaperChange}
                  value={paper}
                />
              </div>
            </div>
          ) : null
        }

        {
          isFMA ? (
            <div className={paperThicknessMap.length === 1 && paperThicknessMap[0].value === 'none' ? "options-item hide" : "options-item"}>
              <div className="options-item-label">{`${t('THICKNESS')}:`}</div>
              <div className={itemValueClassName}>{paperThicknessLabel}</div>
              <div className={itemSelectClassName}>
                <XSelect
                  options={paperThicknessMap}
                  searchable={false}
                  onChanged={this.handlePaperThicknessChange}
                  value={paperThickness}
                />
              </div>
            </div>
          ) : null
        }

        {
          isProCustomer && isFMA ? (
            <div className={(paperThicknessMap.length === 1 && paperThicknessMap[0].value === 'none') ? "options-item hide" : "options-item"}>
              <div className="options-item-label">{`${t('GILDING')}:`}</div>
              <div className={itemValueClassName}>{gildingLabel}</div>
              <div className={itemSelectClassName}>
                <XSelect
                  options={gildingMap}
                  searchable={false}
                  onChanged={this.handleGildingChange}
                  value={gilding}
                />
              </div>
            </div>
          )
          : null
        }
        <div className="downLoadSpec-wrap">
          <div onClick={this.downLoadSpec}>
            <img src={downloadIcon} alt={t('DOWNLOAD')} />
            <span>{t('DOWNLOAD_BOOK_SPEC')}</span>
          </div>
        </div>
      </div>
    );
  }
}

OptionsBar.propTypes = {

};
export default translate('OptionsBar')(OptionsBar);
