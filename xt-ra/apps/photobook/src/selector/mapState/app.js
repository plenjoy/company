import lodash, { get, merge, set } from 'lodash';
import { Map, fromJS } from 'immutable';
import { createSelector } from 'reselect';
import { getRenderSize, getRenderPosition, getRenderAllSpreads, getRenderPagination, checkParentBook, getRenderPaginationSpread, flipImgElements, checkIsEnablePage } from '../../utils/sizeCalculator';
import { checkIsSupportHalfImageInCover, checkIsSupportFullImageInCover, checkIsSupportImageInCover } from '../../utils/cover';
import { spreadTypes, elementTypes, productTypes, pageTypes, cameoPaddingsRatio, coverTypes, bookthemeWhiteList, lastNumbersOfUnblockUploading } from '../../contants/strings';
import * as apiUrl from '../../contants/apiUrl';
// 用于项目中
const env = state => get(state, 'system.env');
const autoAddPhotoToCanvas = state => get(state, 'system.images.autoAddPhotoToCanvas');
const alerts = state => get(state, 'system.modals.alerts');
const sidebar = state => get(state, 'system.sidebar');
const capabilities = state => get(state, 'system.capabilities');
const uploading = state => get(state, 'system.images.uploading');
const uploadingStatus = state => get(state, 'system.images.status');
const upload = state => get(state, 'system.modals.upload');
const uploadedImages = (state) => {
  return get(state, 'project.data.imageArray').toJS();
};
const allDecorations = state => get(state, 'project.decorationArray');

const project = state => get(state, 'project.data');
const spec = state => get(state, 'spec.data');
const bookSettingsModal = state => get(state, 'system.modals.bookSettingsModal');
const paintedTextModal = state => get(state, 'system.modals.paintedTextModal');
const imageEditModal = state => get(state, 'system.modals.imageEditModal');
const textEditModal = state => get(state, 'system.modals.textEditModal');
const propertyModal = state => get(state, 'system.modals.propertyModal');
const confirmModal = state => get(state, 'system.modals.confirmModal');
const howThisWorksModal = state => get(state, 'system.modals.howThisWorksModal');
const quickStartModal = state => get(state, 'system.modals.quickStartModal');
const useSpecModal = state => get(state, 'system.modals.useSpecModal');
const guideLineModal = state => get(state, 'system.modals.guideLineModal');
const contactUsModal = state => get(state, 'system.modals.contactUsModal');
const shareProjectModal = state => get(state, 'system.modals.shareProjectModal');
const saveTemplateModal = state => get(state, 'system.modals.saveTemplateModal');
const alertModal = state => get(state, 'system.modals.alertModal');
const cloneModal = state => get(state, 'system.modals.cloneModal');
const previewScreenshot = state => get(state, 'system.modals.previewScreenshot');
const previewModal = state => get(state, 'system.modals.previewModal');
const pageLoadingModal = state => get(state, 'system.modals.pageLoadingModal');
const changeBgColorModal = state => get(state, 'system.modals.changeBgColorModal');
const themeOverlayModal = state => get(state, 'system.modals.themeOverlayModal');
const xtroModal = state => get(state, 'system.modals.xtroModal');
const approvalPage = state => get(state, 'system.modals.approvalPage');
const fontList = state => get(state, 'system.fontList');
const materials = state => get(state, 'system.global.material');

const price = state => get(state, 'system.price.price');
const coupon = state => get(state, 'system.price.coupon');
const template = state => get(state, 'system.template');
const stickerList = state => get(state, 'system.stickerList');
const pagination = state => get(state, 'system.global.pagination');
const ratios = state => get(state, 'system.global.ratio');
const snipping = state => get(state, 'system.global.snipping');
const togglePanel = state => get(state, 'system.global.togglePanel');
const theme = state => get(state, 'theme');
const themestickerList = state => get(state, 'system.themestickerList');
const globalLoading = state => get(state, 'system.global.globalLoading');

