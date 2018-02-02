import { fromJS } from 'immutable';
import * as types from '../../../contants/actionTypes';

const initialState = fromJS([]);

const albums = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_FACEBOOK_ALBUMS: {
      return fromJS(action.albums);
    }
    default:
      return state;
  }
};

export default albums;
