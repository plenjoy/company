import { coverTypes, productTypes } from '../contants/strings';

/**
 * 检查指定的cover类型是否支持添加用户的照片
 * @param  {string} coverType 待检查的cover类型
 */
export const checkIsSupportImageInCover = (coverType) => {
  // 支持添加图片的封面类型有:
  // Paper Cover or Soft Cover、Hard Cover、Padded Cover
  // Crystal和Metal
  switch (coverType) {
    // Crystal
    case coverTypes.CC:
    case coverTypes.GC:

    // Metal
    case coverTypes.MC:
    case coverTypes.GM:

    // Paper Cover or Soft Cover
    case coverTypes.PSSC:
    case coverTypes.FMPAC:
    case coverTypes.LFPAC:

    // Hard Cover
    case coverTypes.HC:
    case coverTypes.LFHC:
    case coverTypes.PSHC:

    // Padded Cover
    case coverTypes.LFPC:
      return true;
    default:
      return false;
  }
};

/**
 * 检查指定的cover类型是否支持用户添加的照片铺满整个封面
 * @param  {string} coverType 待检查的cover类型
 */
export const checkIsSupportFullImageInCover = (coverType) => {
  // 支持用户添加的照片铺满整个封面类型有:
  // Paper Cover or Soft Cover、Hard Cover、Padded Cover
  switch (coverType) {
    // Paper Cover or Soft Cover
    case coverTypes.PSSC:
    case coverTypes.FMPAC:
    case coverTypes.LFPAC:

    // Hard Cover
    case coverTypes.HC:
    case coverTypes.LFHC:
    case coverTypes.PSHC:

    // Padded Cover
    case coverTypes.LFPC:
      return true;
    default:
      return false;
  }
};

/**
 * 检查指定的cover类型是否支持用户添加SpineText
 * @param  {string} coverType 待检查的cover类型
 */
export const checkIsSupportSpineText = (coverType) => {
  // 支持用户添加的照片铺满整个封面类型有:
  // Paper Cover or、Hard Cover、Padded Cover
  // 如果是Soft Cover, 只有page在大于等于40页时才支持.
  switch (coverType) {
    // Paper Cover or Soft Cover
    // case coverTypes.PSSC:
    case coverTypes.FMPAC:
    case coverTypes.LFPAC:

    // Hard Cover
    case coverTypes.HC:
    case coverTypes.LFHC:
    case coverTypes.PSHC:

    // Padded Cover
    case coverTypes.LFPC:
      return true;
    default:
      return false;
  }
};

/**
 * 检查指定的cover类型是否支持用户添加的照片铺满封面的正面(front)
 * @param  {string} coverType 待检查的cover类型
 */
export const checkIsSupportHalfImageInCover = (coverType) => {
  // 支持添加图片的封面类型有:
  // Crystal和Metal
  switch (coverType) {
    // Crystal
    case coverTypes.CC:
    case coverTypes.GC:

    // Metal
    case coverTypes.MC:
    case coverTypes.GM:
      return true;

    default:
      return false;
  }
};

/**
 * 检查是否需要把封面的用户照片设为内页的背景.
 * @param  {string} coverType coverType 待检查的cover类型
 * @return {boolean}
 */
