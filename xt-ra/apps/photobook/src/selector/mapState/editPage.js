import { get, merge, forIn, set } from 'lodash';
import { createSelector } from 'reselect';
import Immutable, { fromJS } from 'immutable';
import {
  spreadTypes,
  elementTypes,
  pageTypes,
  productTypes,
  coverTypes,
  cameoPaddingsRatio,
  smallViewHeightInNavPages,
  arrangePageRules,
  smallViewWidthInArrangePages
} from '../../contants/strings';

import {
  getRenderSize,
  getRenderPosition,
  getRenderPagination,
  getRenderPaginationSpread,
  computedRatioForSpecialView,
  computedSizeForSpecialView,
  getRenderAllSpreads,
  checkParentBook,
  flipImgElements,
  getArrangePageViewSize
} from '../../utils/sizeCalculator';

// 用于测试
const undoData = state => get(state, 'test.undoData');

// 用于项目中
const env = state => get(state, 'system.env');
const clipboard = state => get(state, 'system.clipboard');
const capabilities = state => get(state, 'system.capabilities');
const project = state => get(state, 'project.data');
const spec = state => get(state, 'spec.data');
const allDecorations = state => get(state, 'project.decorationArray');
const ratios = state => get(state, 'system.global.ratio');
const pagination = state => get(state, 'system.global.pagination');
const materials = state => get(state, 'system.global.material');
const template = state => get(state, 'system.template');
const snipping = state => get(state, 'system.global.snipping');
const specVersion = state => get(state, 'spec.data.version');
const togglePanel = state => get(state, 'system.global.togglePanel');
const uploadingStatus = state => get(state, 'system.images.status');
const modals = state => get(state, 'system.modals');

// undo/redo
const pastPageArray = state => get(state, 'project.data.pageArray.past');
const futurePageArray = state => get(state, 'project.data.pageArray.future');
const pastCover = state => get(state, 'project.data.cover.past');
const futureCover = state => get(state, 'project.data.cover.future');
const inUndoPageArray = state => get(state, 'project.data.pageArray.inUndo');
const inUndoCover = state => get(state, 'project.data.cover.inUndo');

const themes = state => get(state, 'themes');

const fontList = state => get(state, 'system.fontList');
const uploadedImages = (state) => {
  return get(state, 'project.data.imageArray').toJS();
};

/* -----------private function----------------*/

const getImagePaddingRatio = (materials) => {
  const ratio = {
    cover: {
      top: 0,
      left: 0
    },
    inner: {
      top: 0,
      left: 0
    }
  };

  const data = materials.toJS();

  const coverImageSize = get(data, 'cover.size');
  const innerImageSize = get(data, 'inner.size');

  if (coverImageSize && coverImageSize.width) {
    ratio.cover = {
      top:
        (coverImageSize.height - coverImageSize.innerHeight) /
        2 /
        coverImageSize.height,
      left:
        (coverImageSize.width - coverImageSize.innerWidth) /
        2 /
        coverImageSize.width
    };
  }

  if (innerImageSize && innerImageSize.width) {
    ratio.inner = {
      top:
        (innerImageSize.height - innerImageSize.innerHeight) /
        2 /
        innerImageSize.height,
      left:
        (innerImageSize.width - innerImageSize.innerWidth) /
        2 /
        innerImageSize.width
    };
  }

  return ratio;
};

/*-------------------------------------------*/

/* ---------------------selector functions-----------------------------------*/
/**
 * 创建具有可记忆的selector
 */
