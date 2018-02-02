import { get } from 'lodash';

import * as types from '../../../contants/actionTypes';
import * as apiUrl from '../../../contants/apiUrl';


const albumId = (state = -1, action) => {
  switch (action.type) {
    case types.API_SUCCESS:
      switch (action.apiPattern.name) {
        case apiUrl.GET_USER_ALBUM_ID:
        case apiUrl.ADD_ALBUM:
          return +get(action.response, 'resultData.albumId') || -1;
        default:
          return state;
      }
    default:
      return state;
  }
};

export default albumId;
