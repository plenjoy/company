import * as types from '../../contants/actionTypes';
import Immutable from 'immutable';

import { filterInvalidKeys } from '../../../../common/utils/elements';

export function setClipboardData(data) {
  return {
    type: types.SET_CLIPBOARD_DATA,
    data: Immutable.Map({
      sourcePageId: data.get('sourcePageId'),
      elementArray: filterInvalidKeys(data.get('elementArray'))
    })
  };
}

export function clearClipboardData() {
  return {
    type: types.CLEAR_CLIPBOARD_DATA
  };
}
