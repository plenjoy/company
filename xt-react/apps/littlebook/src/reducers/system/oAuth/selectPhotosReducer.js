import { fromJS } from 'immutable';
import * as types from '../../../contants/actionTypes';
import OAuth from '../../../../../common/utils/OAuth';

const initialState = fromJS([]);

const selectPhotos = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SELECT_PHOTOS: {
      let newState = state;
      action.selectPhotos.forEach((photo) => {
        const isFind = newState.find(item => item.get('id') == photo.id);
        if (!isFind) {
          //标准来自第三方
          photo.isFromAuth = true;
          photo.platform = OAuth.authType;
          photo.name =  OAuth.authType;
          newState = newState.push(fromJS(photo));
        }
      });
      return newState;
    }
    case types.DELETE_SELECT_PHOTOS: {
      let newState = state;
      action.selectPhotos.forEach((photo) => {
        newState = newState.filter(item => item.get('id') !== photo.id);
      });
      return newState;
    }
    case types.MOVE_ALL_PHOTOS_TO_Add_IMAGES: {
      return initialState;
    }
    case types.REMOVE_ALL_IMAGES:{
      return initialState;
    }
    default:
      return state;
  }
};

export default selectPhotos;
