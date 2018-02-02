import Immutable from 'immutable';
import { template, merge,get } from 'lodash';
import { getScale } from '../../../utils/scale';
import qs from 'qs';
import { elementTypes, pageTypes,downloadStatus } from '../../../contants/strings';
import { hexString2Number } from '../../../../../common/utils/colorConverter';
import { getOriImageWidth } from '../../../utils/image';
import { getShadowOffset } from '../../../../../common/utils/shadow';
import securityString from '../../../../../common/utils/securityString';
import {
  toDecode,
  isEncode,
  toEncode
} from '../../../../../common/utils/encode';

import { hexToRGBA } from '../../../../../common/utils/colorConverter';

import {
  IMAGES_CROPPER_PARAMS,
  IMAGES_CROPPER,
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  BACKGROUND_FILTER_PARAMS,
  BACKGROUND_CROPPER_PARAMS,
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
import {
  computedSpineElementOptions,
  computedTextElementOptions
} from '../../../utils/spine';

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

export const computedElementOptions = (
  that,
  nextProps,
  element,
  workspaceRatio
) => {
  const { data } = nextProps || that.props;
  const { urls, page, images } = data;
  const ratio = workspaceRatio || data.ratio.workspace;

  let obj = {
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

  // 计算element的显示宽高
  obj.width = pageWidth * element.get('pw') * ratio;
  obj.height = pageHeight * element.get('ph') * ratio;

  // 计算element的left和top值
  obj.left = pageWidth * element.get('px') * ratio;
  obj.top = pageHeight * element.get('py') * ratio;

  // 计算获取裁剪图片的地址.
  const encImgId = element.get('encImgId');

  switch (element.get('type')) {
    case elementTypes.paintedText: {
      if (data.page.get('type') === pageTypes.spine) {
        obj = computedSpineElementOptions(obj, element, ratio, urls);
      } else {
        obj = computedTextElementOptions(
          obj,
          element,
          ratio,
          urls,
          page,
          MIN_TEXT_HEIGHT,
          MIN_TEXT_WIDTH
        );
      }
      break;
    }
    case elementTypes.text: {
      if (element.get('isSpineText')) {
        const isSpineText = true;
        obj = computedSpineElementOptions(
          obj,
          element,
          ratio,
          urls,
          isSpineText,
          pageWidth
        );
      } else {
        obj = computedTextElementOptions(
          obj,
          element,
          ratio,
          urls,
          page,
          MIN_TEXT_HEIGHT,
          MIN_TEXT_WIDTH
        );
      }
      break;
    }
    case elementTypes.sticker: {
      obj.imgUrl = template(THEME_STICKER_SRC)({
        baseUrl: urls.baseUrl,
        stickerCode: element.get('decorationId'),
        size: getReneringStickerSize(obj.width, obj.height)
      });
      obj.keepRatio = true;
      obj.minHeight = Math.round(MIN_PHOTO_HEIGHT * ratio);
      obj.minWidth = Math.round(MIN_PHOTO_WIDTH * ratio);
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
            obj.height,
          );
          const imageUrl = template(BACKGROUND_SRC)({
            calendarBaseUrl: urls.calendarBaseUrl,
            backgroundCode: element.get('backgroundId'),
            size: 700,
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
          obj.corpApiTemplate =
            template(IMAGES_API)({
              baseUrl: urls.baseUrl,
            }) + BACKGROUND_CROPPER_PARAMS;
          obj.filterApiTemplate =
            template(IMAGES_API)({
              baseUrl: urls.baseUrl,
            }) + BACKGROUND_FILTER_PARAMS;
          obj.sourceUrl = imageUrl;
        }
      }
      break;
    }
    case elementTypes.cameo:
    case elementTypes.photo: {
      obj.keepRatio = false;
      obj.minHeight = Math.round(MIN_PHOTO_HEIGHT * ratio);
      obj.minWidth = Math.round(MIN_PHOTO_WIDTH * ratio);
      if (encImgId) {
        const gradient = element.getIn(['style', 'gradient']);
        const isGradientEnable = gradient && gradient.get('gradientEnable');

        // 根据宽度来计算当前整图的尺寸 700/1000/1500
        const oriImageWidth = getOriImageWidth(obj.width, obj.height);

         // 根据宽度来计算当前整图的尺寸 700/1000/1500
        let cropOptions = getCropOptionsByLR(
          0,
          0,
          1,
          1,
          oriImageWidth,
          oriImageWidth
        );

        if (isGradientEnable && element.get('cropRLY')) {
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
          let filterOptions = merge({}, defaultStyle);
          if (element.get('style')) {
            filterOptions = merge({}, defaultStyle, element.get('style').toJS());
          }

          obj.imgUrl = encImgId
            ? template(`${IMAGES_API}${IMAGES_FILTER_PARAMS}`)(
                merge({}, cropOptions, filterOptions, {
                  encImgId,
                  imgFlip,
                  shape,
                  rotation: imageRotate,
                  baseUrl: urls.baseUrl,
                  ...securityString
                })
              )
            : null;

          if (isGradientEnable) {
            obj.imgUrl += `&${qs.stringify(element.getIn(['style', 'gradient']).toJS())}`;
          }

          obj.corpApiTemplate =
            template(IMAGES_CROPPER)({
              baseUrl: urls.baseUrl
            }) + IMAGES_CROPPER_PARAMS;
          obj.filterApiTemplate =
            template(IMAGES_API)({
              baseUrl: urls.baseUrl
            }) + IMAGES_FILTER_PARAMS;
          obj.scale = getCurrentScale(that, nextProps, element);
        }

        // 计算border
        const border = element.get('border');
        if (border) {
          const rbga = hexToRGBA(border.get('color'), border.get('opacity'));
          obj.border = {
            size: Math.ceil(border.get('size') * ratio),
            color: rbga
          };
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

export const failTryToDownload = (that) => {
  const { elementArray, downloadData } = that.state;
  let selectedElementArray = Immutable.List();
  elementArray.forEach((element) => {
    if (element.get('isSelected')) {
      selectedElementArray = selectedElementArray.push(element);
    }
  });

  if (selectedElementArray.size === 1) {
    const element = selectedElementArray.get(0);
    const elementId = element.get('id');
    const theDownloadData = downloadData.get(elementId) || Immutable.Map();
    if (theDownloadData.get('downloadStatus') === downloadStatus.DOWNLOAD_FAIL) {
      const forceToDownload = true;
      that.toDownload(selectedElementArray, forceToDownload);
    }
  }
};
