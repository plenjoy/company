export const getReneringStickerSize = (width, height, avaibleSize = [350, 700, 1000, 1500]) => {
  const maxLength = Math.max(width, height);
  // 从大到小排序
  avaibleSize.sort((a, b) => b - a);
  let fitSize = avaibleSize.find((size) => {
    return size <= maxLength;
  });
  if (!fitSize) {
    fitSize = avaibleSize[avaibleSize.length - 1];
  }
  return fitSize;
};
