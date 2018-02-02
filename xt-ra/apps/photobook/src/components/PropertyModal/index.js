import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import qs from 'qs';

import { isEqual, merge, template, get, forEach } from 'lodash';
import { translate } from 'react-translate';

import { getCropOptions, getCropLRByOptions, getCropOptionsByLR } from '../../utils/crop';
import { getDefaultCrop } from '../../../../common/utils/crop';
import { getShadowOffset } from '../../../../common/utils/shadow';
import { hexToRGBA } from '../../../../common/utils/colorConverter';
import { MIN_BORDER_SIZE, MAX_BORDER_SIZE, MIN_BORDER_OPACITY, MAX_BORDER_OPACITY, gradientTypes, mapGradients, defaultStyle, defaultBorder } from '../../contants/strings';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import XCheckBox from '../../../../common/ZNOComponents/XCheckBox';
import TextPositionTabs from '../TextPositionTabs';
import SliderChange from '../SliderChange';
import FilterImage from '../FilterImage';
import PreviewImage from '../../canvasComponents/PreviewImage';

import * as handler from './handler.js';

import './index.scss';

// 最小宽高
const MIN_PHOTO_HEIGHT = 180;
const MIN_PHOTO_WIDTH = 180;

// 缩略图最大宽高
const THUMB_WIDTH = 150;
const THUMB_HEIGHT = 150;

const opacityTimer = null;
const effectTimer = null;

