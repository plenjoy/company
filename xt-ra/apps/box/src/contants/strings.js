// web clientType
export const clientType = 'H5';

// web  client id
export const webClientId = 1;

// 左侧栏的宽度
export const sideBarWidth = 382;

// workspace 距离顶部的高度
export const topHeight = 180;

// workspace 距离底部的高度
export const bottomHeight = 140;

// preview workspace 距离顶部的高度
export const previewTopHeight = 60;

// preview workspace 距离底部的高度
export const previewBottomHeight = 66;

// workspace占右侧空白区域的百分比.
export const workSpacePrecent = {
  lg: 0.95,
  big: 0.9,
  normal: 0.75,
  sm: 0.5,
  xs: 0.4
};

// spread的类型, 有封面和里面两种.
export const spreadTypes = {
  coverPage: 'coverPage',
  innerPage: 'innerPage'
};

// element的类型
export const elementTypes = {
  background: 'BackgroundElement',
  cameo: 'CameoElement',
  paintedText: 'PaintedTextElement',
  photo: 'PhotoElement',
  text: 'TextElement',
  spine: 'SpineElement',
  dvd: 'DVDElement',
  usbText: 'USBTextElement'
};

// panel type的类型
export const panelTypes = {
  imageWrapped: 'IW',
  blackLeatherette: 'BL',
  imagePanel: 'IP',
  blackPanel: 'BP'
};

export const coverTypes = {
  NONE: 'none',
  LC: 'LC',
  BC: 'BC',
  NC: 'NC',
  HC: 'HC'
};

export const pageTypes = {
  // 针对封面
  full: 'Full',
  front: 'Front',
  back: 'Back',
  spine: 'Spine',

  // 针对内页
  page: 'Page',
  sheet: 'Sheet',
  dvd: 'DVD',
  usb: 'USB'
};

export const cameoDirectionTypes = {
  S: 'Box_Square',
  H: 'Box_Horizontal',
  V: 'Box_Vertical'
};

export const productTypes = {
  imageBox: 'IB',
  woodBox: 'woodBox',
  usbCase: 'usbCase',
  dvdCase: 'dvdCase'
};

// 图片缩放比例清晰限制
export const RESIZE_LIMIT = 200;

/**
 * 天窗形状
 */
export const cameoShapeTypes = {
  rect: 'Box_Rect',
  round: 'Box_Round'
};

/**
 * 天窗效果图的白边大小
 */
export const cameoPaddingsRatio = {
  rectCameoPaddingTop: 101 / 535,
  rectCameoPaddingLeft: 101 / 535,
  roundCameoPaddingTop: 101 / 535,
  roundCameoPaddingLeft: 101 / 535,
  rectCameoRadius: 29 / 535
};

export const defaultFontStyle = {
  defaultColor: '#95989a',
  defaultFontFamily: 'Roboto',
  defaultFontWeight: 'normal',
  defaultFontFamilyId: 'roboto',
  defaultFontId: 'roboto',
  defaultFontSize: 23,
  defaultWidth: 1000,
  defaultHeight: 500
};

export const errorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR'
};

export const elementActionType = {
  textResize: 'textResize',
  textMove: 'textMove'
};

export const resizeDirs = {
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomLeft: 'bottomLeft',
  bottomRight: 'bottomRight',
  left: 'left',
  right: 'right',
  top: 'top',
  bottom: 'bottom'
};

export const textEditorTypes = {
  TEXT_EDITOR: 'TEXT_EDITOR',
  TEXT_EDITOR_NO_JUSTIFY: 'TEXT_EDITOR_NO_JUSTIFY'
};

export const AUTO_DELETE_PAGE = true;

export const defaultFrameOptions = {
  default: {
    // 宽与page的宽的比.
    value: 1 / 2,

    // 框的宽与高的比.
    whRatio: 4
  }
};

export const VERSION = '60001';
