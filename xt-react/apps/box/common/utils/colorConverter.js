export function RGBToHex(r, g, b) {
  const bin = r << 16 | g << 8 | b;
  return ((h) => {
    return '#' + new Array(7 - h.length).join('0') + h;
  })(bin.toString(16).toUpperCase());
}

/**
 * [hexString2Number description]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export function hexString2Number(str) {
  const colorString = str.replace(/^#/, '');
  const colorArray = colorString.split('');
  if (colorString.length === 3) {
    colorArray[5] = colorString[2];
    colorArray[4] = colorString[2];
    colorArray[3] = colorString[1];
    colorArray[2] = colorString[1];
    colorArray[1] = colorString[0];
    colorArray[0] = colorString[0];
  }

  return parseInt(colorArray.join(''), 16);
}

/**
 * [hexToRGB description]
 * @param  {[type]} hexString [description]
 * @return {[type]}           [description]
 */
export function hexToRGB(hexString) {
  const hex = hexString2Number(hexString);
  const r = hex >> 16;
  const g = hex >> 8 & 0xFF;
  const b = hex & 0xFF;
  return [r, g, b];
}

/**
 * [hexToRGBA description]
 * @param  {[type]} hexString [description]
 * @param  {[type]} alpha [description]
 * @return {[type]}           [description]
 */
export function hexToRGBA(hexString, alpha) {
  const hex = hexString2Number(hexString);
  const r = hex >> 16;
  const g = hex >> 8 & 0xFF;
  const b = hex & 0xFF;
  return `rgba(${r}, ${g}, ${b}, ${alpha/100})`;
}

/**
 * 把数字转成带#号的16进制颜色值.
 * @param  {[type]} number [description]
 * @return {[type]}        [description]
 */
export const numberToHex = (number) => {
  var hex = parseInt(number).toString(16).toUpperCase();
  while (hex.length < 6) {
      hex = '0' + hex;
  }
  return '#' + hex;
};
