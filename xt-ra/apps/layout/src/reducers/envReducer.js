import { combineReducers } from 'redux';
import { urls } from './baseUrlReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  urls
});
