import Immutable from 'immutable';
import { isArray, merge, get } from 'lodash';

import * as types from '../../../constants/actionTypes';
import * as apiUrl from '../../../constants/apiUrl';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

function prepareFontList(fontObj) {
  const fontFamilyList = fontObj.fontFamilies.fontFamily;
  const outArray = [];

  fontFamilyList.forEach((fontFamily) => {
    const newFontFamily = merge({}, fontFamily, {
      font: isArray(fontFamily.font) ? [...fontFamily.font] : [fontFamily.font]
    });
    outArray.push(newFontFamily);
  });

  return outArray;
}

const fontList = (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.GET_FONTS: {
          const fontConfigObj = get(action, 'response.fontConfig');
          return Immutable.fromJS(convertObjIn(prepareFontList(fontConfigObj)));
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

export default fontList;
