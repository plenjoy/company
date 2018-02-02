import { List } from 'immutable';
import { findIndex } from 'lodash';
import * as types from '../../contants/actionTypes';
import { convertObjIn } from '../../../../common/utils/typeConverter';

const initialState = List([]);

const imageArray = (state = initialState, action) => {
  switch (action.type) {
    case types.UPLOAD_COMPLETE: {
      const { fields } = action;
      const { imageId, guid, width, height, encImgId, name, createTime } = fields;
      if (guid && width && height) {
        const imageObj = {
          id: imageId,
          guid,
          encImgId
          name,
          height,
          width,
          createTime,
          order: imageArray.length,
          shotTime: ''
        };
        return state.push(convertObjIn(imageObj));
      } else {
        return state;
      }
    }
    case types.DELETE_PROJECT_IMAGE: {
      const { imageId } = action;
      const currentImageIndex = state.findIndex((item) => {
        return item.id === imageId;
      });
      return state.splice(currentImageIndex, 1);
    }
    default:
      return state;
  }
};

export default imageArray;
