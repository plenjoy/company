import Immutable from 'immutable';
import { isUndefined } from 'lodash';

function countSpecifyKeyInObject(immutableObj, specifyKey) {
  let outObj = Immutable.Map();

  immutableObj.forEach((value, key) => {
    if (key === specifyKey && value) {
      outObj = outObj.set(String(value), 1);
    }
    if (value && value.size) {
      const resultMap = countSpecifyKeyInObject(value, specifyKey);
      resultMap.forEach((v, k) => {
        const stringKey = String(k);
        if (isUndefined(outObj.get(k))) {
          outObj = outObj.set(stringKey, resultMap.get(k));
        } else {
          outObj = outObj.set(
            stringKey,
            outObj.get(stringKey) + resultMap.get(stringKey)
          );
        }
      });
    }
  });
  return outObj;
}

export function getImageUsedMap(immutableObj) {
  return countSpecifyKeyInObject(immutableObj, 'encImgId');
}

export function getStickerUsedMap(immutableObj) {
  return countSpecifyKeyInObject(immutableObj, 'decorationId');
}

export function getBackgroundUsedMap(immutableObj) {
  return countSpecifyKeyInObject(immutableObj, 'backgroundId');
}
