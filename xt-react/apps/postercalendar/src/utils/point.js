/**
 * 判断一个点是否在box中
 * @param  {[type]} point [description]
 * @param  {[type]} box   [description]
 * @return {[type]}       [description]
 */
export const inPointInBox = (point, box) => {
  const { x, y, width, height, degree } = box;
  const basePoint = {
    x: x + width / 2,
    y: y + height / 2
  };
  const rotatedPoint = getRotatedPoint(point, basePoint, -degree);
  return clamp(rotatedPoint, box);
}

/**
 * 获取旋转后的坐标
 * @type {[type]}
 */
const getRotatedPoint = (point, basePoint, degree) => {
  const angle = degree * Math.PI / 180;

  const baseX = basePoint.x;
  const baseY = basePoint.y;

  const dx = point.x - baseX;
  const dy = point.y - baseY;

  return {
    x: dx * Math.cos(angle) - dy * Math.sin(angle) + baseX,
    y: dx * Math.sin(angle) + dy * Math.cos(angle) + baseY
  };
}

/**
 * 点与盒子的碰撞检测
 * @param  {[type]} point [description]
 * @param  {[type]} box   [description]
 * @return {[type]}       [description]
 */
const clamp = (point, box) => {
  const { x, y, width, height } = box;
  if (point.x > x && point.x < x + width && point.y > y && point.y < y + height) {
    return true;
  }
  return false;
}
