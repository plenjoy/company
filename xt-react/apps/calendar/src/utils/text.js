import { template } from 'lodash';
import { hexString2Number } from '../../../common/utils/colorConverter';

import { TEXT_SRC } from '../constants/apiUrl';
import { toEncode } from '../../../common/utils/encode';

export const computedTextElementOptions = (obj, element, ratio, urls, page, MIN_TEXT_HEIGHT, MIN_TEXT_WIDTH, isShot = false) => {
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
