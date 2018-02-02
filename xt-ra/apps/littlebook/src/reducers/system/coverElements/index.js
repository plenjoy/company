import Immutable from 'immutable';
import { SAVE_COVER_ELEMENTS } from '../../../contants/actionTypes';


const coverElements = (state = Immutable.List([]), action) => {
  switch (action.type) {
    case SAVE_COVER_ELEMENTS: {
      const { elements } = action;
      return state.merge(Immutable.fromJS(elements));
    }
    default:
      return state;
  }
};

export default coverElements;
