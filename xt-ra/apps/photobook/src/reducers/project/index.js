import { combineReducers } from 'redux';
import data from './projectReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  data
});
