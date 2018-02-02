export const getInnerPageSize = (innerBaseSize, bleed, innerWrapSize) => {
  const innerPageBleedWidth = bleed.left + bleed.right;
  const innerPageBleedHeight = bleed.top + bleed.bottom;
  const innerWrapSizeWidth = innerWrapSize.left + innerWrapSize.right;
  const innerWrapSizeHeight = innerWrapSize.top + innerWrapSize.bottom;
  const baseWidth = innerBaseSize.width;
  const baseHeight = innerBaseSize.height;

  return {
    width: innerBaseSize.width + innerPageBleedWidth + innerWrapSizeWidth,
    height: innerBaseSize.height + innerPageBleedHeight + innerWrapSizeHeight,
    baseWidth,
    baseHeight
  };
}

export const getCoverSheetSize = (baseSize,
  bleedSize,
  wrapSize,
  spineWidth = 0,
  isSingleCover = false,
  spineExpanding = {},
  isRotate) => {
  const coverPageBleedWidth = bleedSize.left + bleedSize.right;
  const coverWrapWidth = wrapSize.left + wrapSize.right;

  const coverPageBleedHeight = bleedSize.top + bleedSize.bottom;
  const coverWrapHeight = wrapSize.top + wrapSize.bottom;

  const {
    expandingOverFrontcover = 0,
    expandingOverBackcover = 0
  } = spineExpanding;

  let baseSizeWidth = baseSize.width;
  let baseSizeHeight = baseSize.height;

  if(isRotate) {
    baseSizeWidth = baseSize.height;
    baseSizeHeight = baseSize.width;
  }

  // cover的宽高.
  const width = (isSingleCover ? baseSizeWidth : (baseSizeWidth * 2)) +
    coverPageBleedWidth +
    coverWrapWidth +
    spineWidth +
    expandingOverFrontcover +
    expandingOverBackcover;
  const height = baseSizeHeight + coverPageBleedHeight + coverWrapHeight;

  const baseWidth = (isSingleCover ? baseSizeWidth : (baseSizeWidth * 2)) + spineWidth + expandingOverFrontcover + expandingOverBackcover;
  const baseHeight = baseSizeHeight;

  return {
    width,
    height,
    baseWidth,
    baseHeight,
    wrapSize
  };
};

export const getFrontCoverSize = (baseSize, bleedSize, wrapSize) => {
  // return {
  //   width: baseSize.width,
  //   height: baseSize.height
  // };
  const coverPageBleedWidth = bleedSize.left + bleedSize.right;
  const coverPageBleedHeight = bleedSize.top + bleedSize.bottom;
  const coverWrapHeight = wrapSize.top + wrapSize.bottom;

  // return {
  //   width: baseSize.width + coverPageBleedWidth,
  //   height: baseSize.height + coverPageBleedHeight
  // };
  return {
    width: baseSize.width + coverPageBleedWidth + wrapSize.right,
    height: baseSize.height + coverPageBleedHeight + coverWrapHeight
  };
};

export const getBackCoverSize = (baseSize, bleedSize, wrapSize) => {
  // return {
  //   width: baseSize.width,
  //   height: baseSize.height
  // };
  const coverPageBleedWidth = bleedSize.left + bleedSize.right;
  const coverPageBleedHeight = bleedSize.top + bleedSize.bottom;
  const coverWrapHeight = wrapSize.top + wrapSize.bottom;

  // return {
  //   width: baseSize.width + coverPageBleedWidth,
  //   height: baseSize.height + coverPageBleedHeight
  // };

  return {
    width: baseSize.width + coverPageBleedWidth + wrapSize.left,
    height: baseSize.height + coverPageBleedHeight + coverWrapHeight
  };
};

/**
 * 获取计算后的封面背景参数
 * @param {*} cover
 * @param {*} coverSheetSize
 */
