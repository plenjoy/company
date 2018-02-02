import { Map } from 'immutable';
import {
  SHOW_IMAGE_EDIT_MODAL,
  HIDE_IMAGE_EDIT_MODAL
} from '../../../contants/actionTypes';

const initialState = Map({
  isShown: false,
  imageEditApiTemplate: '',
  imageName: '',
  encImgId: '',
  imageWidth: 0,
  imageHeight: 0,
  elementWidth: 0,
  elementHeight: 0,
  crop: {},
  onDoneClick: () => {
  },
  onCancelClick: () => {
  }
});

const imageEditModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_IMAGE_EDIT_MODAL: {
      return state.merge(action.data, { isShown: true });
    }
    case HIDE_IMAGE_EDIT_MODAL: {
      return state.merge({ isShown: false });
    }
    default:
      return state;
  }
};

export default imageEditModal;
