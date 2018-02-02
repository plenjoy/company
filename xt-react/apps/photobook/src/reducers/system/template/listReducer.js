import { merge, get, set } from 'lodash';

import { API_SUCCESS, ADD_TEMPLATE, CLEAR_TEMPLATE_LIST } from '../../../contants/actionTypes';
import { productTypes } from '../../../contants/strings';
import { GET_TEMPLATE_LIST, DELETE_TEMPLATE, GET_INNER_TEMPLATE_LIST } from '../../../contants/apiUrl';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

const defaultState = {cover: [], inner: []};
const templateList = (state = defaultState, action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_TEMPLATE_LIST:
        case GET_INNER_TEMPLATE_LIST: {
          const { response } = action;
          const isCover = action.apiPattern.isCover;

          const resTemplateList = convertObjIn(get(response, 'result.list.template'));
          let fliteredList = [];

          if (resTemplateList instanceof Array) {
            fliteredList = resTemplateList.filter(item => !item.pressBookSheet);
          }

          if (isCover) {
            return merge({}, defaultState, {
              cover: fliteredList
            });
          } else {
            return merge({}, {
              inner: [],
              cover: merge([], state.cover)
            }, {
              inner: fliteredList
            });
          }
        }

        case DELETE_TEMPLATE: {
          const { apiPattern, response } = action;
          if (response.result.state === 'success') {
            const copyState = merge({}, state);
            let modifyKey = 'cover';
            let index = state.cover.findIndex(t => t.uidpk === apiPattern.params.templateId);
            if (index === -1) {
              modifyKey = 'inner';
              index = state.inner.findIndex(t => t.uidpk === apiPattern.params.templateId);
            }
            if (index !== -1) {
              const newList = [...state[modifyKey].slice(0, index), ...state[modifyKey].slice(index + 1)];
              return set(copyState, modifyKey, newList);
            }
            return state;
          }
          return state;
        }
        default:
          return state;
      }
    }
    case ADD_TEMPLATE: {
      const { params } = action;
      const { template, isCover } = params;
      const copyState = merge({}, state);
      const modifyKey = isCover ? 'cover' : 'inner';
      const list = state[modifyKey];
      list.push(template);
      return set(copyState, modifyKey, list);
    }
    case CLEAR_TEMPLATE_LIST: {
      return [];
    }
    default:
      return state;
  }
};

export default templateList;
