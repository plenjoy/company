import Immutable from 'immutable';
import { merge, isNumber, isString, isBoolean } from 'lodash';

import {
  getInnerSheetSize,
  getInnerPageSize,
  getCoverSheetSize,
  getFrontCoverSize,
  getBackCoverSize,
  getSpineWidth
} from './sizeCalculator';

import { guid } from '../../../common/utils/math';
import { formatDateTime } from '../../../common/utils/dateFormat';
import { toEncode } from '../../../common/utils/encode';
import {
  elementTypes,
  cameoDirectionTypes,
  paintedTextTypes,
  pageTypes
} from '../contants/strings';
import {
  checkIsSupportHalfImageInCover,
  checkIsSupportImageInCover
} from '../utils/cover';

const DEFAULT_BG_COLOR = '#FFFFFF';

function generateContainer(
  type,
  width,
  height,
  bleed,
  bgColor = DEFAULT_BG_COLOR,
  isPrint = false
) {
  return {
    id: guid(),
    bgColor,
    width,
    height,
    bleed,
    type,
    elements: [],
    template: {},
    backend: {
      isPrint,
      slice: false
    }
  };
}

function generateCover(cover, parameterMap, variableMap, addedSheetNumber = 0) {
  if (!parameterMap) return {};

  const {
    bookCoverBaseSize,
    coverPageBleed,
    coverExpandingSize,
    spineWidth,
    spineExpanding,
    coverThickness
  } = parameterMap;

  const bgColor = variableMap.coverBackgroundColor || DEFAULT_BG_COLOR;

  const coverSheetSize = getCoverSheetSize(
    bookCoverBaseSize,
    coverPageBleed,
    coverExpandingSize,
    spineWidth,
    coverThickness
  );

  const coverAsset = variableMap.coverAsset;

  const spineBleed = merge({}, coverPageBleed, { left: 0, right: 0 });
  const realSpineWidth =
    getSpineWidth(spineWidth, addedSheetNumber) +
    spineBleed.left +
    spineBleed.right;

  const isSupportHalfImageInCover = checkIsSupportHalfImageInCover(cover);
  const isSupportImageInCover = checkIsSupportImageInCover(cover);

  const containers = [];

  if (isSupportHalfImageInCover) {
    const frontCoverSize = getFrontCoverSize(
      bookCoverBaseSize,
      coverPageBleed,
      coverExpandingSize,
      spineExpanding,
      coverThickness
    );
    const backCoverSize = getBackCoverSize(
      bookCoverBaseSize,
      coverPageBleed,
      coverExpandingSize,
      spineExpanding,
      coverThickness
    );

    const frontContainer = generateContainer(
      'Front',
      frontCoverSize.width,
      frontCoverSize.height,
      coverPageBleed,
      bgColor,
      true
    );

    const backContainer = generateContainer(
      'Back',
      backCoverSize.width,
      backCoverSize.height,
      coverPageBleed,
      bgColor
    );

    containers.push(frontContainer);
    containers.push(backContainer);
  } else {
    const fullContainer = generateContainer(
      'Full',
      coverSheetSize.width,
      coverSheetSize.height,
      coverPageBleed,
      bgColor,
      isSupportImageInCover
    );

    containers.push(fullContainer);
  }

  const spineContainer = generateContainer(
    'Spine',
    realSpineWidth,
    coverSheetSize.height,
    spineBleed,
    bgColor
  );

  containers.push(spineContainer);

  return {
    id: guid(),
    ...coverSheetSize,
    bleed: { ...coverPageBleed },
    bgColor,
    bgImageUrl: coverAsset ? coverAsset.coverimage : '',
    containers
  };
}

function generatePage(
  product,
  parameterMap,
  index,
  bgColor = DEFAULT_BG_COLOR
) {
  const { bookInnerBaseSize, innerPageBleed } = parameterMap;

  const isLeftPage = index % 2 === 0;
  const innerPageSize = getInnerPageSize(bookInnerBaseSize, innerPageBleed);

  return {
    id: guid(),
    ...innerPageSize,
    // surfaceNumber: index + 1,
    type: 'Page',
    bgColor,
    pageAlign: isLeftPage ? 'Left' : 'Right',
    bleed: { ...innerPageBleed },
    elements: [],
    template: {},
    backend: {
      isPrint: true,
      slice: false
    }
  };
}

function generateSheet(parameterMap, index, bgColor = DEFAULT_BG_COLOR) {
  const { bookInnerBaseSize, innerPageBleed } = parameterMap;

  const innerSheetSize = getInnerSheetSize(bookInnerBaseSize, innerPageBleed);

  return {
    id: guid(),
    ...innerSheetSize,
    // surfaceNumber: index + 1,
    type: 'Sheet',
    bgColor,
    bleed: { ...innerPageBleed },
    elements: [],
    template: {},
    backend: {
      isPrint: true,
      slice: false
    }
  };
}

