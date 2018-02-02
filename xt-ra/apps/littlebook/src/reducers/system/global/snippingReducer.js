import { Map } from 'immutable';
import { UPDATE_SNIPPING_THUMBNAIL } from '../../../contants/actionTypes';

const initialState = Map({
  thumbnail: null,
  cover: null
});

const snippingThumbnail = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SNIPPING_THUMBNAIL: {
      if(action.data){
        switch(action.data.type){
          case 'thumbnail':{
            return state.merge({
              thumbnail: action.data.base64
            });
          }
          case 'cover':{
            return state.merge({
              cover: action.data.base64
            });
          }
          default:
            return state;
        }
      }
      return state;
    }
    default:
      return state;
  }
};

export default snippingThumbnail;
