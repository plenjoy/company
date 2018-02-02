/**
 * 计算缩放比例
 * @param {object} params
 * params = {
 *   imgRot 旋转角度
 *   imageDetail 图片信息
 *   width 元素宽
 *   height 元素高
 *   cropRLX，cropLUX，cropRLY，cropLUY
 * }
 */
export function getScale(params) {
  const { imageDetail, width, height, cropRLX, cropLUX, cropRLY, cropLUY } = params;
  const cropWidth = imageDetail.get('width') * Math.abs(cropRLX - cropLUX);
  // 截取图片的原始宽
  const scaleW = width / cropWidth;
  // 截取图片的原始高
  const cropHeight = imageDetail.get('height') * Math.abs(cropRLY - cropLUY);
  const scaleH = height / cropHeight;
  return Math.round(Math.max(scaleW, scaleH) * 100);
}

/**
 * 计算缩放后的位置和宽高
 * @param  params = {
 *    x,
 *    y,
 *    width,
 *    height,
 *    scale,
 *    baseIndex // 0 左上角， 1 右上角， 2 右下角， 3 左下角
 * }
 * @return {}
 */
export function getScaledRect(params, baseIndex) {
  const { x, y, width, height, scale } = params;
  const offset = {
    x: 0,
    y: 0
  };
  const deltaXScale = scale.x - 1;
  const deltaYScale = scale.y - 1;
  const deltaWidth = width * deltaXScale;
  const deltaHeight = height * deltaYScale;
  const newWidth = width + deltaWidth;
  const newHeight = height + deltaHeight;
  const newX = x - deltaWidth / 2;
  const newY = y - deltaHeight / 2
  if (baseIndex) {
    const points = [{x, y}, {x: x+ width, y}, {x: x + width, y: y+ height}, {x, y: y+ height}];
    const newPoints = [{x: newX, y: newY}, {x: newX+ newWidth, y: newY}, {x: newX + newWidth, y: newY+ newHeight}, {x: newX, y: newY+ newHeight}];
    offset.x = points[baseIndex].x - newPoints[baseIndex].x;
    offset.y = points[baseIndex].y - newPoints[baseIndex].y;
  }
  return {
    x: newX + offset.x,
    y: newY + offset.y,
    width: newWidth,
    height: newHeight
  }
}
