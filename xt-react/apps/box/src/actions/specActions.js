import { get } from 'lodash';
import { CALL_API } from '../middlewares/api';
import { GET_SPEC_DATA } from '../contants/apiUrl';

export function getSpecData() {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls.baseUrl');
    const autoRandomNum = Date.now();

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_SPEC_DATA,
          params: { baseUrl  }
        }
      }
    });
  };
}
