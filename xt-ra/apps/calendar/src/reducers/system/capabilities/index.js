import Immutable from 'immutable';
import { SET_CAPABILITIES } from '../../../constants/actionTypes';


const capabilities = (state = Immutable.Map({}), action) => {
  switch (action.type) {
    case SET_CAPABILITIES: {
      return state.merge(action.capabilities);
    }
    default:
      return state;
  }
};

export default capabilities;
