// web  client id
export const webClientId = 1;

// web clientType
export const clientType = 'H5';

// element类型.
export const elementTypes = {
  photo: 'PhotoElement',
  text: 'TextElement',
  calendar: 'CalendarElement',
  style: 'StyleElement'
};

// 封面类型
export const pageTypes = {
  top: 'topPage',
  bottom: 'bottomPage',
  cover: 'coverPage'
};

// 产品类型.
export const productTypes = {
  WC: 'WC',
  DC: 'DC',
  PC: 'PC',
  LC: 'LC'
};

export const bookShapeTypes = {
  // 8x11
  landscape: 'landscape',

  // 8x8
  square: 'square',

  // 11x8
  portrait: 'portrait'
};

// 图片缩放比例清晰限制
export const RESIZE_LIMIT = 300;

export const filterOptions = {
  TOP: 'top picks',
  MY: 'my layouts',
  TEXT: 'text',
  MORE_THAN_NINE: '9+',
  MORE_THAN_FIVE: '5+'
};

export const mouseWheel = {
  width: 50,
  height: 50
};

// 缩放的主体类型.
export const ratioTypes = {
  coverWorkspace: 'coverWorkspace',
  innerWorkspace: 'innerWorkspace',

  // preview
  previewCoverWorkspace: 'previewCoverWorkspace',
  previewInnerWorkspace: 'previewInnerWorkspace',

  // arrange pages
  coverWorkspaceForArrangePages: 'coverWorkspaceForArrangePages',
  innerWorkspaceForArrangePages: 'innerWorkspaceForArrangePages',

  // upgrade model
  coverWorkspaceForUpgrade: 'coverWorkspaceForUpgrade',
  innerWorkspaceForUpgrade: 'innerWorkspaceForUpgrade'
};

// 百分比.
export const percent = {
  lg: 0.93,
  big: 0.9,
  normal: 0.75,
  sm: 0.5,
  xs: 0.4
};

// 在arrange pages中, 每一页workspace的宽度.
export const smallViewWidthInArrangePages = 290;
export const smallViewHeightInNavPages = 70;

export const downloadStatus = {
  DOWNLOADING: 0,
  DOWNLOAD_SUCCESS: 1,
  DOWNLOAD_FAIL: 2
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
  template: 'TEMPLATE'
};

// 定义默认图片框, 文本框, painted text的大小.
export const defaultFrameOptions = {
  // FM, LFB
  default: {
    // 宽与page的宽的比.
    value: 1 / 4,

    // 框的宽与高的比.
    whRatio: 2
  }
};

export const elementAction = {
  MOVE: 'MOVE',
  ROTATE: 'ROTATE',
  RESIZE: 'RESIZE'
};

export const pageNumPerRow = {
  WC: 5,
  LC: 6,
  DC: 4
};

export const pageStepMap = {
  WC: 2,
  LC: 1,
  DC: 1
};

export const templateTypes = {
  WC: 6,
  LC: 11,
  DC: 5
};

export const sideBarWidth = 280;

export const dragElementSelector = {
  photo: '.photo-element-thumbnail'
};

export const dragPageSelector = {
  targetPage: '.book-page-thumbnail',
  clonedPage: 'book-page-thumbnail-cloned'
};

export const defaultStyle = {
  brightness: 0,
  effectId: 0,
  opacity: 100
};

export const innerPageHeightShowRatio = {
  WC: 0.58,
  DC: 1,
  LC: 1
};

export const orderType = 'commonProduct';

// 登录页面的路由
export const loginPath = '/sign-in.html';

// 在my project中使用的缩略图的尺寸.
export const smallViewWidthInMyProjects = 400;

export const defaultFontSetting = {
  fontSize: 23,
  color: "#000000",
  fontFamilyId: "roboto",
  fontId: "roboto"
};

export const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
