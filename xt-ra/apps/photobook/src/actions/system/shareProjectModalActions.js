import { CALL_API } from '../../middlewares/api';
import { GET_SHARE_URLS } from '../../contants/apiUrl';
import {
  SHOW_SHARE_PROJECT_MODAL,
  HIDE_SHARE_PROJECT_MODAL
}
from '../../contants/actionTypes.js';

export function showShareProjectModal() {
  return {
    type: SHOW_SHARE_PROJECT_MODAL
  };
}

export function hideShareProjectModal() {
  return {
    type: HIDE_SHARE_PROJECT_MODAL
  };
}

export function getShareUrls(baseUrl, projectid, projectType) {
  return (dispatch, getState) => {
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_SHARE_URLS,
          params: {
            baseUrl,
            projectid,
            projectType
          }
        }
      }
    });
  };
}