const getEnvData = createSelector(env, items => items);
const getTogglePanelData = createSelector(togglePanel, items => items);
const getAutoAddPhotoToCanvas = createSelector(autoAddPhotoToCanvas, items => items);
const getAlertsData = createSelector(alerts, items => items);
const getSidebarData = createSelector(sidebar, items => items);
const getUploadingImages = createSelector(uploading, items => items);
const getUploadingStatus = createSelector(uploadingStatus, items => items);
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
const getXtroModal = createSelector(xtroModal, items => items);
const getHowThisWorksModal = createSelector(howThisWorksModal, items => items);
const getQuickStartModal = createSelector(quickStartModal, items => items);
const getGuideLineModal = createSelector(guideLineModal, items => items);
const getUseSpecModal = createSelector(useSpecModal, items => items);
const getContactUsModal = createSelector(contactUsModal, items => items);
const getShareProjectModal = createSelector(shareProjectModal, items => items);
const getSaveTemplateModal = createSelector(saveTemplateModal, items => items);
const getAlertModal = createSelector(alertModal, items => items);
const getCloneModal = createSelector(cloneModal, items => items);
const getPreviewScreenshot = createSelector(previewScreenshot, items => items);
const getPreviewModal = createSelector(previewModal, items => items);
const getPageLoadingModal = createSelector(pageLoadingModal, items => items);
const getChangeBgColorModal = createSelector(changeBgColorModal, items => items);
const getApprovalPage = createSelector(approvalPage, items => items);
const getFontList = createSelector(fontList, items => items);
const getPrice = createSelector(price, items => items);
const getCoupon = createSelector(coupon, items => items);
const getTemplate = createSelector(template, items => items);
const getStickerList = createSelector(stickerList, items => items);
const getSnipping = createSelector(snipping, items => items);
const getAllPages = createSelector(getProjectData, project => project.pageArray.present);
const getAllImages = createSelector(getProjectData, project => project.imageArray);
// 全局的loading
const getGlobalLoading = createSelector(globalLoading, items => items);
// 获取封面sheet
const getCoverSpread = createSelector(getProjectData, project => project.cover.present);
const getAllContainers = createSelector(getCoverSpread, cover => cover.get('containers'));
// 获取所有decorations
const getAllDecorations = createSelector(allDecorations, decorations => decorations);

const getPagination = createSelector(pagination, getAllPages, (pagination, allPages) => {
  return Map(getRenderPagination(pagination, allPages));
});

const getRatiosData = createSelector(ratios, getPagination, (ratios, pagination) => {
  const cameoPaddings = {
    cameoPaddingTop: 20 / 450,
    cameoPaddingLeft: 20 / 450
  };
  const sheetIndex = pagination.get('sheetIndex');

  const obj = merge({},
    ratios.toJS(),
    cameoPaddings, {
      workspace: sheetIndex === 0 ? ratios.get('coverWorkspace') : ratios.get('innerWorkspace')
    });

  return obj;
});

// 获取所有设置
const getAllSettings = createSelector(getProjectData, (project) => {
  return {
    spec: project.setting.toJS(),
    bookSetting: project.bookSetting.toJS()
  };
});

/**
 * 创建具有可记忆的selector
 */
const getCapabilitiesData = createSelector(capabilities, getAllSettings, (items, allSettings) => {
  const isProfessionalView = !!get(allSettings, 'bookSetting.professionalView');
  const isDesignerMode = !!(items.getIn(['base', 'isDesignerMode']));

  const optionalCap = fromJS({
    isProfessionalView,
    isDesignerMode,
    isAdvancedMode: isProfessionalView || isDesignerMode
  });

  const base = fromJS({}).merge(items.get('base'), optionalCap);
  const bookOptionPages = fromJS({}).merge(items.get('bookOptionPages'), optionalCap);
  const arrangePages = fromJS({}).merge(items.get('arrangePages'), optionalCap);
  const editPages = fromJS({}).merge(items.get('editPages'), optionalCap);
  const navigationPages = fromJS({}).merge(items.get('navigationPages'), optionalCap);

  // preview模式, 一律使用bookrender
  const previewPages = fromJS({}).merge(items.get('previewPages'), {
    isProfessionalView: false,
    isDesignerMode: false,
    isAdvancedMode: false
  });

  return fromJS({
    base,
    bookOptionPages,
    arrangePages,
    editPages,
    navigationPages,
    previewPages
  });
});

// 获取所有cover, inner的渲染效果的素材.
const getAllMaterials = createSelector(materials, materials => materials);

// 获取所有与项目有关系的参数..
const getAllParameters = createSelector(getProjectData, project => project.parameterMap);


// 获取图片使用次数
const getImageUsedMap = createSelector(getProjectData, project => project.imageUsedMap);

