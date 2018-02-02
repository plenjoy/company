import { combineReducers } from 'redux';
import loadings from './loadingReducer';
import upgradeModal from './upgradeModalReducer';
import confirmModal from './confirmModalReducer';
import upload from './uploadImagesReducer';
import alertModal from './alertModalReducer';
import imageEditModal from './imageEditModalReducer';
import cloneModal from './cloneModalReducer';
import previewModal from './previewModalReducer';
import loadingModal from './loadingModalReducer';
import contactUsModal from './contactUsReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  loadings,
  upgradeModal,
  confirmModal,
  cloneModal,
  upload,
  previewModal,
  alertModal,
  imageEditModal,
  loadingModal,
  contactUsModal
});
