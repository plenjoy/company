import { combineReducers } from 'redux';

import env from './envReducer';
import fontList from './fontListReducer';
import tagList from './tagListReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  env,
  fontList,
  tagList
});
