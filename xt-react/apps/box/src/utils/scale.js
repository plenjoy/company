import { get } from 'lodash';

//  计算缩放比例
// export function getScale(params) {
//   const { imgRot, imageDetail, width, height, cropRLX, cropLUX, cropRLY, cropLUY } = params;
//   let cropLength, origLength;
//   if (imgRot % 180 === 0) {
//     cropLength = imageDetail.width * Math.abs(cropRLX - cropLUX);
//     origLength = width;
//   } else {
//     cropLength = imageDetail.height * Math.abs(cropRLY - cropLUY);
//     origLength = height;
//   }
//   return cropLength < origLength
//           ? Math.round((origLength - cropLength) * 100 / origLength)
//           : 0;
// }


export function getScale(params) {
  const { imageDetail, width, height, cropRLX, cropLUX, cropRLY, cropLUY } = params;
  const cropWidth = get(imageDetail, 'width') * Math.abs(cropRLX - cropLUX);
  // 截取图片的原始宽
  const scaleW = width / cropWidth;
  // 截取图片的原始高
  const cropHeight = get(imageDetail, 'height') * Math.abs(cropRLY - cropLUY);
  const scaleH = height / cropHeight;
  return Math.round(Math.max(scaleW, scaleH) * 100);
}
