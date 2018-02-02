import { isNumber, isUndefined } from 'lodash';
import { getCropOptions } from './crop';
import { elementTypes } from '../constants/strings';
import { toEncode } from '../../../common/utils/encode';

function setElement(element, thePage) {
  const percentAttributes = {};
  const absoluteAttributes = {};
  const pageWidth = thePage.get('width');
  const pageHeight = thePage.get('height');

  const elementX = element.get('x');
  const elementY = element.get('y');
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');
  const elementPx = element.get('px');
  const elementPy = element.get('py');
  const elementPw = element.get('pw');
  const elementPh = element.get('ph');

  if (!isNumber(elementPx) && isNumber(elementX)) {
    percentAttributes.px = elementX / pageWidth;
  } else if (isNumber(elementPx)) {
    absoluteAttributes.x = elementPx * pageWidth;
  }

  if (!isNumber(elementPy) && isNumber(elementY)) {
    percentAttributes.py = elementY / pageHeight;
  } else if (isNumber(elementPy)) {
    absoluteAttributes.y = elementPy * pageHeight;
  }

  if (!isNumber(elementPw) && isNumber(elementWidth)) {
    percentAttributes.pw = elementWidth / pageWidth;
  } else if (isNumber(elementPw)) {
    absoluteAttributes.width = elementPw * pageWidth;
  }

  if (!isNumber(elementPh) && isNumber(elementHeight)) {
    percentAttributes.ph = elementHeight / pageHeight;
  } else if (isNumber(elementPh)) {
    absoluteAttributes.height = elementPh * pageHeight;
  }

  return element.merge(percentAttributes, absoluteAttributes, {
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
    opacity: 100
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

function setPhotoElement(element, thePage, imageArray) {
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

    // 如果图片更改需要重新计算crop
    // 如果元素宽高比发生变化重新计算crop
    if (
      theImage &&
      (!originalElement ||
        theImage.get('encImgId') !== origEncImgId ||
        Math.abs(origRatio - newRatio) > 0.0005 ||
        imgRot !== originalElement.get('imgRot'))
    ) {
      const { cropLUX, cropLUY, cropRLX, cropRLY } = getCropOptions(
        theImage.get('width'),
        theImage.get('height'),
        width,
        height,
        imgRot
      );

      calculateAttrbuites.cropLUX = cropLUX;
      calculateAttrbuites.cropLUY = cropLUY;
      calculateAttrbuites.cropRLX = cropRLX;
      calculateAttrbuites.cropRLY = cropRLY;
    }
  }

  return setElement(element, thePage)
    .merge(calculateAttrbuites)
    .merge(addDefaultPhotoElementAttrs(element.merge(originalElement)));
}

function verifyUpdateAttributes(element) {
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

export default function setElementByType(element, thePage, imageArray) {
  let newElement = verifyUpdateAttributes(element);
  switch (newElement.get('type')) {
    case elementTypes.text:
      newElement = newElement.merge(setTextElement(newElement, thePage));
      break;
    case elementTypes.photo:
      newElement = newElement.merge(
        setPhotoElement(newElement, thePage, imageArray)
      );
      break;
    default:
      newElement = newElement.merge(setElement(newElement, thePage));
  }
  return newElement;
}