function generatePageArray(product, parameterMap, bgColor = DEFAULT_BG_COLOR) {
  if (!parameterMap) return [];

  const pageArray = [];

  const { sheetNumberRange } = parameterMap;
  const minSheetNumber = sheetNumberRange.min;
  const minPageNumber = minSheetNumber * 2;

  const isPressBook = product === 'PS';

  if (isPressBook) {
    for (let i = 0; i < minPageNumber; i += 1) {
      const page = generatePage(product, parameterMap, i, bgColor);
      // pressBook的第一页和最后一页不进行打印
      if (i === 0 || i === minPageNumber - 1) {
        page.backend.isPrint = false;
      }
      pageArray.push(page);
    }
  } else {
    for (let i = 0; i < minPageNumber; i += 1) {
      const sheet = generateSheet(parameterMap, i, bgColor);
      i += 1;
      const page = generatePage(product, parameterMap, i, bgColor);
      page.backend.isPrint = false;
      pageArray.push(sheet);
      pageArray.push(page);
    }
  }

  return pageArray;
}

function convertPageArray(pageArray, elementArray) {
  let newPageArray = pageArray;
  pageArray.forEach((page, index) => {
    const elementIds = page.get('elements');
    if (elementIds.size) {
      const realElements = elementArray.filter((element) => {
        return elementIds.indexOf(element.get('id')) !== -1;
      });
      newPageArray = newPageArray.setIn(
        [String(index), 'elements'],
        realElements
      );
    }
  });
  return newPageArray;
}

function convertCover(cover, elementArray) {
  let newCover = cover;
  const containers = cover.get('containers');

  if (containers && containers.forEach) {
    containers.forEach((container, index) => {
      const elementIds = container.get('elements');
      if (elementIds.size) {
        const realElements = elementArray.filter((element) => {
          return elementIds.indexOf(element.get('id')) !== -1;
        });
        newCover = newCover.setIn(
          ['containers', String(index), 'elements'],
          realElements
        );
      }
    });
  }

  return newCover;
}

function generateSku(projectObj) {
  const { project } = projectObj;
  const { summary, version, clientId, createAuthor, userId, artisan } = project;

  const { pageCount, pageAdded, pageBase } = summary;

  const skuObj = {
    project: {
      version,
      clientId,
      createAuthor,
      userId,
      artisan,
      pageCount,
      pageAdded,
      pageBase,
      ...project.spec
    }
  };

  return skuObj;
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
      newElement = newElement.set(key, 0);
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

function verifyElementArray(elementArray) {
  let outElementArray = Immutable.List([]);

  elementArray.forEach((element) => {
    outElementArray = outElementArray.push(verifyElementAttributes(element));
  });

  return outElementArray;
}

function generateProject(project, userInfo, specVersion) {
  const projectId = project.get('projectId');
  const now = new Date();

  const minPageNumber =
    project.getIn(['parameterMap', 'sheetNumberRange', 'min']) * 2;

  const pageArray = project.get('pageArray');
  const cover = project.get('cover');
  const elementArray = verifyElementArray(project.get('elementArray'));
  const imageArray = project.get('imageArray');

  let createdDate = new Date(project.get('createdDate'));
  if (isNaN(createdDate.getTime())) {
    createdDate = new Date();
  }

  const spec = project.get('setting').toJS();

  // bookSetting
  const bookSetting = project.get('bookSetting').toJS();
  const coverForegroundColor = project.getIn([
    'variableMap',
    'coverForegroundColor'
  ]);
  bookSetting.font.color = coverForegroundColor
    ? coverForegroundColor.toUpperCase()
    : '#000000';

  const projectObj = {
    project: {
      version: specVersion,
      clientId: 'web-h5',
      createAuthor: 'web-h5|1.1|1',
      userId: userInfo.get('id'),
      artisan: userInfo.get('firstName'),
      createdDate: formatDateTime(createdDate),
      updatedDate: formatDateTime(now),
      summary: {
        pageCount: pageArray.size,
        pageAdded: pageArray.size - minPageNumber,
        pageBase: minPageNumber,
        freeLogo: true,
        editorSetting: bookSetting
      },
      spec,
      cover: convertCover(cover, elementArray).toJS(),
      pages: convertPageArray(pageArray, elementArray).toJS(),
      images: imageArray.toJS()
    }
  };

  if (projectId !== -1) {
    projectObj.project.guid = projectId;
  }

  return projectObj;
}

export {
  generateCover,
  generatePage,
  generateSheet,
  generatePageArray,
  generateContainer,
  generateProject,
  generateSku
};
