import Immutable from 'immutable';
import * as apiUrl from '../../contants/apiUrl';
import * as types from '../../contants/actionTypes';
import { get } from 'lodash';

export default (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.DELETE_SERVER_PHOTOS: {
          return state.clear();
        }
      }
      return state;
    }
    case types.DELETE_PROJECT_IMAGE: {
      const { encImgId } = action;
      if (encImgId) {
        const newState = state.push(encImgId);
        return newState;
      }
      return state;
    }
    default:
      return state;
  }
};
