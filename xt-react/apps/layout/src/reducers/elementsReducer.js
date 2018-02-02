import { UPDATE_ELEMENT, UPDATE_ELEMENTS } from '../constants/actionTypes';

const initialState = [
  {
    id: 1,
    position: {
      x: 0,
      y: 0
    },
    width: 200,
    height: 200,
    rotateDegree: 0
  },
  {
    id: 2,
    position: {
      x: 0,
      y: 0
    },
    width: 300,
    height: 300,
    rotateDegree: 0
  }
];

const element = (state, action) => {
  switch (action.type) {
    case UPDATE_ELEMENT:
    case UPDATE_ELEMENTS: {
      const { elementIds, newAttribute } = action;
      if (elementIds.indexOf(state.id) === -1) {
        return state;
      }

      return {
        ...state,
        ...newAttribute
      };
    }
    default:
      return state;
  }
};


const elements = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ELEMENT:
    case UPDATE_ELEMENTS: {
      return state.map(e => element(e, action));
    }
    default:
      return state;
  }
};


export default elements;

