import { combineReducers } from 'redux';
import env from './env';
import global from './global';
import modals from './modals';
import notifications from './notifications';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  env,
  global,
  modals,
  notifications
});
