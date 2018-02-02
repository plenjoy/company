import { merge, get, isNumber, isString, isBoolean } from 'lodash';
import { guid } from '../../../common/utils/math';
import { formatDateTime } from '../../../common/utils/dateFormat';

import { toEncode } from '../../../common/utils/encode';
import {
  elementTypes,
  pageTypes,
  productTypes
} from '../constants/strings';
import {
  getInnerPageSize
} from './sizeCalculator';

function generatePage(parameterMap, pageType, additionalOptions) {
  const { baseSize, pageBleed, calendarArea } = parameterMap;
  const { month, year } = additionalOptions;

  const innerPageSize = getInnerPageSize(baseSize, pageBleed);

  const elements = [];
  if (pageType === pageTypes.bottom) {
    elements.push({
      id: guid(),
      type: elementTypes.calendar,
      x: get(calendarArea, 'x'),
      y: get(calendarArea, 'y'),
      width: get(calendarArea, 'width'),
      height: get(calendarArea, 'height'),
      px: get(calendarArea, 'x') / get(innerPageSize, 'width'),
      py: get(calendarArea, 'y') / get(innerPageSize, 'height'),
      pw: get(calendarArea, 'width') / get(innerPageSize, 'width'),
      ph: get(calendarArea, 'height') / get(innerPageSize, 'height'),
      rot: 0,
      dep: 999,
      month,
      year
    });
  }

  return {
    id: guid(),
    ...innerPageSize,
    type: pageType,
    month,
    year,
    styleId: '',
    styleItemId: '',
    bleed: { ...pageBleed },
    elements,
    template: {},
    backend: {
      isPrint: true,
      slice: false
    }
  };
}

function generateCover(
  productType,
  parameterMap,
  calendarSetting
) {
  if (!parameterMap) return {};

  const { baseSize, pageBleed } = parameterMap;
  const coverPageSize = getInnerPageSize(baseSize, pageBleed);
  const containers = [];

  const additionalOptions = {
    month: 0,
    year: Number(calendarSetting.get('startYear'))
  };
  if (productType !== productTypes.LC) {
    const coverPage = generatePage(
      parameterMap,
      pageTypes.cover,
      additionalOptions
    );

    containers.push(coverPage);
  }

  return {
    id: guid(),
    ...coverPageSize,
    bleed: { ...pageBleed },
    containers
  };
}


function generatePageArray(
  productType,
  parameterMap,
  numberOfMonth,
  calendarSetting
) {
  if (!parameterMap) return [];
  const startYear = Number(calendarSetting.get('startYear'));
  const startMonth = Number(calendarSetting.get('startMonth'));

  const pageArray = [];
  for (let i = 0; i < numberOfMonth; i += 1) {
    const additionalOptions = {
      month: startMonth + i > 12 ? (startMonth + i - 12) : (startMonth + i),
      year: startMonth + i > 12 ? (startYear + 1) : startYear
    };
    if (productType === productTypes.WC) {
      const topPage = generatePage(parameterMap, pageTypes.top, additionalOptions);
      pageArray.push(topPage);
    }

    const bottomPage = generatePage(parameterMap, pageTypes.bottom, additionalOptions);
    merge(bottomPage, {
      month: startMonth + i > 12 ? (startMonth + i - 12) : (startMonth + i),
      year: startMonth + i > 12 ? (startYear + 1) : startYear
    });
    pageArray.push(bottomPage);
  }

  return pageArray;
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

function verifyCoverElements(cover) {
  let containers = cover.get('containers');

  if (containers) {
    containers.forEach((o, i) => {
      const container = o;
      container.get('elements').forEach((element, j) => {
        containers = containers.setIn(
          [String(i), 'elements', String(j)],
          verifyElementAttributes(element)
        );
      });
    });
  }
  return containers.first();
}

function generateProject(project, userInfo, specVersion, title) {
  const {
    property,
    setting,
    imageArray,
    calendarSetting
  } = project;

  let pageArray = verifyPageElements(project.pageArray);
  const coverPage = verifyCoverElements(project.cover);
  const productType = setting.get('product');
  if (productType !== productTypes.LC) {
    pageArray = pageArray.unshift(coverPage);
  }

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
      title,
      artisan: userInfo.get('firstName'),
      createdDate: formatDateTime(createdDate),
      updatedDate: formatDateTime(now),
      calendarSetting: calendarSetting.toJS(),
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
  const { version, clientId, createAuthor, userId, artisan, spec } = project;

  const skuObj = {
    project: {
      version,
      clientId,
      createAuthor,
      userId,
      artisan,
      ...spec
    }
  };

  return skuObj;
}


export {
  generateCover,
  generatePage,
  generatePageArray,
  generateProject,
  generateSku
};
