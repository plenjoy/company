/**
 * 根据exif中的orientation值, 转换成旋转的度数.
 * @param  {Number} orientation [description]
 * @return {[type]}             [description]
 */
export const getDegree = (orientation = 1) => {
  let deg = 0;

  // 参数 - 旋转角度
  // 1 - 0°
  // 6 - 顺时针90°
  // 8 - 顺时针270°
  // 3 - 顺时针180°
  switch (parseInt(orientation)) {
    case 6: {
      deg = 90;
      break;
    }
    case 8: {
      deg = -90;
      break;
    }
    case 3: {
      deg = 180;
      break;
    }
    default: {
      break;
    }
  }

  return deg;
};
