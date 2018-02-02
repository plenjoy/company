import { Map } from 'immutable';
import { UPDATE_SNIPPING_IMAGES } from '../../../constants/actionTypes';

const initialState = Map({
  canvasTopMirrorImage: null,
  canvasRightMirrorImage: null,
  previewCanvasTopMirrorImage: null,
  previewCanvasRightMirrorImage: null
});

const snippingImages = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SNIPPING_IMAGES: {
      if (action.data) {
        // switch (action.data.type) {
          return state.merge(action.data);
          // case 'canvasTopMirrorImage': {
          //   return state.merge({
          //     canvasTopMirrorImage: action.data.base64
          //   });
          // }
          // case 'canvasRightMirrorImage': {
          //   return state.merge({
          //     canvasRightMirrorImage: action.data.base64
          //   });
          // }
          // case 'previewCanvasTopMirrorImage': {
          //   return state.merge({
          //     previewCanvasTopMirrorImage: action.data.base64
          //   });
          // }
          // case 'previewCanvasRightMirrorImage': {
          //   return state.merge({
          //     previewCanvasRightMirrorImage: action.data.base64
          //   });
          // }
          // default:
          //   return state;
        // }
      }
      return state;
    }
    default:
      return state;
  }
};

export default snippingImages;