class PropertyModal extends Component {
  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      lockDimension: false,
      element: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        style: merge({}, defaultStyle),
        border: merge({}, defaultBorder)
      },
      gradientTypes: [
        {
          label: t('LINEAR'),
          value: gradientTypes.linear
        },
        {
          label: t('LINEAR2'),
          value: gradientTypes.linear2
        },
        {
          label: t('CIRCULAR'),
          value: gradientTypes.circular
        },
        {
          label: t('DIAMOND'),
          value: gradientTypes.diamond
        },
        {
          label: t('RECTANGLE'),
          value: gradientTypes.rectangle
        }
      ],
      isImgLoading: false,
      thumbnail: {
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT
      },
      currentTabIndex: 0,
      borderSize: 0
    };

    this.toggleLockDimension = event => handler.toggleLockDimension(this, event);
    this.opacityChange = opacity => handler.opacityChange(this, opacity);
    this.brightnessChange = brightness => handler.brightnessChange(this, brightness);
    this.contrastChange = contrast => handler.contrastChange(this, contrast);
    this.saturationChange = saturation => handler.saturationChange(this, saturation);
    this.widthInput = event => handler.widthInput(this, event);
    this.heightInput = event => handler.heightInput(this, event);
    this.xInput = event => handler.xInput(this, event);
    this.yInput = event => handler.yInput(this, event);
    this.handlePropertyModalClose = () => handler.handlePropertyModalClose(this);
    this.handleCancelClick = () => handler.handleCancelClick(this);
    this.handleDoneClick = () => handler.handleDoneClick(this);
    this.getImage = encImgId => handler.getImage(this, encImgId);
    this.handleTabChange = index => handler.handleTabChange(this, index);
    this.changeFilter = filterTag => handler.changeFilter(this, filterTag);
    this.borderColorChange = color => handler.borderColorChange(this, color);
    this.borderSizeChange = borderSize => handler.borderSizeChange(this, borderSize);
    this.borderOpacityChange = opacity => handler.borderOpacityChange(this, opacity);
    this.checkModified = (oldElement, newElement) => handler.checkModified(oldElement, newElement);
    this.getGradientHtml = () => handler.getGradientHtml(this);
    this.onImageLoaded = event => handler.onImageLoaded(this, event);
    this.enableChange = gradientEnable => handler.enableChange(this, gradientEnable);
    this.gradientTypesChange = gradientType => handler.gradientTypesChange(this, gradientType);
    this.gradientOptionChange = (optionKey, optionValue) => handler.gradientOptionChange(this, optionKey, optionValue);
    this.shadowOptionChange = (optionKey, optionValue) => handler.shadowOptionChange(this, optionKey, optionValue);

    this.hideLoading = () => {
      this.setState({
        isImgLoading: false
      });
    };
  }

  componentWillReceiveProps(nextProps) {
    const gradient = get(this.state, 'gradient');
    const oldPropertyModal = get(this.props, 'propertyModal');
    const newPropertyModal = get(nextProps, 'propertyModal');
    if (!isEqual(oldPropertyModal, newPropertyModal) && newPropertyModal.isShown) {
      const { propertyModal } = nextProps;
      const { element } = propertyModal;
      let { borderSize } = this.state;
      if (!element.style) {
        element.style = merge({}, defaultStyle);
      } else {
        element.style = merge({}, defaultStyle, element.style);
      }
      if (!element.border) {
        element.border = merge({}, defaultBorder);
      } else {
        const page = get(nextProps, 'page');
        const pageWidth = page.get('width');
        borderSize = element.border.size;
      }
      this.setState({
        element,
        gradient,
        borderSize,
        currentTabIndex: 0
      });
      const oldUrl = oldPropertyModal.element ? newPropertyModal.element.computed.imgUrl : null;
      const currentUrl = newPropertyModal.element.computed.imgUrl;
      if (oldUrl === currentUrl) {
        this.setState({
          isImgLoading: false
        });
      }
    }
  }

  render() {
    const { propertyModal, allImages, t, page } = this.props;
    const { isShown, filename, imgWidth, imgHeight, ratio, securityString = { timestamp: '', token: '', customerId: -1 } } = propertyModal;

    const { element, currentTabIndex, borderSize } = this.state;
    const { style } = element;
    const { opacity, brightness, contrast, saturation, effectId, gradient, shadow } = style;

    const tabList = [t('IMAGE'), t('BORDER'), t('EFFECTS'), t('GRADIENT')];
    const needResetColor = isShown;
    const borderColor = element.border ? element.border.color : '#FFFFFF';
    const borderOpacity = element.border ? element.border.opacity : 100;

    const { x, y, computed, imgRot, encImgId, imgFlip, cropRLX, cropRLY, cropLUY, cropLUX, border } = element;
    const { width, height } = computed || {};

    const imgStyle = {};

    const elementWidth = element.width;
    const elementHeight = element.height;

    const preViewImgRatio = elementWidth > elementHeight ? (80 / elementWidth) : (80 / elementHeight);

    let borderProps = {};

    if (border && border.size) {
      const viewBorderColor = hexToRGBA(borderColor, borderOpacity);
      const viewBorderSize = element.border.size * preViewImgRatio;
      borderProps = {
        stroke: viewBorderColor,
        strokeWidth: viewBorderSize
      };
    }

    const cropOptions = getCropOptionsByLR(cropLUX, cropLUY, cropRLX, cropRLY, width, height);

    const dimensionClass = classNames('', {
      unlock: !this.state.lockDimension
    });

    let imgUrl = element.computed ? template(element.computed.filterApiTemplate)({
      px: cropOptions.px,
      py: cropOptions.py,
      pw: cropOptions.pw,
      ph: cropOptions.ph,
      encImgId,
      effectId,
      opacity,
      imgFlip,
      brightness,
      contrast,
      saturation,
      width: cropOptions.width,
      height: cropOptions.height,
      rotation: imgRot,
      shape: 'rect',
      ...securityString
    }) : '';

    if (imgUrl) {
      imgUrl += `&${qs.stringify(gradient)}`;
    }

    const { isImgLoading } = this.state;

    const imgClass = classNames('img-container', {
      show: currentTabIndex === 0
    });

    const borderClass = classNames('border-container', {
      show: currentTabIndex === 1
    });

    const effectClass = classNames('shadow-container', {
      show: currentTabIndex === 2
    });

    const gradientClass = classNames('gradient', {
      show: currentTabIndex === 3
    });

    const changeColorClass = classNames('change-color', {
      disabled: !shadow.enable
    });

    return (
      <XModal
        className="property-modal"
        onClosed={this.handlePropertyModalClose}
        opened={isShown}
      >
        <h2 className="modal-title">{t('PROPERTIES')}</h2>
        <h3 className="sub-title">{filename}</h3>
        <div className="modal-content">
          <div className="info-container">
            <div className="img">
              <XLoading isShown={isImgLoading} />
              <a>
                <PreviewImage
                  src={imgUrl}
                  ratio={preViewImgRatio}
                  borderProps={borderProps}
                  shadow={shadow}
                />
              </a>
            </div>
            <div className="params">
              <ul>
                <li>
                  <label htmlFor="x">{t('X')}:</label>
                  <input type="number" id="x" value={Math.round(x)} onChange={this.xInput} />
                </li>
                <li>
                  <label htmlFor="w">{t('W')}:</label>
                  <input type="number" id="w" value={Math.round(elementWidth)} onChange={this.widthInput} />
                </li>
                <li>
                  <label htmlFor="y">{t('Y')}:</label>
                  <input type="number" id="y" value={Math.round(y)} onChange={this.yInput} />
                </li>
                <li>
                  <label htmlFor="h">{t('H')}:</label>
                  <input type="number" id="h" value={Math.round(elementHeight)} onChange={this.heightInput} />
                </li>
              </ul>
              <div className="lock-dimension">
                <a href="javascript:void(0);" className={dimensionClass} onClick={this.toggleLockDimension} />
              </div>
            </div>
          </div>
          <div className="clear" />
          <TextPositionTabs
            initTabIndex={currentTabIndex}
            onTabChange={this.handleTabChange}
            tabList={tabList}
          />
          {
            /** Image tabcontent* */
          }
          <div className={imgClass}>
            <div className="filter-container">
              <h3>{t('FILTER')}</h3>
              <FilterImage
                effectId={effectId}
                changeFilter={this.changeFilter}
              />
            </div>
            <div className="balence-container">
              <h3>{t('BALANCE')}</h3>
              <SliderChange
                onChange={this.opacityChange}
                label={t('OPACITY')}
                subfix="%"
                min={1}
                value={opacity}
              />
              <SliderChange
                onChange={this.brightnessChange}
                label={t('BRIGHTNESS')}
                subfix=""
                min={-100}
                max={100}
                total={200}
                value={brightness}
              />
              <SliderChange
                onChange={this.contrastChange}
                label={t('CONTRAST')}
                subfix=""
                min={-100}
                max={100}
                total={200}
                value={contrast}
              />
              <SliderChange
                onChange={this.saturationChange}
                label={t('SATURATION')}
                subfix=""
                min={0}
                max={200}
                value={saturation}
              />
            </div>
          </div>
          {
            /** Border tabcontent* */
          }
          <div className={borderClass}>
            <h3>{t('STROKE')}</h3>
            <div className="change-color">
              <label>{t('COLOR')}:</label>
              <XColorPicker
                needResetColor={needResetColor}
                initHexString={borderColor}
                onColorChange={this.borderColorChange}
              />
            </div>
            <SliderChange
              onChange={this.borderSizeChange}
              value={borderSize}
              min={MIN_BORDER_SIZE}
              max={MAX_BORDER_SIZE}
              label={`${t('SIZE')}:`}
            />
            <SliderChange
              onChange={this.borderOpacityChange}
              value={borderOpacity}
              subfix="%"
              min={MIN_BORDER_OPACITY}
              max={MAX_BORDER_OPACITY}
              label={`${t('OPACITY')}`}
            />
          </div>
          {
            /** Effect tabcontent* */
          }
          <div className={effectClass}>
            <div className="gradient-header">
              <XCheckBox
                name="shadowEnable"
                checked={shadow.enable}
                subText={t('SHADOW')}
                onClicked={this.shadowOptionChange.bind(this, 'enable')}
              />
            </div>
            <div className={changeColorClass}>
              <label>{t('COLOR')}:</label>
              <XColorPicker
                needResetColor={needResetColor}
                initHexString={shadow.color}
                disabled={!shadow.enable}
                onColorChange={this.shadowOptionChange.bind(this, 'color')}
              />
            </div>
            <SliderChange
              onChange={this.shadowOptionChange.bind(this, 'angle')}
              value={shadow.angle}
              max={360}
              label={`${t('ANGLE')}:`}
              disabled={!shadow.enable}
            />
            <SliderChange
              onChange={this.shadowOptionChange.bind(this, 'opacity')}
              value={shadow.opacity}
              subfix="%"
              disabled={!shadow.enable}
              label={`${t('OPACITY')}`}
            />
            <SliderChange
              onChange={this.shadowOptionChange.bind(this, 'blur')}
              value={shadow.blur}
              disabled={!shadow.enable}
              label={`${t('BLUR')}:`}
            />
            <SliderChange
              onChange={this.shadowOptionChange.bind(this, 'distance')}
              value={shadow.distance}
              disabled={!shadow.enable}
              label={`${t('DISTANCE')}:`}
            />
          </div>
          {
            /** Gradient tabcontent* */
          }
          <div className={gradientClass}>
            <div className="gradient-header">
              <XCheckBox
                name="gradientEnable"
                checked={gradient.gradientEnable}
                subText={t('ENABLE')}
                onClicked={this.enableChange}
              />
              <XSelect
                value={gradient.gradientType}
                onChanged={this.gradientTypesChange}
                searchable={false}
                options={this.state.gradientTypes}
              />
            </div>
            {
              this.getGradientHtml()
            }
          </div>
          <div className="button-container">
            <XButton
              className="white"
              onClicked={this.handleCancelClick}
            >{t('CANCEL')}</XButton>
            <XButton
              onClicked={this.handleDoneClick}
            >{t('DONE')}</XButton>
          </div>
        </div>
      </XModal>
    );
  }
}

PropertyModal.proptype = {
  isShown: PropTypes.bool
};

export default translate('PropertyModal')(PropertyModal);
