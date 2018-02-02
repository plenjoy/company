import qs from 'qs';
import { get } from 'lodash';
import * as apiUrl from '../../contants/apiUrl';
import { CALL_API } from '../../middlewares/api';
import { getRandomNum } from '../../../../common/utils/math';
import { SHOW_SAVE_TEMPLATE_MODAL, HIDE_SAVE_TEMPLATE_MODAL } from '../../contants/actionTypes';

export function showSaveTemplateModal(paginationSpread, pagination) {
  return {
    type: SHOW_SAVE_TEMPLATE_MODAL,
    paginationSpread,
    pagination
  };
}

export function hideSaveTemplateModal() {
  return {
    type: HIDE_SAVE_TEMPLATE_MODAL
  };
}

export function checkTemplateName(userId, name, size, sheetType) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;
    const autoRandomNum = getRandomNum();

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.CHECK_TEMPLATE_NAME,
          params: {
            baseUrl,
            userId,
            name,
            size,
            sheetType,
            autoRandomNum
          }
        }
      }
    });
  };
}

export function saveTemplate(paramsObj) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.SAVE_TEMPLATE,
          params: {
            baseUrl,
            ...paramsObj
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: qs.stringify(paramsObj)
        }
      }
    });
  };
}
