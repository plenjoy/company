import X2JS from 'x2js';
import { merge, forEach, get } from 'lodash';

import { guid } from '../../common/utils/math';
import { formatDateTime } from '../../common/utils/dateFormat';
import {
  getInnerPageSize,
  getCoverSheetSize,
  getFrontCoverSize,
  getBackCoverSize,
  getCoverBackgroundSize,
  getInnerBackgroundSize
} from './sizeCalculator';

import {
  checkIsHalfPageInCover,
  checkIsSupportImageInCover
} from '../utils/cover';

import { elementTypes, cameoDirectionTypes, pageTypes, panelTypes,VERSION } from '../contants/strings';

const needRemoveElementKeyArray = ['src', 'encImgId'];

export const generateSpread = (type, parameterMap, pageNumber) => {
  let outObj = {
    id: guid(),
    w: parameterMap.baseSize.width,
    h: parameterMap.baseSize.height,
    bleedTop: parameterMap.bleedSize.top,
    bleedBottom: parameterMap.bleedSize.bottom,
    bleedLeft: parameterMap.bleedSize.left,
    bleedRight: parameterMap.bleedSize.right,
    spineThicknessWidth: parameterMap.spineThickness,
    wrapSize: parameterMap.wrapSize.left,
    elements: [],
    type,
    pageNumber
  };

  if (type === 'innerPage') {
    outObj = merge({}, outObj, {
      w: parameterMap.innerBaseSize.width,
      h: parameterMap.innerBaseSize.height,
      wrapSize: parameterMap.innerWrapSize.left
    });
  }

  return outObj;
};

export const generateSpreadArray = (imageBoxType, parameterMap) => {
  const spreadArray = [];
  switch (imageBoxType) {
    case panelTypes.blackPanel:
    case panelTypes.blackLeatherette:
      spreadArray.push(generateSpread('coverPage', parameterMap, 0));
      break;
    case panelTypes.imagePanel:
    case panelTypes.imageWrapped: {
      const coverPage = generateSpread('coverPage', parameterMap, 0);
      const innerPage = generateSpread('innerPage', parameterMap, 1);

      spreadArray.push(coverPage);
      spreadArray.push(innerPage);

      break;
    }
    default:
  }

  return spreadArray;
};

const convertProjectSetting = (setting) => {
  const outArray = [];
  forEach(setting, (v, k) => {
    if (k !== 'title') {
      outArray.push({
        _id: (k === 'spineThickness' ? 'thickness' : k),
        _value: v
      });
    }
  });
  return outArray;
};

const convertElementArray = (elementArray, filterKeyArray) => {
  const xmlTextKey = '__text';
  const outArray = [];
  elementArray.forEach((element) => {
    const outObj = {};
    forEach(element, (value, key) => {
      if (key === 'text') {
        outObj[xmlTextKey] = value;
      } else if (filterKeyArray.indexOf(key) === -1) {
        outObj[`_${key}`] = value;
      }
    });
    outArray.push(outObj);
  });
  return outArray;
};

const convertSpreadArray = (spreadArray, filterElementKeyArray) => {
  const outArray = [];
  spreadArray.forEach((spread) => {
    const outObj = {};
    forEach(spread, (value, key) => {
      if (key === 'elements') {
        const elementArray = convertElementArray(value, filterElementKeyArray);
        if (elementArray.length) {
          outObj.elements = {
            element: elementArray
          };
        }
      } else {
        outObj[`_${key}`] = value;
      }
    });
    outArray.push(outObj);
  });
  return outArray;
};

function generateContainer(
  type, width, height, bleed, wrapSize,  isPrint = false, rotate = false, spineExpanding) {
  return {
    id: guid(),
    width,
    height,
    bleed,
    type,
    wrapSize,
    rotate,
    elements: [],
    spineExpanding,
    backend: {
      isPrint
    }
  };
}


/**
 * 生成产品cover封面的参数
 * @param {*} cover
 * @param {*} parameterMap
 * @param {*} variableMap
 */
