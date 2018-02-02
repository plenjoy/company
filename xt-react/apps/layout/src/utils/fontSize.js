import { getPtByPx } from '../../../common/utils/math';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;

export function getFontSizeInPt(fontSizeInPx) {
  const fontSizeInPt = Math.round(getPtByPx(fontSizeInPx));

  if (fontSizeInPt > MAX_FONT_SIZE) {
    return MAX_FONT_SIZE;
  }

  if (fontSizeInPt < MIN_FONT_SIZE) {
    return MIN_FONT_SIZE;
  }

  return fontSizeInPt;
}
