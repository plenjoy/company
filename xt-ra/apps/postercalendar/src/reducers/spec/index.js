import { combineReducers } from 'redux';
import version from './versionReducer';
import data from './specReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  version,
  data
});
