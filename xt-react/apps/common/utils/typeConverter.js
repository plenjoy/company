import { isObject, isPlainObject, isBoolean, isArray, forEach, toNumber } from 'lodash';

export const convertObjIn = (obj, excludeKeys = []) => {
  const outObj = isArray(obj) ? [] : {};
  forEach(obj, (value, key) => {
    if (excludeKeys.indexOf(key) !== -1) {
      outObj[key] = value;
    } else if (isObject(value)) {
      outObj[key] = convertObjIn(value, excludeKeys);
    } else if (value === 'true' || value === 'false') {
      outObj[key] = Boolean(value === 'true');
    } else if (value === 'null') {
      outObj[key] = null;
    } else if (isBoolean(value)) {
      outObj[key] = value;
    } else if (!isNaN(toNumber(value))) {
      outObj[key] = toNumber(value);
    } else {
      outObj[key] = value;
    }
  });

  return outObj;
};

export const convertObjOut = (obj) => {
  const outObj = isArray(obj) ? [] : {};
  forEach(obj, (value, key) => {
    if (isBoolean(value)) {
      outObj[key] = value ? 'true' : 'false';
    } else if (isObject(value)) {
      outObj[key] = convertObjOut(value);
    } else {
      outObj[key] = value;
    }
  });

  return outObj;
};
