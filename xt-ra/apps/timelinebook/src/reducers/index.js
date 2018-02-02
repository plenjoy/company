import { combineReducers } from 'redux';
import projects from './project';
import spec from './spec';
import system from './system';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  spec,
  projects,
  system
});
