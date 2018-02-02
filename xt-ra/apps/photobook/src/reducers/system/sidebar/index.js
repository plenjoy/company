import { combineReducers } from 'redux';
import tabIndex from './tabIndexReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  tabIndex
});
