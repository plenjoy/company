import { combineReducers } from 'redux';

import alerts from './alertsReducer';
import env from './envReducer';
import images from './imagesReducer';
import notifyData from './notifyReducer';
import confirmData from './confirmReducer';
import price from './priceReducer';
import imageEditModalData from '././imageEditModalReducer';
import loadingData from './loadingReducer';
import workspace from './workspaceReducer';
import pagination from './paginationReducer';
import fontList from './fontListReducer';
import snapData from './snapDatasReducer';
import cloneModalData from './cloneModalReducer';
import useSpecModal from './useSpecReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  alerts,
  env,
  images,
  price,
  imageEditModalData,
  notifyData,
  confirmData,
  loadingData,
  workspace,
  pagination,
  fontList,
  snapData,
  cloneModalData,
  useSpecModal
});
