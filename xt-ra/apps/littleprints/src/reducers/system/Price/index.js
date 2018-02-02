import { combineReducers } from 'redux';
import price from './priceReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  price
});
