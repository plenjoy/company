import { combineReducers } from 'redux';
import env from './env';
import global from './global';
import modals from './modals';
import oAuth from './oAuth';
import sidebar from './sidebar';
import notifications from './notifications';
import photoArray from './photoArray';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  env,
  global,
  modals,
  oAuth,
  notifications,
  sidebar,
  photoArray
});
