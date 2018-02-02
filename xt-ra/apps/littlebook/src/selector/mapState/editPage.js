import { get, merge, forIn } from 'lodash';
import { createSelector } from 'reselect';
import Immutable, { fromJS } from 'immutable';
import {
  layoutSheetType,
  pageTypes,
  cameoPaddingsRatio,
  smallViewHeightInNavPages
} from '../../contants/strings';
import {
  getRenderSize,
  getRenderPosition,
  getRenderPagination,
  getRenderPaginationSpread,
  computedRatioForSpecialView,
  computedSizeForSpecialView,
  getRenderAllSpreads,
  checkIsImageCover,
  checkParentBook,
  isSupportSaveProject,
  computedTemplate,
  getArrangePageViewSize
} from '../../utils/sizeCalculator';

// 用于测试
const undoData = state => get(state, 'test.undoData');

// 用于项目中
const capabilities = state => get(state, 'system.capabilities');
const env = state => get(state, 'system.env');
const project = state => get(state, 'project.data.present');
const system = state => get(state, 'system');
const allDecorations = state => get(state, 'project.decorationArray');
const ratios = state => get(state, 'system.global.ratio');
const pagination = state => get(state, 'system.global.pagination');
const materials = state => get(state, 'system.global.material');
const snipping = state => get(state, 'system.global.snipping');
const specVersion = state => get(state, 'spec.data.version');
const togglePanel = state => get(state, 'system.global.togglePanel');
const modals = state => get(state, 'system.modals');

// undo/redo
const past = state => get(state, 'project.data.past');
const future = state => get(state, 'project.data.future');
const inUndo = state => get(state, 'project.data.inUndo');
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
  past,
  future,
  inUndo,
  (past, future, inUndo) => {
    return {
      pastCount: past ? past.length : 0,
      futureCount: future ? future.length : 0,
      inUndo
    };
  }
);

const getEnvData = createSelector(env, items => items);
const getCoverElements = createSelector(system, items => items.coverElements);
const getTogglePanelData = createSelector(togglePanel, items => items);
const getRatiosData = createSelector(ratios, (items) => {
  const obj = merge({}, items.toJS(), cameoPaddingsRatio);

  return obj;
});
const getProjectData = createSelector(project, project => project);

// 获取所有size: spread原始宽高, workspace宽高.
const getUrls = createSelector(getEnvData, (env) => {
  return get(env, 'urls').toJS();
});

// 获取所有spreads
const getAllPages = createSelector(getProjectData, project =>
  project.get('pageArray')
);

// 获取翻页相关的信息.
const getPagination = createSelector(
  pagination,
  getAllPages,
  (pagination, allPages) => {
    return getRenderPagination(pagination, allPages);
  }
);

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

const checkIsSupportSaveProject = createSelector(project, (project) => {
  return isSupportSaveProject(project.get('orderStatus'));
});

// 获取所有elements
const getAllElements = createSelector(getProjectData, project =>
  project.get('elementArray')
);

const getAllTemplates = createSelector(system, (system) => {
  return get(system, 'template.list');
});

const getTemplateDetails = createSelector(system, (system) => {
  return get(system, 'template.details');
});

// 获取所有decorations
const getAllDecorations = createSelector(
  allDecorations,
  decorations => decorations
);

// 获取所有images
const getAllImages = createSelector(getProjectData, project =>
  project.get('imageArray')
);

// 获取所有cover, inner的渲染效果的素材.
const getAllMaterials = createSelector(materials, materials => materials);

// 获取所有与项目有关系的参数..
const getAllParameters = createSelector(getProjectData, project =>
  project.get('parameterMap')
);

// 获取封面sheet
const getCoverSpread = createSelector(getProjectData, project =>
  project.get('cover')
);

// 获取所有variables
const getAllVariables = createSelector(getProjectData, project =>
  project.get('variableMap')
);

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

  if (parameters) {
    size = parameters.get('spineExpanding').toJS();
  }

  return size;
});

// 获取所有设置
const getAllSettings = createSelector(getProjectData, (project) => {
  const uiSetting = project.getIn(['uiSetting', 'templateStrip']);
  return {
    spec: project.get('setting').toJS(),
    uiSetting: uiSetting ? uiSetting.toJS() : {},
    bookSetting: project.get('bookSetting').toJS()
  };
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
  getAllElements,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getPagination,
  getAllMaterials,
  (
    allPages,
    coverSpread,
    allElements,
    allDecorations,
    allImages,
    settings,
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
  getAllElements,
  getAllDecorations,
  getAllImages,
  getAllSettings,
  getPagination,
  getAllMaterials,
  (
    allPages,
    coverSpread,
    allElements,
    allDecorations,
    allImages,
    settings,
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

const getArrangePagesRatios = createSelector(
  getSize,
  getRatiosData,
  (size, ratios) => {
    return computedRatioForSpecialView(
      size,
      ratios,
      getArrangePageViewSize().width
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

/* nav pages*/
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

const getTemplate = createSelector(
  getAllPages,
  getAllElements,
  getAllImages,
  getAllTemplates,
  getPagination,
  getTemplateDetails,
  getAllSettings,
  (allPages, allElements, allImages, templates, pagination, details, allSetting) => {
    return computedTemplate(allPages, allElements, allImages, templates, pagination, details, allSetting);
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
    return computedTemplate(allPages, allElements, allImages, templates, {
      sheetIndex: 0
    }, details, allSetting);
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

// 判断当前的封面是image cover还是text cover.
const isImageCover = createSelector(getPaginationSpreadForCover, (cover) => {
  return checkIsImageCover(cover);
});
/* ---------------------end selector-----------------------------------*/
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

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  // 用于项目中
  env: getEnvData(state),
  urls: getUrls(state),
  ratios: getRatiosData(state),
  project: getProjectData(state),
  allElements: getAllElements(state),
  allDecorations: getAllDecorations(state),
  allImages: getAllImages(state),
  settings: getAllSettings(state),
  template: getTemplate(state),
  templateObjectForInner: getTemplateForInner(state),
  templateObjectForCover: getTemplateForCover(state),
  snipping: getSnipping(state),
  specVersion: getSpecVersion(state),
  togglePanel: getTogglePanelData(state),
  capabilities: getCapabilitiesData(state),
  capability: getCapabilityData(state),
  coverElements: getCoverElements(state),

  // orderstatus
  isSupportSaveProject: checkIsSupportSaveProject(state),
  isDisableDragExternalFiles: getIsDisableDragExternalFiles(state),

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
  isImageCover: isImageCover(state),

  // 底部导航pages.
  navPagesRatios: getNavPagesRatios(state),
  navPagesSize: getNavPagesSize(state),
  navPagesPosition: getNavPagesPosition(state),

  // arrange pages
  arrangePagesRatios: getArrangePagesRatios(state),
  arrangePagesSize: getArrangePagesSize(state),
  arrangePagesPosition: getArrangePagesPosition(state),
  allSheets: getAllSpreads(state)
});
