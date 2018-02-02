
/**
 * 定义默认空的图片框的设置
 * @type {Object}
 */
export const defaultImageFrame = {
  fill: '#000',
  stroke: '#dfdfdf',
  strokeWidth: 4
};

/**
 * 定义默认空的文本框的设置.
 * @type {Object}
 */
export const defaultTextFrame = {
  stroke: '#7b7b7b',

  // 虚线: 10px长, 5px的间隔.
  dash: [4, 4],
  strokeWidth: 1
};
//由于使用了group它的定位方式和css一模一样
export const defaultCameoRectFrame = {
   fill: '#fff',
   offset:{
    x: 0,
    y: 0
   }
};


// 定义page上绘制的默认提示语, 在konva上的默认名称.
export const backgroundTextElementName = 'backgroundTextElementName';
export const defaultTextColor = '#b7b7b7';
