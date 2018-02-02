import { combineReducers } from 'redux';
import cover from './coverReducer';
import setting from './settingReducer';
import property from './propertyReducer';
import orderInfo from './orderInfoReducer';
import pageArray from './pageArrayReducer';
import imageArray from './imageArrayReducer';
import variableMap from './variableMapReducer';
import parameterMap from './parameterMapReducer';
import imageUsedMap from './imageUsedMapReducer';
import calendarSetting from './calendarSettingReducer';
import deletedEncImgIds from './deletedEncImgIdsReducer';
import availableOptionMap from './availableOptionMapReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  cover,
  setting,
  property,
  pageArray,
  orderInfo,
  imageArray,
  variableMap,
  parameterMap,
  imageUsedMap,
  deletedEncImgIds,
  calendarSetting,
  availableOptionMap
});
