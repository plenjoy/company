class Paddings {
  constructor(top = 0, left = 0, right = 0, bottom = 0) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}

// paper
const paperCover = {
  back: new Paddings(24, 6, 0, 24),
  spain: new Paddings(24, 0, 0, 24), // 37, 38
  cover: new Paddings(24, 0, 6, 24),

    // 里层
  left: new Paddings(25, 5, 0, 25), // top = 0, left = 0, right = 0, bottom = 0
  right: new Paddings(25, 0, 5, 25),

    // 外层
  outLeft: new Paddings(24, 4, 0, 24),
  outRight: new Paddings(24, 0, 4, 24)
};

// hard cover
const hardCover = {
  back: new Paddings(24, 8, 0, 24),
  spain: new Paddings(24, 0, 0, 24),
  cover: new Paddings(24, 0, 8, 24),

    // 里层
  left: new Paddings(33, 31, 0, 33),
  right: new Paddings(33, 0, 31, 33),

    // 外层
  outLeft: new Paddings(24, 6, 0, 24),
  outRight: new Paddings(24, 0, 6, 24)
};

// default
const defaultCover = {
  back: new Paddings(24, 4, 0, 24),
  spain: new Paddings(24, 0, 0, 24), //  new Paddings(35, 35);
  cover: new Paddings(24, 0, 4, 24),

  // 里层
  left: new Paddings(24, 5, 0, 24),
  right: new Paddings(24, 0, 5, 24),

  // 外层
  outLeft: new Paddings(24, 4, 0, 24),
  outRight: new Paddings(24, 0, 4, 24)
};

/**
 * 定义不同封面素材对应的四周的白边的尺寸.
 * @type {Object}
 */
const coverPaddings = {
  // hard cover与padded cover使用相同的素材.
  LBHC: hardCover,

  // paper cover
  LBPAC: paperCover,

  // 默认值.
  _default: defaultCover
};

/**
 * 定义不同封面素材对应的四周的白边的尺寸.
 * @type {Object}
 */
const innerPaddings = {
  // hard cover与padded cover使用相同的内页素材.
  LBHC: hardCover,

  // paper cover
  LBPAC: paperCover,

  // 默认值.
  _default: defaultCover
};


/* 定义不同素材效果图对应的四周的效果尺寸的大小.*/
// top = 0, left = 0, right = 0, bottom = 0
const innerSheetHardCoverEffectRatio = new Paddings(8 / 925, 26 / 1706, 22 / 1706, 9 / 925);
const innerSheetDefaultCoverEffectRatio = new Paddings(10 / 945, 25 / 1726, 20 / 1726, 8 / 945);

/**
 * 定义不同素材效果图对应的四周的效果尺寸的大小.
 * 效果图包括工作区域和围绕四周的效果.
 * @type {Object}
 */
const innerSheetPaddingsEffectRatio = {
  // hard cover与paper cover使用相同的素材.
  LBHC: innerSheetHardCoverEffectRatio,
  LFPAC: innerSheetHardCoverEffectRatio,

  // 默认值.
  _default: innerSheetDefaultCoverEffectRatio
};

/**
 * 根据cover id, 查找对应的cover在render时, 对应白边的大小.
 * @param  {string} coverType cover id比如: CC,GC,NC,HC等.
 * @return {object} 白边的大小, 结构为: {top, right, bottom, left}
 */
export const getCoverPaddings = (coverType) => {
  const paddings = coverPaddings[coverType] || coverPaddings._default;

  return paddings;
};

/**
 * 根据cover id, 查找对应的cover在render时, 对应白边的大小.
 * @param  {string} coverType cover id比如: CC,GC,NC,HC等.
 * @return {object} 白边的大小, 结构为: {top, right, bottom, left}
 */
export const getInnerPaddings = (coverType) => {
  const paddings = innerPaddings[coverType] || innerPaddings._default;

  return paddings;
};

/**
 * 根据cover id, 获取不同素材效果图对应的四周的效果尺寸的大小.效果图包括工作区域和围绕四周的效果.
 * @param  {string} coverType cover id比如: CC,GC,NC,HC等.
 * @return {object} 白边的大小, 结构为: {top, right, bottom, left}
 */
export const getInnerSheetPaddingsEffectRatio = (coverType) => {
  const paddings = innerSheetPaddingsEffectRatio[coverType] || innerSheetPaddingsEffectRatio._default;

  return paddings;
};

