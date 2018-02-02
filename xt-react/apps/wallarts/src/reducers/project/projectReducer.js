import { combineReducers } from 'redux';
import setting from './settingReducer';
import property from './propertyReducer';
import orderInfo from './orderInfoReducer';
import pageArray from './pageArrayReducer';
import imageArray from './imageArrayReducer';
import variableMap from './variableMapReducer';
import parameterMap from './parameterMapReducer';
import imageUsedMap from './imageUsedMapReducer';
import deletedEncImgIds from './deletedEncImgIdsReducer';
import availableOptionMap from './availableOptionMapReducer';


// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  setting,
  property,
  pageArray,
  orderInfo,
  imageArray,
  variableMap,
  parameterMap,
  imageUsedMap,
  deletedEncImgIds,
  availableOptionMap
});
