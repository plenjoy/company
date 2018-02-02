import { combineReducers } from 'redux';
import setting from './settingReducer';
import bookSetting from './bookSettingReducer';
import cover from './coverReducer';
import pageArray from './pageArrayReducer';
import property from './propertyReducer';
import imageArray from './imageArrayReducer';
import backgroundArray from './backgroundArrayReducer';
import stickerArray from './stickerArrayReducer';
import imageUsedMap from './imageUsedMapReducer';
import stickerUsedMap from './stickerUsedMapReducer';
import parameterMap from './parameterMapReducer';
import variableMap from './variableMapReducer';
import orderInfo from './orderInfoReducer';
import deletedEncImgIdArray from './deletedEncImgIdsReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  setting,
  bookSetting,
  cover,
  pageArray,
  property,
  imageArray,
  deletedEncImgIdArray,
  imageUsedMap,
  stickerUsedMap,
  parameterMap,
  variableMap,
  orderInfo,
  backgroundArray,
  stickerArray
});
