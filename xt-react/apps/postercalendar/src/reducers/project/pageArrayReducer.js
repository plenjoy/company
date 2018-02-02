import Immutable from 'immutable';

import { pageTypes } from '../../constants/strings';
import * as types from '../../constants/actionTypes';

import elements from './elementArrayReducer';

const pageArrayReducer = (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.SET_PAGE_ARRAY: {
      const { pageArray } = action;
      if (Immutable.List.isList(pageArray)) {
        return pageArray;
      }

      return state;
    }
    case types.CREATE_ELEMENTS:
    case types.DELETE_ELEMENTS: {
      const { pageId } = action;

      const thePageIndex = state.findIndex(o => o.get('id') === pageId);
      if (thePageIndex !== -1) {
        const oldElements = state.getIn([String(thePageIndex), 'elements']);

        return state.setIn(
          [String(thePageIndex), 'elements'],
          elements(oldElements, action)
        );
      }

      return state;
    }
    case types.UPDATE_ELEMENTS: {
      const { updateObjectArray } = action;

      let newState = state;
      updateObjectArray.forEach((updateObject) => {
        const pageId = updateObject.get('pageId');
        const updateElements = updateObject.get('elements');

        const thePageIndex = state.findIndex(o => o.get('id') === pageId);
        if (thePageIndex !== -1) {
          const oldElements = newState.getIn([String(thePageIndex), 'elements']);

          newState = newState.setIn(
            [String(thePageIndex), 'elements'],
            elements(oldElements, action, updateElements)
          );
        }
      });

      return newState;
    }
    case types.CREATE_DUAL_PAGE:
    case types.CREATE_MULTIPLE_DUAL_PAGE: {
      const { insertIndex, insertPageArray } = action;

      const leftPageArray = state.slice(0, insertIndex);
      const rightPageArray = state.slice(insertIndex);

      return leftPageArray.concat(insertPageArray).concat(rightPageArray);
    }
    case types.DELETE_DUAL_PAGE: {
      const { leftPageId, rightPageId } = action;

      return state.filter((page) => {
        const pageId = page.get('id');
        return pageId !== leftPageId && pageId !== rightPageId;
      });
    }

    case types.CHANGE_PAGE_BGCOLOR: {
      const { pageId, bgColor } = action;

      const thePageIndex = state.findIndex(o => o.get('id') === pageId);
      if (thePageIndex !== -1) {
        return state.setIn([String(thePageIndex), 'bgColor'], bgColor);
      }

      return state;
    }
    case types.APPLY_TEMPLATE_TO_PAGES: {
      const { templateDataArray } = action;
      let newState = state;

      templateDataArray.forEach((templateData) => {
        const pageId = templateData.get('pageId');
        const templateId = templateData.get('templateId');
        const templateElements = templateData.get('elements');


        const thePageIndex = newState.findIndex(o => o.get('id') === pageId);

        if (thePageIndex !== -1) {
          const thePage = newState.get(thePageIndex);
          newState = newState.set(
            String(thePageIndex),
            thePage.merge({
              template: {
                tplGuid: templateId,
              },
              elements: templateElements
            })
          );
        }
      });

      return newState;
    }
    case types.UPDATE_PAGE_TEMPLATE_ID: {
      const { pageId, templateId } = action;

      const thePageIndex = state.findIndex(o => o.get('id') === pageId);
      if (thePageIndex !== -1) {
        return state.setIn([String(thePageIndex), 'template', 'tplGuid'], templateId);
      }

      return state;
    }
    case types.MOVE_PAGE_BEFORE: {
      const { pageId, beforePageId } = action;

      let pageIndex = -1;
      let beforePageIndex = -1;

      state.forEach((page, index) => {
        const pId = page.get('id');
        if (pId === pageId) {
          pageIndex = index;
        }

        if (pId === beforePageId) {
          beforePageIndex = index;
        }
      });

      const thePage = state.get(pageIndex);
      let newPageArray = state;

      if (pageIndex !== -1 && beforePageIndex !== -1) {
        if (thePage.get('type') === pageTypes.sheet) {
          const blankPageIndex = pageIndex + 1;
          const blankPage = state.get(pageIndex + 1);

          newPageArray = newPageArray.filter((page, index) => {
            return index !== pageIndex && index !== blankPageIndex;
          });

          newPageArray = newPageArray.slice(0, beforePageIndex)
            .concat(Immutable.List([thePage, blankPage]))
            .concat(newPageArray.slice(beforePageIndex));
        } else {
          newPageArray = newPageArray.delete(pageIndex);

          newPageArray = newPageArray.slice(0, 1)
            .concat(newPageArray.slice(1, beforePageIndex))
            .concat(Immutable.List([thePage]))
            .concat(newPageArray.slice(beforePageIndex));
        }

        return newPageArray;
      }

      return state;
    }
    case types.DELETE_ALL: {
      let newState = state;

      newState.forEach((page, index) => {
        const oldElements = page.get('elements');

        newState = newState.set(
          String(index),
          page.merge({
            elements: elements(oldElements, action),
            template: {
              tplGuid: ''
            }
          })
        );
      });

      return newState;
    }
    default:
      return state;
  }
};

export default pageArrayReducer;
