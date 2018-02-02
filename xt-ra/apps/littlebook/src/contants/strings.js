// web  client id
export const webClientId = 1;

// web clientType
export const clientType = 'H5';

// 缩放的主体类型.
export const ratioType = {
  coverWorkspace: 'coverWorkspace',
  innerWorkspace: 'innerWorkspace',

  // preview
  previewCoverWorkspace: 'previewCoverWorkspace',
  previewInnerWorkspace: 'previewInnerWorkspace',

  // order page
  orderCoverWorkspace: 'orderCoverWorkspace',
  orderInnerWorkspace: 'orderInnerWorkspace',

  screen: 'screen',

  // 渲染效果图与封面workspace大小的比例
  coverRenderWidth: 'coverRenderWidth',
  coverRenderHeight: 'coverRenderHeight',

  // 渲染效果图与内页workspace大小的比例
  innerRenderWidth: 'innerRenderWidth',
  innerRenderHeight: 'innerRenderHeight',

  // 里层.
  coverRenderPaddingLeft: 'coverRenderPaddingLeft',
  coverRenderPaddingTop: 'coverRenderPaddingTop',
  innerRenderPaddingLeft: 'innerRenderPaddingLeft',
  innerRenderPaddingTop: 'innerRenderPaddingTop',
  coverSheetPaddingLeft: 'coverSheetPaddingLeft',
  coverSheetPaddingTop: 'coverSheetPaddingTop',
  innerSheetPaddingLeft: 'innerSheetPaddingLeft',
  innerSheetPaddingTop: 'innerSheetPaddingTop',

  // 外层.
  coverRenderOutPaddingLeft: 'coverRenderOutPaddingLeft',
  coverRenderOutPaddingTop: 'coverRenderOutPaddingTop',
  innerRenderOutPaddingLeft: 'innerRenderOutPaddingLeft',
  innerRenderOutPaddingTop: 'innerRenderOutPaddingTop',
  coverSheetOutPaddingLeft: 'coverSheetOutPaddingLeft',
  coverSheetOutPaddingTop: 'coverSheetOutPaddingTop',
  innerSheetOutPaddingLeft: 'innerSheetOutPaddingLeft',
  innerSheetOutPaddingTop: 'innerSheetOutPaddingTop',

  // arrange pages
  coverWorkspaceForArrangePages: 'coverWorkspaceForArrangePages',
  innerWorkspaceForArrangePages: 'innerWorkspaceForArrangePages'
};

// 缩放的主体类型.
export const spreadTypes = {
  coverPage: 'coverPage',
  innerPage: 'innerPage'
};

// 定义封面类型.
export const coverTypes = {
  // Crystal
  LBHC: 'LBHC',
  LBPAC: 'LBPAC'
};

export const templateCoverTypes = ['HC', 'PA'];

// 保存自定义模版时的 sheetType 类型;
export const layoutSheetType = {
  PA: 'PA',
  HC: 'HC',
  INNER: 'INNER'
};

// 保存自定义模版时属于 sheetType 为 CC 的  cover 集合;
export const CcSheetTypeArray = ['MC', 'GM', 'CC', 'GC'];

// 百分比.
export const percent = {
  lg: 0.93,
  big: 0.8,
  normal: 0.75,
  sm: 0.5,
  xs: 0.4
};

/**
 * elType 类型
 */

export const elType = {
  cameo: 'cameo',
  image: 'image',
  text: 'text'
};

// element类型.
export const elementTypes = {
  background: 'BackgroundElement',
  cameo: 'CameoElement',
  paintedText: 'PaintedTextElement',
  photo: 'PhotoElement',
  decoration: 'DecorationElement',
  text: 'TextElement',
  spine: 'SpineElement',
  sticker: 'sticker'
};

export const pageTypes = {
  // 针对封面
  full: 'Full',
  front: 'Front',
  back: 'Back',
  spine: 'Spine',

  // 针对内页
  page: 'Page',
  sheet: 'Sheet'
};

/**
 * 天窗形状
 */
export const cameoShapeTypes = {
  rect: 'Rect',
  round: 'Round',
  oval: 'Oval'
};

/**
 * 天窗大小
 */
export const cameoSizeTypes = {
  small: 'S',
  middle: 'M',
  large: 'L'
};

/**
 * 天窗效果图的白边大小
 */
export const cameoPaddings = {
  top: 10,
  left: 10
};

