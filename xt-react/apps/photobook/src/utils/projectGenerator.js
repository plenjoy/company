import { isNumber, isString, isBoolean } from 'lodash';
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
import { toEncode } from '../../../common/utils/encode';

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

function generateCover(
  cover,
  parameterMap,
  variableMap,
  bgColor = DEFAULT_BG_COLOR,
  addedSheetNumber = 0
) {
  if (!parameterMap) return {};

  const {
    bookCoverBaseSize,
    bookInnerBaseSize,
    coverPageBleed,
    coverExpandingSize,
    spineWidth,
    spineExpanding
  } = parameterMap;

  const coverSheetSize = getCoverSheetSize(
    bookCoverBaseSize,
    coverPageBleed,
    coverExpandingSize,
    spineWidth
  );

  const coverAsset = variableMap.coverAsset;

  const realSpineWidth =
    getSpineWidth(spineWidth, addedSheetNumber) +
    coverPageBleed.left +
    coverPageBleed.right;

  const isSupportHalfImageInCover = checkIsSupportHalfImageInCover(cover);
  const isSupportImageInCover = checkIsSupportImageInCover(cover);

  const containers = [];

  if (isSupportHalfImageInCover) {
    const frontCoverSize = getFrontCoverSize(
      bookCoverBaseSize,
      coverPageBleed,
      coverExpandingSize,
      spineExpanding
    );
    const backCoverSize = getBackCoverSize(
      bookCoverBaseSize,
      coverPageBleed,
      coverExpandingSize,
      spineExpanding
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
    coverPageBleed,
    bgColor
  );

  containers.push(spineContainer);

  return {
    id: guid(),
    ...coverSheetSize,
    bleed: { ...coverPageBleed },
    bgImageUrl: coverAsset ? coverAsset.coverimage : '',
    containers
  };
}

function generatePage(parameterMap, bgColor = DEFAULT_BG_COLOR) {
  const { bookInnerBaseSize, innerPageBleed } = parameterMap;

  const innerPageSize = getInnerPageSize(bookInnerBaseSize, innerPageBleed);

  return {
    id: guid(),
    ...innerPageSize,
    type: 'Page',
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

function generateSheet(parameterMap, bgColor = DEFAULT_BG_COLOR) {
  const { bookInnerBaseSize, innerPageBleed } = parameterMap;

  const innerSheetSize = getInnerSheetSize(bookInnerBaseSize, innerPageBleed);

  return {
    id: guid(),
    ...innerSheetSize,
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

function generatePageArray(
  isPressBook,
  parameterMap,
  bgColor = DEFAULT_BG_COLOR
) {
  if (!parameterMap) return [];

  const pageArray = [];

  const { sheetNumberRange } = parameterMap;
  const minSheetNumber = sheetNumberRange.min;
  const minPageNumber = minSheetNumber * 2;

  if (isPressBook) {
    for (let i = 0; i < minPageNumber; i += 1) {
      const page = generatePage(parameterMap, bgColor);
      // pressBook的第一页和最后一页不进行打印
      if (i === 0 || i === minPageNumber - 1) {
        page.backend.isPrint = false;
      }
      pageArray.push(page);
    }
  } else {
    for (let i = 0; i < minPageNumber; i += 1) {
      const sheet = generateSheet(parameterMap, bgColor);
      i += 1;
      const page = generatePage(parameterMap, bgColor);
      page.backend.isPrint = false;
      pageArray.push(sheet);
      pageArray.push(page);
    }
  }

  return pageArray;
}

/**
 * 检查指定的element id的集合中是否包含painted text元素.
 * @type {Boolean}
 */

function hasContainPaintedTextElements(elements) {
  if (!elements) {
    return false;
  }

  return Boolean(
    elements.find(
      ele => ele.get('type') === elementTypes.paintedText && ele.get('text')
    )
  );
}

/**
 * 检查封面的full page上, painted text的分布情况.
 * @param  {[type]} elementIds 封面上full page的元素id的集合
 * @param  {[type]} elementsArray 所有元素的集合.
 */
function checkPaintedTextStatusInFullPage(fullPage) {
  let frontPaintedText = paintedTextTypes.none;
  let backPaintedText = paintedTextTypes.none;

  if (fullPage) {
    const elements = fullPage.get('elements');

    const paintedTextArray = [];

    elements.forEach((element) => {
      if (
        element.get('type') === elementTypes.paintedText &&
        element.get('text')
      ) {
        paintedTextArray.push(element);
      }
    });

    if (paintedTextArray && paintedTextArray.length) {
      // 检查左半页和右半页是否有painted text
      paintedTextArray.forEach((paintedTextElement) => {
        const px = paintedTextElement.get('px');
        // 如果px小于0.5, 那么肯定在左半页.
        if (px < 0.5) {
          if (backPaintedText === paintedTextTypes.none) {
            backPaintedText = paintedTextTypes.back;
          }
        } else if (frontPaintedText === paintedTextTypes.none) {
          frontPaintedText = paintedTextTypes.front;
        }
      });
    }
  }

  return { frontPaintedText, backPaintedText };
}

/**
 * 检查封面上painted text的添加情况.
 * @param  {[type]} cover [description]
 * @return {[type]}       [description]
 */
export const checkPaintedTextInCover = (cover) => {
  let frontPaintedText = paintedTextTypes.none;
  let backPaintedText = paintedTextTypes.none;
  let spinePaintedText = paintedTextTypes.none;
  let useTextPrinting = false;

  const pages = cover.get('containers');
  if (pages && pages.size) {
    // spine
    const spinePage = pages.find(p => p.get('type') === pageTypes.spine);
    const backPage = pages.find(p => p.get('type') === pageTypes.back);
    const frontPage = pages.find(p => p.get('type') === pageTypes.front);
    const fullPage = pages.find(p => p.get('type') === pageTypes.full);

    // 检查封面的spine是否包含painted text.
    if (spinePage) {
      const hasPaintedText = hasContainPaintedTextElements(
        spinePage.get('elements')
      );

      // 更新值为Spine如果包含painted text.
      spinePaintedText = hasPaintedText
        ? paintedTextTypes.spine
        : paintedTextTypes.none;
    }

    // 检查封面的背面是否包含painted text.
    if (backPage) {
      const hasPaintedText = hasContainPaintedTextElements(
        backPage.get('elements')
      );
      backPaintedText = hasPaintedText
        ? paintedTextTypes.back
        : paintedTextTypes.none;
    }

    // 检查封面的正面是否包含painted text.
    if (frontPage) {
      const hasPaintedText = hasContainPaintedTextElements(
        frontPage.get('elements')
      );
      frontPaintedText = hasPaintedText
        ? paintedTextTypes.front
        : paintedTextTypes.none;
    }

    // 如果是full page, 那就要检查full page的左半页和右半页是否包含painted text.
    if (fullPage) {
      const hasPaintedText = hasContainPaintedTextElements(
        fullPage.get('elements')
      );
      // 当封面的page为full时, 并且包含painted text时, 那么要进一步检查是左页, 右页还是都包含.
      if (hasPaintedText) {
        const paintedTextStatusInFullPage = checkPaintedTextStatusInFullPage(
          fullPage
        );

        backPaintedText = paintedTextStatusInFullPage.backPaintedText;
        frontPaintedText = paintedTextStatusInFullPage.frontPaintedText;
      } else {
        // 当封面的page为full时, 并且不包含painted text, 那么back和front的值均设为none.
        backPaintedText = paintedTextTypes.none;
        frontPaintedText = paintedTextTypes.none;
      }
    }

    if (
      frontPaintedText !== paintedTextTypes.none ||
      backPaintedText !== paintedTextTypes.none ||
      spinePaintedText !== paintedTextTypes.none
    ) {
      useTextPrinting = true;
    }
  }

  return {
    frontPaintedText,
    backPaintedText,
    spinePaintedText,
    useTextPrinting
  };
};

function generateSku(projectObj) {
  const { project } = projectObj;
  const { summary, version, clientId, createAuthor, userId, artisan } = project;

  const {
    pageCount,
    pageAdded,
    pageBase,
    useCameo,
    cameoDirection,
    useGilding,
    useTextPrinting,
    backPaintedText,
    frontPaintedText,
    spinePaintedText
  } = summary;

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
      useCameo,
      cameoDirection,
      useGilding,
      useTextPrinting,
      backPaintedText,
      frontPaintedText,
      spinePaintedText,
      ...project.spec
    }
  };

  if (!summary.useCameo) {
    skuObj.project.cameo = 'none';
    skuObj.project.cameoShape = 'none';
  }

  return skuObj;
}

function getCameoDirection(cameoSize) {
  if (cameoSize.get('width') === cameoSize.get('height')) {
    return cameoDirectionTypes.S;
  } else if (cameoSize.get('width') > cameoSize.get('height')) {
    return cameoDirectionTypes.H;
  }
  return cameoDirectionTypes.V;
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

function fixSpineContainerFontSize(spineContainer) {
  let outSpineContainer = spineContainer;

  spineContainer.get('elements').forEach((element, index) => {
    if (
      element.get('type') === elementTypes.text ||
      element.get('type') === elementTypes.paintedText
    ) {
      outSpineContainer = outSpineContainer.setIn(
        ['elements', String(index), 'fontSize'],
        0
      );
    }
  });

  return outSpineContainer;
}

function verifyCoverElements(cover) {
  let newCover = cover;

  const containers = newCover.get('containers');

  if (containers) {
    containers.forEach((o, i) => {
      let container = o;
      if (container.get('type') === pageTypes.spine) {
        const newSpineContainer = fixSpineContainerFontSize(container);
        newCover = newCover.setIn(['containers', String(i)], newSpineContainer);

        container = newSpineContainer;
      }
      container.get('elements').forEach((element, j) => {
        newCover = newCover.setIn(
          ['containers', String(i), 'elements', String(j)],
          verifyElementAttributes(element)
        );
      });
    });
  }

  return newCover;
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

function generateProject(project, userInfo, specVersion) {
  const {
    property,
    setting,
    parameterMap,
    imageArray,
    bookSetting,
    backgroundArray,
    stickerArray
  } = project;

  const pageArray = verifyPageElements(project.pageArray.present);
  const cover = verifyCoverElements(project.cover.present);

  const projectId = property.get('projectId');
  const isParentBook = property.get('isParentBook');
  const applyBookThemeId = property.get('applyBookThemeId');
  const now = new Date();

  const minPageNumber = parameterMap.getIn(['sheetNumberRange', 'min']) * 2;

  const cameoSize = parameterMap.get('cameoSize');
  const cameoDirection = getCameoDirection(cameoSize);

  const containers = cover.get('containers');
  let countCameoElements = 0;
  containers.forEach((container) => {
    container.get('elements').forEach((element) => {
      if (element.get('type') === elementTypes.cameo) {
        countCameoElements += 1;
      }
    });
  });

  let createdDate = new Date(property.get('createdDate'));
  if (isNaN(createdDate.getTime())) {
    createdDate = new Date();
  }

  // 检查painted text在封面上的使用情况.
  const paintedTextStatus = checkPaintedTextInCover(cover);

  const isEditedParentBook = isParentBook;

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
        useCameo: Boolean(countCameoElements),
        useGilding: setting.get('gilding').toLowerCase() !== 'none',
        freeLogo: true,
        useTextPrinting: false,
        editorSetting: bookSetting.toJS(),
        cameoDirection,
        isParentBook,
        isEditedParentBook,
        ...paintedTextStatus
      },
      spec: setting.toJS(),
      cover: cover.toJS(),
      pages: pageArray.toJS(),
      images: imageArray.toJS(),
      backgrounds: backgroundArray.toJS(),
      stickers: stickerArray.toJS(),
      decorations: [],
      applyBookThemeId
    }
  };

  if (projectId !== -1) {
    projectObj.project.guid = projectId;
  }

  return projectObj;
}

function generateImageJson(sheetSize) {
  const imageJson = [];
  let i = 0;
  for (; i < sheetSize; i++) {
    imageJson.push(i);
  }
  return imageJson;
}

export {
  generateCover,
  generatePage,
  generateSheet,
  generatePageArray,
  generateContainer,
  generateProject,
  generateSku,
  generateImageJson
};
