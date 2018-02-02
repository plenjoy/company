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
  CC: 'CC',
  GC: 'GC',

  // Leatherette
  LC: 'LC',
  GL: 'GL',
  LFLC: 'LFLC',
  LFGL: 'LFGL',
  PSLC: 'PSLC',

  // Bling Cover
  LFBC: 'LFBC',
  BC: 'BC',

  // hard cover
  HC: 'HC',
  LFHC: 'LFHC',
  PSHC: 'PSHC',

  // linen cover
  NC: 'NC',
  LFNC: 'LFNC',
  PSNC: 'PSNC',

  // metal cover
  MC: 'MC',
  GM: 'GM',

  // Soft Cover
  // 软壳现在使用两个名称：FMA和Layflat中为Paper Cover，Press Book中为Soft Cover
  PSSC: 'PSSC',

  // Paper Cover
  // 软壳现在使用两个名称：FMA和Layflat中为Paper Cover，Press Book中为Soft Cover
  FMPAC: 'FMPAC',
  LFPAC: 'LFPAC',

  // Black Cover
  // 已经禁用了.
  LBB: 'LBB',
  LLB: 'LLB',
  LSB: 'LSB',

  // Photo Cover
  // 已经禁用, 但为了兼容老数据..
  LBPC: 'LBPC',

  // padded cover
  LFPC: 'LFPC'
};

// 保存自定义模版时的 sheetType 类型;
export const layoutSheetType = {
  CC: 'CC',
  HC: 'HC',
  INNER: 'INNER'
};

export const mapCoverForLayout = {
  PA: ['LFPAC', 'FMPAC'],
  HC: ['HC', 'LFHC', 'PSHC'],
  PC: ['LFPC'],
  NC: ['NC', 'LFNC', 'PSNC'],
  BC: ['LFBC', 'BC'],
  LC: ['LC', 'LFLC', 'PSLC'],
  GL: ['GL', 'LFGL'],
  SC: ['PSSC'],
  GC: ['GC'],
  MC: ['MC'],
  GM: ['GM'],
  CC: ['CC']
};

// 保存自定义模版时属于 sheetType 为 CC 的  cover 集合;
export const CcSheetTypeArray = ['MC', 'GM', 'CC', 'GC'];

