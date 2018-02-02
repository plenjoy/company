/**
 * 碰撞检测
 * @param  {object} source 物体
 * @param  {object} target 待碰撞物体
 * @return {boolean}
 */
export const collision = (source, target) => {
  if (source.x + source.width < target.x ||
      source.y + source.height <target.y ||
      source.x > target.x + target.width ||
      source.y > target.y + target.height) {
    return false;
  }
  return true;
}
