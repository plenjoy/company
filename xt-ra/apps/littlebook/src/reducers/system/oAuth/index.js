import { combineReducers } from 'redux';
import token from './tokenReducer';
import user from './userReducer';
import albums from './albumsReducer';
import selectPhotos from './selectPhotosReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  user,
  token,
  albums,
  selectPhotos
});