const getUndoData = createSelector(
  pastPageArray,
  futurePageArray,
  inUndoPageArray,
  pastCover,
  futureCover,
  inUndoCover,
  (
    pastPageArray,
    futurePageArray,
    inUndoPageArray,
    pastCover,
    futureCover,
    inUndoCover
  ) => {
    return {
      pastCount: pastPageArray.length || pastCover.length,
      futureCount: futurePageArray.length || futureCover.length,
      inUndo: inUndoPageArray || inUndoCover
    };
  }
);
const getEnvData = createSelector(env, items => items);
const getClipboardData = createSelector(clipboard, items => items);
const getTogglePanelData = createSelector(togglePanel, items => items);
const getRatiosData = createSelector(ratios, (items) => {
  const obj = merge({}, items.toJS(), cameoPaddingsRatio);

  return obj;
});
const getProjectData = createSelector(project, project => project);
const getSpecData = createSelector(spec, items => items);
const getUploadingStatus = createSelector(uploadingStatus, items => items);

// 获取所有size: spread原始宽高, workspace宽高.
const getUrls = createSelector(getEnvData, (env) => {
  return get(env, 'urls').toJS();
});

// 获取所有spreads
const getAllPages = createSelector(
  getProjectData,
  project => project.pageArray.present
);

// 获取翻页相关的信息.
const getPagination = createSelector(
  pagination,
  getAllPages,
  (pagination, allPages) => {
    return getRenderPagination(pagination, allPages);
  }
);

// 获取所有decorations
const getAllDecorations = createSelector(
  allDecorations,
  decorations => decorations
);

// 获取所有images
const getAllImages = createSelector(
  getProjectData,
  project => project.imageArray
);

// 获取所有cover, inner的渲染效果的素材.
const getAllMaterials = createSelector(materials, materials => materials);

// 获取所有与项目有关系的参数..
const getAllParameters = createSelector(
  getProjectData,
  project => project.parameterMap
);

// 获取封面sheet
const getCoverSpread = createSelector(
  getProjectData,
  project => project.cover.present
);

// 获取所有variables
const getAllVariables = createSelector(
  getProjectData,
  project => project.variableMap
);

const getTemplate = createSelector(template, items => items);

const getSnipping = createSelector(snipping, items => items);

const getSpecVersion = createSelector(specVersion, items => items);

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

  if (parameters.size) {
    size = parameters.get('spineExpanding').toJS();
  }

  return size;
});

// 获取所有设置
const getAllSettings = createSelector(getProjectData, (project) => {
  return {
    spec: project.setting.toJS(),
    bookSetting: project.bookSetting.toJS()
  };
});

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

