import { fromJS, is } from 'immutable';

/**
 * 对immutable的list元素去重.
 * @param  {LIST}   array 待去重的数组
 * @param  {Function} fn    去重的方法.
 * @return {LIST}        去重后的数组.
 */
export const unique = (array, fn) => {
  if (!array || array.size <= 1) {
    return array;
  }

  let newArr = fromJS([]);

  array.forEach((item) => {
    const index = newArr.findIndex((m) => {
      if (fn && typeof (fn) === 'function') {
        return fn(item, m);
      }

      return is(item, m);
    });

    if (index === -1) {
      newArr = newArr.push(item);
    }
  });

  return newArr;
};
