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
    this.routerClickHandle = event => handler.routerClickHandle(this, event);
    this.addRouterClickListener = () => handler.addRouterClickListener(this);
    this.removeRouterClickListener = () =>
      handler.removeRouterClickListener(this);
    this.getSettingLabel = (setting, selectMap) =>
      handler.getSettingLabel(setting, selectMap);
    this.getItemLabel = (value, map) => handler.getItemLabel(value, map);
    this.handleProductChange = event =>
      handler.handleProductChange(this, event);
    this.handleOptionChange = event => handler.handleOptionChange(this, event);
    this.handleCoverChange = event => handler.handleCoverChange(this, event);
    this.handleColorChange = event => handler.handleColorChange(this, event);
    this.handleSizeChange = event => handler.handleSizeChange(this, event);
    this.handlePaperChange = event => handler.handlePaperChange(this, event);
    this.handlePaperThicknessChange = event =>
      handler.handlePaperThicknessChange(this, event);
    this.handleGildingChange = event =>
      handler.handleGildingChange(this, event);
    this.handleMetalSurfaceChange = event =>
      handler.handleMetalSurfaceChange(this, event);
  }

  componentWillReceiveProps(nextProps) {
    const oldSetting = this.props.data.setting;
    const newSetting = nextProps.data.setting;
    const oldSelectMap = this.props.data.selectMap;
    const newSelectMap = nextProps.data.selectMap;

    if (!isEqual(oldSetting, newSetting) && newSelectMap) {
      this.setState({
        textShowInPage: this.getSettingLabel(newSetting, newSelectMap)
      });
    }
  }

  render() {
    const { data, t } = this.props;
    const {
      setting,
      selectMap,
      settingLabels,
      isProCustomer,
      capability,
      property
    } = data;
    const { textShowInPage, isInEdit } = this.state;
    const {
      product,
      cover,
      leatherColor,
      size,
      paper,
      paperThickness,
      gilding,
      metalSurface
    } = setting;
    const {
      productMap,
      coverMap,
      colorMap,
      sizeMap,
      paperMap,
      paperThicknessMap,
      gildingMap,
      metalSurfaceMap
    } = selectMap;
    const {
      productLabel,
      coverLabel,
      colorLabel,
      sizeLabel,
      paperLabel,
      paperThicknessLabel,
      gildingLabel,
      metalSurfaceLabel
    } = settingLabels;

    const itemValueClassName = classNames('options-item-value', {
      hide: isInEdit
    });
    const itemSelectClassName = classNames('options-item-select', {
      hide: !isInEdit
    });

    const hasCoverType = property.get('hasCoverType');

    // TODO, 如果是pressbook, 暂时先屏蔽下载book spec的功能. 因为该书的book spec还没有制作好.
    const productType = get(setting, 'product');
    const isPressBook = productTypes.PS === productType;
    const isLayflat = productTypes.LF === productType;
    const isFMA = productTypes.FM === productType;
    // 由于 图片的名字可能一模一样 colorMap 里面我添加一个 cover 区分是哪个cover里面的图片
    if (colorMap) {
      colorMap.forEach((v) => {
        v.cover = cover;
      });
    }

    const isShowMetalCover = capability.get('isShowMetalCover');

    return (
      <div className="options-bar">
        <div className="options-item">
          <div className="options-item-label title">{`${t(
            'BOOK_OPTIONS'
          )}`}</div>
          {!hasCoverType ? (
            <button className="options-switch" onClick={this.handleChange}>
              {isInEdit ? t('DONE') : t('CHANGE')}
            </button>
          ) : null}
        </div>
        {capability.get('canShowProductOption') ? (
          <div
            className={
              productMap.length === 1 && productMap[0].value === 'none' ? (
                'options-item hide'
              ) : (
                'options-item'
              )
            }
          >
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
        ) : null}
        <div
          className={
            coverMap.length === 1 && coverMap[0].value === 'none' ? (
              'options-item hide'
            ) : (
              'options-item'
            )
          }
        >
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
        {capability.get('canShowSizeOption') ? (
          <div
            className={
              colorMap.length === 1 && colorMap[0].value === 'none' ? (
                'options-item hide'
              ) : (
                'options-item'
              )
            }
          >
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
        ) : null}

        {capability.get('canShowSizeOption') ? (
          <div
            className={
              sizeMap.length === 1 && sizeMap[0].value === 'none' ? (
                'options-item hide'
              ) : (
                'options-item'
              )
            }
          >
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
        ) : null}

        {isFMA && capability.get('canShowSizeOption') ? (
          <div
            className={
              paperMap.length === 1 && paperMap[0].value === 'none' ? (
                'options-item hide'
              ) : (
                'options-item'
              )
            }
          >
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
        ) : null}

        {isFMA && capability.get('canShowSizeOption') ? (
          <div
            className={
              paperThicknessMap.length === 1 &&
              paperThicknessMap[0].value === 'none' ? (
                'options-item hide'
              ) : (
                'options-item'
              )
            }
          >
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
        ) : null}

        {(isProCustomer || isShowMetalCover) &&
        isFMA &&
        capability.get('canShowSizeOption') ? (
          <div
            className={
              paperThicknessMap.length === 1 &&
              paperThicknessMap[0].value === 'none' ? (
                'options-item hide'
              ) : (
                'options-item'
              )
            }
          >
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
        ) : null}

        {(isProCustomer || isShowMetalCover) &&
        isFMA &&
        metalSurface !== 'none' ? (
          <div
            className={
              paperThicknessMap.length === 1 &&
              paperThicknessMap[0].value === 'none' ? (
                'options-item hide'
              ) : (
                'options-item'
              )
            }
          >
            <div className="options-item-label">{`${t('METAL_SURFACE')}:`}</div>
            <div className={itemValueClassName}>{metalSurfaceLabel}</div>
            <div className={itemSelectClassName}>
              <XSelect
                options={metalSurfaceMap}
                searchable={false}
                onChanged={this.handleMetalSurfaceChange}
                value={metalSurface}
              />
            </div>
          </div>
        ) : null}

        {capability.get('canSpecDownloadLink') ? (
          <div className="downLoadSpec-wrap">
            <div onClick={this.downLoadSpec}>
              <img src={downloadIcon} alt={t('DOWNLOAD')} />
              <span>{t('DOWNLOAD_BOOK_SPEC')}</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

OptionsBar.propTypes = {};
export default translate('OptionsBar')(OptionsBar);
