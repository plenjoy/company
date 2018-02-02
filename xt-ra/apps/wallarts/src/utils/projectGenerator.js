import { merge, get, isNumber, isString, isBoolean } from 'lodash';
import { guid } from '../../../common/utils/math';
import {
  pageTypes,
  productTypes,
  canvasBorderTypes,
  elementTypes,
  enumPhotoQuantity,
  enumOrientation
} from '../constants/strings';
import { formatDateTime } from '../../../common/utils/dateFormat';

const DEFAULT_PHOTO_ELEMENT = {
  rot: 0,
  type: elementTypes.photo,
  imageid: '',
  encImgId: '',
  imgRot: 0,
  imgFlip: false,
  cropLUX: 0,
  cropLUY: 0,
  cropRLX: 1,
  cropRLY: 1,
  style: {
    brightness: 0,
    effectId: 0,
    opacity: 100
  },
  border: {
    size: 0,
    color: '#000000',
    opacity: 100
  }
};

function generateSplitElements(setting, parameterMap, pageSize) {
  const { photoQuantity, orientation } = setting;
  const { bleed, elementSize, elementBleed, floatBgSize } = parameterMap;

  const gutterWidth = floatBgSize.left;

  const elements = [];
  if (photoQuantity === enumPhotoQuantity.three) {
    for (let i = 0; i < 3; i++) {
      // Landscape
      let elementX =
        (elementSize.width + gutterWidth) * i - elementBleed.left + bleed.left;
      let elementY = -elementBleed.top + bleed.top;

      let elementWidth =
        elementSize.width + elementBleed.left + elementBleed.right;
      let elementHeight =
        elementSize.height + elementBleed.top + elementBleed.bottom;

      if (orientation === enumOrientation.portrait) {
        elementX = -elementBleed.left + bleed.left;
        elementY =
          (elementSize.height + gutterWidth) * i - elementBleed.top + bleed.top;
      }

      const element = {
        id: guid(),
        x: elementX,
        y: elementY,
        px: elementX / pageSize.pageWidth,
        py: elementY / pageSize.pageHeight,
        width: elementWidth,
        height: elementHeight,
        pw: elementWidth / pageSize.pageWidth,
        ph: elementHeight / pageSize.pageHeight,
        dep: i + 1,
        bleed: elementBleed
      };

      elements.push(Object.assign({}, DEFAULT_PHOTO_ELEMENT, element));
    }
  }

  return elements;
}

function generateDefaultElement(setting, parameterMap, pageSize) {
  const { bleed, canvasBorderThickness } = parameterMap;
  const productType = setting.product;
  const canvasBorder = setting.canvasBorder;
  let elementWidth = pageSize.pageWidth;
  let elementHeight = pageSize.pageHeight;
  let elementX = 0;
  let elementY = 0;
  if (
    (productType === productTypes.canvas &&
      canvasBorder !== canvasBorderTypes.image) ||
    productType === productTypes.frameCanvas
  ) {
    elementWidth =
      pageSize.pageWidth -
      bleed.left -
      bleed.right -
      canvasBorderThickness.left -
      canvasBorderThickness.right;
    elementHeight =
      pageSize.pageHeight -
      bleed.top -
      bleed.bottom -
      canvasBorderThickness.top -
      canvasBorderThickness.bottom;
    elementX = bleed.left + canvasBorderThickness.left;
    elementY = bleed.top + canvasBorderThickness.top;
  }
  const dafaultElement = {
    id: guid(),
    x: elementX,
    y: elementY,
    px: elementX / pageSize.pageWidth,
    py: elementY / pageSize.pageHeight,
    width: elementWidth,
    height: elementHeight,
    pw: elementWidth / pageSize.pageWidth,
    ph: elementHeight / pageSize.pageHeight,
    dep: 1
  };
  return Object.assign({}, DEFAULT_PHOTO_ELEMENT, dafaultElement);
}

