import { template, merge, get } from 'lodash';
import Immutable from 'immutable';
import qs from 'qs';
import { elementTypes, imageShapeTypes, pageTypes } from '../../../contants/strings';
import { hexString2Number, hexToRGBA } from '../../../../../common/utils/colorConverter';
import { getShadowOffset } from '../../../../../common/utils/shadow';
import { toDecode, isEncode, toEncode } from '../../../../../common/utils/encode';
import securityString from '../../../../../common/utils/securityString';
import { getPxByPt } from '../../../../../common/utils/math';

import {
  IMAGES_CROPPER_PARAMS,
  IMAGES_CROPPER,
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  BACKGROUND_FILTER_PARAMS,
  TEXT_SRC,
  PAINETEXT_SRC,
  THEME_STICKER_SRC,
  BACKGROUND_SRC
} from '../../../contants/apiUrl';

import {
  defaultStyle
} from '../../../contants/strings';

import { getCropOptions, getCropOptionsByLR } from '../../../utils/crop';
import { getReneringStickerSize } from '../../../utils/sticker';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;

/**
 * 计算element的显示时的宽高和left,top值.
 * @param  {object} that BookPage的this指向
 * @param  {object} element 原始数据
 * @param  {number} ratio 原始值与显示值的缩放比
 */
