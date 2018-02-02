import { combineReducers } from 'redux';
import confirmModal from './confirmModalReducer';
import imageEditModal from './imageEditModalReducer';
import loadings from './loadingReducer';
import upload from './uploadImagesReducer';
import bookSettingsModal from './bookSettingsModalReducer';
import paintedTextModal from './paintedTextModalReducer';
import textEditModal from './textEditModalReducer';
import propertyModal from './propertyModalReducer';
import howThisWorksModal from './howThisWorksReducer';
import quickStartModal from './qucikStartReducer';
import contactUsModal from './contactUsReducer';
import shareProjectModal from './shareProjectReducer';
import saveTemplateModal from './saveTemplateModalReducer';
import cloneModal from './cloneModalReducer';
import alertModal from './alertModalReducer';
import previewModal from './previewReducer';
import pageLoadingModal from './pageLoadingModalReducer';
import changeBgColorModal from './changeBgcolorModalReducer';
import approvalPage from './approvalPageReducer';
import previewScreenshot from './previewScreenshotReducer.js';
import themeOverlayModal from './themeOverlayReducer';
import xtroModal from './xtroReducer';
import guideLineModal from './guideLineReducer';
import useSpecModal from './useSpecReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  confirmModal,
  imageEditModal,
  loadings,
  upload,
  bookSettingsModal,
  paintedTextModal,
  textEditModal,
  propertyModal,
  howThisWorksModal,
  quickStartModal,
  guideLineModal,
  contactUsModal,
  shareProjectModal,
  saveTemplateModal,
  cloneModal,
  alertModal,
  previewModal,
  pageLoadingModal,
  changeBgColorModal,
  approvalPage,
  previewScreenshot,
  themeOverlayModal,
  xtroModal,
  useSpecModal
});
