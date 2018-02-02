/**
 * element实体
 */
export class Element {
  constructor(options = {}) {
    const {
      // element的类型
      type = 'PhotoElement',

      // element的性质
      elType = 'image',

      // element在画布中起始点的x坐标
      x = 0,

      // element在画布中起始点的y坐标
      y = 0,

      // element的原始宽
      width = 0,

      // element的原始高
      height = 0,

      // 裁剪图片时, 起始点相对于图片左上角的比例
      px = 0,
      py = 0,

      // 裁剪图片时, 裁剪的图片宽高的比例
      pw = 1,
      ph = 1,

      // 元素的层级
      dep = 0,

      // 图片的id
      imageid = '',
      encImgId = '',

      // 元素的旋转角度
      rot = 0,

      // 图片的旋转角度.
      imgRot = 0,

      // 是否以中心点左右反转
      imgFlip = false,

      // 裁剪时, 起始点相对于图片左上角的比例
      cropLUX = 0,
      cropLUY = 0,

      // 裁剪时, 裁剪的宽高相对于图片的比例
      cropRLX = 1,
      cropRLY = 1
    } = options;


    // element的类型
    this.type = type;

    // element的性质
    this.elType = elType;

    // element在画布中起始点的x坐标
    this.x = x;

    // element在画布中起始点的y坐标
    this.y = y;

    // element的原始宽
    this.width = width;

    // element的原始高
    this.height = height;

    // 裁剪图片时, 起始点相对于图片左上角的比例
    this.px = px;
    this.py = py;

    // 裁剪图片时, 裁剪的图片宽高的比例
    this.pw = pw;
    this.ph = ph;

    // 元素的层级
    this.dep = dep;

    // 图片的id
    this.imageid = imageid;
    this.encImgId = encImgId;

    // 图片的旋转角度.
    this.rot = rot;
    this.imgRot = imgRot;

    // 是否以中心点左右反转
    this.imgFlip = imgFlip;

    // 裁剪时, 起始点相对于图片左上角的比例
    this.cropLUX = cropLUX;
    this.cropLUY = cropLUY;

    // 裁剪时, 裁剪的宽高相对于图片的比例
    this.cropRLX = cropRLX;
    this.cropRLY = cropRLY;
  }
}
