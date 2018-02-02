import { fromJS } from 'immutable';
import * as types from '../../../constants/actionTypes';

const initialState = fromJS({
  accessToken: '',
  expiresIn: 0,
  signedRequest: '',
  userID: '',
  type: ''
});

const token = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_OAUTH_TOKEN: {
      return state.merge(fromJS(action.token));
    }
    default:
      return state;
  }
};

export default token;
