import { combineReducers } from 'redux';
import material from './materialReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  material
});
