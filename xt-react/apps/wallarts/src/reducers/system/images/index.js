import { combineReducers } from 'redux';
import { AUTO_ADD_PHOTO_TO_CANVAS } from '../../../constants/actionTypes';
import { merge } from 'lodash';
import uploading from './uploadingReducer';
import status from './statusReducer';

const autoAddPhotoToCanvas = (state = { status: false }, action) => {
  switch (action.type) {
    case AUTO_ADD_PHOTO_TO_CANVAS: {
      const { params } = action;
      return merge({}, state, params);
    }
    default:
      return state;
  }
};

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  uploading,
  status,
  autoAddPhotoToCanvas
});
