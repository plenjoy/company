import { combineReducers } from 'redux';
import env from './env';
import global from './global';
import images from './images';
import modals from './modals';
import sidebar from './sidebar';
import price from './price';
import fontList from './fontList';
import stickerList from './stickerList';
import notifications from './notifications';
import capabilities from './capabilities';
import template from './template';
import coverElements from './coverElements';
import oAuth from './oAuth';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  env,
  global,
  modals,
  images,
  sidebar,
  price,
  fontList,
  stickerList,
  notifications,
  capabilities,
  template,
  coverElements,
  oAuth
});
