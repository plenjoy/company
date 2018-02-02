// element的类型
export const elementTypes = {
  photo: 'PhotoElement',
  text: 'TextElement'
};

// 产品类型.
export const productTypes = {
  LF: 'LF',
  FM: 'FM',
  LB: 'LB',
  PS: 'PS'
};

export const elementAction = {
  MOVE: 'MOVE',
  RESIZE: 'RESIZE',
  ROTATE: 'ROTATE'
};

export const DEFAULT_FONT_FAMILY_ID = 'roboto';
export const DEFAULT_FONT_WEIGHT_ID = 'roboto';
export const DEFAULT_FONT_COLOR = '#000000';

// 模板状态对照表.
export const STATUS = [
  { value: 1, text: 'Online' },
  { value: 2, text: 'Deleted' },
  { value: 3, text: 'Draft' },
  { value: 4, text: 'Review' },
  { value: 5, text: 'Test' },
  { value: 6, text: 'ToProduct' },
  { value: 7, text: 'Check' }
];

// 默认的文案提示.
export const defaultTextList = ['Double click to edit text', 'Enter text here'];
