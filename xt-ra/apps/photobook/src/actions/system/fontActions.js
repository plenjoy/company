import { get } from 'lodash';

import { CALL_API } from '../../middlewares/api';
import * as apiUrl from '../../contants/apiUrl';

export function getFontList() {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_FONTS,
          params: {
            baseUrl: urls.baseUrl
          }
        }
      }
    });
  };
}
