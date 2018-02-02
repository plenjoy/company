import { merge } from 'lodash';
import { guid } from '../../../common/utils/math';

/**
 * element实体
 */
const element = {
  id : guid(),

  // element的类型
  type : 'PhotoElement',

  // element在画布中起始点的x坐标
  x : 0,

  // element在画布中起始点的y坐标
  y : 0,

  // element的原始宽
  width : 0,

  // element的原始高
  height : 0,

  // 裁剪图片时, 起始点相对于图片左上角的比例
  px : 0,
  py : 0,

  // 裁剪图片时, 裁剪的图片宽高的比例
  pw : 1,
  ph : 1,

  // 元素的层级
  dep : 0,

  // 图片的id
  encImgId : '',

  // 元素的旋转角度
  rot : 0,

  // 图片的旋转角度.
  imgRot : 0,

  // 是否以中心点左右反转
  imgFlip : false,

  // 裁剪时, 起始点相对于图片左上角的比例
  cropLUX : 0,
  cropLUY : 0,

  // 裁剪时, 裁剪的宽高相对于图片的比例
  cropRLX : 0,
  cropRLY : 0,

  // 元素边框.
  border : {
    color: '#000000',
    size: 0,
    opacity: 100
  },

  // 最后修改时间.
  lastModified : Date.now()
}

export const createNewElement = (options) => {
  return merge({}, element, options);
};
