import Immutable from 'immutable';
import undoable from '../../utils/undoable';
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
    case types.UPDATE_ELEMENTS: {
      const { updateObjectArray } = action;

      let newState = state;
      updateObjectArray.forEach((updateObject) => {
        const pageId = updateObject.get('pageId');
        const updateElements = updateObject.get('elements');

        const thePageIndex = state.findIndex(o => o.get('id') === pageId);
        if (thePageIndex !== -1) {
          const oldElements = newState.getIn([
            String(thePageIndex),
            'elements'
          ]);

          newState = newState.setIn(
            [String(thePageIndex), 'elements'],
            elements(oldElements, action, updateElements)
          );
        }
      });

      return newState;
    }
    case types.CHANGE_CANVAS_BORDER_COLOR: {
      const { color } = action;
      let newState = state;
      newState = newState.setIn(['0','canvasBorder', 'color'], color);
      return newState;
    }
    default:
      return state;
  }
};

const includeActionTypes = [
  types.CREATE_ELEMENT,
  types.CREATE_ELEMENTS
];

const undoablePageArray = undoable(pageArrayReducer, {
  filter: includeActionTypes,
  limit: 10
});

export default undoablePageArray;
