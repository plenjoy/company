import { combineReducers } from 'redux';

import list from './listReducer';
import details from './detailReducer';
import isInApplyingTemplate from './isInApplyingTemplateReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  list,
  details,
  isInApplyingTemplate
});
