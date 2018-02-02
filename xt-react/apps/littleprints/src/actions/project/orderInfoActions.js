import * as apiUrl from '../../constants/apiUrl';
import * as types from '../../constants/actionTypes';

import { CALL_API } from '../../middlewares/api';
import { getDataFromState } from '../../utils/getDataFromState';


export function getOrderInfo(projectId) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, userId } = stateData;
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PROJECT_ORDERED_STATUS,
          params: {
            baseUrl,
            projectId,
            userId
          }
        }
      }
    });
  };
}

export function clearOrderInfo() {
  return {
    type: types.CLEAR_ORDER_INFO
  };
}
