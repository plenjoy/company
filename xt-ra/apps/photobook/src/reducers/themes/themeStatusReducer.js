import * as types from '../../contants/actionTypes';
import { GET_BOOKTHEME_STATUS } from '../../contants/apiUrl';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_BOOKTHEME_STATUS: {
          const { response } = action;
          const { data } = response;
          const { showTheme } = data;
          return showTheme;
        }
        default: {
          return state;
        }
      }
    }
    default: {
      return state;
    }
  }
};
