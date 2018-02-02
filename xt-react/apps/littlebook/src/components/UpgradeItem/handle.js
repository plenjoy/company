import { fromJS } from 'immutable';
import { template, merge, get } from 'lodash';
import {
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  TEXT_SRC
} from '../../contants/apiUrl';
import { sheetSizeOptions, effectPaddings } from '../../contants/upgrade';
import { originalCoverSize, elementTypes} from '../../contants/strings';
import { toEncode } from '../../../../common/utils/encode';
import { hexString2Number } from '../../../../common/utils/colorConverter';
import { getCropOptionsByLR, getCropOptions } from '../../utils/crop';
import qs from 'qs';
import securityString from '../../../../common/utils/securityString';
const getImage = (images, encImgId) => {
  return images.find((im) => {
    return im.get('encImgId') === encImgId;
  });
};

/**
 * 校正crystal, metal封面模板上的元素的px.
 * @param  {number} px 元素的原始px
 */
const correctPxPw = (x, px, width, pw) => {
  let newPx = px;
  let newPw = pw;

  const pageWidth = x / px;
  const halfPageWidth = pageWidth / 2;

  newPx = (x - halfPageWidth) / halfPageWidth;

  // element width
  newPw = width / halfPageWidth;

  return {
    px: newPx,
    pw: newPw
  };
};

export const computedSheetOptions = (productSize, isHardCover, isPhotoElement = true) => {
  const coverType = isHardCover ? 'hardCover': 'softCover';

  const paddings = get(effectPaddings, `${coverType}.${productSize}`);
  const sheetSizeInfo = get(sheetSizeOptions, `${coverType}.${productSize}`);

  const {
    width,
    height,
    bleed,
    spineExpanding
  } = sheetSizeInfo;

  // 容器的大小. 也就是效果图的大小.
  const containerSize = {
    width: width + paddings.right,
    height: height + paddings.top + paddings.bottom,
    top: 0,
    left: 0
  };

  const effectSize = {
    width: width + paddings.left + paddings.right,
    height: height + paddings.top + paddings.bottom,
    top: 0,
    left: 0
  };

  // sheetsize, 没有包含出血, 但是包含了压线.
  // 相对于container: 从效果的白边区域, 移到可视区.
  const sheetSize = {
    width,
    height,
    top: paddings.top,
    left: paddings.left
  };

  // sheetSizeWithBleed, 包含出血, 但是包含了压线.
  // 相对于sheetsize.
  const sheetSizeWithBleed = {
    width: width + bleed.right + (isPhotoElement ? 0 : bleed.left),
    height: height + bleed.top + bleed.bottom,
    top: -bleed.top,
    left: isPhotoElement ? 0 : -bleed.left
  };

  return {
    containerSize,
    effectSize,
    sheetSize,
    sheetSizeWithBleed
  };
};

export const doComputed = (props) => {
  const {
    element,
    isHardCover
  } = props.data;

  const productSize = element.getIn(['summary', 'productSize']);
  const isPhotoElement = element.get('type') === elementTypes.photo;

  const {
    containerSize,
    effectSize,
    sheetSize,
    sheetSizeWithBleed
  } = computedSheetOptions(productSize, isHardCover, isPhotoElement);

  const coverType = isHardCover ? 'hardCover': 'softCover';
  const size = get(originalCoverSize, `${coverType}.${productSize}`);

  const ratio = containerSize.height / size.height;
  const spineWidth = originalCoverSize.spineWidth * ratio;

  return {
    ratio,
    spineWidth,
    containerSize,
    effectSize,
    sheetSize,
    sheetSizeWithBleed
  };
};

/**
 * 计算元素的显示尺寸.
 * @param  {object} coverOriginalSize 封面的原始宽高{width, height}
 * @param  {object} containerSize 显示时的视图宽高{width, height}
 * @param  {Immutable.Map} element
 */
export const computedElementOptions = (
  viewPageSize,
  spineWidth,
  ratio,
  element,
  baseUrl,
  isHardCover,
  productSize,
  allImages,
  fromElement,
  shouldReComputedCrops = false,
  env
  ) => {
  const obj = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    imgUrl: ''
  };


  if (!element) {
    return fromJS(obj);
  }

  const imageRotate = element.get('imgRot');
  const imgFlip = element.get('imgFlip');

  const viewPageHeight = viewPageSize.height;
  const viewPageWidth = (viewPageSize.width * 2) + spineWidth;

  // 计算element的left和top值
  obj.width = viewPageWidth * element.get('pw');
  obj.height = viewPageHeight * element.get('ph');
  obj.left = (viewPageWidth * element.get('px') - (viewPageWidth * 0.5 + spineWidth/2));
  obj.top = viewPageHeight * element.get('py');

  switch (element.get('type')) {
    case elementTypes.text: {
      const oriHeight = obj.height / ratio;
      const oriWidth = obj.width / ratio;

      const text = element.get('text');
      const fontSizePercent = element.get('fontSize');
      const originalFontSize = fontSizePercent * (viewPageHeight/ratio);

      const fontColor = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

      obj.imgUrl = template(TEXT_SRC)({
        // 兼容老数据.
        text: toEncode(text),

        width: oriWidth,
        height: oriHeight,
        originalFontSize,
        baseUrl,
        ratio,

        fontSize: originalFontSize,
        fontColor: hexString2Number(fontColor),
        fontFamily: element.get('fontFamily'),

        originalWidth: oriWidth,
        originalHeight: oriHeight,

        textAlign: element.get('textAlign'),
        verticalTextAlign: element.get('textVAlign')
      });

      break;
    }
    case elementTypes.photo: {
      // 计算获取裁剪图片的地址.
      const encImgId = element.get('encImgId');
      const image = getImage(allImages, encImgId);

      if (encImgId && image) {
        let cropLUX = element.get('cropLUX');
        let cropLUY = element.get('cropLUY');
        let cropRLX = element.get('cropRLX');
        let cropRLY = element.get('cropRLY');

        if (shouldReComputedCrops) {
          const newCrops = getCropOptions(image.get('width'), image.get('height'), obj.width, obj.height, imageRotate);

          cropLUX = newCrops.cropLUX;
          cropLUY = newCrops.cropLUY;
          cropRLX = newCrops.cropRLX;
          cropRLY = newCrops.cropRLY;
        }

        const cropOptions = getCropOptionsByLR(
            cropLUX,
            cropLUY,
            cropRLX,
            cropRLY,
            obj.width,
            obj.height
          );

        const shape = 'rect';
        let filterOptions = {
          effectId: 0,
          opacity: 100
        };

        if (element.get('style')) {
          filterOptions = element.get('style').toJS();
        }

        obj.imgUrl = template(`${IMAGES_API}${IMAGES_FILTER_PARAMS}`)(merge(
            {}, cropOptions, filterOptions, {
              encImgId,
              imgFlip,
              shape,
              rotation: imageRotate,
              baseUrl,
              ...securityString
            }
          ))
      }
      break;
    }
    default: {
      break;
    }
  }

  return fromJS(obj);
};
