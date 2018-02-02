import { merge } from 'lodash';
import Immutable from 'immutable';
import { GET_SHARE_URLS } from '../../../contants/apiUrl';
import {
  SHOW_SHARE_PROJECT_MODAL,
  HIDE_SHARE_PROJECT_MODAL,
  API_SUCCESS
} from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  znoUrl: '',
  anonymousUrl: '',
  isShown: false
});

const shareProjectModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SHARE_PROJECT_MODAL:
      return state.merge({ isShown: true });
    case HIDE_SHARE_PROJECT_MODAL:
      return state.merge({ isShown: false });
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_SHARE_URLS:
          const { response } = action;
          return state.merge(response.data);
        default:
          return state;
      }
    default:
      return state;
  }
};

export default shareProjectModal;
