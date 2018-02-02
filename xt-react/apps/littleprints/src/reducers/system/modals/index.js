import { combineReducers } from 'redux';
import loadings from './loadingReducer';
import upgradeModal from './upgradeModalReducer';
import confirmModal from './confirmModalReducer';
import upload from './uploadImagesReducer';
import alertModal from './alertModalReducer';
import contactUsModal from './contactUsReducer';
import cloneModal from './cloneModalReducer';
import previewModal from './previewReducer';
import imageEditModal from './imageEditModalReducer';
import textEditModal from './textEditModalReducer';
// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  loadings,
  upgradeModal,
  confirmModal,
  upload,
  contactUsModal,
  imageEditModal,
  alertModal,
  cloneModal,
  previewModal,
  textEditModal
});
