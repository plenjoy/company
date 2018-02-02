import { combineReducers } from 'redux';
import ratio from './ratioReducer';
import material from './materialReducer';
import pagination from './paginationReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  ratio,
  material,
  pagination
});
