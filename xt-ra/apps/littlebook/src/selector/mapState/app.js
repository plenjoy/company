import { get, merge } from 'lodash';
import { Map, fromJS } from 'immutable';
import { createSelector } from 'reselect';
import {
  getRenderSize,
  getRenderPosition,
  getRenderAllSpreads,
  getRenderPagination,
  isSupportSaveProject,
  getRenderPaginationSpread,
  checkIsImageCover,
  computedTemplate
} from '../../utils/sizeCalculator';
import {
  spreadTypes,
  elementTypes,
  pageTypes,
  cameoPaddingsRatio,
  layoutSheetType
} from '../../contants/strings';

// 用于项目中
const env = state => get(state, 'system.env');
const autoAddPhotoToCanvas = state =>
  get(state, 'system.images.autoAddPhotoToCanvas');
const alerts = state => get(state, 'system.modals.alerts');
const sidebar = state => get(state, 'system.sidebar');
const capabilities = state => get(state, 'system.capabilities');
const uploading = state => get(state, 'system.images.uploading');
const upload = state => get(state, 'system.modals.upload');
const autoUpload = state => get(state, 'system.modals.autoUpload');
const system = state => get(state, 'system');
const uploadedImages = (state) => {
  return get(state, 'project.data.present').get('imageArray').toJS();
};
const allDecorations = state => get(state, 'project.decorationArray');

const project = state => get(state, 'project.data.present');
const spec = state => get(state, 'spec.data');
const bookSettingsModal = state =>
  get(state, 'system.modals.bookSettingsModal');
const paintedTextModal = state => get(state, 'system.modals.paintedTextModal');
const imageEditModal = state => get(state, 'system.modals.imageEditModal');
const textEditModal = state => get(state, 'system.modals.textEditModal');
const propertyModal = state => get(state, 'system.modals.propertyModal');
const confirmModal = state => get(state, 'system.modals.confirmModal');
const upgradeModal = state => get(state, 'system.modals.upgradeModal');
const selectModal = state => get(state, 'system.modals.selectModal');
const howThisWorksModal = state =>
  get(state, 'system.modals.howThisWorksModal');
const quickStartModal = state => get(state, 'system.modals.quickStartModal');
const contactUsModal = state => get(state, 'system.modals.contactUsModal');
const shareProjectModal = state =>
  get(state, 'system.modals.shareProjectModal');
const saveTemplateModal = state =>
  get(state, 'system.modals.saveTemplateModal');
const alertModal = state => get(state, 'system.modals.alertModal');
const cloneModal = state => get(state, 'system.modals.cloneModal');
const previewModal = state => get(state, 'system.modals.previewModal');
const pageLoadingModal = state => get(state, 'system.modals.pageLoadingModal');
const changeBgColorModal = state =>
  get(state, 'system.modals.changeBgColorModal');
const approvalPage = state => get(state, 'system.modals.approvalPage');
const fontList = state => get(state, 'system.fontList');
const materials = state => get(state, 'system.global.material');

const price = state => get(state, 'system.price.price');
const template = state => get(state, 'system.template');
const stickerList = state => get(state, 'system.stickerList');
const pagination = state => get(state, 'system.global.pagination');
const ratios = state => get(state, 'system.global.ratio');
const snipping = state => get(state, 'system.global.snipping');
const globalLoading = state => get(state, 'system.global.globalLoading');
const oAuth = state => get(state, 'system.oAuth');

/**
 * 创建具有可记忆的selector
 */