export const cameoPaddingsRatio = {
  rectCameoPaddingTop: 15 / 420,
  rectCameoPaddingLeft: 15 / 420,
  roundCameoPaddingTop: 9 / 432,
  roundCameoPaddingLeft: 9 / 432
};

// 书脊在渲染效果图中, 顶部突出部分的比例.
export const spineExpandingTopRatio = 30 / 800;

// 在arrange pages中, 每一页workspace的宽度. // 废弃：用 getArrangePageViewSize().width 代替
// export const smallViewWidthInArrangePages = 290;
export const smallViewHeightInNavPages = 70;

// 在my project中使用的缩略图的尺寸.
export const smallViewWidthInMyProjects = 400;

// 产品类型.
export const productTypes = {
  LB2: 'LB2'
};

// 内页sheet的shadow图片的原始大小.
export const shadowBaseSize = {
  LB2: {
    left: { width: 789, height: 789 },
    middle: { width: 3, height: 789 },
    right: { width: 789, height: 789 }
  }
};

// 每一sheet包含的page数量.
export const pageStep = 2;

// 组件zindex的定义.
export const zIndex = {
  notification: 99999,
  modal: 50000,
  actionBar: 40000,
  shadow: 30000,
  elementBase: 100
};

export const orderType = 'commonProduct';

export const FREE = 'FREE!';

// 定义图片的形状.
export const imageShapeTypes = {
  rect: 'Rect',
  round: 'Round',
  oval: 'Oval'
};

// 天窗的方向类型.
export const cameoDirectionTypes = {
  S: 'Square',
  H: 'Horizontal',
  V: 'Vertical'
};

// 图片加载的并发数.
export const limitImagesLoading = 10;

// 支持半页模板的封面上, 允许的最大图片数.
export const limitImageNumberInHalfPageTemplate = 2;

// 登录页面的路由
export const loginPath = '/sign-in.html';

// crop 图片的最大尺寸；
export const cropLimitedSize = 1500;

// 图片缩放比例清晰限制
export const RESIZE_LIMIT = 300;

// 拖拽页面时, 设置拖拽元素的缩略图的节点选择器.
export const dragPageSelector = {
  targetPage: '.book-page-thumbnail',
  clonedPage: 'book-page-thumbnail-cloned'
};

export const dragElementSelector = {
  photo: '.photo-element-thumbnail'
};

// product名称, 简写与全称的对应关系.
export const productNames = {
  LF: 'Layflat Photo Book',
  FM: 'Flush Mount Album',
  LB: 'Little Black Book',
  PS: 'Press Photo Book'
};

// 定义最小和最大字号
export const MIN_FONT_SIZE = 4;
export const MAX_FONT_SIZE = 120;

// 定义最小和最大border size
export const MIN_BORDER_SIZE = 0;
export const MAX_BORDER_SIZE = 50;

// 定义最小和最大border opacity
export const MIN_BORDER_OPACITY = 1;
export const MAX_BORDER_OPACITY = 100;

export const filterOptions = {
  TOP: 'top picks',
  MY: 'my layouts',
  TEXT: 'text',
  MORE_THAN_NINE: '9+'
};

export const DEFAULT_FONT_FAMILY_ID = 'roboto';
export const DEFAULT_FONT_WEIGHT_ID = 'roboto';

// 避免用户误操作的阀值.
// 如果在以下的变化范围内, 我们认为是用户的无意操作.
export const userMistakeLimit = {
  // px
  x: 0.5,
  y: 0.5,

  // 度数.
  rot: 0.1,

  // px
  width: 0.5,
  height: 0.5
};

export const elementAction = {
  MOVE: 'MOVE',
  ROTATE: 'ROTATE',
  RESIZE: 'RESIZE'
};

