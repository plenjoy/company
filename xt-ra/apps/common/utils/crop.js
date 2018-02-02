/**
 * get default crop params
 * @param {number} imageWidth 图片的宽
 * @param {number} imageHeight 图片的高
 * @param {number} targetWidth 容器的宽
 * @param {number} targetHeight 容器的高
 * @returns {object}
 */
export const getDefaultCrop = (imageWidth, imageHeight, targetWidth, targetHeight) => {
  if (imageWidth && imageHeight && targetWidth && targetHeight) {
    const imageX = imageWidth / imageHeight;
    const targetX = targetWidth / targetHeight;
    let px;
    let py;
    let pw;
    let ph;

    if (imageX > targetX) {
      // horizonal image + portrait target container
      const finalHeight = imageHeight;
      const finalWidth = finalHeight * targetX;
      const paddingSize = (imageWidth - finalWidth) / 2;

      px = paddingSize / imageWidth;
      py = 0;
      pw = finalWidth / imageWidth;
      ph = 1;
    } else {
      // portrait image + horizonal target container
      const finalWidth = imageWidth;
      const finalHeight = finalWidth / targetX;
      const paddingSize = (imageHeight - finalHeight) / 2;

      px = 0;
      py = paddingSize / imageHeight;
      pw = 1;
      ph = finalHeight / imageHeight;
    }

    return { px, py, pw, ph };
  }

  // wrong params, crop whole image
  return { px: 0, py: 0, pw: 1, ph: 1 };
};

/**
 * get rotated angle
 * @param nCurrentAngle
 * @param nDegree
 * @returns {*}
 */
export const getRotatedAngle = (nCurrentAngle, nDegree) => {
  let angle = nCurrentAngle;
  let degree = nDegree;
  if (angle !== undefined && angle != null) {
    // valid degree now is 0 | 90 | 180 | -90
    degree = parseFloat(degree) || 90;

    angle += degree;
    // degree value fix
    angle = angle > 180 ? angle -= 360 : angle;
    angle = angle < -90 ? angle += 360 : angle;

    return angle;
  }
  else {
    return 0;
  }
};

/**
 * 获取图片裁剪时的起始点和结束点的相对值
 * @param {number} imageWidth 图片的宽
 * @param {number} imageHeight 图片的高
 * @param {number} targetWidth 容器的宽
 * @param {number} targetHeight 容器的高
 * @returns {object}
 */
export const getDefaultCropLRXY = (imageWidth, imageHeight, targetWidth, targetHeight) => {
  // 获取默认的裁剪参数, px, py, pw, ph。
  const defaultCrop = getDefaultCrop(imageWidth, imageHeight, targetWidth, targetHeight);
  const { px, py, pw, ph } = defaultCrop;

  return {
    cropLUX: px,
    cropLUY: py,
    cropRLX: px + pw,
    cropRLY: py + ph
  };
};
