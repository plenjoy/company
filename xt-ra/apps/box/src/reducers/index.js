import { combineReducers } from 'redux';
import project from './projectReducer';
import spec from './specReducer';
import system from './systemReducer';


// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  spec,
  project,
  system
});
