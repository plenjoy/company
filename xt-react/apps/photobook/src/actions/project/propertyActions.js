import qs from 'qs';
import * as types from '../../contants/actionTypes';
import * as apiUrl from '../../contants/apiUrl';
import { CALL_API } from '../../middlewares/api';

import { getDataFromState } from '../../utils/getDataFromState';

export function projectLoadCompleted() {
  return {
    type: types.PROJECT_LOAD_COMPLETED
  };
}

export function updateProjectId(projectId) {
  return {
    type: types.UPDATE_PROJECT_ID,
    projectId
  };
}

export function getProjectTitle(projectId) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, userId } = stateData;
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PROJECT_TITLE,
          params: {
            baseUrl,
            userId,
            projectId
          }
        }
      }
    });
  };
}

export function saveProjectTitle(projectId, projectTitle) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, userId } = stateData;
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.SAVE_PROJECT_TITLE,
          params: {
            baseUrl,
            userId,
            projectId,
            projectName: encodeURIComponent(projectTitle)
          }
        }
      }
    });
  };
}

export function changeProjectTitle(title) {
  return {
    type: types.CHANGE_PROJECT_TITLE,
    title
  };
}

export function checkProjectTitle(paramsObj) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls } = stateData;
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.CHECK_PROJECT_TITLE,
          params: {
            baseUrl
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify(paramsObj)
        }
      }
    });
  };
}

export function setApplyBookThemeId(bookThemeId) {
  return {
    type: types.SET_APPLY_BOOK_THEME_ID,
    bookThemeId
  };
}

export function clearApplyThemeId() {
  return setApplyBookThemeId('');
}
