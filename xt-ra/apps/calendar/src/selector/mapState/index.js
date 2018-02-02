import { Map, fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import {
  getRenderSize,
  getRenderPagination,
  getRenderPaginationSpread,
  computedSizeForSpecialView,
  getRenderAllSpreads,
  computedSizeForUpgrade
} from '../../utils/sizeCalculator';

const env = state => get(state, 'system.env');
const capabilities = state => get(state, 'system.capabilities');
const confirmModal = state => get(state, 'system.modals.confirmModal');
const pagination = state => get(state, 'system.global.pagination');
const ratios = state => get(state, 'system.global.ratio');
const template = state => get(state, 'system.template');
const styles = state => get(state, 'system.styles');

// projects
const project = state => get(state, 'project.data');


const sidebar = (state) => get(state, 'system.sidebar');
const upload = (state) => get(state, 'system.modals.upload');

const uploading = (state) => get(state, 'system.images.uploading');
const fontList = state => get(state, 'system.fontList');

const autoAddPhotoToCanvas = (state) => get(state, 'system.images.autoAddPhotoToCanvas');

const contactUsModal = state => get(state, 'system.modals.contactUsModal');
const imageEditModal = state => get(state, 'system.modals.imageEditModal');
const alertModal = state => get(state, 'system.modals.alertModal');
const cloneModal = state => get(state, 'system.modals.cloneModal');
const previewModal = state => get(state, 'system.modals.previewModal');
const textEditModal = state => get(state, 'system.modals.textEditModal');
const upgradeModal =state =>get(state,'system.modals.upgradeModal')


const price = state => get(state, 'system.price.price');


// spec
const spec = state => get(state, 'spec.data');

const uploadedImages = (state) => {
  return get(state, 'project.data.imageArray').toJS();
};

// 1. env
const getEnvData = createSelector(env, items => items);
const getUrls = createSelector(getEnvData, (env) => {
  return get(env, 'urls').toJS();
});
const getConfirmModal = createSelector(confirmModal, items => items);
const getUpgradeModal = createSelector(upgradeModal, items => items);

const getCapabilitiesData = createSelector(capabilities, items => items);
const getCapabilityData = createSelector(
  getCapabilitiesData,
  getEnvData,
  (capabilities, env) => {
    return env.qs.get('source') === 'designer'
      ? capabilities.get('designerPages')
      : capabilities.get('editPages');
  }
);

// projects
const getProjectData = createSelector(project, items => items);
// spec
const getSpecData = createSelector(spec, items => items);
// 获取所有images
const getAllImages = createSelector(
  getProjectData,
  project => project.imageArray
);

const getAllPages = createSelector(getProjectData, projectData => projectData.pageArray);
//获取图片使用次数
const getImageUsedMap = createSelector(getProjectData, projectData => projectData.imageUsedMap);
// 获取所有variables
const getAllVariables = createSelector(getProjectData, projectData => projectData.variableMap);
// 获取所有与项目有关系的参数..
const getAllParameters = createSelector(getProjectData, projectData => projectData.parameterMap);

const getTemplate = createSelector(template, items => items);
const getStyles = createSelector(styles, items => items);
const getFontList = createSelector(fontList, items => items);

const getUploadShow = createSelector(upload, items => items);
const getAutoAddPhotoToCanvas = createSelector(autoAddPhotoToCanvas, items => items);
const getUploadingImages = createSelector(uploading, items => items);

const getContactUsModal = createSelector(contactUsModal, items => items);
const getImageEditModal = createSelector(imageEditModal, items => items);
const getAlertModal = createSelector(alertModal, items => items);
const getCloneModal = createSelector(cloneModal, items => items);
const getPreviewModal = createSelector(previewModal, items => items);
const getTextEditModal = createSelector(textEditModal, items => items);

const getPrice = createSelector(price, items => items);

// 获取封面sheet
const getCoverSpread = createSelector(
  getProjectData,
  project => project.cover
);

const getUploadedImages = createSelector(uploadedImages, items => items);

// 获取所有设置
const getAllSettings = createSelector(getProjectData, (projectData) => {
  return {
    spec: projectData.setting.toJS(),
    calendarSetting: projectData.calendarSetting.toJS()
  };
});

const getPagination = createSelector(pagination, getAllPages, getAllSettings, (pagination, allPages, settings) => {
  return getRenderPagination(pagination, allPages, settings);
});

const getRatiosData = createSelector(ratios, getPagination, (ratios, pagination) => {
  const sheetIndex = pagination.sheetIndex;

  const obj = merge({},
    ratios.toJS(),{
      workspace: sheetIndex === 0 ? ratios.get('coverWorkspace') : ratios.get('innerWorkspace')
    });

  return obj;
});


// 获取所有size: spread原始宽高, workspace宽高.
const getSize = createSelector(getProjectData,
  getRatiosData,
  getAllParameters,
  getAllVariables,
  (project, ratios, parameters, variables) => {
    const size = getRenderSize(project, ratios, parameters, variables);
    return size;
  });

const getUpgradeSize = createSelector(
  getProjectData,
  getSize,
  getRatiosData,
  getAllParameters,
  getAllVariables,
  (project, size, ratios, parameters, variables) => {
    const obj = computedSizeForUpgrade(
      project,
      size,
      ratios,
      parameters,
      variables
    );
    return obj;
  }
);


const getArrangePagesSize = createSelector(
  getProjectData,
  getSize,
  getRatiosData,
  getAllParameters,
  getAllVariables,
  (project, size, ratios, parameters, variables) => {
    const obj = computedSizeForSpecialView(
      project,
      size,
      ratios,
      parameters,
      variables
    );
    return obj;
  }
);



const getPaginationSpread = createSelector(
  getAllPages,
  getCoverSpread,
  getAllImages,
  getAllSettings,
  getPagination,
  (
    allPages,
    coverSpread,
    allImages,
    settings,
    pagination
  ) => {
    return getRenderPaginationSpread(
      allPages,
      coverSpread,
      allImages,
      settings,
      pagination
    );
  }
);

/** ********preview**********/
const getPreviewRatiosData = createSelector(getRatiosData, getPagination, (ratios, pagination) => {
  const sheetIndex = pagination.sheetIndex;
  return merge({}, ratios, {
    workspace: sheetIndex === 0 ? ratios.previewCoverWorkspace : ratios.previewInnerWorkspace,
    coverWorkspace: ratios.previewCoverWorkspace,
    innerWorkspace: ratios.previewInnerWorkspace
  });
});

const getPreviewSize = createSelector(project,
  getPreviewRatiosData,
  getAllParameters,
  getAllVariables,
  (project, ratios, parameters, variables) => {
    return getRenderSize(project, ratios, parameters, variables, true);
  });

const getSidebarData = createSelector(sidebar, items => items);

const getAllSpreads = createSelector(
  getAllPages,
  getCoverSpread,
  getAllImages,
  getAllSettings,
  (allPages, coverSpread, allImages, settings) => {
    return getRenderAllSpreads(
      allPages,
      coverSpread,
      allImages,
      settings
    );
  }
);

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  // projects
  autoAddPhotoToCanvas: getAutoAddPhotoToCanvas(state),
  uploadingImages: getUploadingImages(state),
  project: getProjectData(state),
  upload: getUploadShow(state),
  settings: getAllSettings(state),
  imageUsedMap: getImageUsedMap(state),
  variables: getAllVariables(state),
  parameters: getAllParameters(state),
  // spec
  spec: getSpecData(state),
  // system
  env: getEnvData(state),
  urls: getUrls(state),
  size: getSize(state),

  ratios: getRatiosData(state),
  pagination: getPagination(state),
  paginationSpread: getPaginationSpread(state),
  confirmModal: getConfirmModal(state),
  sidebar: getSidebarData(state),
  uploadedImages: getUploadedImages(state),
  contactUsModal: getContactUsModal(state),
  imageEditModal: getImageEditModal(state),
  capability: getCapabilityData(state),
  capabilities: getCapabilitiesData(state),
  allImages: getAllImages(state),

  // preview
  previewRatios: getPreviewRatiosData(state),
  previewSize: getPreviewSize(state),

  arrangePagesSize: getArrangePagesSize(state),
  allSheets: getAllSpreads(state),
  template: getTemplate(state),
  styles: getStyles(state),
  alertModal: getAlertModal(state),
  cloneModal: getCloneModal(state),
  previewModal: getPreviewModal(state),
  fontList: getFontList(state),
  textEditModal: getTextEditModal(state),
  price: getPrice(state),
  upgradeModal: getUpgradeModal(state),

  upgradeSize: getUpgradeSize(state)
});
