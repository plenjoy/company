// 获取显示局域相关
export function getBoxLimit(oriWidth, oriHeight) {
  const width = 1200;
  const ratio = width / oriWidth;
  const height = Math.round(oriHeight * ratio);
  return {
    ratio,
    width,
    height
  };
}