export const generateCover = (setting, parameterMap, variableMap, isRotate = false) => {
  if (!parameterMap) return {};

  const {
    baseSize,
    bleedSize,
    wrapSize,
    spineSize,
    spineExpanding
  } = parameterMap;

  const isSingleCover = setting.product === 'woodBox';

  const coverSheetSize = getCoverSheetSize(
    baseSize, bleedSize, wrapSize, spineSize, isSingleCover, spineExpanding, isRotate
  );

  const coverAsset = variableMap.coverAsset;

  const backgroundSize = getCoverBackgroundSize(variableMap.cover, coverSheetSize, isRotate);

  const realSpineWidth = spineSize;
  const realSpineHeight = baseSize.height + get(wrapSize, 'top') + get(wrapSize, 'bottom');

  const isHalfPageInCover = checkIsHalfPageInCover(setting.cover);

  const isSupportImageInCover = checkIsSupportImageInCover(setting.cover);

  const containers = [];

  const noWrapSize = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };

  if (isHalfPageInCover) {
    const frontCoverSize = getFrontCoverSize(
      baseSize, bleedSize, wrapSize
    );
    const backCoverSize = getBackCoverSize(
      baseSize, bleedSize, wrapSize
    );
    const frontContainer = generateContainer(
      'Front', frontCoverSize.width, frontCoverSize.height, bleedSize, merge({}, wrapSize, {left: 0}), true
    );
    const backContainer = generateContainer(
      'Back', backCoverSize.width, backCoverSize.height, bleedSize, merge({}, wrapSize, {right: 0}), true
    );
    containers.push(frontContainer);
    containers.push(backContainer);
  } else {
    const fullContainer = generateContainer(
      'Full',
      coverSheetSize.width,
      coverSheetSize.height,
      bleedSize,
      wrapSize,
      isSupportImageInCover,
      isRotate
    );

    containers.push(fullContainer);
  }

  const spineContainer = generateContainer(
    'Spine', realSpineWidth, realSpineHeight, bleedSize, merge({}, wrapSize, {left: 0, right: 0}), true, false, spineExpanding
  );

  containers.push(spineContainer);

  let effectImageUrl = '';

  if(isRotate) {
    effectImageUrl = variableMap.cover ? variableMap.cover.rImage : '';
  } else {
    effectImageUrl = variableMap.cover ? variableMap.cover.image : '';
  }

  return {
    id: guid(),
    ...coverSheetSize,
    bleed: { ...bleedSize },
    bgImageUrl: coverAsset ? `${coverAsset.coverimage}?random=${VERSION}` : '',
    effectImageUrl:`${effectImageUrl}?random=${VERSION}`,
    backgroundSize,
    containers,
    isRotate
  };
}

/**
 * 生成产品内部背景参数
 * @param {*} parameterMap
 * @param {*} variableMap
 */
export const generateInner = (setting, parameterMap, variableMap, pageArray) => {
  if (!parameterMap) return {};
  let isLeftPage, refPageSize;

  // dvdCase用右页dvd作为参照page作缩放比；
  // 其余产品都用左页缩放
  switch(setting.product) {
    case 'usbCase':
    case 'IB': {
      isLeftPage = true;
      refPageSize = pageArray[0];
      break;
    }
    case 'dvdCase': {
      isLeftPage = false;
      refPageSize = pageArray[1];
      break;
    }
    default:
      return {};
  }

  // 返回效果背景图以及缩放后尺寸
  return {
    effectImageUrl: variableMap.inner ? variableMap.inner.image+`?random=${VERSION}`  : '',
    backgroundSize: getInnerBackgroundSize(variableMap.inner, refPageSize, isLeftPage)
  };
}

/**
 * 生成内页页面详情
 * @param {*} parameterMap
 * @param {*} variableMap
 * @param {*} isLeftPage
 * @param {*} pageType
 */
function generatePage(parameterMap, variableMap, isLeftPage, pageType) {
  const {
    innerBleedSize,
    innerWrapSize
  } = parameterMap;

  const newBleedSize = merge({}, innerBleedSize);
  let pageSizeType = '';

  if (pageType === pageTypes.dvd || pageType === pageTypes.usb) {
    newBleedSize.top = 0;
    newBleedSize.right = 0;
    newBleedSize.bottom = 0;
    newBleedSize.left = 0;
  }

  switch(pageType) {
    case pageTypes.page: {
      pageSizeType = 'innerBaseSize';
      break;
    }
    case pageTypes.dvd: {
      pageSizeType = 'dvdSize';
      break;
    }
    case pageTypes.usb: {
      pageSizeType = 'usbSize';
      break;
    }
    default: {
      pageSizeType = 'innerBaseSize';
      break;
    }
  }

  const innerPageSize = getInnerPageSize(
    parameterMap[pageSizeType], newBleedSize, innerWrapSize
  );

  return {
    id: guid(),
    ...innerPageSize,
    // surfaceNumber: index + 1,
    type: pageType,
    bleed: { ...newBleedSize },
    elements: [],
    wrapSize: innerWrapSize,
    backend: {
      isPrint: true
    }
  };
}