// painted text的类型.
export const paintedTextTypes = {
  front: 'Front',
  back: 'Back',
  spine: 'Spine',
  none: 'None'
};
// painted text的字体
export const paintedTextFontsFilterArray = [
  { famliy: 73, font: 'Akashi', weight: ['Regular'] },
  { famliy: 9, font: 'Anton', weight: ['Normal'] },
  { famliy: 1, font: 'Arial', weight: ['Bold', 'Italic', 'Normal'] },
  {
    famliy: 17,
    font: 'Arimo',
    weight: ['Normal', 'Normal Italic', 'Bold', 'Bold Italic']
  },
  { famliy: 30, font: 'Bebas Neue', weight: ['Regular', 'Bold'] },
  { famliy: 101, font: 'Caesar Dressing', weight: ['Normal'] },
  {
    famliy: 15,
    font: 'Cantarell',
    weight: ['Normal', 'Normal Italic', 'Bold', 'Bold Italic']
  },
  { famliy: 5, font: 'Comfortaa', weight: ['Thin', 'Normal', 'Bold'] },
  {
    famliy: 55,
    font: 'Dosis',
    weight: ['Medium', 'Semi-Bold', 'Bold', 'ExtraBold']
  },
  { famliy: 12, font: 'Fira Mono', weight: ['Bold'] },
  { famliy: 22, font: 'Lilly', weight: ['Regular'] },
  { famliy: 45, font: 'McLaren', weight: ['Normal'] },
  { famliy: 33, font: 'Montserrat', weight: ['Normal', 'Bold'] },
  { famliy: 2, font: 'Pacifico', weight: ['Regular'] },
  {
    famliy: 21,
    font: 'Raleway',
    weight: [
      'Medium',
      'Medium Italic',
      'Bold',
      'Bold Italic',
      'Extra-Bold',
      'Extra-Bold Italic',
      'Ultra-Bold',
      'Ultra-Bold Italic'
    ]
  },
  {
    famliy: 20,
    font: 'Roboto',
    weight: [
      'Normal',
      'Normal Italic',
      'Medium',
      'Medium Italic',
      'Bold',
      'Bold Italic',
      'Ultra-Bold',
      'Ultra-Bold Italic'
    ]
  },
  { famliy: 58, font: 'Sanchez', weight: ['Normal', 'Normal Italic'] },
  { famliy: 68, font: 'Slackey', weight: ['Normal'] },
  { famliy: 3, font: 'Volkhov', weight: ['Bold', 'Bold Italic'] },
  {
    famliy: 40,
    font: 'Yantramanav',
    weight: ['Normal', 'Medium', 'Bold', 'Ultra-Bold']
  }
];

// cover 名字
export const coverNames = {
  bling: 'Bling Cover',
  linen: 'Linen Cover',
  leatherette: 'Leatherette',
  genuineLeather: 'Genuine Leather',
  crystalLeather: 'Crystal Leatherette',
  genuineCrystalLeather: 'Crystal Genuine Leather',
  metalGenuineLeather: 'Metal Genuine Leather',
  metalLeatherette: 'Metal Leatherette'
};

// 定义parent book的尺寸.
// 最小边为6英寸.
export const PARENT_BOOK_SIZE = 6;

// 定义默认图片框, 文本框, painted text的大小.
export const defaultFrameOptions = {
  // FM, LFB
  default: {
    // 宽与page的宽的比.
    value: 1 / 4,

    // 框的宽与高的比.
    whRatio: 2
  },

  // press book
  ps: {
    // 宽与page的宽的比.
    value: 1 / 2,

    // 框的宽与高的比.
    whRatio: 2
  }
};

export const dragTypes = {
  template: 'TEMPLATE'
};

export const logoInfo = {
  imageRatio: 2.423076923076923, // 宽高比
  ratio: 90 / 1460,
  baseWidth: 75
};

// 单位pt.
export const defaultSpineTextFontSize = 20;
export const defaultTextFontSize = 25;
export const defaultTextLength = 22;

// 封面上的text的默认大小, 单位px
export const defaultCoverTextSize = {
  pw: 500 / 1410,
  ph: 100 / 490
};

// upgrade预览元素的宽高.
export const upgradeItemSize = {
  square: 240,
  landscape: 185
};

// 定义soft cover, hard cover在6x6, 5x7尺寸上的原始尺寸
export const originalCoverSize = {
  softCover: {
    '6X6': {
      width: 3786,
      height: 1842
    },
    '8X8': {
      width: 4943,
      height: 2433
    },
    '5X7': {
      width: 4364,
      height: 1547
    },
    bleed: {
      top: 47,
      left: 23,
      right: 23,
      bottom: 47
    }
  },
  hardCover: {
    '6X6': {
      width: 4388,
      height: 2291
    },
    '8X8': {
      width: 5545,
      height: 2881
    },
    '5X7': {
      width: 4979,
      height: 1996
    },
    bleed: {
      top: 212,
      left: 212,
      right: 212,
      bottom: 212
    }
  },
  spineWidth: 160,
  spineExpanding: {
    softCover: {
      expandingOverBackcover: 153.5433,
      expandingOverFrontcover: 153.5433
    },
    hardCover: {
      expandingOverBackcover: 236.2205,
      expandingOverFrontcover: 236.2205
    }
  }
};