// 获取Sticker使用次数
const getStickerUsedMap = createSelector(getProjectData, project => project.stickerUsedMap);

// 获取所有variables
const getAllVariables = createSelector(getProjectData, project => project.variableMap);

const getIsUseUnblockUpload = createSelector(env, (env) => {
  // 两种情况下使用非阻塞上传.
  // 1. userid的尾数为1.
  // 2. querystring中包含: upload=unblock
  // const userId = env.userInfo.get('id');
  // const qs = env.qs;

  // const lastNumber = userId ? userId % 10 : -1;

  // const isMatchedUserId = lastNumbersOfUnblockUploading.findIndex(m => m === lastNumber) !== -1;
  // const isMatchedQS = qs ? qs.get('upload') === 'unblock' : false;

  // return isMatchedUserId || isMatchedQS;
  return false;
});

const getIsUsePhotoGroup = createSelector(env, (env) => {
  // 两种情况下使用photo group.
  // 1. userid的尾数后两位为00-09.
  // 2. querystring中包含: photoGroup=true
  const userId = env.userInfo.get('id');
  const qs = env.qs;

  const isMatchedUserId = userId % 100 < 10;
  const isMatchedQS = qs ? qs.get('photoGroup') === true : false;

  return isMatchedUserId || isMatchedQS;
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
    const spinePage = containers.find(page => page.get('type') === pageTypes.spine);

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

  if (parameters.size) {
    size = parameters.get('spineExpanding').toJS();
  }

  return size;
});

// 获取所有size: spread原始宽高, workspace宽高.
const getSize = createSelector(getProjectData,
  getRatiosData,
  getSpineSize,
  getSpainExpandingSize,
  getAllParameters,
  getAllMaterials,
  (project, ratios, spineSize, spainExpanding, parameters, materials) => {
    const size = getRenderSize(project, ratios, spineSize, spainExpanding, parameters, materials);
    return size;
  });

/**
 * [description]
 * @param  {[type]} getAllPages    [description]
 * @param  {[type]} getPagination  [description]
 * @param  {[type]} (allPages,  pagination [description]
 * @return {[type]}                [description]
 */
const getPaginationSpread = createSelector(getAllContainers, getAllPages, getPagination, getAllSettings,
  (allContainers, allPages, pagination, settings) => {
    const coverType = get(settings, 'spec.cover');
    const productType = get(settings, 'spec.product');
    const totalOfSheets = pagination.get('total');
    const currentSheetIndex = pagination.get('sheetIndex');
    const currentPageIndex = pagination.get('pageIndex');
    const isCover = pagination.get('sheetIndex') === 0;
    let page = allPages.find(page => page.get('id') === pagination.get('pageId'));
    if (!page && allContainers) {
      page = allContainers.find(page => page.get('id') === pagination.get('pageId'));
    }

    const summary = {
      isCover: pagination.get('sheetIndex') === 0,
      isSupportHalfImageInCover: checkIsSupportHalfImageInCover(coverType),
      isHalfPage: productType === productTypes.PS,
      isEnable: checkIsEnablePage(totalOfSheets, currentSheetIndex, currentPageIndex, productType, coverType, isCover),
      isCrystal: (coverType === coverTypes.CC || coverType === coverTypes.GC),
      isMetal: (coverType === coverTypes.MC || coverType === coverTypes.GM)
    };

    return fromJS({ page, summary });
  });

/*
 * 获取翻页后的spreads, 只返回3个spreads:
 * - 如果当前页为第一页: 那么返回1,2,3页
 * - 如果当前页为最后一页: 那么返回倒数3页.
 * - 否则返回当前页, 前一页和后一页.
 * - 如果spreads的总数小于3, 那么返回所有.
 */
const getPaginationSpreadForCover = createSelector(getAllPages,
  getCoverSpread,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getPagination,
  getAllMaterials,
  getProjectData,
  (allPages, coverSpread, allDecorations, allImages, settings, pagination, materials, project) => {
    return getRenderPaginationSpread(allPages, coverSpread, allDecorations, allImages, settings, pagination, materials, project, true);
  });

const getAllSpreads = createSelector(getAllPages,
  getCoverSpread,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getAllMaterials,
  (allPages, coverSpread, allDecorations, allImages, settings, materials) => {
    return getRenderAllSpreads(allPages, coverSpread, allDecorations, allImages, settings, materials);
  });

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getPosition = createSelector(getSize,
  getRatiosData,
  (size, ratios) => {
    return getRenderPosition(size, ratios);
  });


