
import { get, merge, template } from 'lodash';
import { getScale } from '../../../utils/scale';
import { elementTypes, pageTypes } from '../../../contants/strings';
import { hexString2Number } from '../../../../common/utils/colorConverter';
import securityString from '../../../../../common/utils/securityString';
import { getCropOptions, getCropOptionsByLR } from '../../../utils/crop';

import {
  IMAGES_CROPPER_PARAMS,
  IMAGES_CROPPER,
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  TEXT_SRC,
  PAINETEXT_SRC
} from '../../../contants/apiUrl';

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
  } = element;
  let imageDetail = get(images, encImgId);
  const lastImageDetail = get(lastImages, encImgId);
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

export const computedElementOptions = (that, nextProps, element, rate) => {
  const { data } = nextProps || that.props;
  const { urls, page, images } = data;

  const ratio = rate || data.rate;


  const obj = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    imgUrl: ''
  };

  const imageRotate = get(element, 'imgRot');
  const imgFlip = get(element, 'imgFlip');
  const pageWidth = get(page, 'width');
  const pageHeight = get(page, 'height');

  // 计算element的显示宽高.
  obj.width = Math.round(pageWidth * get(element, 'pw') * ratio);
  obj.height = Math.round(pageHeight * get(element, 'ph') * ratio);

  // 计算element的left和top值
  obj.left = pageWidth * get(element, 'px') * ratio;
  obj.top = pageHeight * get(element, 'py') * ratio;

  if (get(element, 'type') === elementTypes.cameo) {
    obj.width = Math.round(get(element, 'width') * ratio);
    obj.height = Math.round(get(element, 'height') * ratio);

    // 计算element的left和top值
    obj.left = ((pageWidth - get(page, 'bleed.left') - get(page, 'bleed.right') - get(page, 'wrapSize.right') - get(element, 'width')) / 2 + get(page, 'bleed.left')) * ratio;
    obj.top = ((pageHeight - get(element, 'height')) / 2) * ratio;
  }

  // 计算获取裁剪图片的地址.
  const encImgId = get(element, 'encImgId');

  switch (get(element, 'type')) {
    case elementTypes.paintedText:
      {
        if (get(data, 'page.type') === pageTypes.spine) {
        // 如果为spin他的宽和高计算函数
          obj.width = get(element, 'width') * ratio;
          obj.height = get(element, 'height') * ratio;
          obj.left = get(element, 'x') * ratio;
          obj.top = get(element, 'y') * ratio;
          const text = get(element, 'text');
          const color = get(element, 'fontColor') ? get(element, 'fontColor') : '#ffffff';

          //spin 接口参数
          //  align:center font:Roboto height:33.15191666666667 color:0 text:2223333 ratio:0.8199999999999995 width:667.9878048780491
          obj.imgUrl = template(PAINETEXT_SRC)({
            text,
            color: hexString2Number(color),
            fontFamily: get(element, 'fontFamily'),
            width: get(element, 'height'),
            height: get(element, 'width'),
            baseUrl: urls.baseUrl,
            ratio
          });
        } else {
          const text = get(element, 'text');
          const fontSizePercent = get(element, 'fontSize');
          const originalFontSize = fontSizePercent * get(page, 'height');
          const fontColor = get(element, 'fontColor') ? get(element, 'fontColor') : '#ffffff';

          obj.imgUrl = template(TEXT_SRC)({
            text,
            fontSize: originalFontSize,
            fontColor: hexString2Number(fontColor),
            fontFamily: get(element, 'fontFamily'),
            width: get(element, 'width'),
            height: get(element, 'height'),
            originalWidth: get(element, 'width'),
            originalHeight: get(element, 'height'),
            originalFontSize,
            baseUrl: urls.baseUrl,
            textAlign: get(element, 'textAlign'),
            verticalTextAlign: get(element, 'textVAlign'),
            ratio
          });

          obj.minHeight = MIN_TEXT_HEIGHT * ratio;
          obj.minWidth = MIN_TEXT_WIDTH * ratio;
        }
        break;
      }
    case elementTypes.text:
    case elementTypes.usbText:
      {
        const text = get(element, 'text');
        const fontSizePercent = get(element, 'fontSize');
        const originalFontSize = fontSizePercent * page.height;

        obj.imgUrl = template(TEXT_SRC)({
          text,
          fontSize: originalFontSize,
          fontColor: hexString2Number(element.fontColor),
          fontFamily: element.fontFamily,
          width: element.width,
          height: element.height,
          originalWidth: element.width,
          originalHeight: element.height,
          originalFontSize,
          baseUrl: urls.baseUrl,
          textAlign: element.textAlign,
          verticalTextAlign: element.textVAlign,
          ratio
        });

        obj.minHeight = MIN_TEXT_HEIGHT * ratio;
        obj.minWidth = MIN_TEXT_WIDTH * ratio;
        break;
      }
    case elementTypes.cameo:
    case elementTypes.dvd:
    case elementTypes.photo:
      {
        obj.keepRatio = false;
        // obj.minHeight = MIN_PHOTO_HEIGHT * ratio;
        // obj.minWidth = MIN_PHOTO_WIDTH * ratio;
        if (encImgId) {
          let cropOptions = null;
          // 如果cropRLY为0, 表示新增的.
          if (!get(element, 'cropRLY')) {
            const image = images ? get(images, 'encImgId') : null;
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
              get(element, 'cropLUX'),
              get(element, 'cropLUY'),
              get(element, 'cropRLX'),
              get(element, 'cropRLY'),
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

            if (get(element, 'style')) {
              filterOptions = get(element, 'style');
            }

            obj.imgUrl = encImgId ? template(`${IMAGES_CROPPER}${IMAGES_CROPPER_PARAMS}`)(merge({}, cropOptions, filterOptions, {
              encImgId,
              imgFlip,
              shape,
              rotation: imageRotate,
              baseUrl: urls.baseUrl,
              ...securityString
            })) : null;
            obj.corpApiTemplate = template(IMAGES_CROPPER)({
              baseUrl: urls.baseUrl
            }) + IMAGES_CROPPER_PARAMS;
            obj.scale = getCurrentScale(that, nextProps, element);
          }
        }
        break;
      }
    default:
  }

  return obj;
};

export function convertElements(that, nextProps, elements, rate) {
  let outList = [];
  const props = nextProps || that.props;
  const elementArray = that.state ? that.state.elementArray : [];
  // const { elementArray } = that.state;

  elements.forEach((element) => {
    const computed = computedElementOptions(that, props, element, rate);

    const stateElement = elementArray.find((o) => {
      return get(o, 'id') === get(element, 'id');
    });

    const extraProps = {
      isDisabled: false,
      isSelected: false
    };

    if (stateElement) {
      extraProps.isDisabled = get(stateElement, 'isDisabled');
      extraProps.isSelected = get(stateElement, 'isSelected');
    }

    outList.push(
      merge({}, element, { computed }, extraProps)
    );
  });

  return outList;
}
