import { template, merge } from 'lodash';
import { getDefaultCrop } from './crop';

/**
 * 获取用于裁剪的图片地址.
 * @param {string} originalUrl http://www.zno.com/imageBox/liveUpdateCropImage.ep?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>
 * @param {string} encImgId 图片的enc ID
 * @param {string} imageId 图片的ID
 * @param {number} originalImageWidth 图片的原始宽度
 * @param {number} originalImageHeight 图片的原始高度
 * @param {number} targetWidth 目标容器的宽度
 * @param {number} targetHeight 目标容器的高度
 * @param {number} rotation 旋转角度
 * @returns {string} 用于裁剪的图片地址
 */
export const combineImgCopperUrl = (originalUrl,
                                    imgObj,
                                    targetWidth,
                                    targetHeight) => {
  let url = '';

  // 根据原图的宽和高, 已经目标区域的宽和高, 计算裁剪时的比例.
  // const cropParams = getDefaultCrop(originalImageWidth, originalImageHeight, targetWidth, targetHeight);
  const cropParams = {
    px: imgObj.cropLUX,
    py: imgObj.cropLUY,
    pw: imgObj.cropRLX - imgObj.cropLUX,
    ph: imgObj.cropRLY - imgObj.cropLUY
  };

  // 调用lodash的template方法, 动态的替换里面的变量.
  url = template(originalUrl)(merge({}, cropParams, {
    rotation: imgObj.imgRot,
    encImgId: encodeURIComponent(imgObj.encImgId),
    width: Math.floor(targetWidth),
    height: Math.floor(targetHeight)
  }));

  return url;
};

// export const combineImgCopperUrl = (originalUrl,
//                                     encImgId,
//                                     imageId,
//                                     originalImageWidth,
//                                     originalImageHeight,
//                                     targetWidth,
//                                     targetHeight,
//                                     rotation = 0) => {
//   let url = '';
//
//   // 根据原图的宽和高, 已经目标区域的宽和高, 计算裁剪时的比例.
//   const cropParams = getDefaultCrop(originalImageWidth, originalImageHeight, targetWidth, targetHeight);
//
//   // 调用lodash的template方法, 动态的替换里面的变量.
//   url = template(originalUrl)(merge({}, cropParams, {
//     rotation,
//     imageId,
//     encImgId,
//     width: Math.ceil(targetWidth),
//     height: Math.ceil(targetHeight)
//   }));
//
//   return url;
// };

/**
 * 下载图片并返回promise对象
 * @param url 图片的地址
 * @returns {Promise}
 */
export const loadImg = (url) => {
  const promise = new Promise((resolve, reject) => {
    if (url) {
      const img = new Image();
      img.onload = () => {
        resolve({
          msg: 'done',
          url,
          img
        });
      };

      img.onerror = (ev) => {
        reject({
          msg: ev.message,
          url,
          img
        });
      };
      img.src = url;
    } else {
      reject({
        msg: 'url is not empty',
        url,
        img
      });
    }
  });

  return promise;
};
