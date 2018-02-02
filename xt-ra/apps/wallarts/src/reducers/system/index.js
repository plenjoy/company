import { combineReducers } from 'redux';
import env from './env';
import global from './global';
import modals from './modals';
import fontList from './fontList';
import notifications from './notifications';
import capabilities from './capabilities';
import images from './images';
import price from './price';
// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  env,
  global,
  modals,
  fontList,
  notifications,
  capabilities,
  images,
  price
});
