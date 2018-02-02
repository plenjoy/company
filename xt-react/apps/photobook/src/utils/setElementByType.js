import { isNumber, isUndefined } from 'lodash';
import { getCropOptions, getNewCropByBase } from './crop';
import { elementTypes } from '../contants/strings';
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

  needFillAttrKeys.forEach(key => {
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

function setPhotoElement(element, thePage, imageArray, ratio) {
  const calculateAttrbuites = {};

  const encImgId = element.get('encImgId');
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');
  const elementId = element.get('id');
  const originalElement = thePage.get('elements').find(o => {
    return o.get('id') === element.get('id');
  });

  // 在某些情况下, 该值为undefined.
  // rot, imgRot
  // element只包含更新字段 不是全量的element
  // 如果更新字段包含rot 则用新的rot
  // 否则 如果原始element无rot 则更新rot为0
  if (element.get('rot')) {
    calculateAttrbuites.rot = element.get('rot');
  } else if (originalElement && !originalElement.get('rot')) {
      calculateAttrbuites.rot = 0;
  }

  if (element.get('imgRot')) {
    calculateAttrbuites.imgRot = element.get('imgRot');
  } else if (originalElement && !originalElement.get('imgRot')) {
    calculateAttrbuites.imgRot = 0;
  }

  if (
    encImgId ||
    (elementId &&
      (elementWidth || elementHeight) &&
      originalElement &&
      originalElement.get('encImgId'))
  ) {
    const theImage = imageArray.find(o => {
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

    const DEVIATION = 0.001;

    // 如果图片更改需要重新计算crop
    // 如果元素宽高比发生变化重新计算crop
    if (
      theImage &&
      (!originalElement ||
        theImage.get('encImgId') !== origEncImgId ||
        Math.abs(origRatio - newRatio) > DEVIATION)
    ) {
      let cropOptions = {};
      const imgRatio = theImage.get('width') / theImage.get('height');
      // 使用default crop的情况
      // 1、当element的crop为空的时候
      // 2、原始元素不存在 如创建元素时
      // 3、解决天窗crop问题
      // 4、图片改变时
      // 5、元素旋转
      // 6、expand操作
      if (
        !element.get('cropRLY') ||
        !originalElement ||
        originalElement.get('type') === elementTypes.cameo ||
        theImage.get('encImgId') !== origEncImgId ||
        originalElement.get('rot') ||
        __app.isExpand
      ) {
        __app.isExpand = false;
        cropOptions = getCropOptions(
          theImage.get('width'),
          theImage.get('height'),
          width,
          height,
          imgRot
        );
        calculateAttrbuites.cropLUX = cropOptions.cropLUX;
        calculateAttrbuites.cropLUY = cropOptions.cropLUY;
        calculateAttrbuites.cropRLX = cropOptions.cropRLX;
        calculateAttrbuites.cropRLY = cropOptions.cropRLY;
      } else {
        calculateAttrbuites.cropLUX = element.get('cropLUX');
        calculateAttrbuites.cropLUY = element.get('cropLUY');
        calculateAttrbuites.cropRLX = element.get('cropRLX');
        calculateAttrbuites.cropRLY = element.get('cropRLY');
      }
    }
  }

  return setElement(element, thePage)
    .merge(calculateAttrbuites)
    .merge(addDefaultPhotoElementAttrs(element.merge(originalElement)));
}

function setBackgroundElement(element, thePage, backgroundArray) {
  const calculateAttrbuites = {};

  const elementWidth = element.get('width');
  const elementHeight = element.get('height');

  const originalElement = thePage.get('elements').find(o => {
    return o.get('id') === element.get('id');
  });

  const backgroundId = element.get('backgroundId');

  if (backgroundId) {
    const theBackground = backgroundArray.find(o => {
      return o.get('code') === backgroundId;
    });

    if (theBackground) {
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

      const { cropLUX, cropLUY, cropRLX, cropRLY } = getCropOptions(
        theBackground.get('width'),
        theBackground.get('height'),
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

  return setElement(element, thePage).merge(calculateAttrbuites);
}

function setStickerElement(element, thePage, stickerArray) {
  const percentAttrbuites = {};
  const originalElement = thePage.get('elements').find(o => {
    return o.get('id') === element.get('id');
  });

  const decorationId =
    element.get('decorationId') || originalElement.get('decorationId');

  const theSticker = stickerArray.find(o => o.get('code') === decorationId);

  if (theSticker) {
    const stickerRatio = theSticker.get('width') / theSticker.get('height');

    if (isNumber(element.get('width'))) {
      const elementHeight = element.get('width') / stickerRatio;
      percentAttrbuites.pw = element.get('width') / thePage.get('width');
      percentAttrbuites.ph = elementHeight / thePage.get('height');
      percentAttrbuites.width = element.get('width');
      percentAttrbuites.height = elementHeight;
    } else if (isNumber(element.get('height'))) {
      const elementWidth = element.get('height') * stickerRatio;
      percentAttrbuites.ph = element.get('height') / thePage.get('height');
      percentAttrbuites.pw = elementWidth / thePage.get('width');
      percentAttrbuites.width = elementWidth;
      percentAttrbuites.height = element.get('height');
    }
  }

  if (isNumber(element.get('x'))) {
    percentAttrbuites.px = element.get('x') / thePage.get('width');
  }

  if (isNumber(element.get('y'))) {
    percentAttrbuites.py = element.get('y') / thePage.get('height');
  }

  return element.merge(percentAttrbuites, {
    lastModified: Date.now()
  });
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
  backgroundArray,
  stickerArray,
  ratio
) {
  let newElement = verifyUpdateAttributes(element);
  switch (newElement.get('type')) {
    case elementTypes.paintedText:
    case elementTypes.text:
      newElement = newElement.merge(setTextElement(newElement, thePage));
      break;
    case elementTypes.photo:
    case elementTypes.cameo:
      newElement = newElement.merge(
        setPhotoElement(newElement, thePage, imageArray, ratio)
      );
      break;
    case elementTypes.background: {
      if (backgroundArray) {
        newElement = newElement.merge(
          setBackgroundElement(newElement, thePage, backgroundArray)
        );
      }

      break;
    }
    case elementTypes.sticker: {
      if (stickerArray) {
        newElement = newElement.merge(
          setStickerElement(newElement, thePage, stickerArray)
        );
      }

      break;
    }

    default:
      newElement = newElement.merge(setElement(newElement, thePage));
  }
  return newElement;
}
