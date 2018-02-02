import { fromJS } from 'immutable';
import * as types from '../../../constants/actionTypes';

const initialState = fromJS([]);

const photoArray = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_PHOTOS: {
      let newState = state;

      action.photos.forEach((photo) => {
        photo.isIncluded = true;
        newState = newState.push(fromJS(photo));
      });

      return fromJS(newState);
    }
    case types.CLEAR_PHOTOS: {
      return initialState;
    }
    case types.SORT_PHOTOS: {
      let photoArray = state;

      // 由于返回的图片全是从新到旧，所以先从旧到新排序 => 排除同一时刻上传图片顺序错位
      photoArray = photoArray.reverse();
      photoArray = photoArray.sort((prePhoto, nextPhoto) => {
        return prePhoto.get('created_time') - nextPhoto.get('created_time');
      });

      return photoArray;
    }
    case types.INCLUDE_PHOTOS: {
      let photoArray = state;
      let includeIds = action.ids;

      for(const id of includeIds) {
        const photoIdx = photoArray.findIndex(photo => photo.get('id') === id);

        photoArray = photoArray.setIn([String(photoIdx), 'isIncluded'], true);
      }
      return photoArray;
    }
    case types.EXCLUDE_PHOTOS: {
      let photoArray = state;
      let excludeIds = action.ids;

      for(const id of excludeIds) {
        const photoIdx = photoArray.findIndex(photo => photo.get('id') === id);

        if(photoIdx !== -1) {
          photoArray = photoArray.setIn([String(photoIdx), 'isIncluded'], false);
        }
      }
      return photoArray;
    }
    case types.SET_IS_CAPTION_OUT_OF_SIZE: {
      let photoArray = state;

      return photoArray.map(photo => {
        const photoId = photo.get('id');
        const isCaptionOutOfSize = action.captionMap[photoId].isCaptionOutOfSize;
        const newCaption = action.captionMap[photoId].newCaption;

        photo = photo.set('isCaptionOutOfSize', isCaptionOutOfSize);
        photo = photo.set('caption', newCaption);

        return photo;
      });
    }
    default:
      return state;
  }
};

export default photoArray;
