import Immutable from 'immutable';
import { template, merge } from 'lodash';
import { getScale } from '../../../utils/scale';
import { elementTypes, pageTypes } from '../../../contants/strings';
import { hexString2Number } from '../../../../../common/utils/colorConverter';
import { toDecode, isEncode, toEncode } from '../../../../../common/utils/encode';
import qs from 'qs';
import { hexToRGBA } from '../../../../../common/utils/colorConverter';

import {
  IMAGES_CROPPER_PARAMS,
  IMAGES_CROPPER,
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  TEXT_SRC,
  PAINETEXT_SRC,
  STICKER_SRC
} from '../../../contants/apiUrl';

import { getCropOptions, getCropOptionsByLR } from '../../../utils/crop';
import { getPxByPt, getPtByPx } from '../../../../../common/utils/math';
import { getFontSizeInPt } from '../../../utils/fontSize';

const MIN_PHOTO_HEIGHT = 180;
const MIN_PHOTO_WIDTH = 180;
const MIN_TEXT_HEIGHT = 140;
const MIN_TEXT_WIDTH = 140;

// 计算缩放比例
export const getCurrentScale = (that, nextProps, element) => {
  const lastImages = nextProps.data.images;
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
  const lastImageDetail = lastImages.get(encImgId);
  imageDetail = imageDetail || lastImageDetail;
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

export const computedElementOptions = (that, nextProps, element, workspaceRatio) => {
  const { data } = nextProps || that.props;
  const { urls, page, images, summary, parameters} = data;

  const ratio = workspaceRatio || data.ratio.workspace;
  const isCover = summary.get('isCover');

  const obj = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    imgUrl: ''
  };

  const imageRotate = element.get('imgRot');
  const imgFlip = element.get('imgFlip');
  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  // 计算element的显示宽高.
  obj.width = Math.round(pageWidth * element.get('pw') * ratio);
  obj.height = Math.round(pageHeight * element.get('ph') * ratio);

  // 计算element的left和top值
  obj.left = Math.ceil(pageWidth * element.get('px') * ratio);
  obj.top = Math.ceil(pageHeight * element.get('py') * ratio);

  if(isCover && page.get('type') === pageTypes.full && page.getIn(['backend', 'isPrint'])){
    // 重新计算, 渲染时要减去书脊的压线.
    const expandingOverFrontcover = parameters.getIn(['spineExpanding', 'expandingOverFrontcover']);
    const expandingOverBackcover = parameters.getIn(['spineExpanding', 'expandingOverBackcover']);
    obj.left = Math.ceil((pageWidth * element.get('px') - expandingOverFrontcover - expandingOverBackcover) * ratio);
    obj.top = Math.ceil(pageHeight * element.get('py') * ratio);
  }

  // 计算获取裁剪图片的地址.
  const encImgId = element.get('encImgId');

  switch (element.get('type')) {
    case elementTypes.text:
      {
        const text = element.get('text');
        const fontSizePercent = element.get('fontSize');
        const fontSizeInPt = getFontSizeInPt(
          fontSizePercent * page.get('height')
        );

        const originalFontSize = getPxByPt(fontSizeInPt);
        const fontColor = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

        if (data.page.get('type') === pageTypes.spine) {
          // 兼容移动端.
          const w = obj.width;
          const h = obj.height;
          if(w > h){
            obj.width = h;
            obj.height = w;
          }

          let eW = element.get('pw') * pageWidth;
          let eH = element.get('ph') * pageHeight;
          if(eW > eH){
            eW = element.get('ph') * pageHeight;
            eH = element.get('pw') * pageWidth;
          }

          // 计算element的left和top值
          obj.left = Math.ceil(((pageWidth - eW) / 2) * ratio);
          obj.top = Math.ceil(((pageHeight - eH) / 2) * ratio);

          obj.imgUrl = text ? template(TEXT_SRC)({
            // 兼容老数据.
            text: toEncode(text),
            fontSize: originalFontSize,
            fontColor: hexString2Number(fontColor),
            fontFamily: element.get('fontFamily'),
            width: pageWidth * element.get('pw'),
            height: pageHeight * element.get('ph'),
            originalWidth: pageWidth * element.get('pw'),
            originalHeight: pageHeight * element.get('ph'),
            originalFontSize,
            baseUrl: urls.baseUrl,
            textAlign: element.get('textAlign'),
            verticalTextAlign: element.get('textVAlign'),
            ratio
          }) : null;
        } else {
          obj.imgUrl = text ? template(TEXT_SRC)({
            // 兼容老数据.
            text: toEncode(text),
            fontSize: originalFontSize,
            fontColor: hexString2Number(fontColor),
            fontFamily: element.get('fontFamily'),
            width: pageWidth * element.get('pw'),
            height: pageHeight * element.get('ph'),
            originalWidth: pageWidth * element.get('pw'),
            originalHeight: pageHeight * element.get('ph'),
            originalFontSize,
            baseUrl: urls.baseUrl,
            textAlign: element.get('textAlign'),
            verticalTextAlign: element.get('textVAlign'),
            ratio
          }) : null;
        }

        obj.minHeight = MIN_TEXT_HEIGHT * ratio;
        obj.minWidth = MIN_TEXT_WIDTH * ratio;
        break;
      }
    case elementTypes.photo:
      {
        obj.keepRatio = false;
        obj.minHeight = MIN_PHOTO_HEIGHT * ratio;
        obj.minWidth = MIN_PHOTO_WIDTH * ratio;

        if (encImgId) {
          let cropOptions = null;
          // 如果cropRLY为0, 表示新增的.
          if (!element.get('cropRLY')) {
            const image = images ? images.get('encImgId') : null;
            if (image) {
              cropOptions = getCropOptions(
                image.width,
                image.height,
                obj.width,
                obj.height,
                imageRotate
              );
            }
          } else {
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

            let filterOptions = {
              effectId: 0,
              opacity: 100
            };

            if (element.get('style')) {
              filterOptions = element.get('style').toJS();
            }

            obj.imgUrl = encImgId ? template(`${IMAGES_API}${IMAGES_FILTER_PARAMS}`)(merge({}, cropOptions, filterOptions, {
              encImgId,
              imgFlip,
              shape,
              rotation: imageRotate,
              baseUrl: urls.baseUrl
            })) : null;

            obj.corpApiTemplate = template(IMAGES_CROPPER)({
              baseUrl: urls.baseUrl
            }) + IMAGES_CROPPER_PARAMS;
            obj.filterApiTemplate = template(IMAGES_API)({
              baseUrl: urls.baseUrl
            }) + IMAGES_FILTER_PARAMS;
            obj.scale = getCurrentScale(that, nextProps, element);
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
    default:
  }

  return Immutable.Map(obj);
};