const getCapabilitiesData = createSelector(capabilities, items => items);
const getEnvData = createSelector(env, items => items);
const getAutoAddPhotoToCanvas = createSelector(
  autoAddPhotoToCanvas,
  items => items
);
const getAlertsData = createSelector(alerts, items => items);
const getSidebarData = createSelector(sidebar, items => items);
const getUploadingImages = createSelector(uploading, items => items);
const getUploadShow = createSelector(upload, items => items);
const getUploadedImages = createSelector(uploadedImages, items => items);
const getProjectData = createSelector(project, items => items);
const getSpecData = createSelector(spec, items => items);
const getBookSettingsModal = createSelector(bookSettingsModal, items => items);
const getPaintedTextModal = createSelector(paintedTextModal, items => items);
const getImageEditModal = createSelector(imageEditModal, items => items);
const getTextEditModal = createSelector(textEditModal, items => items);
const getPropertyModal = createSelector(propertyModal, items => items);
const getConfirmModal = createSelector(confirmModal, items => items);
const getUpgradeModal = createSelector(upgradeModal, items => items);
const getSelectModal = createSelector(selectModal, items => items);
const getHowThisWorksModal = createSelector(howThisWorksModal, items => items);
const getQuickStartModal = createSelector(quickStartModal, items => items);
const getContactUsModal = createSelector(contactUsModal, items => items);
const getShareProjectModal = createSelector(shareProjectModal, items => items);
const getSaveTemplateModal = createSelector(saveTemplateModal, items => items);
const getAlertModal = createSelector(alertModal, items => items);
const getCloneModal = createSelector(cloneModal, items => items);
const getPreviewModal = createSelector(previewModal, items => items);
const getPageLoadingModal = createSelector(pageLoadingModal, items => items);
const getChangeBgColorModal = createSelector(
  changeBgColorModal,
  items => items
);
const getApprovalPage = createSelector(approvalPage, items => items);
const getFontList = createSelector(fontList, items => items);
const getPrice = createSelector(price, items => items);
const getStickerList = createSelector(stickerList, items => items);
const getSnipping = createSelector(snipping, items => items);
const getAllPages = createSelector(getProjectData, project =>
  project.get('pageArray')
);
const getAllElements = createSelector(getProjectData, project =>
  project.get('elementArray')
);
const getAllImages = createSelector(getProjectData, project =>
  project.get('imageArray')
);
const getAllContainers = createSelector(getProjectData, project =>
  project.getIn(['cover', 'containers'])
);
const getoAuth = createSelector(oAuth, items => items);
const getAutoUpload = createSelector(autoUpload, items => items);
const getGlobalLoading = createSelector(globalLoading, items => items);

// 获取所有decorations
const getAllDecorations = createSelector(
  allDecorations,
  decorations => decorations
);

const getPagination = createSelector(
  pagination,
  getAllPages,
  (pagination, allPages) => {
    return Map(getRenderPagination(pagination, allPages));
  }
);

const getRatiosData = createSelector(
  ratios,
  getPagination,
  (ratios, pagination) => {
    const cameoPaddings = {
      cameoPaddingTop: 20 / 450,
      cameoPaddingLeft: 20 / 450
    };
    const sheetIndex = pagination.get('sheetIndex');

    const obj = merge({}, ratios.toJS(), cameoPaddings, {
      workspace:
        sheetIndex === 0
          ? ratios.get('coverWorkspace')
          : ratios.get('innerWorkspace')
    });

    return obj;
  }
);

// 获取所有设置
const getAllSettings = createSelector(getProjectData, (project) => {
  const uiSetting = project.getIn(['uiSetting', 'templateStrip']);
  return {
    spec: project.get('setting').toJS(),
    uiSetting: uiSetting ? uiSetting.toJS() : {},
    bookSetting: project.get('bookSetting').toJS()
  };
});

// 获取所有cover, inner的渲染效果的素材.
const getAllMaterials = createSelector(materials, materials => materials);

const checkIsSupportSaveProject = createSelector(project, (project) => {
  return isSupportSaveProject(project.get('orderStatus'));
});

// 获取所有与项目有关系的参数..
const getAllParameters = createSelector(getProjectData, project =>
  project.get('parameterMap')
);

// 获取封面sheet
const getCoverSpread = createSelector(getProjectData, project =>
  project.get('cover')
);

// 获取图片使用次数
const getImageUsedCountMap = createSelector(getProjectData, project =>
  project.get('imageUsedCountMap')
);

// 获取Sticker使用次数
const getStickerUsedCountMap = createSelector(getProjectData, project =>
  project.get('decorationUsedCountMap')
);

// 获取所有variables
const getAllVariables = createSelector(getProjectData, project =>
  project.get('variableMap')
);

const getAllTemplates = createSelector(system, (system) => {
  return get(system, 'template.list');
});

const getTemplateDetails = createSelector(system, (system) => {
  return get(system, 'template.details');
});

// 获取spain的宽.
const getSpineSize = createSelector(getCoverSpread, (coverSpread) => {
  const size = {
    width: 0,
    height: 0,
    bleed: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  };

  // 查找容器里面的spine page. 并返回它的宽高.
  const containers = coverSpread.get('containers');
  if (containers) {
    const spinePage = containers.find(
      page => page.get('type') === pageTypes.spine
    );

    if (spinePage) {
      size.width = spinePage.get('width');
      size.height = spinePage.get('height');
      size.bleed = {
        top: spinePage.getIn(['bleed', 'top']),
        right: spinePage.getIn(['bleed', 'right']),
        bottom: spinePage.getIn(['bleed', 'bottom']),
        left: spinePage.getIn(['bleed', 'left'])
      };
    }
  }

  return size;
});

// 获取spain的压线.
const getSpainExpandingSize = createSelector(getAllParameters, (parameters) => {
  let size = {
    expandingOverBackcover: 0,
    expandingOverFrontcover: 0
  };

  if (parameters) {
    size = parameters.get('spineExpanding').toJS();
  }

  return size;
});

