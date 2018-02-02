import { merge, get } from 'lodash';
import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import { addEventListener, removeEventListener } from '../../../common/utils/events';

import { cameoShapeTypes, cameoSizeTypes, coverTypes, productTypes, cameoPaddingsRatio, RESIZE_LIMIT } from '../../contants/strings';

// 导入组件
import XLoading from '../../../common/ZNOComponents/XLoading';
import XWarnTip from '../../../common/ZNOComponents/XWarnTip';
import Element from '../Element';
import CameoActionBar from '../CameoActionBar';
import BgUploadImage from '../BgUploadImage';

// 导入处理函数
import * as cameoHandler from './handler/cameo';
import * as loadingHandler from './handler/loading';
import * as cameoActionBarHandler from './handler/cameoActionBarHandler';

import './index.scss';

const WARNTIP_LEFT = 10;
const WARNTIP_BOTTOM = 10;

class CameoElement extends Component {
  constructor(props) {
    super(props);

    this.onDrop = event => cameoHandler.onDrop(this, event);
    this.handleClick = event => cameoHandler.handleClick(this, event);
    this.handleDragOver = event => cameoHandler.handleDragOver(this, event);
    this.getCameoShadowStyle = (cameoShape, widthoutBleedSize, bleedSize) => cameoHandler.getCameoShadowStyle(cameoShape, widthoutBleedSize, bleedSize);

    this.showCameoActionBar = event => cameoActionBarHandler.showCameoActionBar(this, event);
    this.hideCameoActionBar = event => cameoActionBarHandler.hideCameoActionBar(this, event);

    this.actionBarHandler = {
      onCrop: event => cameoActionBarHandler.onCrop(this, event),
      onRotate: event => cameoActionBarHandler.onRotate(this, event),
      onRect: event => cameoActionBarHandler.onRect(this, event),
      onRound: event => cameoActionBarHandler.onRound(this, event),
      onClear: event => cameoActionBarHandler.onClear(this, event)
    };

    this. onImageLoaded = this. onImageLoaded.bind(this);

    this.state = {
      isShowActionBar: false,
      isImgLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const newEncImgId = nextProps.data.element.encImgId;
    const oldImgUrl = get(this.props.data.element, 'computed.imgUrl');
    const newImgUrl = get(nextProps.data.element, 'computed.imgUrl');

    if (newEncImgId && oldImgUrl !== newImgUrl && newImgUrl) {
      // 清空原来的图片.
      this.setState({
        isImgLoading: true
      });
    }
  }

  componentDidMount() {
    addEventListener(window, 'click', this.hideCameoActionBar);
  }

  componentWillUnmount() {
    removeEventListener(window, 'click', this.hideCameoActionBar);
  }

  onImageLoaded() {
    this.setState({
      isImgLoading: false
    });
  }

  render() {
    const { t, actions, data } = this.props;
    const { summary, element, rate, page, setting, parameterMap, isPreview, paginationSpread } = data;
    const { isImgLoading } = this.state;
    const imgUrl = get(element, 'computed.imgUrl');
    const scale = get(element, 'computed.scale');
    const cameoWidth = get(element, 'computed.width');
    const cameoHeight = get(element, 'computed.height');
    const cameoPositionTop = get(element, 'computed.top');
    const cameoPositionLeft = get(element, 'computed.left');

    const cameoShape = get(summary, 'cameoShape');
    const cameoBleed = get(parameterMap, 'cameoBleed');
    const cameoBleedByComputed = {
      top: get(cameoBleed, 'top') * rate,
      right: get(cameoBleed, 'right') * rate,
      bottom: get(cameoBleed, 'bottom') * rate,
      left: get(cameoBleed, 'left') * rate
    };

    const cameoSizeWithoutBleed = {
      width: (cameoWidth - (cameoBleedByComputed.left + cameoBleedByComputed.right)),
      height: (cameoHeight - (cameoBleedByComputed.top + cameoBleedByComputed.bottom))
    };

    const wrapStyle = {
      width: `${cameoWidth}px`,
      height: `${cameoHeight}px`,
      top: `${cameoPositionTop}px`,
      left: `${cameoPositionLeft}px`,
      zIndex: get(element, 'dep') + 100
    };

    // cameo-item
    const itemStyle = {
      top: `${cameoBleedByComputed.top}px`,
      left: `${cameoBleedByComputed.left}px`,
      width: `${cameoSizeWithoutBleed.width}px`,
      height: `${cameoSizeWithoutBleed.height}px`,
      borderRadius: cameoShape === cameoShapeTypes.rect
        ? `${cameoSizeWithoutBleed.width * cameoPaddingsRatio.rectCameoRadius}px`
        : `${cameoSizeWithoutBleed.width / 2}px/${cameoSizeWithoutBleed.height / 2}px`,
      zIndex: parseInt(Math.random()*100)
    };

    const cameWithBleedStyle = {
      top: `-${cameoBleedByComputed.top}px`,
      left: `-${cameoBleedByComputed.left}px`,
      width: `${cameoWidth}px`,
      height: `${cameoHeight}px`
    };

    // cameo-effect
    const renderStyle = this.getCameoShadowStyle(cameoShape, cameoSizeWithoutBleed, cameoBleedByComputed);
    // const renderStyle = {
    //   top: `${cameoBleedByComputed.top - 0}px`,
    //   left: `${cameoBleedByComputed.left - 0}px`,
    //   height: `${cameoSizeWithoutBleed.height + 0 + 0}px`,
    //   width: `${cameoSizeWithoutBleed.width + 0 + 0}px`
    // };

    const hasImage = !!get(element, 'encImgId');

    const elementActions = {
      handleClick: this.handleClick,
      handleDrop: this.onDrop,
      handleDragOver: this.handleDragOver
    };
    const elementStyle = {
      top: 0,
      left: 0,
      width: `${cameoWidth}px`,
      height: `${cameoHeight}px`
    };
    const elementData = merge({}, data, { className: 'cameo-element', style: elementStyle });

    // 图片警告图标.
    const warntipStyle = {
      left: WARNTIP_LEFT + cameoBleedByComputed.left,
      bottom: WARNTIP_BOTTOM + cameoBleedByComputed.bottom,
    };

    // 天窗的actionbar
    const cameoActionBarStyle = {
      display: this.state.isShowActionBar ? 'block' : 'none',
      position: 'absolute',
      left: `${(cameoWidth - 250) / 2}px`,
      // width: FULL_ACTION_BAR_WIDTH - removeWidth + 'px',
      bottom: '-15px'
    };

    const cameoActionBarActions = this.actionBarHandler;

    const cameoActionBarData = {
      style: cameoActionBarStyle,
      highlightIcons: {
        // todo
        // largeHightlight: setting.cameo === cameoSizeTypes.large || false,
        // mediumHightlight: setting.cameo === cameoSizeTypes.middle || false,
        // smallHightlight: setting.cameo === cameoSizeTypes.small || false,
        rectHightlight: setting.cameoShape === cameoShapeTypes.rect || false,
        roundHightlight: setting.cameoShape === cameoShapeTypes.round || setting.cameoShape === cameoShapeTypes.oval || false
      },
      roundLabel: cameoShapeTypes.round,
      hasImage,
      disabledIcons: {
        cropDisable: !hasImage,
        rotateDisable: !hasImage,
        flipDisable: !hasImage,
        // rectDisable,
        // roundDisable,
        // sDisable,
        // mDisable,
        // lDisable,
        // removeDisable
      }
    };

    return (
      <div className="cameo-wrap absolute" style={wrapStyle}>
        <div className="cameo-effect absolute" style={renderStyle}>
          <img className="effect-img" src={`./assets/cameo/${cameoShape}.png`} />
        </div>
        <div className="cameo-item absolute" style={itemStyle}>
          {
            (isPreview || hasImage) ? null : (
              <BgUploadImage
                viewWidth={cameoSizeWithoutBleed.width}
                viewHeight={cameoSizeWithoutBleed.height}
                hasImage={hasImage}
              />
            )
          }

          <div className="cameo-item-with-bleed absolute" style={cameWithBleedStyle}>
            <Element actions={elementActions} data={elementData}>
              <div>
                <div className="layer-image">
                  <XLoading isShown={isImgLoading} />
                </div>

                {
                 imgUrl
                 ? (
                   <img
                     className="cameo-img"
                     src={imgUrl}
                     onLoad={this.onImageLoaded}
                     onError={this.onImageLoaded}
                   />
                  )
                 : null
                }

                {
                  isPreview
                  ? null
                  : (
                    <XWarnTip
                      isShown={scale > RESIZE_LIMIT}
                      title={t('BEYOND_SIZE_TIP', { n: scale, m: RESIZE_LIMIT })}
                      left={WARNTIP_LEFT + cameoBleedByComputed.left}
                      bottom={WARNTIP_LEFT + cameoBleedByComputed.left}
                    />
                  )
                }
              </div>
            </Element>
          </div>
        </div>

        {/* 天窗的action bar */}
        <CameoActionBar actions={cameoActionBarActions} data={cameoActionBarData} />
      </div>
    );
  }
}

export default translate('CameoElement')(CameoElement);
