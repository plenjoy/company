import { get, isArray, merge } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import { GET_TEMPLATE_LIST, APPLY_LAYOUT } from '../../constants/apiUrl';
import { showConfirm } from './confirmModalActions.js';
import { addTracker } from './global/trackerActions.js';
import {
  CLEAR_TEMPLATE_LIST,
  ADD_TEMPLATE,
  IS_IN_APPLY_TEMPLATE,
  SET_TEMPLATE_LIST
} from '../../constants/actionTypes';

import { productTypes } from '../../constants/strings';
import { convertObjIn } from '../../../../common/utils/typeConverter';

export function getTemplateList(customerId, size, productType) {
  return (dispatch, getState) => {
    const state = getState();
    let designSize = size;
    const product = get(state, 'project.data.setting').get('product');
    if (product !== productTypes.LC) {
      designSize = `${size.split('X')[1]}X${size.split('X')[0]}`;
    }
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_TEMPLATE_LIST,
          params: {
            baseUrl,
            designSize,
            customerId,
            autoRandomNum: new Date().getTime(),
            productType
          }
        }
      }
    }).then(
      response => {
        return new Promise((resolve, reject) => {
          if (response.result.state === 'success') {
            const resultTemplateList = convertObjIn(
              response.result.list.template
            );
            const coverTemplateList = [];
            const innerTemplateList = [];
            let coverDefaultTemplateGuid = '';
            let innerDefaultTemplateGuid = '';
            const resTemplateList =
              resultTemplateList instanceof Array
                ? resultTemplateList
                : [resultTemplateList];

            if (resTemplateList instanceof Array) {
              resTemplateList.forEach(item => {
                const checkedGuid =
                  typeof item.guid === 'object'
                    ? item.guid.__text.replace(/\s/g, '')
                    : item.guid && item.guid.replace(/\s/g, '');
                if (item.usePosition == 0) {
                  if (item.isCoverDefault) {
                    coverDefaultTemplateGuid = checkedGuid;
                  }
                  coverTemplateList.push(
                    merge({}, item, { guid: checkedGuid })
                  );
                } else if (item.usePosition > 0) {
                  if (item.isCoverDefault) {
                    innerDefaultTemplateGuid = checkedGuid;
                  }
                  innerTemplateList.push(
                    merge({}, item, { guid: checkedGuid })
                  );
                }
              });
            }

            if (!coverDefaultTemplateGuid)
              coverDefaultTemplateGuid =
                coverTemplateList.length && get(coverTemplateList, '0.guid');
            if (!innerDefaultTemplateGuid)
              innerDefaultTemplateGuid =
                innerTemplateList.length && get(innerTemplateList, '0.guid');

            coverDefaultTemplateGuid =
              typeof coverDefaultTemplateGuid === 'object'
                ? coverDefaultTemplateGuid.__text.replace(/\s/g, '')
                : coverDefaultTemplateGuid &&
                  coverDefaultTemplateGuid.replace(/\s/g, '');
            innerDefaultTemplateGuid =
              typeof innerDefaultTemplateGuid === 'object'
                ? innerDefaultTemplateGuid.__text.replace(/\s/g, '')
                : innerDefaultTemplateGuid &&
                  innerDefaultTemplateGuid.replace(/\s/g, '');

            dispatch({
              type: SET_TEMPLATE_LIST,
              ListInfo: {
                coverTemplateList,
                innerTemplateList,
                coverDefaultTemplateGuid,
                innerDefaultTemplateGuid
              }
            });

            const project = get(getState(), 'project.data');
            const isNewProject = get(project, 'property').get('isNewProject');

            if (
              isNewProject &&
              coverDefaultTemplateGuid &&
              innerDefaultTemplateGuid
            ) {
              const productSize = get(project, 'setting').get('size');
              getTemplateInfo(coverDefaultTemplateGuid, productSize);
              getTemplateInfo(innerDefaultTemplateGuid, productSize);
            }
            resolve(response);
          } else {
            console.log('模板列表获取失败');
            dispatch(
              showConfirm({
                confirmMessage: 'Failed to get the layout, please try again.',
                onOkClick: () => {
                  dispatch(getTemplateList(customerId, size, productType));
                },
                xCloseFun: () => {},
                onCancelClick: () => {},
                okButtonText: 'OK',
                cancelButtonText: 'Cancel'
              })
            );
            reject(err);
          }
        });
      },
      err => {
        return new Promise((resolve, reject) => {
          reject(err);
          dispatch(
            showConfirm({
              confirmMessage: 'Failed to get the layout, please try again.',
              onOkClick: () => {
                dispatch(getTemplateList(customerId, size, productType));
              },
              xCloseFun: () => {},
              onCancelClick: () => {},
              okButtonText: 'OK',
              cancelButtonText: 'Cancel'
            })
          );
        });
      }
    );
  };
}

export function getTemplateInfo(templateId, size) {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');
    const productType = get(getState(), 'project.data.setting').get('product');
    let designSize = size;
    if (productType !== productTypes.LC) {
      designSize = `${size.split('X')[1]}X${size.split('X')[0]}`;
    }

    const templateIds = isArray(templateId) ? templateId : [templateId];

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: APPLY_LAYOUT,
          params: {
            baseUrl,
            templateIds,
            size: designSize
          }
        },
        options: {
          method: 'POST',
          body: JSON.stringify({
            templates: templateIds,
            size: designSize
          })
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

const mapConver = cover => {
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

export function changeApplyTemplateStatus(value = false) {
  return {
    type: IS_IN_APPLY_TEMPLATE,
    value
  };
}