// 获取所有size: spread原始宽高, workspace宽高.
const getSize = createSelector(
  getProjectData,
  getRatiosData,
  getSpineSize,
  getSpainExpandingSize,
  getAllParameters,
  getAllMaterials,
  (project, ratios, spineSize, spainExpanding, parameters, materials) => {
    return getRenderSize(
      project,
      ratios,
      spineSize,
      spainExpanding,
      parameters,
      materials
    );
  }
);

/**
 * [description]
 * @param  {[type]} getAllPages    [description]
 * @param  {[type]} getAllElements [description]
 * @param  {[type]} getPagination  [description]
 * @param  {[type]} (allPages,     allElements,  pagination [description]
 * @return {[type]}                [description]
 */
const getPaginationSpread = createSelector(
  getAllContainers,
  getAllPages,
  getAllElements,
  getPagination,
  (allContainers, allPages, allElements, pagination) => {
    let page = allPages.find(
      page => page.get('id') === pagination.get('pageId')
    );
    if (!page && allContainers) {
      page = allContainers.find(
        page => page.get('id') === pagination.get('pageId')
      );
    }
    const elements = [];

    // 查找当前page下的所有elements.
    if (page) {
      const pageElements = page.get('elements');
      if (pageElements && pageElements.size) {
        pageElements.forEach((id) => {
          const element = allElements.find(element => element.get('id') === id);
          if (element) {
            elements.push(element);
          }
        });
      }
    }

    const obj = { page, elements };

    return Map(obj);
  }
);

const getTemplate = createSelector(
  getAllPages,
  getAllElements,
  getAllImages,
  getAllTemplates,
  getPagination,
  getTemplateDetails,
  getAllSettings,
  (allPages, allElements, allImages, templates, pagination, details, allSetting) => {
    return computedTemplate(allPages, allElements, allImages, templates, pagination.toJS(), details, allSetting);
  }
);

const getTemplateForCover = createSelector(
  getAllPages,
  getAllElements,
  getAllImages,
  getAllTemplates,
  getTemplateDetails,
  getAllSettings,
  (allPages, allElements, allImages, templates, details, allSetting) => {
    const pagination = {
      sheetIndex: 0
    };

    return computedTemplate(allPages, allElements, allImages, templates, pagination, details, allSetting);
  }
);

const getTemplateForInner = createSelector(
  getAllTemplates,
  getTemplateDetails,
  getAllSettings,
  (templates, details, allSetting) => {
    const coverType = get(allSetting, 'spec.cover');
    const templateObject = templates.get(coverType);

    let list = [];

    if (templateObject) {
      list = templateObject.get('inner');
    }

    return fromJS({
      list,
      details
    });
  }
);

const getAllSpreads = createSelector(
  getAllPages,
  getCoverSpread,
  getAllElements,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getAllMaterials,
  (
    allPages,
    coverSpread,
    allElements,
    allDecorations,
    allImages,
    settings,
    materials
  ) => {
    return getRenderAllSpreads(
      allPages,
      coverSpread,
      allElements,
      allDecorations,
      allImages,
      settings,
      materials
    );
  }
);

/*
 * 获取翻页后的spreads, 只返回3个spreads:
 * - 如果当前页为第一页: 那么返回1,2,3页
 * - 如果当前页为最后一页: 那么返回倒数3页.
 * - 否则返回当前页, 前一页和后一页.
 * - 如果spreads的总数小于3, 那么返回所有.
 */
const getPaginationSpreadForCover = createSelector(
  getAllPages,
  getCoverSpread,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getAllElements,
  getPagination,
  getAllMaterials,
  (
    allPages,
    coverSpread,
    allDecorations,
    allImages,
    settings,
    allElements,
    pagination,
    materials
  ) => {
    return getRenderPaginationSpread(
      allPages,
      coverSpread,
      allElements,
      allDecorations,
      allImages,
      settings,
      pagination,
      materials,
      true
    );
  }
);

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getPosition = createSelector(getSize, getRatiosData, (size, ratios) => {
  return getRenderPosition(size, ratios);
});

/** ********preview********* */
const getPreviewRatiosData = createSelector(
  getRatiosData,
  getPagination,
  (ratios, pagination) => {
    const sheetIndex = pagination.get('sheetIndex');

    return merge({}, ratios, cameoPaddingsRatio, {
      workspace:
        sheetIndex === 0
          ? ratios.previewCoverWorkspace
          : ratios.previewInnerWorkspace,
      coverWorkspace: ratios.previewCoverWorkspace,
      innerWorkspace: ratios.previewInnerWorkspace
    });
  }
);

