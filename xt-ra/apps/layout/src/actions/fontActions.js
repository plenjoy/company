import { get } from 'lodash';

import { CALL_API } from '../middlewares/api';
import * as apiUrl from '../constants/apiUrl';

export function getFontList() {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls');

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
