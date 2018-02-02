/**
 * 根据后台使用阴影参数中的angle和distance, 计算出canvas中对应的offset值.
 * @param  {Number} angle  [description]
 * @param  {Number} radius [description]
 * @return {Object}  {x,y}
 */
export const getShadowOffset = (angle, radius) => {
  // 转成弧度.
  const newAngle = (angle * Math.PI) / 180;

  return {
    x: Math.cos(newAngle) * radius,
    y: Math.sin(newAngle) * radius
  };
};
