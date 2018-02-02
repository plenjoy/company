import { isNumber, isUndefined } from 'lodash';
import { getCropOptions, getNewCropByBase } from './crop';
import { elementTypes } from '../constants/strings';
import { toEncode } from '../../../common/utils/encode';

function setElement(element, thePage) {
  const percentAttrbuites = {};
  if (isNumber(element.get('x'))) {
    percentAttrbuites.px = element.get('x') / thePage.get('width');
  }

  if (isNumber(element.get('y'))) {
    percentAttrbuites.py = element.get('y') / thePage.get('height');
  }

  if (isNumber(element.get('width'))) {
    percentAttrbuites.pw = element.get('width') / thePage.get('width');
  }

  if (isNumber(element.get('height'))) {
    percentAttrbuites.ph = element.get('height') / thePage.get('height');
  }

  return element.merge(percentAttrbuites, {
    lastModified: Date.now()
  });
}

function setTextElement(element, thePage) {
  const percentAttributes = {};

  const fontSize = element.get('fontSize');
  if (fontSize && fontSize > 1) {
    percentAttributes.fontSize =
      element.get('fontSize') / thePage.get('height');
  }

  return setElement(element, thePage).merge(percentAttributes);
}

function addDefaultPhotoElementAttrs(element) {
  const outObj = {};
  const DEFAULT_BORDER = {
    color: '#000000',
    size: 0,
    opacity: 100
  };

  const DEFAULT_STYLE = {
    effectId: 0,
    opacity: 100,
    brightness: 0,
    contrast: 0,
    saturation: 100
  };

  const needFillAttrKeys = ['border', 'imgFlip', 'imgRot', 'style'];

  needFillAttrKeys.forEach((key) => {
    switch (key) {
      case 'border': {
        if (isUndefined(element.get(key))) {
          outObj.border = DEFAULT_BORDER;
        }
        break;
      }
      case 'imgFlip': {
        if (isUndefined(element.get(key))) {
          outObj.imgFlip = false;
        }
        break;
      }

      case 'imgRot': {
        if (isUndefined(element.get(key))) {
          outObj.imgRot = 0;
        }
        break;
      }

      case 'style': {
        if (isUndefined(element.get(key))) {
          outObj.style = DEFAULT_STYLE;
        }
        break;
      }

      default:
    }
  });

  return outObj;
}

function setPhotoElement(element, thePage, imageArray, ratio, needReCropImage) {
  const calculateAttrbuites = {};

  const encImgId = element.get('encImgId');
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');
  const elementId = element.get('id');
  const originalElement = thePage.get('elements').find((o) => {
    return o.get('id') === element.get('id');
  });

  if (
    encImgId ||
    (elementId &&
      (elementWidth || elementHeight) &&
      originalElement &&
      originalElement.get('encImgId'))
  ) {
    const theImage = imageArray.find((o) => {
      return (
        o.get('encImgId') === (encImgId || originalElement.get('encImgId'))
      );
    });

    let width = 0;
    let height = 0;
    let imgRot = 0;

    if (typeof elementWidth !== 'undefined') {
      width = elementWidth;
    } else if (originalElement) {
      width = originalElement.get('width') || 0;
    }

    if (typeof elementHeight !== 'undefined') {
      height = elementHeight;
    } else if (originalElement) {
      height = originalElement.get('height') || 0;
    }

    if (typeof element.get('imgRot') !== 'undefined') {
      imgRot = element.get('imgRot');
    } else if (originalElement) {
      imgRot = originalElement.get('imgRot') || 0;
    }

    const origRatio = originalElement
      ? originalElement.get('width') / originalElement.get('height')
      : 1;
    const newRatio = width / height;

    const origEncImgId = originalElement
      ? originalElement.get('encImgId')
      : null;

    const DEVIATION = 0.0005;

    // 如果图片更改需要重新计算crop
    // 如果元素宽高比发生变化重新计算crop
    if (
      needReCropImage && theImage &&
      (!originalElement ||
        theImage.get('encImgId') !== origEncImgId ||
        Math.abs(origRatio - newRatio) > DEVIATION)
    ) {
      let cropOptions = {};
      const imgRatio = theImage.get('width') / theImage.get('height');
      const oriWidth = originalElement ? originalElement.get('width') : 0;
      const oriHeight = originalElement ? originalElement.get('height') : 0;
      const diffWidth = element.get('width') - oriWidth;
      const diffHeight = element.get('height') - oriHeight;
      // 使用default crop的情况
      // 1、原始元素不存在
      // 2、元素图片改变
      // 3、元素宽高比和图片宽高比一致 解决fit to content的问题 有隐患
      // 4、元素旋转
      // 5、元素宽高同时改变
      if (!originalElement ||
          theImage.get('encImgId') !== origEncImgId ||
          Math.abs(imgRatio - newRatio) < DEVIATION ||
          originalElement.get('rot') ||
          (!!diffWidth && !!diffHeight)) {
        cropOptions = getCropOptions(
          theImage.get('width'),
          theImage.get('height'),
          width,
          height,
          imgRot
        );
      } else {
        cropOptions = getNewCropByBase(
          element,
          originalElement,
          {
            width: theImage.get('width'),
            height: theImage.get('height')
          },
          ratio
        );
      }

      calculateAttrbuites.cropLUX = cropOptions.cropLUX;
      calculateAttrbuites.cropLUY = cropOptions.cropLUY;
      calculateAttrbuites.cropRLX = cropOptions.cropRLX;
      calculateAttrbuites.cropRLY = cropOptions.cropRLY;
    }
  }

  return setElement(element, thePage)
    .merge(calculateAttrbuites)
    .merge(addDefaultPhotoElementAttrs(element.merge(originalElement)));
}

export function verifyUpdateAttributes(element) {
  let outElement = element;
  const needVerifyKeys = [
    'x',
    'y',
    'width',
    'height',
    'px',
    'py',
    'pw',
    'ph',
    'cropLUX',
    'cropLUY',
    'cropRLX',
    'cropRLY'
  ];

  element.forEach((value, key) => {
    if (needVerifyKeys.indexOf(key) !== -1 && !isNumber(value)) {
      outElement = outElement.remove(key);
    }
  });

  const fontFamily = outElement.get('fontFamily');
  const text = outElement.get('text');

  if (fontFamily) {
    outElement = outElement.set('fontFamily', toEncode(fontFamily));
  }

  if (text) {
    outElement = outElement.set('text', toEncode(text));
  }

  return outElement;
}

export default function setElementByType(
  element,
  thePage,
  imageArray,
  ratio,
  needReCropImage = true
) {
  let newElement = verifyUpdateAttributes(element);
  switch (newElement.get('type')) {
    case elementTypes.text:
      newElement = newElement.merge(setTextElement(newElement, thePage));
      break;
    case elementTypes.photo:
      newElement = newElement.merge(
        setPhotoElement(newElement, thePage, imageArray, ratio, needReCropImage)
      );
      break;

    default:
      newElement = newElement.merge(setElement(newElement, thePage));
  }
  return newElement;
}