const getPreviewSize = createSelector(
  project,
  getPreviewRatiosData,
  getSpineSize,
  getSpainExpandingSize,
  getAllParameters,
  getAllMaterials,
  (project, ratios, spineSize, spainExpanding, parameters, materials) => {
    return getRenderSize(
      project,
      ratios,
      spineSize,
      spainExpanding,
      parameters,
      materials
    );
  }
);

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getPreviewPosition = createSelector(
  getPreviewSize,
  getRatiosData,
  (size, ratios) => {
    return getRenderPosition(size, ratios);
  }
);

/** ********end preview********* */

/** ********order page********* */
const getOrderRatiosData = createSelector(
  getRatiosData,
  getPagination,
  (ratios, pagination) => {
    const sheetIndex = pagination.get('sheetIndex');

    return merge({}, ratios, cameoPaddingsRatio, {
      workspace:
        sheetIndex === 0
          ? ratios.orderCoverWorkspace
          : ratios.orderInnerWorkspace,
      coverWorkspace: ratios.orderCoverWorkspace,
      innerWorkspace: ratios.orderInnerWorkspace
    });
  }
);

const getOrderSize = createSelector(
  project,
  getOrderRatiosData,
  getSpineSize,
  getSpainExpandingSize,
  getAllParameters,
  getAllMaterials,
  (project, ratios, spineSize, spainExpanding, parameters, materials) => {
    return getRenderSize(
      project,
      ratios,
      spineSize,
      spainExpanding,
      parameters,
      materials
    );
  }
);

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getOrderPosition = createSelector(
  getOrderSize,
  getRatiosData,
  (size, ratios) => {
    return getRenderPosition(size, ratios);
  }
);
/** ********end order page********* */

// 判断当前的封面是image cover还是text cover.
const isImageCover = createSelector(getPaginationSpreadForCover, (cover) => {
  return checkIsImageCover(cover);
});

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  autoAddPhotoToCanvas: getAutoAddPhotoToCanvas(state),
  env: getEnvData(state),
  alerts: getAlertsData(state),
  sidebar: getSidebarData(state),
  uploadingImages: getUploadingImages(state),
  uploadedImages: getUploadedImages(state),
  upload: getUploadShow(state),
  project: getProjectData(state),
  spec: getSpecData(state),
  bookSettingsModal: getBookSettingsModal(state),
  paintedTextModal: getPaintedTextModal(state),
  imageEditModal: getImageEditModal(state),
  textEditModal: getTextEditModal(state),
  propertyModal: getPropertyModal(state),
  confirmModal: getConfirmModal(state),
  upgradeModal: getUpgradeModal(state),
  selectModal: getSelectModal(state),
  howThisWorksModal: getHowThisWorksModal(state),
  quickStartModal: getQuickStartModal(state),
  contactUsModal: getContactUsModal(state),
  shareProjectModal: getShareProjectModal(state),
  saveTemplateModal: getSaveTemplateModal(state),
  alertModal: getAlertModal(state),
  cloneModal: getCloneModal(state),
  previewModal: getPreviewModal(state),
  pageLoadingModal: getPageLoadingModal(state),
  changeBgColorModal: getChangeBgColorModal(state),
  approvalPage: getApprovalPage(state),
  fontList: getFontList(state),
  price: getPrice(state),
  allTemplate: getAllTemplates(state),
  template: getTemplate(state),
  templateForCover: getTemplateForCover(state),
  templateObjectForInner: getTemplateForInner(state),
  stickerList: getStickerList(state),
  size: getSize(state),
  settings: getAllSettings(state),
  globalLoading: getGlobalLoading(state),
  materials: getAllMaterials(state),
  variables: getAllVariables(state),
  parameters: getAllParameters(state),
  imageUsedCountMap: getImageUsedCountMap(state),
  decorationUsedCountMap: getStickerUsedCountMap(state),
  pagination: getPagination(state),
  paginationSpread: getPaginationSpread(state),
  paginationSpreadForCover: getPaginationSpreadForCover(state),
  allImages: getAllImages(state),
  ratio: getRatiosData(state),
  capabilities: getCapabilitiesData(state),
  allElements: getAllElements(state),
  snipping: getSnipping(state),
  allSheets: getAllSpreads(state),
  autoUpload: getAutoUpload(state),
  oAuth: getoAuth(state),

  // orderstatus
  isSupportSaveProject: checkIsSupportSaveProject(state),

  // preview
  previewRatios: getPreviewRatiosData(state),
  previewSize: getPreviewSize(state),
  previewPosition: getPreviewPosition(state),

  position: getPosition(state),

  // order
  orderRatios: getOrderRatiosData(state),
  orderSize: getOrderSize(state),
  orderPosition: getOrderPosition(state),
  isImageCover: isImageCover(state)
});
