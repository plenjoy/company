import { combineReducers } from 'redux';
import qs from './queryStringReducer';
import urls from './urlsReducer';
import userInfo from './userInfoReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  qs,
  urls,
  userInfo
});
