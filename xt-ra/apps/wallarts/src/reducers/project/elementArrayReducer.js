import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';


export default (state = Immutable.List(), action, updateElements = Immutable.List()) => {
  switch (action.type) {
    case types.CREATE_ELEMENT: {
      return state.push(action.element);
    }
    case types.CREATE_ELEMENTS: {
      return state.concat(action.elements);
    }
    case types.UPDATE_ELEMENT:
    case types.UPDATE_ELEMENTS: {
      let newState = state;

      updateElements.forEach((element) => {
        const theElementIndex = newState.findIndex((o) => {
          return o.get('id') === element.get('id');
        });

        if (theElementIndex !== -1) {
          const theElement = newState.get(theElementIndex);
          newState = newState.set(
            String(theElementIndex),
            theElement.merge(element)
          );
        }
      });

      return newState;
    }
    case types.DELETE_ELEMENTS: {
      const { elementIds } = action;
      return state.filter((element) => {
        return elementIds.indexOf(element.get('id')) === -1;
      });
    }
    case types.DELETE_ALL: {
      const { willDeleteElementIds } = action;
      return state.filter((element) => {
        return willDeleteElementIds.indexOf(element.get('id')) === -1;
      });
    }
    default:
      return state;
  }
};
