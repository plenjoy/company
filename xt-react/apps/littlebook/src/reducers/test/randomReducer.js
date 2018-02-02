import {List} from 'immutable';
import { DID_RANDOM } from '../../contants/actionTypes';

const initialState = List([]);
const randoms = (state = initialState, action) => {
  switch (action.type) {
    case DID_RANDOM: {
      return state.push({
        value: action.value
      });
    }
    default:
      return state;
  }
};

export default randoms;
