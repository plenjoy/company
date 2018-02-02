import { get } from 'lodash';
import qs from 'qs';

import { CALL_API } from '../middlewares/api';
import * as apiUrl from '../constants/apiUrl';

export function getTagList(categoryLeafNode) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_TAG_LIST,
          params: {
            wwwBaseUrl: urls.wwwBaseUrl
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            categoryLeafNode,
          })
        }
      }
    });
  };
}
