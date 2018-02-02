import { Map } from 'immutable';
import {
  UPDATE_COVER_MATERIAL,
  UPDATE_INNER_MATERIAL,
  SET_ORIGINAL_MATERIALS,
  DOWNLOAD_MATERIALS_STATUS
} from '../../../contants/actionTypes';

const imgObj = {
  img: null,
  base64: null,
  size: { width: 0, height: 0 },
  paddings: { top: 0, right: 0, bottom: 0, left: 0 }
};
const initialState = Map({
  cover: JSON.parse(JSON.stringify(imgObj)),
  inner: JSON.parse(JSON.stringify(imgObj)),
  originalMaterials: null,
  isDownloadCompleted: false
});

const material = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COVER_MATERIAL: {
      return state.merge({
        cover: action.data
      });
    }
    case UPDATE_INNER_MATERIAL: {
      return state.merge({
        inner: action.data
      });
    }
    case SET_ORIGINAL_MATERIALS: {
      return state.merge({
        originalMaterials: action.data
      });
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
