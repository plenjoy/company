import qs from 'qs';
import { get, isArray } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import { GET_TEMPLATE_LIST, GET_INNER_TEMPLATE_LIST, APPLY_LAYOUT, SAVE_TEMPLATE, DELETE_TEMPLATE } from '../../contants/apiUrl';
import { productTypes, productCodes, mapCoverForLayout, CcSheetTypeArray  } from '../../contants/strings';
import { ADD_TEMPLATE, IS_IN_APPLY_TEMPLATE, CLEAR_TEMPLATE_LIST } from '../../contants/actionTypes';

export function getTemplateList(customerId, size, cover, productType, isCover = true) {
  return (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');
    const productCode = productCodes[productType];
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: isCover ? GET_TEMPLATE_LIST : GET_INNER_TEMPLATE_LIST,
          params: {
            baseUrl,
            size,
            customerId,
            productCode,
            cover: mapConver(productCode, cover, size, isCover)
          },
          productType,
          isCover
        }
      }
    });
  };
}

export function getTemplateInfo(templateId, size) {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    const templateIds = isArray(templateId) ? templateId : [templateId];

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: APPLY_LAYOUT,
          params: {
            baseUrl,
            templateIds,
            size
          }
        },
        options: {
          method: 'POST',
          body: JSON.stringify({
            templates: templateIds,
            size
          })
        }
      }
    });
  };
}

export function deleteTemplate(templateId, userId) {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: DELETE_TEMPLATE,
          params: {
            baseUrl,
            templateId,
            userId
          }
        }
      }
    });
  };
}

export function clearTemplateList() {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_TEMPLATE_LIST
    });
    return Promise.resolve();
  };
}

export function addTemplate(template, isCover) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_TEMPLATE,
      params: {
        template,
        isCover
      }
    });
    return Promise.resolve(template);
  };
}


const mapConver = (productCode, cover, size, isCover) => {
  let resCover;
  for (const key in mapCoverForLayout) {
    if (mapCoverForLayout.hasOwnProperty(key)) {
      const item = mapCoverForLayout[key];
      if (item.indexOf(cover) >= 0) {
        resCover = key;
        break;
      }
    }
  }
  if (productCode === 'V2_PRESSBOOK') {
    return 'HC';
  } else {
    if (isCover) {
      if (CcSheetTypeArray.indexOf(resCover) >= 0) {
        return 'CC';
      } else if (['5X7', '7X5'].indexOf(size.toUpperCase()) >= 0) {
        return 'PA';
      } else {
        return 'HC';
      }
    } else {
      if (['5X7', '7X5'].indexOf(size.toUpperCase()) >= 0) {
           return 'PA';
       } else {
         return 'HC';
       }
    }
  }
};

// 保存自定义模版的 action
export function saveLayout(paramsObj) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: SAVE_TEMPLATE,
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

export function changeApplyTemplateStatus(value = false) {
  return {
    type: IS_IN_APPLY_TEMPLATE,
    value
  };
}