export const thumbnailEffectPaddingRatios = {
  softCover: {
    '6X6': {
      top: 5 / 194,
      right: 5 / 194,
      bottom: 10 / 194,
      left: 5 / 194
    },
    '8X8': {
      top: 5 / 194,
      right: 5 / 194,
      bottom: 10 / 194,
      left: 5 / 194
    },
    '5X7': {
      top: 5 / 173,
      right: 5 / 251,
      bottom: 10 / 173,
      left: 5 / 251
    }
  },
  hardCover: {
    '6X6': {
      top: 6 / 220,
      right: 6 / 220,
      bottom: 8 / 220,
      left: 6 / 220
    },
    '8X8': {
      top: 6 / 220,
      right: 6 / 220,
      bottom: 8 / 220,
      left: 6 / 220
    },
    '5X7': {
      top: 6 / 186,
      right: 6 / 264,
      bottom: 8 / 186,
      left: 6 / 264
    }
  }
};

export const shapeType = {
  controlElement: 'ELEMENT_CONTROL',
  backgroundElement: 'BACKGROUND_ELEMENT',
  backgroundRect: 'BACKGROUND_RECT',
  cameoElement: 'CAMEO_ELEMENT',
  cameoElementEffect: 'CAMEO_ELEMENT_EFFECT',
  elementBorder: 'ELEMENT_BORDER',
  iCon: 'ICON'
};

export const downloadStatus = {
  DOWNLOADING: 0,
  DOWNLOAD_SUCCESS: 1,
  DOWNLOAD_FAIL: 2
};

export const imageTypes = {
  FULL: 0,
  LANDSCAPE: 1,
  PORTRAIT: 2
};

export const editTextOperateType = 'onEditByActionBar';
export const mouseWheel = {
  width: 50,
  height: 50
};

// 书脊边上阴影的宽与page宽的比.
export const spineShodawRatioForHardCover = 0; // 10 / 2416;
export const spineShodawRatioForPaperCover = 0; // 18 / 2416;

export const bookShapeTypes = {
  // 8x11
  landscape: 'landscape',

  // 8x8
  square: 'square',

  // 11x8
  portrait: 'portrait'
};

export const shapeTypes = {
  // 8x11
  L: 'landscape',

  // 8x8
  S: 'square',

  // 11x8
  P: 'portrait'
};

export const uploadImageFailedTypes = {
  uidRepeat: 'imageuidpk repeat'
};
// 业务参数：当前照片的横竖情况（L为横，P为竖，S为方）
export const imgShape = {
  p: 'P',
  s: 'S',
  l: 'L'
};
export const imageCountPerSheet = 2;

// template group类型.
export const templateGroupTypes = {
  // 6x6
  GROUP_COVER_6X6: 'GROUP_COVER_6X6',
  GROUP_COVER_8X8: 'GROUP_COVER_8X8',

  PL: 'PL',
  SS: 'SS',
  PP: 'PP',
  PS: 'PS',
  SL: 'SL',
  LL: 'LL',
  SP: 'SP',
  LS: 'LS',
  LP: 'LP',

  // 5x7
  // cover
  GROUP_COVER_5X7: 'GROUP_COVER_5X7',

  // 内页.
  GROUP_5X7: 'GROUP_5X7'
};

export const upgradeItemTypes = {
  toHardCover: {
    value: 'toHardCover',
    text: 'Upgrade to Hard Cover',
    subText: 'Additional $5.00',
    contents:
      'Hard cover is thicker, sturdier, and offers better protection than a paper cover. Beautiful for gifting.'
  },
  toSize8X8: {
    value: 'toSize8X8',
    text: 'Upgrade to 8x8',
    subText: 'Additional $10.00',
    contents:
      'A larger size for a more glamorous appeal. The 8x8 size is perfect for starting a series to collect your favorite photos.'
  }
};
export const oAuthTypes = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  GOOGLE: 'google'
};

export const arrangePageRules = {
  containerPaddingLeft: 35,
  containerPaddingRight: 35,
  margin: 30,
  minWidth: 330,
  maxWidth: 400
};
