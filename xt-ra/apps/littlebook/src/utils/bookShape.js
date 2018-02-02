import { bookShapeTypes } from '../contants/strings';

/**
 * 判断当前书的形状, landscape/portrait/square.
 * @param  {string} size 书的尺寸: 8X8
 * @return {string}   landscape/portrait/square
 */
export const checkBookShapeType = (size) => {
  const newSize = size ? size.toLowerCase() : '';
  const chars = newSize.split('x');
  let type;

  if (chars && chars.length === 2) {
    const first = parseInt(chars[0]);
    const second = parseInt(chars[1]);

    if (first === second) {
      type = bookShapeTypes.square;
    } else if (first > second) {
      type = bookShapeTypes.portrait;
    } else {
      type = bookShapeTypes.landscape;
    }
  }

  return type;
};