/**
 * 生成page列表
 * @param {*} setting
 * @param {*} parameterMap
 * @param {*} variableMap
 */
export const generatePageArray = (setting, parameterMap, variableMap) => {
  if (!parameterMap) return [];
  const pageArray = [];
  const IS_LEFT_PAGE = true;

  switch(setting.product) {
    case 'woodBox': {
      break;
    }
    case 'IB': {
      pageArray.push(generatePage(parameterMap, variableMap, IS_LEFT_PAGE, pageTypes.page));
      break;
    }
    // usb的右页用usbSize来计算带出血包边的宽度
    case 'usbCase': {
      pageArray.push(generatePage(parameterMap, variableMap, IS_LEFT_PAGE, pageTypes.page));
      pageArray.push(generatePage(parameterMap, variableMap, !IS_LEFT_PAGE, pageTypes.usb));
      break;
    }
    // dvd的左右页用dvdSize或innerBaseSize来计算带出血包边的宽度
    case 'dvdCase': {
      let pageLeftType = setting.dvdType === 'one' ? pageTypes.page : pageTypes.dvd;
      pageArray.push(generatePage(parameterMap, variableMap, IS_LEFT_PAGE, pageLeftType));
      pageArray.push(generatePage(parameterMap, variableMap, !IS_LEFT_PAGE, pageTypes.dvd));
      break;
    }
  }

  return pageArray;
}

/**
 * 获取天窗方向，长宽相等为方，不等为垂直或水平方向
 * @param {*} cameoSize
 */
function getCameoDirection(cameoSize) {
  if (cameoSize.width === cameoSize.height) {
    return cameoDirectionTypes.S;
  } else if (cameoSize.width > cameoSize.height) {
    return cameoDirectionTypes.H;
  } else {
    return cameoDirectionTypes.V;
  }
}

/**
 * 将element数据放入cover里
 * @param {*} cover
 * @param {*} elementArray
 */
function convertCover(cover, elementArray) {
  let newCover = {...cover};
  const containers = cover.containers;
  containers.forEach((container, index) => {
    const elementIds = container.elements;
    if (elementIds.length) {
      const realElements = elementArray.filter((element) => {
        return elementIds.indexOf(element.id) !== -1;
      });
      newCover.containers[index].elements = realElements;
    }
  });
  return newCover;
}

/**
 * 筛选保存container必要的数据
 * @param {*} container
 */
function formatContainerData(containers) {
  return containers.map(container => {
    return {
      id: container.id,
      width: container.width,
      height: container.height,
      type: container.type,
      backend: container.backend,
      bleed: container.bleed,
      wrapSize: container.wrapSize,
      elements: container.elements
    }
  })
}

/**
 * 筛选保存cover必要的数据
 * @param {*} cover
 */
function formatCoverSavingData(cover, isProjectRotate) {
  return {
    id: cover.id,
    width: cover.width,
    height: cover.height,
    containers: formatContainerData(cover.containers),
    isRotate: isProjectRotate
  };
}

/**
 * 筛选保存pages必要的数据
 * @param {*} pageArray
 */
function formatPageSavingData(pageArray) {
  return pageArray.map(page => {
    return {
      id: page.id,
      width: page.width,
      height: page.height,
      type: page.type,
      bleed: page.bleed,
      elements: page.elements,
      backend: page.backend
    };
  });
}

/**
 * 将element数据放入page里
 * @param {*} pageArray
 * @param {*} elementArray
 */
function convertPageArray(pageArray, elementArray) {
  let newPageArray = [...pageArray];
  pageArray.forEach((page, index) => {
    const elementIds = page.elements;
    if (elementIds.length) {
      const realElements = elementArray.filter((element) => {
        return elementIds.indexOf(element.id) !== -1;
      });
      newPageArray[index].elements = realElements;
    }
  });
  return newPageArray;
}

/**
 * 生成保存project的对象
 * @param {*} project
 * @param {*} userInfo
 * @param {*} specVersion
 */
