import { Map, fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import {
  getRenderAllSpreads,
  getRenderSize,
  getRenderPagination,
  getRenderPaginationSpread
} from '../../utils/sizeCalculator';
import {
  enumPhotoQuantity
} from '../../constants/strings';

const env = state => get(state, 'system.env');
const ratios = state => get(state, 'system.global.ratio');
const capabilities = state => get(state, 'system.capabilities');
const materials = state => get(state, 'system.global.material');
const confirmModal = state => get(state, 'system.modals.confirmModal');
const alertModal = state => get(state, 'system.modals.alertModal');
const imageEditModal = state => get(state, 'system.modals.imageEditModal');
const cloneModal = state => get(state, 'system.modals.cloneModal');
const loadingModal = state => get(state, 'system.modals.loadingModal');
const previewModal = state => get(state, 'system.modals.previewModal');
const contactUsModal = state => get(state, 'system.modals.contactUsModal');
const snipping = state => get(state, 'system.global.snipping');
const modals = state => get(state, 'system.modals');
// projects
const project = state => get(state, 'project.data');
const price = state => get(state, 'system.price.price');

// spec
const spec = state => get(state, 'spec');
const pagination = state => get(state, 'system.global.pagination');

const fontList = state => get(state, 'system.fontList');

const uploadedImages = (state) => {
  return get(state, 'project.data.imageArray').toJS();
};
const upload = state => get(state, 'system.modals.upload');
const autoAddPhotoToCanvas = state => get(state, 'system.images.autoAddPhotoToCanvas');
const uploading = state => get(state, 'system.images.uploading');
const imageStatus = state => get(state, 'system.images.status');
const getPrice = createSelector(price, items => items);
// 1. env
const getEnvData = createSelector(env, items => items);
const getRatiosData = createSelector(ratios, items => items);
const getConfirmModal = createSelector(confirmModal, items => items);
const getAlertModal = createSelector(alertModal, items => items);
const getImageEditModal = createSelector(imageEditModal, items => items);
const getCloneModal = createSelector(cloneModal, items => items);
const getLoadingModal = createSelector(loadingModal, items => items);
const getPreviewModal = createSelector(previewModal, items => items);
const getContactUsModal = createSelector(contactUsModal, items => items);
const getSnipping = createSelector(snipping, items => items);

const getUrls = createSelector(getEnvData, (env) => {
  return get(env, 'urls').toJS();
});

/*
  是否要禁用从电脑中拖拽图片到app中上传.
 */
const getIsDisableDragExternalFiles = createSelector(modals, (data) => {
  let isDisable = false;

  // 以下情况需要禁用.
  // 1. 预览打开时
  if (data.previewModal.get('isShown')) {
    isDisable = true;
  }

  return isDisable;
});

// projects
const getProjectData = createSelector(project, items => items);
const getSettings = createSelector(
  getProjectData,
  projectData => projectData.setting
);
// 获取所有images
const getAllImages = createSelector(
  getProjectData,
  projectData => projectData.imageArray
);
// 获取所有variables
const getAllVariables = createSelector(getProjectData, projectData => projectData.variableMap);
// 获取所有与项目有关系的参数..
const getAllParameters = createSelector(getProjectData, projectData => projectData.parameterMap);
// 获取所有渲染效果的素材.
const getAllMaterials = createSelector(materials, materials => materials);
// 获取所有 pages
const getAllPages = createSelector(
  getProjectData,
  projectData => projectData.pageArray.present
);
const getIsSplit = createSelector(getProjectData, projectData => {
  return  projectData.availableOptionMap &&
          projectData.availableOptionMap.get('photoQuantity') &&
          projectData.availableOptionMap.get('photoQuantity').size > 1 &&
          projectData.setting.get('photoQuantity') &&
          projectData.setting.get('photoQuantity') === enumPhotoQuantity.three;
});

const getIsShowSwitch = createSelector(getProjectData, projectData => {
  return  projectData.availableOptionMap &&
          projectData.availableOptionMap.get('photoQuantity') &&
          projectData.availableOptionMap.get('photoQuantity').size > 1;
});

const getPagination = createSelector(pagination, getAllPages, getSettings, (pagination, allPages, settings) => {
  return getRenderPagination(pagination, allPages, settings);
});

// 获取所有size: spread原始宽高, workspace宽高.
const getSize = createSelector(getSettings,
  getRatiosData,
  getAllParameters,
  getAllVariables,
  (settings, ratios, parameters, variables) => {
    const size = getRenderSize(settings, ratios, parameters, variables);
    return size;
  });

const getScreenShotSize = createSelector(getSettings,
  getRatiosData,
  getAllParameters,
  getAllVariables,
  (settings, ratios, parameters, variables) => {
    const size = getRenderSize(settings, ratios, parameters, variables, undefined, true);
    return size;
  });
const getPaginationSpread = createSelector(
  getAllPages,
  getAllImages,
  getSettings,
  getPagination,
  (
    allPages,
    allImages,
    settings,
    pagination
  ) => {
    return getRenderPaginationSpread(
      allPages,
      allImages,
      settings,
      pagination
    );
  }
);

const getAllSpreads = createSelector(
  getAllPages,
  getAllImages,
  getSettings,
  (allPages, coverSpread, allImages, settings) => {
    return getRenderAllSpreads(
      allPages,
      allImages,
      settings
    );
  }
);

// spec
const getSpecData = createSelector(spec, items => items);

const getFontList = createSelector(fontList, items => items);
const getCapabilitiesData = createSelector(capabilities, items => items);
const getUploadedImages = createSelector(uploadedImages, items => items);
const getImageUsedMap = createSelector(getProjectData, project => project.imageUsedMap);
const getUploadShow = createSelector(upload, items => items);
const getAutoAddPhotoToCanvas = createSelector(autoAddPhotoToCanvas, items => items);
const getUploadingImages = createSelector(uploading, items => items);
const getImageStatus = createSelector(imageStatus, items => items);

/** ********preview**********/
const getPreviewRatiosData = createSelector(getRatiosData, (ratios) => {
  return ratios.merge({ workspace: ratios.get('previewWorkspace') });
});
const getPreviewSize = createSelector(getSettings,
  getRatiosData,
  getAllParameters,
  getAllVariables,
  (project, ratios, parameters, variables) => {
    return getRenderSize(project, ratios, parameters, variables, true);
  });

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  // project
  project: getProjectData(state),
  settings: getSettings(state),
  allImages: getAllImages(state),
  variables: getAllVariables(state),
  parameters: getAllParameters(state),
  allSheets: getAllSpreads(state),
  // spec
  spec: getSpecData(state),

  // system
  env: getEnvData(state),
  urls: getUrls(state),
  ratios: getRatiosData(state),
  fontList: getFontList(state),
  materials: getAllMaterials(state),
  confirmModal: getConfirmModal(state),
  alertModal: getAlertModal(state),
  cloneModal: getCloneModal(state),
  loadingModal: getLoadingModal(state),
  previewModal: getPreviewModal(state),
  contactUsModal: getContactUsModal(state),
  capabilities: getCapabilitiesData(state),

  pagination: getPagination(state),
  paginationSpread: getPaginationSpread(state),

  // 渲染相关的尺寸
  size: getSize(state),

  uploadedImages: getUploadedImages(state),
  imageUsedMap: getImageUsedMap(state),
  upload: getUploadShow(state),
  autoAddPhotoToCanvas: getAutoAddPhotoToCanvas(state),
  uploadingImages: getUploadingImages(state),
  imageStatus: getImageStatus(state),
  imageEditModal: getImageEditModal(state),
  price: getPrice(state),

  // preview
  previewRatios: getPreviewRatiosData(state),
  previewSize: getPreviewSize(state),

  screenShotSize: getScreenShotSize(state),
  snipping: getSnipping(state),
  isSplit: getIsSplit(state),
  isShowSwitch: getIsShowSwitch(state),
  isDisableDragExternalFiles: getIsDisableDragExternalFiles(state)
});