// 百分比.
export const percent = {
  full: 1,
  lg: 0.93,
  big: 0.9,
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
  sticker: 'StickerElement'
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

// 在arrange pages中, 每一页workspace的宽度.
export const smallViewWidthInArrangePages = 290;
export const smallViewHeightInNavPages = 70;

// 在my project中使用的缩略图的尺寸.
export const smallViewWidthInMyProjects = 400;

// 产品类型.
export const productTypes = {
  LF: 'LF',
  FM: 'FM',
  LB: 'LB',
  PS: 'PS'
};

// 内页sheet的shadow图片的原始大小.
export const shadowBaseSize = {
  LF: {
    left: { width: 789, height: 789 },
    middle: { width: 3, height: 789 },
    right: { width: 789, height: 789 }
  },
  FM: {
    left: { width: 789, height: 789 },
    middle: { width: 3, height: 789 },
    right: { width: 789, height: 789 }
  },
  PS: {
    left: { width: 789, height: 789 },
    middle: { width: 470, height: 789 },
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
export const limitImagesLoading = 5;

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
  MORE_THAN_NINE: '9+',
  MORE_THAN_FIVE: '5+'
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

// 定义默认sticker的大小.
export const defaultStickerOptions = {
  // FM, LFB
  default: {
    // 宽与page的宽的比.
    value: 1 / 6
  },

  // press book
  ps: {
    // 宽与page的宽的比.
    value: 1 / 3
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

export const dragTypes = {
  template: 'TEMPLATE',
  sticker: 'STICKERS',
  photo: 'PHOTO',
  theme: 'THEME',
  background: 'background'
};

export const ignoreShapes = [
  shapeType.controlElement,
  shapeType.elementBorder,
  shapeType.cameoElementEffect,
  shapeType.Icon
];

export const downloadStatus = {
  DOWNLOADING: 0,
  DOWNLOAD_SUCCESS: 1,
  DOWNLOAD_FAIL: 2
};

export const bookShapeTypes = {
  // 8x11
  landscape: 'landscape',

  // 8x8
  square: 'square',

  // 11x8
  portrait: 'portrait'
};

export const mouseWheel = {
  width: 50,
  height: 50
};

export const DEFAULT_CAMEO_SIZE = 'M';
export const DEFAULT_CAMEO_SHAPE = 'Rect';

export const MIN_IMAGE_WIDTH = 360;

export const uploadImageFailedTypes = {
  uidRepeat: 'imageuidpk repeat'
};

export const LAYOUT_MAX_VIEW_NUM_PS = 5;
export const LAYOUT_MAX_VIEW_NUM_DEFAULT = 10;

export const defaultSpineTextLength = 99;

export const DEFAULT_THEME_NAME = 'EVERYDAY';
export const BACKGROUND_ELEMENT_DEP = -1200;

export const gradientTypes = {
  linear: 'line',
  linear2: '2line',
  circular: 'round',
  diamond: 'diamond',
  rectangle: 'rectangle'
};

export const mapGradients = [
  {
    type: gradientTypes.linear,
    options: [
      {
        key: 'gradientAngle',
        defaultValue: 90,
        min: 0,
        max: 360,
        step: 90
      },
      {
        key: 'gradientMidpoint',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    type: gradientTypes.linear2,
    options: [
      {
        key: 'gradientAngle',
        defaultValue: 90,
        min: 0,
        max: 360,
        step: 90
      },
      {
        key: 'gradientMidpoint',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    type: gradientTypes.circular,
    options: [
      {
        key: 'gradientMidpoint',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    type: gradientTypes.diamond,
    options: [
      {
        key: 'gradientMidpoint',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    type: gradientTypes.rectangle,
    options: [
      {
        key: 'gradientMidpoint',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  }
];

export const mapGradientOptions = {
  line: ['gradientAngle', 'gradientMidpoint'],
  '2line': ['gradientAngle', 'gradientMidpoint'],
  round: ['gradientMidpoint'],
  diamond: ['gradientMidpoint'],
  rectangle: ['gradientMidpoint']
};

export const gradientKeepFields = ['gradientEnable', 'gradientType'];

export const defaultStyle = {
  opacity: 100,
  brightness: 0,
  contrast: 0,
  saturation: 100,
  effectId: 0,
  gradient: {
    gradientEnable: false,
    gradientType: gradientTypes.linear,
    gradientAngle: 90,
    gradientMidpoint: 0.5
  },
  shadow: {
    enable: false,
    color: '#000000',
    blur: 50,
    opacity: 50,
    angle: 45,
    distance: 25
  }
};

export const defaultBorder = {
  color: '#FFFFFF',
  size: 0,
  opacity: 100
};

export const filterEffectMap = {
  no: 0,
  bw: 1,
  sepia: 2,
  mono: 3,
  paint: 4,
  spread: 5
};

/**
 * 开放booktheme的产品列表.
 * 不在该列表的产品, 就不显示booktheme相关的选项. 但设计师除外.
 * @type {Array}
 */
export const bookthemeWhiteList = [productTypes.LF];

export const PER_ACTION_BUTTON_WIDTH = 50;
export const PER_ACTION_BUTTON_HEIGHT = 26;

export const DEVIATION = 0.02;
export const rotatedAngle = [90, 270];

// 定义在cookie中是否要显示新手指引的key.
export const HAS_SHOW_GET_STARTED_KEY = 'HAS_SHOW_GET_STARTED_KEY';

// A/B测试时, 定义user id的尾号为以下数字的需要使用非阻塞上传.
export const lastNumbersOfUnblockUploading = [1, 3, 5, 7, 9];

// selecttheme中, theme项的最小宽.
export const minWidthOfTheme = 360;

export const coverBgColorAndFontColorArray = [
  {
    bgColor: '#ffffff',
    fontColor: '#000000'
  },
  {
    bgColor: '#000000',
    fontColor: '#ffffff'
  },
  {
    bgColor: '#7ce0d3',
    fontColor: '#ffffff'
  },
  {
    bgColor: '#dbdad9',
    fontColor: '#000000'
  },
  {
    bgColor: '#cc000e',
    fontColor: '#ffffff'
  },
  {
    bgColor: '#1f3b34',
    fontColor: '#ffffff'
  },
  {
    bgColor: '#ffd862',
    fontColor: '#000000'
  },
  {
    bgColor: '#f1c3b8',
    fontColor: '#000000'
  },
  {
    bgColor: '#151a36',
    fontColor: '#ffffff'
  },
  {
    bgColor: '#adc1e4',
    fontColor: '#ffffff'
  }
];

export const needChangeBgColorCover = [
  'HC',
  'LFHC',
  'PSHC',
  'FMPAC',
  'LFPAC',
  'PSSC',
  'LFPC'
];

// 定义封面类型.
export const coverTypeNames = {
  // Crystal
  CC: 'Crystal Leatherette Cover',
  GC: 'Crystal Genuine Leather Cover',

  // Leatherette
  LC: 'Leatherette Cover',
  GL: 'Genuine Leather Cover',
  LFLC: 'Leatherette Cover',
  LFGL: 'Genuine Leather Cover',
  PSLC: 'Leatherette Cover',

  // Bling Cover
  LFBC: 'Bling Cover',
  BC: 'Bling Cover',

  // hard cover
  HC: 'Hard Cover',
  LFHC: 'Hard Cover',
  PSHC: 'Hard Cover',

  // linen cover
  NC: 'Linen Cover',
  LFNC: 'Linen Cover',
  PSNC: 'Linen Cover',

  // metal cover
  MC: 'Metal Leatherette Cover',
  GM: 'Metal Genuine Leather Cover',

  // Soft Cover
  PSSC: 'Soft Cover',

  // Paper Cover
  FMPAC: 'Paper Cover',
  LFPAC: 'Paper Cover',

  // Black Cover
  LBB: 'Black Cover',
  LLB: 'Genuine Leather Cover',
  LSB: 'Bling Cover',

  // Photo Cover
  // 已经禁用, 但为了兼容老数据..
  LBPC: 'Photo Cover',

  // padded cover
  LFPC: 'Padded Cover'
};


export const productCodes = {
  LF: 'V2_FMA',
  FM: 'V2_FMA',
  LB: 'V2_LBB',
  PS: 'V2_PRESSBOOK'
};

// 每个sheet的最大允许放置的照片数.
export const maxImagesCountEachSheet = 16;

// autofill计算结构的类型: 默认和最优类型
export const autofillResultTypes = {
  default: 'default',
  best: 'best'
};

export const arrangePageRules = {
  containerPaddingLeft: 35,
  containerPaddingRight: 35,
  margin: 30,
  minWidth: 330,
  maxWidth: 400,
  // 总宽偏移量，用来调整不同产品的arrange page尺寸
  offset: {
    PS: 5
  }
};