export const checkIsSetCoverAsInnerBg = (coverType) => {
  // 只有hard cover和padded cover需要把封面的截图设为内页的背景.
  switch (coverType) {
    // Hard Cover
    case coverTypes.HC:
    case coverTypes.LFHC:
    case coverTypes.PSHC:

    // Padded Cover
    case coverTypes.LFPC:
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
  /*
  如果当前封面支持打印Painted Text和Spine Text
  - Leatherette, Genuine Leatherette,
  - Linen Cover,
  - Crystal Leatherette, Crystal Genuine Leatherette，
  - metal Leatherette, metal Genuine Leatherette，
  其中Crystal Leatherette, Crystal Genuine Leatherette仅支持封底打印）
  */
  switch (coverType) {
    // Leatherette, Genuine Leatherette
    case coverTypes.LC:
    case coverTypes.GL:
    case coverTypes.LFLC:
    case coverTypes.LFGL:

    // press book不再支持painted text
    // case coverTypes.PSLC:

    // Linen Cover
    case coverTypes.NC:
    case coverTypes.LFNC:
    // case coverTypes.PSNC:

    // Crystal Leatherette, Crystal Genuine Leatherette
    case coverTypes.CC:
    case coverTypes.GC:

    // metal Leatherette, metal Genuine Leatherette
    case coverTypes.MC:
    case coverTypes.GM:
      return true;
    default:
      return false;
  }
};

/**
 * 检查spine上是否支持painted text.
 * @param  {string} coverType coverType 待检查的cover类型
 * @return {boolean}
 */
export const checkIsSupportPaintedTextInSpine = (coverType) => {
  /*
  如果当前封面支持打印Painted Text和Spine Text
  - Leatherette, Genuine Leatherette,
  - Linen Cover,
  - Crystal Leatherette, Crystal Genuine Leatherette，
  - metal Leatherette, metal Genuine Leatherette，
  其中Crystal Leatherette, Crystal Genuine Leatherette仅支持封底打印）
  */
  switch (coverType) {
    // Leatherette, Genuine Leatherette
    case coverTypes.LC:
    case coverTypes.GL:
    case coverTypes.LFLC:
    case coverTypes.LFGL:
    // case coverTypes.PSLC:

    // Linen Cover
    case coverTypes.NC:
    case coverTypes.LFNC:
      // case coverTypes.PSNC:
      return true;
    default:
      return false;
  }
};

/**
 * 检查封面的正面是否支持painted text.
 * @param  {string} coverType coverType 待检查的cover类型
 * @return {boolean}
 */
export const checkIsSupportFrontPaintedTextInCover = (coverType) => {
  /*
  如果当前封面的正面支持打印Painted Text的类型有:
  - Leatherette, Genuine Leatherette,
  - Linen Cover

  仅支持封底和书脊打印:
  - Crystal Leatherette, Crystal Genuine Leatherette，
  - metal Leatherette, metal Genuine Leatherette，
  */
  switch (coverType) {
    // Leatherette, Genuine Leatherette
    case coverTypes.LC:
    case coverTypes.GL:
    case coverTypes.LFLC:
    case coverTypes.LFGL:
    case coverTypes.PSLC:

    // Linen Cover
    case coverTypes.NC:
    case coverTypes.LFNC:
    case coverTypes.PSNC:
      return true;
    default:
      return false;
  }
};

/**
 * 检查是否支持parent book. 只有: 8x8以上（包括8x8）的FMA才支持
 * @param  {[type]} productType FM/LF/PS
 * @param  {[type]} productSize 产品的尺寸: 8X8
 */
export const checkIsSupportParentBook = (productType, productSize) => {
  let isSupport = false;

  if (productSize && typeof productSize === 'string') {
    const size = productSize.toLowerCase().split('x');

    if (size && size.length === 2) {
      const h = parseInt(size[1]);
      const w = parseInt(size[0]);

      if (w >= 8 && h >= 8 && productType === productTypes.FM) {
        isSupport = true;
      }
    }
  }

  return isSupport;
};

/**
 * 检查该封面类型是否支持编辑parent book.
 * 只有这些封面才支持: Paper、Hard、Padded Cover
 * @param  {[type]} coverType [description]
 */
export const checkIsSupportEditParentBook = (coverType) => {
  // Paper、Hard、Padded Cover
  switch (coverType) {
    // Paper Cover or Soft Cover
    case coverTypes.PSSC:
    case coverTypes.FMPAC:
    case coverTypes.LFPAC:

    // Hard Cover
    case coverTypes.HC:
    case coverTypes.LFHC:
    case coverTypes.PSHC:

    // Padded Cover
    case coverTypes.LFPC:
      return true;
    default:
      return false;
  }
};
