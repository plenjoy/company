/**
 * 新的天窗的位置为封面正面的水平垂直居中
 * @param  {object} coverSize 封面的原始大小, 结构: {width, height}
 * @param  {object} cameoSize  天窗的原始大小, 结构: {width, height}
 * @param  {object} cameoBleed 天窗的出血, 结构: {width, height}
 * @param  {object} spineSize  书脊的原始大小, 结构: {width, height}
 */
export const computedCameoElementOptions = (coverSize, cameoSize, cameoBleed, spineSize) => {
  const frontCoverWidth = (coverSize.width - spineSize.width) / 2;
  const frontCoverHeight = coverSize.height;

  // 天窗的尺寸: 基础宽高加上出血.
  const width = cameoSize.get('width') + cameoBleed.get('left') + cameoBleed.get('right');
  const height = cameoSize.get('height') + cameoBleed.get('top') + cameoBleed.get('top');

  const left = (frontCoverWidth - width) / 2;
  const top = (frontCoverHeight - height) / 2;

  const x = frontCoverWidth + spineSize.width + left;
  const y = top;
  const px = x / coverSize.width;
  const py = y / coverSize.height;
  const pw = width / coverSize.width;
  const ph = height / coverSize.height;

  return { x, y, px, py, pw, ph };
};
