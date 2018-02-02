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
