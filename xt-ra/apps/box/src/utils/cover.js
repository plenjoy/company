import { coverTypes } from '../contants/strings';

export const checkIsSupportImageInCover = coverType => {
  // 支持添加图片的封面类型有:
  // Paper Cover or Soft Cover、Hard Cover、Padded Cover
  // Crystal和Metal
  switch (coverType) {
    // Crystal
    case coverTypes.NONE:
    case coverTypes.HC:
      return true;
    default:
      return false;
  }
};

export const checkIsHalfPageInCover = (coverType) => {
  switch (coverType) {
    // Crystal
    case coverTypes.LC:
    case coverTypes.BC:
    case coverTypes.NC:
      return true;
    default:
      return false;
  }
};

export const checkIsSetCoverAsInnerBg = (coverType) => {
  switch (coverType) {
    // Hard Cover
    case coverTypes.HC:
    case coverTypes.NONE:
      return true;
    default:
      return false;
  }
};

/**
 * 检查封面上是否支持painted text.
 * @param  {string} coverType coverType 待检查的cover类型
 * @return {boolean}
 */
export const checkIsSupportPaintedTextInCover = (coverType) => {
  switch (coverType) {
    case coverTypes.LC:
    case coverTypes.NC:
      return true;
    default:
      return false;
  }
};
