import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import { cameoShapeTypes, shapeType, RESIZE_LIMIT, cameoPaddingsRatio } from '../../contants/strings';
import { backgroundTextElementName, defaultTextColor } from '../../contants/canvas';
import { Image, Group, Rect, Text, Arc } from 'react-konva';
import * as helperHandler from '../../utils/canvas/helper';
import Immutable from 'immutable';
// 导入处理函数
import * as cameoHandler from './handler/cameo';
// 导入默认设置
import * as canvasOptions from '../../contants/canvas';
import { loadImg } from '../../utils/image';
import { getCropRect } from '../../utils/crop';

class CameoElementShot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cameoShapeImageObj: null,
      cameoImageObj: null,
      isLoading: false
    };
    this.getCameoBackgroundImage = cameoShape => cameoHandler.getCameoBackgroundImage(this, cameoShape);
    this.loadImg = url => loadImg(url);
  }

  componentWillReceiveProps(nextProps) {
    const { summary, cameoElementAttrs, element } = this.props;
    const newElement = nextProps.element;
    const imgUrl = element.getIn(['computed', 'imgUrl']);
    const newImgUrl = newElement.getIn(['computed', 'imgUrl']);
    const cameoShape = summary.get('cameoShape');
    const cameoFfectImageUrl = this.getCameoBackgroundImage(cameoShape);
    if (cameoFfectImageUrl) {
      this.loadImg(cameoFfectImageUrl).then(obj => this.setState({ cameoFfectImageObj: obj.img }), () => {});
    }
    if (imgUrl != newImgUrl && newImgUrl) {
      this.setState({ isLoading: true });
      this.loadImg(newImgUrl).then(
        (obj) => {
          this.setState({ cameoImageObj: obj.img, isLoading: false });
        }, () => {}
        );
    }
  }


  componentDidMount() {
    const { summary, cameoElementAttrs, element } = this.props;
    const imgUrl = element.getIn(['computed', 'imgUrl']);
    const cameoShape = summary.get('cameoShape');
    const cameoFfectImageUrl = this.getCameoBackgroundImage(cameoShape);
    if (cameoFfectImageUrl) {
      this.loadImg(cameoFfectImageUrl).then(obj => this.setState({ cameoFfectImageObj: obj.img }), () => {});
    }
    if (imgUrl) {
      this.setState({ isLoading: true });
      this.loadImg(imgUrl).then(obj => this.setState({ cameoImageObj: obj.img, isLoading: false }), () => {});
    }
  }

  render() {
    const { element, isPreview, summary, ratio, settings, parameters, paginationSpread, actions, t } = this.props;
    const { isLoading } = this.state;
    const {
      imgUrl,
      offset,
      x,
      y,
      width,
      height,
      zIndex,
    } = helperHandler.getRenderElementOptions(element);
    const cameoElementAttrs = {
      x,
      y,
      width,
      height,
      offset,
      zIndex,
      id: shapeType.cameoElement,
      rotation: element.get('rot'),
      draggable: false,
      name: 'element'
    };
    const cameoShape = summary.get('cameoShape');
    const { cameoFfectImageObj, cameoImageObj } = this.state;
    const cameoSize = {
      x,
      y,
      width,
      height
    };

    // 根据元素的crop信息计算需要从原图中截取的rect
    const crop = getCropRect(element.toJS(), cameoImageObj);

    // 获取天窗的出血.
    const cameoBleed = parameters.get('cameoBleed');
    const cameoBleedByComputed = {
      top: cameoBleed ? cameoBleed.get('top') * ratio.workspace : 0,
      right: cameoBleed ? cameoBleed.get('right') * ratio.workspace : 0,
      bottom: cameoBleed ? cameoBleed.get('bottom') * ratio.workspace : 0,
      left: cameoBleed ? cameoBleed.get('left') * ratio.workspace : 0
    };

    const cameoSizeWithoutBleed = {
      width: (cameoSize.width - (cameoBleedByComputed.left + cameoBleedByComputed.right)),
      height: (cameoSize.height - (cameoBleedByComputed.top + cameoBleedByComputed.bottom))
    };

    const cameoEffectPaddings = {
      left: cameoSizeWithoutBleed.width * cameoPaddingsRatio.rectCameoPaddingTop,
      top: cameoSizeWithoutBleed.width * cameoPaddingsRatio.rectCameoPaddingLeft,
      right: cameoSizeWithoutBleed.width * cameoPaddingsRatio.roundCameoPaddingTop,
      bottom: cameoSizeWithoutBleed.width * cameoPaddingsRatio.roundCameoPaddingLeft
    };

    // 由于使用了group它的定位方式和原来css一模一样
    // cameo-effect
    const effectRenderStyle = {
      y: (cameoBleedByComputed.top - cameoEffectPaddings.top + 2),
      x: (cameoBleedByComputed.left - cameoEffectPaddings.left),
      height: (cameoSizeWithoutBleed.height + cameoEffectPaddings.top + cameoEffectPaddings.bottom - 3),
      width: (cameoSizeWithoutBleed.width + cameoEffectPaddings.left + cameoEffectPaddings.right + 3),
    };
    const cameoEffectImageProps = {
      ref: 'imageNode',
      image: cameoFfectImageObj,
      x: effectRenderStyle.x,
      y: effectRenderStyle.y,
      width: effectRenderStyle.width,
      height: effectRenderStyle.height,
      id: shapeType.cameoElementEffect
    };

    // cameo-item rect
    const cameoRectStyle = {
      y: cameoBleedByComputed.top,
      x: cameoBleedByComputed.left,
      width: cameoSizeWithoutBleed.width,
      height: cameoSizeWithoutBleed.height,
    };
    const cameoRectProps = merge({}, cameoElementAttrs, canvasOptions.defaultCameoRectFrame, cameoRectStyle);

    // cameo-item hasimgUrl
    const cameoImgStyle = {
      ref: 'imageNode',
      image: cameoImageObj,
      y: cameoBleedByComputed.top,
      x: cameoBleedByComputed.left,
      width: cameoSizeWithoutBleed.width,
      height: cameoSizeWithoutBleed.height,
    };
    const cameoImgProps = merge({}, cameoElementAttrs, canvasOptions.defaultCameoRectFrame, cameoImgStyle, {crop});


     // cameo-text
    const cameoTextSize = 14;
    const cameoTextStyle = {
      x: 0,
      y: (cameoSize.height - cameoTextSize) / 2,
      padding: 10,
      fill: '#333333',
      fontFamily: 'Gotham SSm A',
      // 设置一下文本容器的大小. 以至于我们可以设置align做水平居中.
      width: cameoSize.width,
      align: 'center',
      text: t('DRAG_AND_DROP_TIP'),
      fontSize: cameoTextSize,
      // konva上的默认名称
      name: backgroundTextElementName,
      id: shapeType.backgroundElement
    };


    // Group设置为CameoElementAttr 的x,y
    let groupShapeProps = {};
    const imgGroupShapeProps = {};
    if (cameoShape === cameoShapeTypes.oval || cameoShape === cameoShapeTypes.round) {
      if (Math.floor(cameoSize.height) !== Math.floor(cameoSize.width)) {
        groupShapeProps = {
          clipFunc(ctx) {
            cameoHandler.Ellipse(ctx, cameoSize.width / 2, cameoSize.height / 2, cameoSizeWithoutBleed.width / 2, cameoSizeWithoutBleed.height / 2);
          }
        };
      } else {
        groupShapeProps = {
          clipFunc(ctx) {
            ctx.arc(cameoSize.width / 2, cameoSize.height / 2, cameoSizeWithoutBleed.width / 2, 0, Math.PI * 2, false);
          }
        };
      }
    }
    const bigGroupStyle = merge({}, cameoElementAttrs);
    const groupStyle = merge({}, cameoElementAttrs, { x: 0, y: 0, offset: { x: 0, y: 0 } }, groupShapeProps);
    const backgroundGroupStyle = merge({}, { x: 0, y: 0 });

    return (
      <Group {...bigGroupStyle}>
        <Group {...backgroundGroupStyle}>
          <Image {...cameoEffectImageProps} />
        </Group>
        <Group {...groupStyle}>
          {
            (imgUrl && cameoImageObj) ? <Image {...cameoImgProps} /> : <Rect {...cameoRectProps} />
          }
        </Group>
      </Group>
    );
  }
}

export default translate('CameoElementShot')(CameoElementShot);
