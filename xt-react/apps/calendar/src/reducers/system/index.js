import {
	combineReducers
} from 'redux';
import env from './env';
import global from './global';
import modals from './modals';
import notifications from './notifications';
import sidebar from './sidebar';
import images from './images';
import price from './price';
import fontList from './fontList';
import template from './template';
import capabilities from './capabilities';
import styles from './style';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  env,
  global,
  modals,
  notifications,
  sidebar,
  images,
  price,
  fontList,
  template,
  capabilities,
	styles
});