/** ********preview********* */
const getPreviewRatiosData = createSelector(getRatiosData, getPagination, (ratios, pagination) => {
  const sheetIndex = pagination.get('sheetIndex');

  return merge({}, ratios, cameoPaddingsRatio, {
    workspace: sheetIndex === 0 ? ratios.previewCoverWorkspace : ratios.previewInnerWorkspace,
    coverWorkspace: ratios.previewCoverWorkspace,
    innerWorkspace: ratios.previewInnerWorkspace
  });
});

const getPreviewSize = createSelector(project,
  getPreviewRatiosData,
  getSpineSize,
  getSpainExpandingSize,
  getAllParameters,
  getAllMaterials,
  (project, ratios, spineSize, spainExpanding, parameters, materials) => {
    return getRenderSize(project, ratios, spineSize, spainExpanding, parameters, materials);
  });

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getPreviewPosition = createSelector(getPreviewSize,
  getRatiosData,
  (size, ratios) => {
    return getRenderPosition(size, ratios);
  });

/** ********end preview********* */


/** ********order page********* */
const getOrderRatiosData = createSelector(getRatiosData, getPagination, (ratios, pagination) => {
  const sheetIndex = pagination.get('sheetIndex');

  return merge({}, ratios, cameoPaddingsRatio, {
    workspace: sheetIndex === 0 ? ratios.orderCoverWorkspace : ratios.orderInnerWorkspace,
    coverWorkspace: ratios.orderCoverWorkspace,
    innerWorkspace: ratios.orderInnerWorkspace
  });
});

const getOrderSize = createSelector(project,
  getOrderRatiosData,
  getSpineSize,
  getSpainExpandingSize,
  getAllParameters,
  getAllMaterials,
  (project, ratios, spineSize, spainExpanding, parameters, materials) => {
    return getRenderSize(project, ratios, spineSize, spainExpanding, parameters, materials);
  });

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getOrderPosition = createSelector(getOrderSize,
  getRatiosData,
  (size, ratios) => {
    return getRenderPosition(size, ratios);
  });
/** ********end order page********* */


/* ----------------parent book---------------------*/
const getParentBook = createSelector(getAllSettings, getEnvData, (settings, env) => {
  const productType = get(settings, 'spec.product');
  const coverType = get(settings, 'spec.cover');
  const productSize = get(settings, 'spec.size');

  const isParentBook = env.qs.get('isParentBook');
  const { isSupportParentBook, isSupportEditParentBook } = checkParentBook(productType, productSize, coverType);

  const isEditParentBook = isParentBook && isSupportParentBook && isSupportEditParentBook;

  return {
    isEditParentBook
  };
});

/* ----------------start 内页包边--------------------*/
const getCoverSpreadForInnerWrap = createSelector(getAllPages,
  getCoverSpread,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getPagination,
  getAllMaterials,
  getProjectData,
  (allPages, coverSpread, allDecorations, allImages, settings, pagination, materials, project) => {
    const coverSpreadData = getRenderPaginationSpread(allPages, coverSpread, allDecorations, allImages, settings, pagination, materials, project, true);

    // 在bookpage上, 调用css的transform: scale(-1,1), 实现水平翻转的效果.
    // 2. 图片水平镜像 + 图片翻转
    // const newCoverSpreadData = flipImgElements(coverSpreadData);

    return coverSpreadData;
  });
/* ----------------end 内页包边---------------------*/

const getThemes = createSelector(theme,
  getEnvData,
  (data, env) => {
    let themes = data.themes;
    const uploadBaseUrl = get(env, 'urls').get('calendarBaseUrl');
    themes.forEach((theme, themeIndex) => {
      const imageJson = theme.get('picJsonStr');
      const size = theme.getIn(['imageSize', 2]);
      const themeId = theme.get('guid');
      let screenshots = fromJS([]);
      if (imageJson) {
        imageJson.forEach((index) => {
          screenshots = screenshots.push(lodash.template(apiUrl.THEME_SRC)({
            uploadBaseUrl,
            themeId,
            size,
            index
          }));
        });
        themes = themes.setIn([themeIndex, 'screenshots'], screenshots);
        themes = themes.setIn([themeIndex, 'coverScreenshot'], screenshots.get(0));
      }
    });
    return themes;
  });

