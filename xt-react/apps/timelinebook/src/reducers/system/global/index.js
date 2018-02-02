import { combineReducers } from 'redux';
import material from './materialReducer';
import ratio from './ratioReducer';
import viewProperties from './viewPropertiesReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  material,
  ratio,
  viewProperties
});