function generatePage(setting, parameterMap) {
  if (!parameterMap) return [];
  const {
    bleed,
    matteSize,
    floatBgSize,
    frameBaseSize,
    boardInMatting,
    borderInFrame,
    frameBorderThickness,
    canvasBorderThickness
  } = parameterMap;
  const bleedWidth = get(bleed, 'left') + get(bleed, 'right');
  const bleedHeight = get(bleed, 'top') + get(bleed, 'bottom');
  const matteWidth = get(matteSize, 'left') + get(matteSize, 'right');
  const matteHeight = get(matteSize, 'top') + get(matteSize, 'bottom');
  const floatBgWidth = get(floatBgSize, 'left') + get(floatBgSize, 'right');
  const floatBgHeight = get(floatBgSize, 'top') + get(floatBgSize, 'bottom');
  const boardInMattingWidth =
    get(boardInMatting, 'left') + get(boardInMatting, 'right');
  const boardInMattingHeight =
    get(boardInMatting, 'top') + get(boardInMatting, 'bottom');
  const canvasBorderThicknessWidth =
    get(canvasBorderThickness, 'left') + get(canvasBorderThickness, 'right');
  const canvasBorderThicknessHeight =
    get(canvasBorderThickness, 'top') + get(canvasBorderThickness, 'bottom');

  const { orientation } = setting;
  const pageWidth =
    frameBaseSize.width +
    canvasBorderThicknessWidth +
    bleedWidth -
    matteWidth +
    boardInMattingWidth -
    floatBgWidth;
  const pageHeight =
    frameBaseSize.height +
    canvasBorderThicknessHeight +
    bleedHeight -
    matteHeight +
    boardInMattingHeight -
    floatBgHeight;

  let elements = [];

  const pageSize = { pageWidth, pageHeight };

  switch (setting.photoQuantity) {
    case enumPhotoQuantity.one:
      elements = [generateDefaultElement(setting, parameterMap, pageSize)];
      break;

    case enumPhotoQuantity.three:
      elements = generateSplitElements(setting, parameterMap, pageSize);
      break;

    default:
      elements = [generateDefaultElement(setting, parameterMap, pageSize)];
  }

  return {
    id: guid(),
    width: pageWidth,
    height: pageHeight,
    type: pageTypes.page,
    bleed,
    elements,
    spec: merge({}, setting),
    template: {},
    borderInFrame,
    boardInMatting,
    matteSize,
    frameBorderThickness,
    canvasBorderThickness,
    canvasBorder: {
      top: get(canvasBorderThickness, 'top'),
      bottom: get(canvasBorderThickness, 'bottom'),
      left: get(canvasBorderThickness, 'left'),
      right: get(canvasBorderThickness, 'right'),
      color: '16777215'
    },
    backend: {
      isPrint: true,
      slice: false
    }
  };
}

function generatePageArray(setting, parameterMap) {
  const pageArray = [];
  // for (let i = 0; i < 3; i++) {
  pageArray.push(generatePage(setting, parameterMap));
  // }
  return pageArray;
}

function verifyPageElements(pageArray) {
  let newPageArray = pageArray;

  pageArray.forEach((page, i) => {
    page.get('elements').forEach((element, j) => {
      newPageArray = newPageArray.setIn(
        [String(i), 'elements', String(j)],
        verifyElementAttributes(element)
      );
    });
  });

  return newPageArray;
}
function verifyElementAttributes(element) {
  let newElement = element;
  const needVerifyNumberKeys = [
    'x',
    'y',
    'width',
    'height',
    'px',
    'py',
    'pw',
    'ph',
    'cropLUX',
    'cropLUY',
    'cropRLX',
    'cropRLY',
    'dep',
    'rot',
    'imgRot',
    'fontSize'
  ];

  const needVerifyStringKeys = [
    'text',
    'fontWeight',
    'fontFamily',
    'fontColor',
    'textAlign',
    'textVAlign'
  ];

  const needVerifyBooleanKeys = ['imgFlip'];

  newElement.forEach((value, key) => {
    if (
      needVerifyNumberKeys.indexOf(key) !== -1 &&
      (!isNumber(value) || isNaN(value))
    ) {
      if (!isNaN(Number(value))) {
        newElement = newElement.set(key, Number(value));
      } else {
        newElement = newElement.set(key, 0);
      }
    }

    if (needVerifyStringKeys.indexOf(key) !== -1 && !isString(value)) {
      newElement = newElement.set(key, '');
    }

    if (needVerifyBooleanKeys.indexOf(key) !== -1 && !isBoolean(value)) {
      newElement = newElement.set(key, false);
    }
  });

  const fontFamily = newElement.get('fontFamily');
  const text = newElement.get('text');

  if (fontFamily) {
    newElement = newElement.set('fontFamily', toEncode(fontFamily));
  }

  if (text) {
    newElement = newElement.set('text', toEncode(text));
  }

  return newElement;
}
function generateProject(project, userInfo, specVersion) {
  const { property, setting, parameterMap, imageArray } = project;

  const pageArray = verifyPageElements(project.pageArray.present);

  const projectId = property.get('projectId');
  const now = new Date();

  let createdDate = new Date(property.get('createdDate'));
  if (isNaN(createdDate.getTime())) {
    createdDate = new Date();
  }

  const projectObj = {
    project: {
      version: specVersion,
      clientId: 'web-h5',
      createAuthor: 'web-h5|1.1|1',
      userId: userInfo.get('id'),
      artisan: userInfo.get('firstName'),
      createdDate: formatDateTime(createdDate),
      updatedDate: formatDateTime(now),
      summary: {},
      spec: setting.toJS(),
      pages: pageArray.toJS(),
      images: imageArray.toJS()
    }
  };

  if (projectId !== -1) {
    projectObj.project.guid = projectId;
  }

  return projectObj;
}

function generateSku(projectObj) {
  const { project } = projectObj;
  const { version, clientId, createAuthor, userId, artisan } = project;

  const skuObj = {
    project: {
      version,
      clientId,
      createAuthor,
      userId,
      artisan,
      ...project.spec
    }
  };

  return skuObj;
}

export { generatePage, generatePageArray, generateProject, generateSku };
