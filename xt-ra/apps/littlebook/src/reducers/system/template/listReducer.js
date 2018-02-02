import { get } from 'lodash';
import {
  API_SUCCESS,
  ADD_TEMPLATE,
  CLEAR_TEMPLATE_LIST
} from '../../../contants/actionTypes';
import { List, fromJS } from 'immutable';
import { GET_TEMPLATE_LIST, DELETE_TEMPLATE, GET_INNER_TEMPLATE_LIST } from '../../../contants/apiUrl';
import { layoutSheetType } from '../../../contants/strings';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

const defaultState = {
  LBPAC: {
    cover: {},
    inner: {}
  },
  LBHC: {
    cover: {},
    inner: {}
  },
};

const groupTemplates = (groupName, templateIds, templates) => {
  const groups = [];

  if (templateIds && templates) {
    templateIds.forEach((id) => {
      const template = templates.find(t => t.uidpk === id && t.layout.trim() === groupName);

      if (template) {
        groups.push(template);
      }
    });
  }

  return groups;
};

const templateList = (state = fromJS(defaultState), action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_TEMPLATE_LIST:
        case GET_INNER_TEMPLATE_LIST: {
          const { response } = action;
          const errorCode = get(response.result, 'errorCode');
          if (errorCode) {
            return state;
          }

          let newState = state;

          // 处理空模板等情况.
          const allTemplates = get(response, 'result.list.template') || [];
          let resTemplateList = convertObjIn(allTemplates);
          resTemplateList = resTemplateList.length ? resTemplateList : [resTemplateList];

          // groups
          const groups = get(response, 'result.groups.group') || [];
          let resGroups = convertObjIn(groups);
          resGroups = resGroups.length ? resGroups : [resGroups];

          const isCover = get(action, 'apiPattern.params.isCover');

          if (isCover) {
            // 封面模板.
            switch (get(action, 'apiPattern.params.cover')) {
              case 'PA': {
                // const coverTemplates = resTemplateList.filter(t => t.sheetType.toUpperCase() === layoutSheetType.PA);
                const coverTemplates = {};
                resGroups.forEach((g) => {
                  const newTemplates = groupTemplates(g.name.trim(), g.templateUID, resTemplateList);

                  if (newTemplates && g.name) {
                    coverTemplates[g.name.trim()] = newTemplates;
                  }
                });

                newState = newState.setIn(['LBPAC', 'cover'], fromJS(coverTemplates));

                break;
              }
              case 'HC': {
                // const coverTemplates = resTemplateList.filter(t => t.sheetType.toUpperCase() === layoutSheetType.HC);
                const coverTemplates = {};
                resGroups.forEach((g) => {
                  const newTemplates = groupTemplates(g.name.trim(), g.templateUID, resTemplateList);

                  if (newTemplates && g.name) {
                    coverTemplates[g.name.trim()] = newTemplates;
                  }
                });

                newState = newState.setIn(['LBHC', 'cover'], fromJS(coverTemplates));
                break;
              }
              default: {
                break;
              }
            }
          } else {
            // 内页模板.
            // const innerTemplates = resTemplateList.filter(t => t.sheetType.toUpperCase() === layoutSheetType.INNER);
            const innerTemplates = {};
            resGroups.forEach((g) => {
              const newTemplates = groupTemplates(g.name.trim(), g.templateUID, resTemplateList);

              if (newTemplates && g.name) {
                innerTemplates[g.name.trim()] = newTemplates;
              }
            });

            newState = newState.setIn(['LBPAC', 'inner'], fromJS(innerTemplates));
            newState = newState.setIn(['LBHC', 'inner'], fromJS(innerTemplates));
          }

          return newState;
        }
        case DELETE_TEMPLATE: {
          const { apiPattern, response } = action;
          if (response.result.state === 'success') {
            const index = state.findIndex(
              t => t.get('uidpk') === apiPattern.params.templateId
            );
            if (index !== -1) {
              return state.splice(index, 1);
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
      return state.merge(params);
    }
    case CLEAR_TEMPLATE_LIST: {
      return List([]);
    }
    default:
      return state;
  }
};

export default templateList;