export const computedElementOptions = (that, element, workspaceRatio) => {
  const { data } = that.props;
  const { urls, page, images, settings, env } = data;
  const ratio = workspaceRatio || data.ratio.workspace;

  // 天窗形状.
  const cameShape = get(settings, 'spec.cameoShape');

  const obj = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    imgUrl: ''
  };

  const imageRotate = element.get('imgRot');
  const imgFlip = element.get('imgFlip');

  // 计算element的显示宽高.
  obj.width = element.get('width') * ratio;
  obj.height = element.get('height') * ratio;

  // 计算element的left和top值
  obj.left = element.get('x') * ratio;
  obj.top = element.get('y') * ratio;

  // 计算获取裁剪图片的地址.
  const encImgId = element.get('encImgId');

  switch (element.get('type')) {
    case elementTypes.paintedText: {
      if (data.page.get('type') === pageTypes.spine) {
      // 如果为spin他的宽和高计算函数
        obj.width = element.get('width') * ratio;
        obj.height = element.get('height') * ratio;
        obj.left = element.get('x') * ratio;
        obj.top = element.get('y') * ratio;
        const text = element.get('text');
        const fontSizePercent = element.get('fontSize');
        const originalFontSize = fontSizePercent * page.get('height');
        const scale = 1 / ratio;
        const color = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

        // spin 接口参数
        //  align:center font:Roboto height:33.15191666666667 color:0 text:2223333 ratio:0.8199999999999995 width:667.9878048780491
        obj.imgUrl = text ? template(PAINETEXT_SRC)({
          // 兼容老数据.
          text: toEncode(text),

          color: hexString2Number(color),
          fontFamily: element.get('fontFamily'),
          width: element.get('height'),
          height: element.get('width'),
          baseUrl: urls.baseUrl,
          ratio
        }) : null;
      } else {
        const text = element.get('text');
        const fontSizePercent = element.get('fontSize');
        const originalFontSize = fontSizePercent * page.get('height');
        const scale = 1 / ratio;
        const fontColor = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

        obj.imgUrl = text ? template(TEXT_SRC)({
          // 兼容老数据.
          text: toEncode(text),

          fontSize: originalFontSize,
          fontColor: hexString2Number(fontColor),
          fontFamily: element.get('fontFamily'),
          width: element.get('width'),
          height: element.get('height'),
          originalWidth: element.get('width'),
          originalHeight: element.get('height'),
          originalFontSize,
          baseUrl: urls.baseUrl,
          textAlign: element.get('textAlign'),
          verticalTextAlign: element.get('textVAlign'),
          ratio
        }) : null;
      }
      break;
    }
    case elementTypes.text: {
      if (data.page.get('type') === pageTypes.spine) {
            // 如果为spin他的宽和高计算函数
        obj.width = element.get('width') * ratio;
        obj.height = element.get('height') * ratio;
        obj.left = element.get('x') * ratio;
        obj.top = element.get('y') * ratio;
        const text = element.get('text');
        const fontSizePercent = element.get('fontSize');
        const originalFontSize = fontSizePercent * page.get('height');
        const scale = 1 / ratio;
        const color = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

        // spin 接口参数
        //  align:center font:Roboto height:33.15191666666667 color:0 text:2223333 ratio:0.8199999999999995 width:667.9878048780491
        obj.imgUrl = text ? template(PAINETEXT_SRC)({
          // 兼容老数据.
          text: toEncode(text),

          color: hexString2Number(color),
          fontFamily: element.get('fontFamily'),
          width: element.get('height'),
          height: element.get('width'),
          baseUrl: urls.baseUrl,
          ratio
        }) : null;
      } else {
        const text = element.get('text');
        const fontSizePercent = element.get('fontSize');
        const originalFontSize = fontSizePercent * page.get('height');
        const scale = 1 / ratio;

        const fontColor = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

        obj.imgUrl = template(TEXT_SRC)({
        // 兼容老数据.
          text: toEncode(text),

          fontSize: originalFontSize,
          fontColor: hexString2Number(fontColor),
          fontFamily: element.get('fontFamily'),
          width: element.get('width'),
          height: element.get('height'),
          originalWidth: element.get('width'),
          originalHeight: element.get('height'),
          originalFontSize,
          baseUrl: urls.baseUrl,
          textAlign: element.get('textAlign'),
          verticalTextAlign: element.get('textVAlign'),
          ratio
        });
      }
      break;
    }
    case elementTypes.sticker : {
      obj.imgUrl = template(THEME_STICKER_SRC)({
        baseUrl: urls.baseUrl,
        stickerCode: element.get('decorationId'),
        size: 96
      });
      obj.keepRatio = true;
      break;
    }
    case elementTypes.background: {
      if (element.get('backgroundId')) {
        if (element.get('cropRLY')) {
          const cropOptions = getCropOptionsByLR(
            element.get('cropLUX'),
            element.get('cropLUY'),
            element.get('cropRLX'),
            element.get('cropRLY'),
            obj.width,
            obj.height
          );
          const imageUrl = template(BACKGROUND_SRC)({
            calendarBaseUrl: urls.calendarBaseUrl,
            backgroundCode: element.get('backgroundId'),
            size: getReneringStickerSize(obj.width, obj.height),
            suffix: element.get('suffix') || 'jpg'
          });
          obj.imgUrl = template(`${IMAGES_API}${BACKGROUND_FILTER_PARAMS}`)(
            merge({}, cropOptions, {
              imageUrl,
              rotation: element.get('imgRot'),
              baseUrl: urls.baseUrl,
              ...securityString
            })
          );
        }
      }
      break;
    }
    case elementTypes.cameo :
    case elementTypes.photo: {
      if (encImgId) {
        let cropOptions = null;

        // 如果cropRLY为0, 表示新增的.
        if (element.get('cropRLY')) {
          cropOptions = getCropOptionsByLR(
            element.get('cropLUX'),
            element.get('cropLUY'),
            element.get('cropRLX'),
            element.get('cropRLY'),
            obj.width,
            obj.height
          );
        }

        if (cropOptions) {
          // const shape = element.get('type') === elementTypes.cameo ?
          //   (cameShape === imageShapeTypes.rect ? 'rect' : 'oval') : 'rect';
          const shape = 'rect';

          let filterOptions = merge({}, defaultStyle);

          if (element.get('style')) {
            filterOptions = merge({}, filterOptions, element.get('style').toJS());
          }

          obj.imgUrl = template(`${IMAGES_API}${IMAGES_FILTER_PARAMS}`)(merge(
            {}, cropOptions, filterOptions, {
              encImgId,
              imgFlip,
              shape,
              rotation: imageRotate,
              baseUrl: urls.baseUrl,
              ...securityString
            }
          ));

          if (element.getIn(['style', 'gradient'])) {
            obj.imgUrl += `&${qs.stringify(element.getIn(['style', 'gradient']).toJS())}`
          }

          obj.keepRatio = false;


          obj.corpApiTemplate = template(IMAGES_CROPPER)({
            baseUrl: urls.baseUrl
          }) + IMAGES_CROPPER_PARAMS;
          obj.filterApiTemplate = template(IMAGES_API)({
            baseUrl: urls.baseUrl
          }) + IMAGES_FILTER_PARAMS;
        }

        // 计算border
        const border = element.get('border');
        if (border) {
          if (!border.get('size')) {
            obj.border = 'none';
          } else {
            const rbga = hexToRGBA(border.get('color'), border.get('opacity'));
            obj.border = `${Math.ceil(border.get('size') * ratio)}px solid ${rbga}`;
          }
        }

        const shadow = element.getIn(['style', 'shadow']);
        if (shadow && shadow.get('enable')) {
          const { x, y } = getShadowOffset(shadow.get('angle'), shadow.get('distance') * ratio);
          obj.shadow = {
            shadowColor: shadow.get('color'),
            shadowBlur: shadow.get('blur') * ratio,
            shadowEnabled: shadow.get('enable'),
            shadowOpacity: shadow.get('opacity') / 100,
            shadowOffsetX: x,
            shadowOffsetY: y
          };
        }
      }
      break;
    }
    default:
  }

  // 只要其中的width或height为0, 那么就不要请求图片, 因为该数据就是无效的图片路径, 会引起服务器返回601错误.
  if (!obj.width || !obj.height) {
    obj.imgUrl = '';
  }

  return Immutable.fromJS(obj);
};
