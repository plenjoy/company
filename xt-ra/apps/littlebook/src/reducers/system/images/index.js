import { combineReducers } from 'redux';
import { AUTO_ADD_PHOTO_TO_CANVAS } from '../../../contants/actionTypes';
import { merge } from 'lodash';
import uploading from './uploadingReducer';

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
  autoAddPhotoToCanvas
});
