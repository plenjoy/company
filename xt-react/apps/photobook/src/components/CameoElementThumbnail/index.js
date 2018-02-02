import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge } from 'lodash';
import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';
import {
  cameoShapeTypes,
  cameoPaddings,
  cameoSizeTypes
} from '../../contants/strings';
import projectParser from '../../../../common/utils/projectParser';

import './index.scss';

// 导入组件
import Element from '../Element';
import CameoActionBar from '../CameoActionBar';
import XLoading from '../../../../common/ZNOComponents/XLoading';

// 导入处理函数
import * as handler from './handler';

class CameoElementThumbnail extends Component {
  constructor(props) {
    super(props);

    this.getCameoBackgroundImage = cameoShape =>
      handler.getCameoBackgroundImage(this, cameoShape);
    this.hideLoading = () => handler.hideLoading(this);
    this.lazyLoadingImage = imgUrl => handler.lazyLoadingImage(this, imgUrl);

    this.state = {
      src: '',
      isImgLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // 懒加载图片.
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    const oldImgUrl = oldElement.getIn(['computed', 'imgUrl']);
    const newImgUrl = newElement.getIn(['computed', 'imgUrl']);

    if (oldImgUrl !== newImgUrl) {
      if (newImgUrl) {
        this.setState({
          src: newImgUrl
        });
      } else {
        this.setState({
          src: ''
        });
      }
    }
  }

  componentWillMount() {
    const element = this.props.data.element;
    const imgUrl = element.getIn(['computed', 'imgUrl']);
    if (imgUrl) {
      this.lazyLoadingImage(imgUrl);
    }
  }

  render() {
    const { t, actions, data } = this.props;
    const {
      summary,
      element,
      ratio,
      page,
      parameters,
      setting,
      specData
    } = data;
    const {
      configurableOptionArray,
      allOptionMap,
      disableOptionArray
    } = specData;
    const availableOptionMap = projectParser.getAvailableOptionMap(
      setting,
      configurableOptionArray,
      allOptionMap,
      disableOptionArray
    );
    const availCameoSizeTypes = availableOptionMap.cameo;
    const availCameoShapeTypes = availableOptionMap.cameoShape;

    const cameoShape = element.get('cameoShape');
    const cameoImg = element.getIn(['computed', 'imgUrl']);
    const hasImage = !!element.get('encImgId');

    // 获取天窗的出血.
    const cameoBleed = parameters.get('cameoBleed');
    const cameoBleedByComputed = {
      top: cameoBleed ? cameoBleed.get('top') * ratio.workspace : 0,
      right: cameoBleed ? cameoBleed.get('right') * ratio.workspace : 0,
      bottom: cameoBleed ? cameoBleed.get('bottom') * ratio.workspace : 0,
      left: cameoBleed ? cameoBleed.get('left') * ratio.workspace : 0
    };

    // 天窗的大小(包含出血部分)
    const cameoSize = {
      width: element.get('pw') * page.get('width') * ratio.workspace,
      height: element.get('ph') * page.get('height') * ratio.workspace
    };

    // 天窗的偏移量.
    const cameoPosition = {
      left: element.get('px') * page.get('width') * ratio.workspace,
      top: element.get('py') * page.get('height') * ratio.workspace
    };

    const cameoSizeWithoutBleed = {
      width:
        cameoSize.width -
        (cameoBleedByComputed.left + cameoBleedByComputed.right),
      height:
        cameoSize.height -
        (cameoBleedByComputed.top + cameoBleedByComputed.bottom)
    };

    const cameoEffectPaddings = {
      left: cameoSizeWithoutBleed.width * ratio.cameoLeft,
      top: cameoSizeWithoutBleed.width * ratio.cameoTop,
      right: cameoSizeWithoutBleed.width * ratio.cameoLeft,
      bottom: cameoSizeWithoutBleed.width * ratio.cameoTop
    };

    const wrapStyle = {
      width: `${cameoSize.width}px`,
      height: `${cameoSize.height}px`,
      top: `${cameoPosition.top}px`,
      left: `${cameoPosition.left}px`,

      // 90是最低的. 为了使cameo不会挡住其他元素.
      // painted text等都要比cameo高.
      zIndex: 90
    };

    // cameo-item
    const itemStyle = {
      top: `${cameoBleedByComputed.top}px`,
      left: `${cameoBleedByComputed.left}px`,
      width: `${cameoSizeWithoutBleed.width}px`,
      height: `${cameoSizeWithoutBleed.height}px`,
      borderRadius:
        cameoShape === cameoShapeTypes.rect
          ? 0
          : `${cameoSizeWithoutBleed.width /
              2}px/${cameoSizeWithoutBleed.height / 2}px`
    };
    const cameWithBleedStyle = {
      top: `${-cameoBleedByComputed.top}px`,
      left: `${-cameoBleedByComputed.left}px`,
      width: `${cameoSize.width}px`,
      height: `${cameoSize.height}px`
    };

    // cameo-effect
    const renderStyle = {
      top: `${cameoBleedByComputed.top - cameoEffectPaddings.top}px`,
      left: `${cameoBleedByComputed.left - cameoEffectPaddings.left}px`,
      height: `${cameoSizeWithoutBleed.height +
        cameoEffectPaddings.top +
        cameoEffectPaddings.bottom}px`,
      width: `${cameoSizeWithoutBleed.width +
        cameoEffectPaddings.left +
        cameoEffectPaddings.right}px`
    };

    // element
    const elementActions = {};
    const elementData = merge(
      {},
      data,
      { className: 'cameo-element', style: cameWithBleedStyle },
      { setCursorDefault: true }
    );

    return (
      <div className="cameo-wrap-thumbnail absolute" style={wrapStyle}>
        <div className="cameo-effect absolute" style={renderStyle}>
          <img
            className="effect-img"
            src={this.getCameoBackgroundImage(cameoShape)}
          />
        </div>
        <div className="cameo-item absolute" style={itemStyle}>
          <div
            className="cameo-item-with-bleed absolute"
            style={cameWithBleedStyle}
          >
            <Element actions={elementActions} data={elementData}>
              <div>
                <div className="layer-image">
                  <XLoading isShown={this.state.isImgLoading} />
                </div>

                {this.state.src ? (
                  <img
                    className="cameo-img"
                    src={this.state.src}
                    onLoad={this.hideLoading}
                    onError={this.hideLoading}
                  />
                ) : null}
              </div>
            </Element>
          </div>
        </div>
      </div>
    );
  }
}

CameoElementThumbnail.propTypes = {};

CameoElementThumbnail.defaultProps = {};

export default translate('CameoElement')(CameoElementThumbnail);