// 获取所有size: spread原始宽高, workspace宽高.
const getSize = createSelector(
  project,
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

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getPosition = createSelector(getSize, getRatiosData, (size, ratios) => {
  return getRenderPosition(size, ratios);
});

/*
 * 获取翻页后的spreads, 只返回3个spreads:
 * - 如果当前页为第一页: 那么返回1,2,3页
 * - 如果当前页为最后一页: 那么返回倒数3页.
 * - 否则返回当前页, 前一页和后一页.
 * - 如果spreads的总数小于3, 那么返回所有.
 */
const getPaginationSpread = createSelector(
  getAllPages,
  getCoverSpread,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getPagination,
  getAllMaterials,
  getProjectData,
  (
    allPages,
    coverSpread,
    allDecorations,
    allImages,
    settings,
    pagination,
    materials,
    project
  ) => {
    return getRenderPaginationSpread(
      allPages,
      coverSpread,
      allDecorations,
      allImages,
      settings,
      pagination,
      materials,
      project
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
  getPagination,
  getAllMaterials,
  getProjectData,
  (
    allPages,
    coverSpread,
    allDecorations,
    allImages,
    settings,
    pagination,
    materials,
    project
  ) => {
    return getRenderPaginationSpread(
      allPages,
      coverSpread,
      allDecorations,
      allImages,
      settings,
      pagination,
      materials,
      project,
      true
    );
  }
);

/**
 * 创建bookoptions页面所需要的数据.
 */
const getBookOptions = createSelector(
  getUrls,
  getSize,
  getRatiosData,
  getPosition,
  getAllMaterials,
  getAllVariables,
  getPagination,
  getPaginationSpreadForCover,
  getAllSettings,
  (
    urls,
    size,
    ratios,
    position,
    materials,
    variables,
    pagination,
    paginationSpread,
    settings
  ) => {
    return Immutable.fromJS({
      isPreview: true,
      urls,
      size,
      ratios,
      position: position.cover,
      materials,
      variables,
      pagination,
      paginationSpread,
      settings
    });
  }
);

const getArrangePagesSize = createSelector(
  getSize,
  getRatiosData,
  getAllParameters,
  (size, ratios, parameters) => {
    const obj = computedSizeForSpecialView(
      size,
      ratios,
      parameters,
      getArrangePageViewSize().width
      // smallViewWidthInArrangePages
    );

    return obj;
  }
);

/*
 * 获取翻页后的spreads, 只返回3个spreads:
 * - 如果当前页为第一页: 那么返回1,2,3页
 * - 如果当前页为最后一页: 那么返回倒数3页.
 * - 否则返回当前页, 前一页和后一页.
 * - 如果spreads的总数小于3, 那么返回所有.
 */
const getAllSpreads = createSelector(
  getAllPages,
  getCoverSpread,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getAllMaterials,
  (allPages, coverSpread, allDecorations, allImages, settings, materials) => {
    return getRenderAllSpreads(
      allPages,
      coverSpread,
      allDecorations,
      allImages,
      settings,
      materials
    );
  }
);

const getArrangePagesRatios = createSelector(
  getSize,
  getRatiosData,
  (size, ratios) => {
    return computedRatioForSpecialView(
      size,
      ratios,
      getArrangePageViewSize().width
      // smallViewWidthInArrangePages
    );
  }
);

// 计算渲染效果和sheet相对于workspace时, 白边需要调整的距离.
const getArrangePagesPosition = createSelector(
  getArrangePagesSize,
  getArrangePagesRatios,
  (size, ratios) => {
    return getRenderPosition(size, ratios);
  }
);

/* nav pages */
const getNavPagesRatios = createSelector(
  getSize,
  getRatiosData,
  (size, ratios) => {
    return computedRatioForSpecialView(
      size,
      ratios,
      smallViewHeightInNavPages,
      false
    );
  }
);

const getNavPagesSize = createSelector(
  getSize,
  getRatiosData,
  getAllParameters,
  (size, ratios, parameters) => {
    const obj = computedSizeForSpecialView(
      size,
      ratios,
      parameters,
      smallViewHeightInNavPages,
      false
    );

    return obj;
  }
);

const getNavPagesPosition = createSelector(
  getNavPagesSize,
  getNavPagesRatios,
  (size, ratios) => {
    return getRenderPosition(size, ratios);
  }
);
/* ---------------------end selector-----------------------------------*/

/* ----------------parent book---------------------*/
const getParentBook = createSelector(
  getAllSettings,
  getProjectData,
  (settings, project) => {
    const productType = get(settings, 'spec.product');
    const coverType = get(settings, 'spec.cover');
    const productSize = get(settings, 'spec.size');

    const property = project.property;
    const isParentBook = property.get('isParentBook');
    const { isSupportParentBook, isSupportEditParentBook } = checkParentBook(
      productType,
      productSize,
      coverType
    );

    const isEditParentBook =
      isParentBook && isSupportParentBook && isSupportEditParentBook;

    return {
      isEditParentBook
    };
  }
);

const getCurrentTemplateList = createSelector(getTemplate, getPagination, (template, pagination) => {
  const isCover = pagination.sheetIndex === 0;

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

/* ----------------end parent book---------------------*/

/* ----------------start 内页包边--------------------*/
const getCoverSpreadForInnerWrap = createSelector(
  getAllPages,
  getCoverSpread,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getPagination,
  getAllMaterials,
  getProjectData,
  (
    allPages,
    coverSpread,
    allDecorations,
    allImages,
    settings,
    pagination,
    materials,
    project
  ) => {
    const newCoverSpreadData = getRenderPaginationSpread(
      allPages,
      coverSpread,
      allDecorations,
      allImages,
      settings,
      pagination,
      materials,
      project,
      true
    );

    // 在bookpage上, 调用css的transform: scale(-1,1), 实现水平翻转的效果.
    // 2. 图片水平镜像 + 图片翻转
    // newCoverSpreadData = flipImgElements(newCoverSpreadData);
    return newCoverSpreadData;
  }
);
/* ----------------end 内页包边---------------------*/

const getFontList = createSelector(fontList, items => items);
const getUploadedImages = createSelector(uploadedImages, items => items);

const getBackgroundArray = createSelector(
  project,
  data => data.backgroundArray
);
const getStickerArray = createSelector(project, data => data.stickerArray);

/*
  是否要禁用从电脑中拖拽图片到app中上传.
 */
const getIsDisableDragExternalFiles = createSelector(modals, (data) => {
  let isDisable = false;

  // 以下情况需要禁用.
  // 1. 预览打开时
  // 2. approval modal打开时.
  if (data.approvalPage.get('isShown') || data.previewModal.get('isShown')) {
    isDisable = true;
  }

  return isDisable;
});

const getIsUseFastCrop = createSelector(env, (env) => {
  // 两种情况下使用photo group.
  // 1. userid的尾数后两位为00-09.
  // 2. querystring中包含: photoGroup=true
  const userId = env.userInfo.get('id');
  const qs = env.qs;

  // 将现在CustomerId尾号从20-29变为20-49，即进行30%的测试
  const isMatchedUserId = userId % 100 >= 20 && userId % 100 <= 49;
  const isMatchedQS = qs ? qs.get('fastCrop') === true : false;

  return isMatchedUserId || isMatchedQS;
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

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  // 用于项目中
  env: getEnvData(state),
  urls: getUrls(state),
  ratios: getRatiosData(state),
  project: getProjectData(state),
  allDecorations: getAllDecorations(state),
  allImages: getAllImages(state),
  settings: getAllSettings(state),
  template: getCurrentTemplateList(state),
  snipping: getSnipping(state),
  spec: getSpecData(state),
  specVersion: getSpecVersion(state),
  togglePanel: getTogglePanelData(state),
  capabilities: getCapabilitiesData(state),
  clipboardData: getClipboardData(state),

  // undo/redo
  undoData: getUndoData(state),

  // cover, inner的渲染效果的素材.
  materials: getAllMaterials(state),
  size: getSize(state),
  position: getPosition(state),
  variables: getAllVariables(state),
  parameters: getAllParameters(state),
  pagination: getPagination(state),
  paginationSpread: getPaginationSpread(state),
  paginationSpreadForCover: getPaginationSpreadForCover(state),
  bookOptionsData: getBookOptions(state),
  isDisableDragExternalFiles: getIsDisableDragExternalFiles(state),
  hasAddedElements: checkHasAddedElements(state),

  // 封面的数据, 用于渲染内页包边.
  coverSpreadForInnerWrap: getCoverSpreadForInnerWrap(state),

  // arrange pages
  arrangePagesRatios: getArrangePagesRatios(state),
  arrangePagesSize: getArrangePagesSize(state),
  arrangePagesPosition: getArrangePagesPosition(state),
  allSheets: getAllSpreads(state),

  // 底部导航pages.
  navPagesRatios: getNavPagesRatios(state),
  navPagesSize: getNavPagesSize(state),
  navPagesPosition: getNavPagesPosition(state),

  // parent book
  parentBook: getParentBook(state),
  fontList: getFontList(state),
  uploadedImages: getUploadedImages(state),

  backgroundArray: getBackgroundArray(state),
  StickerArray: getStickerArray(state),

  uploadStatus: getUploadingStatus(state),
  isUseFastCrop: getIsUseFastCrop(state)
});
