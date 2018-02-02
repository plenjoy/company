import { combineReducers } from 'redux';
import price from './priceReducer';
import coupon from './couponReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  price,
  coupon
});
