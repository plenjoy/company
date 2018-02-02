import Immutable from 'immutable';
import { template, merge, get } from 'lodash';
import { getScale } from '../../../utils/scale';
import { elementTypes, pageTypes } from '../../../constants/strings';
import securityString from '../../../../../common/utils/securityString';
import { hexToRGBA } from '../../../../../common/utils/colorConverter';

import {
  IMAGES_CROPPER_PARAMS,
  IMAGES_CROPPER,
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  CALENDAR_IMAGE
} from '../../../constants/apiUrl';

import { getCropOptions, getCropOptionsByLR } from '../../../utils/crop';
import { computedTextElementOptions } from '../../../utils/text';

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
  workspaceRatio,
  settings
) => {
  const { data } = nextProps || that.props;
  const { urls, page, images, userInfo } = data;

  const userInfoObj =userInfo.toJS();
  const timestamp = userInfoObj.timestamp;
  const token = userInfoObj.authToken;
  const customerId = userInfoObj.id;

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
  obj.left = Math.round(pageWidth * element.get('px') * ratio);
  obj.top = Math.round(pageHeight * element.get('py') * ratio);

  // 计算获取裁剪图片的地址.
  const encImgId = element.get('encImgId');

  switch (element.get('type')) {
    case elementTypes.text: {
      obj = computedTextElementOptions(
        obj,
        element,
        ratio,
        urls,
        page,
        MIN_TEXT_HEIGHT,
        MIN_TEXT_WIDTH
      );
      break;
    }
    case elementTypes.calendar: {
      const productType = get(settings, 'spec.product');
      const size = get(settings, 'spec.size');
      const orientation = get(settings, 'spec.orientation');
      const month = element.get('month');
      const dateStyle = get(settings, 'spec.dateStyle');
      const fixedMonth = month && month < 10 ? `0${month}` : month;
      const year = element.get('year');
      const baseUrl = urls.baseUrl;
      const requestSize =
        orientation !== 'Portrait'
          ? `${size.split('X')[1]}X${size.split('X')[0]}`
          : size;
      obj.imgUrl =
        productType && requestSize
          ? template(CALENDAR_IMAGE)({
              dateStyle,
              productType,
              size: requestSize,
              month: fixedMonth,
              year,
              baseUrl,
              imageSize: 700
            })
          : null;
      break;
    }
    case elementTypes.photo: {
      obj.keepRatio = false;
      obj.minHeight = Math.round(MIN_PHOTO_HEIGHT * ratio);
      obj.minWidth = Math.round(MIN_PHOTO_WIDTH * ratio);
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

          let filterOptions = {
            effectId: 0,
            opacity: 100
          };

          if (element.get('style')) {
            filterOptions = element.get('style').toJS();
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
            size: Math.round(border.get('size') * ratio),
            color: rbga
          };
        }
      }
      break;
    }
    default:
  }

  return Immutable.fromJS(obj);
};
