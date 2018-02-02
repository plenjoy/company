import { combineReducers } from 'redux';
import tabIndex from './tabIndexReducer';
import managePhotoTabIndex from './managePhotoFilterPhotoTabReducer.js';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  tabIndex,
  managePhotoTabIndex
});
