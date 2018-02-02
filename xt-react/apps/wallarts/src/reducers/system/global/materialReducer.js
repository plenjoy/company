import { fromJS } from 'immutable';
import {
  UPDATE_FRAME_MATERIAL,
  SET_ORIGINAL_MATERIALS,
  UPDATE_MATTE_MATERIAL,
  DOWNLOAD_MATERIALS_STATUS,
  UPDATE_PREVIEW_FRAME_MATERIAL
} from '../../../constants/actionTypes';

const initialState = fromJS({
  backgrounds: {},
  previewBackgrounds: {},
  mattes: {},
  originalMaterials: null,
  isDownloadCompleted: false
});

const material = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FRAME_MATERIAL: {
      return state.setIn(['backgrounds', String(action.data.sheetIndex)], action.data.img);
    }
    case UPDATE_PREVIEW_FRAME_MATERIAL: {
      return state.setIn(['previewBackgrounds', String(action.data.sheetIndex)], action.data.img);
    }
    case UPDATE_MATTE_MATERIAL: {
      return state.setIn(['mattes', String(action.data.sheetIndex)], action.data.img);
    }
    case SET_ORIGINAL_MATERIALS: {
      return state;
      /*return state.merge({
        originalMaterials: action.data
      });*/
    }
    case DOWNLOAD_MATERIALS_STATUS: {
      return state.merge({
        isDownloadCompleted: action.isCompeleted
      });
    }
    default:
      return state;
  }
};

export default material;