const getThemeSummary = createSelector(theme, (data) => {
  return data.summary;
});

const getBackgrounds = createSelector(theme, getPagination, getAllSettings, getPaginationSpread, (data, pagination, settings, paginationSpread) => {
  const sheetIndex = pagination.get('sheetIndex');
  if (sheetIndex === 0) {
    const coverType = get(settings, 'spec.cover');
    if (coverType && checkIsSupportImageInCover(coverType)) {
      if (checkIsSupportFullImageInCover(coverType)) {
        return data.backgrounds.filter((background) => {
          return background.get('isCover') && background.get('isSpread');
        });
      } else if (checkIsSupportHalfImageInCover(coverType)) {
        return data.backgrounds.filter((background) => {
          return background.get('isCover') && !background.get('isSpread');
        });
      }
    }
  } else {
    const isHalfPage = paginationSpread.getIn(['summary', 'isHalfPage']);
    if (isHalfPage) {
      return data.backgrounds.filter((background) => {
        return !background.get('isCover') && !background.get('isSpread');
      });
    }
    return data.backgrounds.filter((background) => {
      return !background.get('isCover') && background.get('isSpread');
    });
  }
  return fromJS([]);
});

const getCurrentTheme = createSelector(getThemes, getProjectData, getThemeSummary, getCapabilitiesData, (themes, project, themeSummary, capabilities) => {
  const applyBookThemeId = get(project, 'property').get('applyBookThemeId');
  const currentThemeType = themeSummary.get('currentThemeType');
  const isUseDefaultTheme = capabilities.getIn(['base', 'isUseDefaultTheme']);
  if (applyBookThemeId) {
    const currentTheme = themes.find((theme) => {
      return theme.get('guid') === applyBookThemeId;
    });

    const themeCode = currentTheme ? (currentTheme.get('parentThemeCode') || currentTheme.get('typeCode')) : '';
    if (currentTheme && (currentThemeType === String(themeCode))) {
      return currentTheme;
    }

    if (isUseDefaultTheme) {
      return themes.find((theme) => {
        return theme.get('isDefault');
      });
    }
  }
  if (isUseDefaultTheme) {
    return themes.find((theme) => {
      return theme.get('isDefault');
    });
  }

  return null;
});

const getBookThemeStatus = createSelector(theme, getEnvData, getAllSettings, (data, env, allSettings) => {
  let opened = false;

  // 1.显示booktheme相关选项.
  //  - 设计师
  // 2. 显示booktheme相关选项, 有条件
  // - 后台开关打开, 并且该产品在bookthemeWhiteList中已配置.
  // - url上包含themeOpened, 值为true, 并且该产品在bookthemeWhiteList中已配置.
  if (env.qs.get('source') === 'designer') {
    opened = true;
  } else {
    // 获取产品类型.
    const product = get(allSettings, 'spec.product');
    const isInWhiteList = !!(bookthemeWhiteList.find(m => m === product));

    if (isInWhiteList) {
      opened = !!(data.showTheme) || !!(env.qs.get('themeOpened'));
    }
  }

  return opened;
});

const checkHasAddedElements = createSelector(getProjectData, (project) => {
  const cover = get(project, 'cover.present');
  const pageArray = get(project, 'pageArray.present');
  const setting = get(project, 'setting');

  let hasAddedElements = false;

  // 检查cover上是否新增了元素
  const cotainers = cover.get('containers');
  cotainers && cotainers.forEach((container) => {
    const elements = container.get('elements');
    if (elements.size > 1) {
      hasAddedElements = true;
      return false;
    } else if (elements.size) {
      const element = elements.get(0);
      // pressbook部分cover自带天窗
      if (element.get('type') === elementTypes.cameo &&
          !element.get('encImgId') &&
          setting.get('product') === productTypes.PS &&
          [coverTypes.PSNC, coverTypes.PSLC].indexOf(setting.get('cover')) >= 0) {
        // keep space
        hasAddedElements = false;
      } else {
        hasAddedElements = true;
        return false;
      }
    }
  });

  // 检查内页是否新增了元素
  if (!hasAddedElements) {
    pageArray && pageArray.forEach((page) => {
      if (page.get('elements').size) {
        hasAddedElements = true;
        return false;
      }
    });
  }

  return hasAddedElements;
});