export const getCoverBackgroundSize = (cover, coverSheetSize, isRotate = false) => {
  // 从spec里面拿到的原素材数据
  let {
    width: oriBgWidth,
    height: oriBgHeight,
    paddingTop: oriPaddingTop,
    paddingRight: oriPaddingRight,
    paddingBottom: oriPaddingBottom,
    paddingLeft: oriPaddingLeft
  } = cover;

  if(isRotate) {
    oriBgWidth = cover.rWidth;
    oriBgHeight = cover.rHeight;
    oriPaddingTop = cover.rPaddingTop;
    oriPaddingRight = cover.rPaddingRight;
    oriPaddingBottom = cover.rPaddingBottom;
    oriPaddingLeft = cover.rPaddingLeft;
  }

  // 获取原素材操作区大小
  const oriWidth = oriBgWidth - oriPaddingLeft - oriPaddingRight;
  const oriHeight = oriBgHeight - oriPaddingTop - oriPaddingBottom;

  // 计算操作区大小(不带出血，不带包边)与原素材操作区大小宽高比
  const ratioX = coverSheetSize.baseWidth / oriWidth;
  const ratioY = coverSheetSize.baseHeight / oriHeight;

  // 将封面参数进行比例缩放，缩放成操作区参数
  const coverImageSize = {
    bgImageWidth: oriBgWidth * ratioX,
    bgImageHeight: oriBgHeight * ratioY,
    paddingTop: oriPaddingTop * ratioY,
    paddingRight: oriPaddingRight * ratioX,
    paddingBottom: oriPaddingBottom * ratioY,
    paddingLeft: oriPaddingLeft * ratioX
  };

  // 返回参数
  return {
    ...coverImageSize,
    ratioX,
    ratioY
  }
}

/**
 * 获取计算后的内页背景参数
 * @param {*} inner
 * @param {*} refPage
 * @param {*} isLeftPage
 */
export const getInnerBackgroundSize = (inner, refPage, isLeftPage) => {
  // 从spec里面拿到的原素材数据
  const oriBgSize = inner;
  const oriPageSize = {};

  // 计算出原素材单页操作区大小
  if(isLeftPage) {
    oriPageSize.width = oriBgSize.width - oriBgSize.lPagePaddingLeft - oriBgSize.lPagePaddingRight;
    oriPageSize.height = oriBgSize.height - oriBgSize.lPagePaddingTop - oriBgSize.lPagePaddingBottom;
  } else {
    oriPageSize.width = oriBgSize.width - oriBgSize.rPagePaddingLeft - oriBgSize.rPagePaddingRight;
    oriPageSize.height = oriBgSize.height - oriBgSize.rPagePaddingTop - oriBgSize.rPagePaddingBottom;
  }

  //获取单页操作区的高宽比
  const ratioX = refPage.baseWidth / oriPageSize.width;
  const ratioY = refPage.baseHeight / oriPageSize.height;

  // 将内页参数进行比例缩放，缩放成操作区参数
  const innerImageSize = {
    bgImageWidth: inner.width * ratioX,
    bgImageHeight: inner.height * ratioY,
    paddingLeft: inner.paddingLeft * ratioX,
    paddingTop: inner.paddingTop * ratioY,
    paddingRight: inner.paddingRight * ratioX,
    paddingBottom: inner.paddingBottom * ratioY,
    lPagePaddingLeft: (inner.lPagePaddingLeft - inner.paddingLeft) * ratioX,
    lPagePaddingTop: (inner.lPagePaddingTop - inner.paddingTop) * ratioY,
    lPagePaddingRight: (inner.lPagePaddingRight - inner.paddingRight) * ratioX,
    lPagePaddingBottom: (inner.lPagePaddingBottom - inner.paddingBottom) * ratioY,
    rPagePaddingLeft: (inner.rPagePaddingLeft - inner.paddingLeft || 0) * ratioX,
    rPagePaddingTop: (inner.rPagePaddingTop - inner.paddingTop || 0) * ratioY,
    rPagePaddingRight: (inner.rPagePaddingRight - inner.paddingRight || 0) * ratioX,
    rPagePaddingBottom: (inner.rPagePaddingBottom - inner.paddingBottom || 0) * ratioY
  };

  // 返回参数
  return {
    ...innerImageSize,
    ratioX,
    ratioY
  }
}
