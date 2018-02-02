import qs from 'qs';
import { get, isArray, set } from 'lodash';
import x2jsInstance from '../../../../../common/utils/xml2js';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

import { CALL_API } from '../../../middlewares/api';
import {
  GET_TEMPLATE_LIST,
  GET_INNER_TEMPLATE_LIST,
  GET_TEMPLATE_DATA,
  SAVE_TEMPLATE,
  DELETE_TEMPLATE,
  GET_RELATION_TEMPLATE
} from '../../../contants/apiUrl';
import { productTypes } from '../../../contants/strings';
import {
  ADD_TEMPLATE,
  IS_IN_APPLY_TEMPLATE,
  CLEAR_TEMPLATE_LIST
} from '../../../contants/actionTypes';

import {
  convertResultToJson,
  formatTemplateInstance
} from '../../../utils/template';

export function getTemplateList(size, cover, isCover = true, originalSize = '') {
  const newSize = size;

  // 目前8x8的内页, 需要使用6x6的模板.
  const newOriginalSize = originalSize || size;

  return (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: isCover ? GET_TEMPLATE_LIST : GET_INNER_TEMPLATE_LIST,
          params: {
            size: newSize,
            baseUrl,
            cover,
            isCover,
            originalSize
          }
        }
      }
    });
  };
}

export function getTemplateData(templateIds, size) {
  const newSize = size;

  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_TEMPLATE_DATA,
          params: {
            baseUrl,
            templateIds,
            size: newSize
          }
        },
        options: {
          method: 'POST',
          body: JSON.stringify({
            templates: templateIds,
            size: newSize
          })
        }
      }
    }).then((response) => {
      const results = convertResultToJson(response);

      // 格式化template的原始数据, 使它可以在app中可以使用的格式
      const newTemplates = formatTemplateInstance(
        results,
        templateIds,
        newSize
      );

      return Promise.resolve(newTemplates);
    });
  };
}

export function getTemplateInfo(templateId, size) {
  const newSize = size;

  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    const templateIds = isArray(templateId) ? templateId : [templateId];

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_TEMPLATE_DATA,
          params: {
            baseUrl,
            templateIds,
            size: newSize
          }
        },
        options: {
          method: 'POST',
          body: JSON.stringify({
            templates: templateIds,
            size: newSize
          })
        }
      }
    });
  };
}

/**
 * 根据当前的模板id, 获取指定产品大小和封面下关联的template.
 * @param  {string} currentTemplateId 当前的模板id
 * @param  {string} targetProductSize
 * @param  {string} targetCoverType
 */
export function getRelationTemplate(currentTemplateId, targetProductSize, targetCoverType) {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_RELATION_TEMPLATE,
          params: {
            baseUrl,
            templateGUID: currentTemplateId,
            size: targetProductSize,
            coverType: targetCoverType,
            autoRandomNum: Date.now()
          }
        }
      }
    }).then((result) => {
      let viewData = get(result, 'data.viewData');

      if (viewData) {
        viewData = x2jsInstance.xml2js(viewData);

        const templateElement = convertObjIn(get(viewData, 'templateView.spread.elements.element'));
        set(result, 'data.viewData', viewData);
        set(result, 'data.templateElement', templateElement);
      }

      return result;
    }, (err) => {
      return Promise.reject(err);
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

export function addTemplate(template) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_TEMPLATE,
      params: template
    });
    return Promise.resolve(template);
  };
}

const mapConver = (cover) => {
  let resCover;
  for (const key in coverMap) {
    if (coverMap.hasOwnProperty(key)) {
      const item = coverMap[key];
      if (item.indexOf(cover) >= 0) {
        resCover = key;
        break;
      }
    }
  }
  return resCover || 'NONE';
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
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
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
