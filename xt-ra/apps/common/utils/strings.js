// web client id
export const webClientId = 1;

export const supportedImagesTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/x-png',
  'image/png'
];

// littiteBook 最少上传数量
export const leastUploadImagesCount = 24;

// 上传文件失败的失败类型.
export const uploadFailTypes = {
  // 超时.
  timeExpired: 'timeExpired',

  // 文件过大
  overSize: 'overSize',

  // 空文件
  emptyFile: 'emptyFile',

  // no rgb
  colorSpace: 'colorSpace',

  // 无效的类型.
  invalidFileType: 'invalidFileType'
};

export const invalidElementKeys = [
  'dateSelected',
  'isDisabled',
  'isSelected',
  'computed',
  'elements'
];

// painted text的类型.
export const paintedTextTypes = {
  front: 'Front',
  back: 'Back',
  spine: 'Spine',
  none: 'None'
};

export const uploadStatus = {
  PENDING: 'PENDING',
  DONE: 'DONE',
  PROGRESS: 'PROGRESS',
  FAIL: 'FAIL'
};