export const generateProject = (project, userInfo, specVersion) => {
  let {
    projectId,
    pageArray,
    cover,
    elementArray,
    imageArray,
    setting,
    parameterMap: { cameoSize },
    isProjectRotate
  } = project;

  let frontPaintedText = '';
  let spinePaintedText = '';
  let backPaintedText = '';
  let cameoDirection = 'None';
  let useCameo = false;
  let usbNumber = 0;
  let dvdNumber = 0;
  let usbPaintedText = '';
  let useTextPrinting = false;
  let printNumber = 0;

  // 保存的时候去掉element.isSelect的状态
  elementArray = elementArray.map(element => {
    delete element.isSelect;
    return element;
  });

  const savedCover = convertCover(formatCoverSavingData(cover, isProjectRotate), elementArray);

  const savedPages = convertPageArray(formatPageSavingData(pageArray), elementArray);

  const cameoElements = elementArray.filter(element => element.type === elementTypes.cameo);

  const usbElementsHasText = elementArray.filter(element => element.type === elementTypes.usbText && element.text);

  if(cameoSize) {
    cameoDirection = getCameoDirection(cameoSize);
  }

  if(cameoElements.length > 0) {
    useCameo = true;
  }

  if(setting.product === 'usbCase') {
    usbNumber = 1;
  }

  if(usbElementsHasText.length > 0) {
    usbPaintedText = 'usbText';
  }

  if(isUsePaintedText(pageTypes.front, cover, elementArray)) {
    frontPaintedText = pageTypes.front;
  }

  if(isUsePaintedText(pageTypes.spine, cover, elementArray)) {
    spinePaintedText = pageTypes.spine;
  }

  if(isUsePaintedText(pageTypes.back, cover, elementArray)) {
    backPaintedText = pageTypes.back;
  }

  if(setting.product === 'dvdCase') {
    if(setting.dvdPrinted === 'noPrinted') {
      dvdNumber = 0;
    } else {
      switch(setting.dvdType) {
        case 'one': dvdNumber = 1; break;
        case 'two': dvdNumber = 2; break;
      }
    }
  }

  useTextPrinting = !!(frontPaintedText || spinePaintedText || backPaintedText || usbPaintedText);

  // 备注：工厂在生产时，所有的封面都不算printNumber
  printNumber =
    // cover.containers.filter(container => {
    //   let inPrintNumber = true;
    //   inPrintNumber = inPrintNumber && container.backend.isPrint;
    //   inPrintNumber = inPrintNumber && container.type !== pageTypes.spine && container.type !== pageTypes.back;

    //   if(container.type === pageTypes.front) {
    //     inPrintNumber = inPrintNumber && (cameoElements.length > 0);
    //   }

    //   return inPrintNumber;
    // }).length +
    pageArray.filter(page => page.backend.isPrint && page.type !== pageTypes.usb).length;

  let createdDate = new Date(project.createdDate);
  if (isNaN(createdDate.getTime())) {
    createdDate = new Date();
  }

  return {
    project: {
      guid: !!~projectId ? projectId : undefined,
      version: specVersion,
      clientId: 'web-h5',
      createAuthor: 'web-h5|1.1|1',
      userId: userInfo.id,
      artisan: userInfo.firstName,
      createdDate: formatDateTime(createdDate),
      updatedDate: formatDateTime(new Date()),
      summary: {
        useCameo: Boolean(cameoElements.length),
        cameoDirection,
        dvdNumber,
        usbNumber,
        printNumber,
        usbPaintedText,
        frontPaintedText,
        spinePaintedText,
        backPaintedText,
        useTextPrinting
      },
      spec: setting,
      cover: savedCover,
      pages: savedPages,
      images: imageArray
    }
  };
};

/**
 * 生成sku项目简介数据
 * @param {*} projectObj
 */
export const generateSku = (projectObj) => {
  const { project } = projectObj;
  const { summary } = project;

  const newSummary = {...summary};
  const newSpec = {...project.spec};

  if(newSummary.useCameo === false) {
    newSummary.cameoDirection = '';
    newSpec.cameo = '';
    newSpec.cameoShape = '';
  }

  const skuObj = {
    project: {
      version: project.version,
      clientId: project.clientId,
      createAuthor: project.createAuthor,
      userId: project.userId,
      artisan: project.artisan,
      ...newSummary,
      ...newSpec
    }
  };

  return skuObj;
}


function isUsePaintedText(pageType, cover, elementArray) {
  const container = cover.containers.find(container => container.type === pageType);
  let hasPaintedText = false;

  if(container) {
    for(const elementId of container.elements) {
      const theElement = elementArray.find(element => elementId === element.id);

      if(theElement && theElement.type === elementTypes.paintedText && theElement.text) {
        hasPaintedText = true;
      }
    }
  }

  return hasPaintedText;
}