const getCurrentTemplateList = createSelector(getTemplate, getPagination, (template, pagination) => {
  const isCover = pagination.get('sheetIndex') === 0;

  const cover = get(template, 'list.cover');
  const inner = get(template, 'list.inner');

  let list = [];
  if (isCover) {
    list = cover;
  } else {
    list = inner;
  }
  return merge({}, template, {
    list,
    inner,
    cover
  });
});

// themes categories.
const getThemesCategories = createSelector(theme, data => data.categories);
const getThemeOverlayModal = createSelector(themeOverlayModal, data => data);
const getThemestickerList = createSelector(themestickerList, data => data);

/* ----------------end parent book---------------------*/

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  autoAddPhotoToCanvas: getAutoAddPhotoToCanvas(state),
  env: getEnvData(state),
  alerts: getAlertsData(state),
  sidebar: getSidebarData(state),
  uploadingImages: getUploadingImages(state),
  uploadStatus: getUploadingStatus(state),
  uploadedImages: getUploadedImages(state),
  upload: getUploadShow(state),
  isUseUnblockUpload: getIsUseUnblockUpload(state),
  isUsePhotoGroup: getIsUsePhotoGroup(state),
  spec: getSpecData(state),
  bookSettingsModal: getBookSettingsModal(state),
  paintedTextModal: getPaintedTextModal(state),
  imageEditModal: getImageEditModal(state),
  textEditModal: getTextEditModal(state),
  propertyModal: getPropertyModal(state),
  confirmModal: getConfirmModal(state),
  xtroModal: getXtroModal(state),
  howThisWorksModal: getHowThisWorksModal(state),
  quickStartModal: getQuickStartModal(state),
  useSpecModal:getUseSpecModal(state),
  guideLineModal: getGuideLineModal(state),
  contactUsModal: getContactUsModal(state),
  shareProjectModal: getShareProjectModal(state),
  saveTemplateModal: getSaveTemplateModal(state),
  alertModal: getAlertModal(state),
  cloneModal: getCloneModal(state),
  previewScreenshot: getPreviewScreenshot(state),
  previewModal: getPreviewModal(state),
  pageLoadingModal: getPageLoadingModal(state),
  changeBgColorModal: getChangeBgColorModal(state),
  approvalPage: getApprovalPage(state),
  fontList: getFontList(state),
  price: getPrice(state),
  coupon: getCoupon(state),
  template: getCurrentTemplateList(state),
  stickerList: getStickerList(state),
  size: getSize(state),
  materials: getAllMaterials(state),
  pagination: getPagination(state),
  paginationSpread: getPaginationSpread(state),
  paginationSpreadForCover: getPaginationSpreadForCover(state),
  allImages: getAllImages(state),
  ratio: getRatiosData(state),
  capabilities: getCapabilitiesData(state),

  snipping: getSnipping(state),
  togglePanel: getTogglePanelData(state),
  allSheets: getAllSpreads(state),
  allContainers: getAllContainers(state),

  project: getProjectData(state),
  settings: getAllSettings(state),
  imageUsedMap: getImageUsedMap(state),
  stickerUsedMap: getStickerUsedMap(state),
  variables: getAllVariables(state),
  parameters: getAllParameters(state),
  // preview
  previewRatios: getPreviewRatiosData(state),
  previewSize: getPreviewSize(state),
  previewPosition: getPreviewPosition(state),

  // 封面的数据, 用于渲染内页包边.
  coverSpreadForInnerWrap: getCoverSpreadForInnerWrap(state),

  position: getPosition(state),

  // order
  orderRatios: getOrderRatiosData(state),
  orderSize: getOrderSize(state),
  orderPosition: getOrderPosition(state),

  // parent book
  parentBook: getParentBook(state),

   // themes
  themesCategories: getThemesCategories(state),
  themestickerList: getThemestickerList(state),
  themeOverlayModal: getThemeOverlayModal(state),

  themes: getThemes(state),
  backgrounds: getBackgrounds(state),
  currentTheme: getCurrentTheme(state),
  themeSummary: getThemeSummary(state),
  globalLoading: getGlobalLoading(state),
  isBookthemeOpen: getBookThemeStatus(state),
  hasAddedElements: checkHasAddedElements(state)
});
