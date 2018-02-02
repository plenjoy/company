/**
 * 给字符串解密
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const toDecode = str => {
  let s = str;

  try {
    s = decodeURIComponent(str);
  } catch (e) {
    //
  }

  return s;
};

/**
 * 判断字符串是否encode
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const isEncode = str => {
  // toDecode处理有特殊符号的情况
  // toEncode处理没有特殊符号的情况
  return (
    typeof str === 'string' && (toDecode(str) !== str || toEncode(str) === str)
  );
};

/**
 * 给字符串加密.
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const toEncode = str => {
  return str ? encodeURIComponent(toDecode(str)) : '';
};
