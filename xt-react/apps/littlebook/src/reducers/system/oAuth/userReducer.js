import { fromJS } from 'immutable';
import * as types from '../../../contants/actionTypes';

const initialState = fromJS({
  name: '',
  avatar: ''
});

const user = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_OAUTH_USER: {
      return state.merge(fromJS(action.user));
    }
    default:
      return state;
  }
};

export default user;
