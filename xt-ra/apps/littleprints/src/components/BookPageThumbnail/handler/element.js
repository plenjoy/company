import { template, merge, get } from 'lodash';
import Immutable from 'immutable';
import { elementTypes, imageShapeTypes, pageTypes } from '../../../constants/strings';
import { hexString2Number, hexToRGBA } from '../../../../../common/utils/colorConverter';
import { toDecode, isEncode, toEncode } from '../../../../../common/utils/encode';
import { getPxByPt } from '../../../../../common/utils/math';
import securityString from '../../../../../common/utils/securityString';

import { getScale } from '../../../utils/scale';

import {
  IMAGES_CROPPER_PARAMS,
  IMAGES_CROPPER,
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  TEXT_SRC,
  CALENDAR_IMAGE
} from '../../../constants/apiUrl';

import { getCropOptions, getCropOptionsByLR } from '../../../utils/crop';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;


// 计算缩放比例
export const getCurrentScale = (that, element) => {
  const { data } = that.props;
  const { images } = data;
  let scale;
  const {
    imgRot,
    width,
    height,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY,
    encImgId
  } = element.toJS();
  let imageDetail = images.get(encImgId);
  if (imageDetail) {
    scale = getScale({
      imgRot,
      imageDetail,
      width,
      height,
      cropRLX,
      cropLUX,
      cropRLY,
      cropLUY
    });
  } else {
    scale = 0;
  }
  return scale;
};

/**
 * 计算element的显示时的宽高和left,top值.
 * @param  {object} that BookPage的this指向
 * @param  {object} element 原始数据
 * @param  {number} ratio 原始值与显示值的缩放比
 */
export const computedElementOptions = (that, element, workspaceRatio) => {
  const { data } = that.props;
  const { urls, page, images, settings } = data;
  const ratio = workspaceRatio || data.ratio.workspace;

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
          const shape = 'rect';

          let filterOptions = {
            effectId: 0,
            opacity: 100,
            brightness: 0,
            contrast: 0,
            saturation: 100
          };

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
          obj.keepRatio = false;


          obj.corpApiTemplate = template(IMAGES_CROPPER)({
            baseUrl: urls.baseUrl
          }) + IMAGES_CROPPER_PARAMS;
          obj.filterApiTemplate = template(IMAGES_API)({
            baseUrl: urls.baseUrl
          }) + IMAGES_FILTER_PARAMS;

          obj.scale = getCurrentScale(that, element);
        }

        // 计算border
        const border = element.get('border');
        if (border) {
          if (!border.get('size')) {
            obj.border = 'none';
          } else {
            const rbga = hexToRGBA(border.get('color'), border.get('opacity'));
            obj.border = `${Math.round(border.get('size') * ratio)}px solid ${rbga}`;
          }
        }
      }
      break;
    }
    case elementTypes.calendar: {
      const productType = get(settings, 'spec.product');
      const size = get(settings, 'spec.size');
      const month = element.get('month');
      const dateStyle = get(settings, 'spec.dateStyle');
      const fixedMonth = month && month < 10 ? '0' + month : month;
      const year = element.get('year');
      const calendarBaseUrl = urls.calendarBaseUrl;
      const baseUrl = urls.baseUrl;
      obj.imgUrl = productType && size
          ? template(CALENDAR_IMAGE)({
            dateStyle,
            productType,
            size,
            month: fixedMonth,
            year,
            baseUrl,
            imageSize: 700,
            ...securityString
          })
          : null;
      break;
    }
    default:
  }

  return Immutable.fromJS(obj);
};
