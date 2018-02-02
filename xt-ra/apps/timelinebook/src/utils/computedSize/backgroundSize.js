/**
 * 原始素材图尺寸 => 实物尺寸 => 缩放后视图尺寸
 * @param {*} materialSize 
 * @param {*} realViewSize 
 * @param {*} coverWorkspace 
 */
export function getBackgroundImageSize(materialSize, realViewSize, coverWorkspace) {
  const oriPaddingTop = materialSize.get('top');
  const oriPaddingRight = materialSize.get('right');
  const oriPaddingBottom = materialSize.get('bottom');
  const oriPaddingLeft = materialSize.get('left');
  const oriImageWidth = materialSize.get('width');
  const oriImageHeight = materialSize.get('height');

  const oriViewWidth = oriImageWidth - oriPaddingLeft - oriPaddingRight;
  const oriViewHeight = oriImageHeight - oriPaddingTop - oriPaddingBottom;

  const ratioX = realViewSize.width / oriViewWidth;
  const ratioY = realViewSize.height / oriViewHeight;

  return {
    x: - oriPaddingLeft * ratioX * coverWorkspace,
    y: - oriPaddingTop * ratioY * coverWorkspace,
    width: oriImageWidth * ratioX * coverWorkspace,
    height: oriImageHeight * ratioY * coverWorkspace,

    // 原素材图缩放尺寸
    paddingBottom: oriPaddingBottom * ratioY * coverWorkspace
  };
}