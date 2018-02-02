import Immutable from 'immutable';
import { template } from 'lodash';
import { hexString2Number } from '../../../common/utils/colorConverter';

import { PAINETEXT_SRC, TEXT_SRC } from '../contants/apiUrl';
import { toEncode } from '../../../common/utils/encode';

export function getSpineTextRect(newSpineContainer) {
  const spineBleed = newSpineContainer.get('bleed');

  const bleedLeft = spineBleed.get('left');
  const bleedRight = spineBleed.get('right');
  const bleedTop = spineBleed.get('top');
  const bleedBottom = spineBleed.get('bottom');

  const pageWidthWithoutBleed =
    newSpineContainer.get('width') - (bleedLeft + bleedRight);
  const pageHeightWithoutBleed =
    newSpineContainer.get('height') - (bleedTop + bleedBottom);

  const widthBufferRatio = 0.82;
  const heightBuffer = 300;

  const width = pageWidthWithoutBleed * widthBufferRatio;
  const height = pageHeightWithoutBleed - 300;
  const x = pageWidthWithoutBleed * ((1 - widthBufferRatio) / 2) + bleedLeft;
  const y = heightBuffer / 2 + bleedTop;

  return {
    width,
    height,
    x,
    y
  };
}

export const computedSpineElementOptions = (
  obj,
  element,
  ratio,
  urls,
  isSpineText = false,
  pageWidth = 0,
  isShot = false
) => {
  // 如果为spin他的宽和高计算函数
  obj.width = element.get('width') * ratio;
  obj.height = element.get('height') * ratio;

  // 如果是isSpineText
  if (isSpineText) {
    obj.left = (pageWidth * ratio - element.get('width') * ratio) / 2;
  } else {
    obj.left = element.get('x') * ratio;
  }

  obj.top = element.get('y') * ratio;

  let text = element.get('text');
  const color = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

  text = text || (!isShot && 'Double click to edit text');

  obj.imgUrl = template(PAINETEXT_SRC)({
    // 兼容老数据.
    text: toEncode(text),
    color: hexString2Number(color),
    fontFamily: element.get('fontFamily'),
    width: element.get('height'),
    height: element.get('width'),
    baseUrl: urls.baseUrl,
    ratio
  });
  return obj;
};

export const computedTextElementOptions = (
  obj,
  element,
  ratio,
  urls,
  page,
  MIN_TEXT_HEIGHT,
  MIN_TEXT_WIDTH,
  isShot = false
) => {
  const text = element.get('text');
  const fontSizePercent = element.get('fontSize');
  const originalFontSize = fontSizePercent * page.get('height');

  const fontColor = element.get('fontColor')
    ? element.get('fontColor')
    : '#ffffff';

  obj.imgUrl = text
    ? template(TEXT_SRC)({
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
    })
    : null;
  obj.minHeight = Math.round(MIN_TEXT_HEIGHT * ratio);
  obj.minWidth = Math.round(MIN_TEXT_WIDTH * ratio);
  return obj;
};
