import {
  merge,
  get,
  isEmpty
} from 'lodash';
import {
  elementTypes,
  coverTypes,
  pageTypes
} from '../../contants/strings';
import { getPxByInch, guid } from '../../../common/utils/math';
import { generateCover, generatePageArray } from '../../utils/projectGenerator';
import projectParser from '../../../common/utils/projectParser';

export const formatOldVersionProject = (res, getState) => {
  const specOptions = get(res, 'project.imageBox.spec.option');
  let spreads = get(res, 'project.imageBox.spreads.spread');
  const allOptionMap = get(getState(), 'spec.allOptionMap');
  const title = res.project.title;
 const images = res.project.images.image || [];
  let {
    setting,
    parameterArray,
    variableArray,
    configurableOptionArray,
    cover,
    pageArray
  } = getState().project;

  let spec = specOptions.reduce((setting, option) => {
    const optionId = option.id === 'thickness'
      ? 'spineThickness'
      : option.id;

    setting[optionId] = option.value;
    return setting;
  }, {});

  spreads = spreads instanceof Array ? spreads : [spreads];

  const newSetting = projectParser.getDefaultProjectSetting(spec, configurableOptionArray);

  const coverSpread = spreads.find(spread => spread.type === 'coverPage');
  const innerSpread = spreads.find(spread => spread.type === 'innerPage');

  const coverElements = get(coverSpread, 'elements.element');
  const innerElements = get(innerSpread, 'elements.element');

  const parameterMap = projectParser.getParameters(newSetting, parameterArray);
  const convertedParameterMap = convertParametersUnit(parameterMap);
  const variableMap = projectParser.getVariables(newSetting, variableArray);

  cover = generateCover(newSetting, convertedParameterMap, variableMap);

  cover.containers = cover.containers.map(container => {

    if(container.type === 'Full') {

      if(coverElements) {
        container.elements = coverElements instanceof Array
          ? coverElements
          : [coverElements];
      } else {
        container.elements = [createPhotoElement(container)];
      }
    }

    return container;
  });

  pageArray = generatePageArray(newSetting, convertedParameterMap, variableMap);

  const pages = pageArray.map(page => {
    if(page.type === pageTypes.page || page.type === pageTypes.dvd) {
      if(innerElements) {
        page.elements = innerElements instanceof Array
          ? innerElements
          : [innerElements];
      } else {
        page.elements = [createPhotoElement(page)];
        page.position = 'left';
      }
    }
    return page;
  });

  const project = { spec: newSetting, cover, pages, title, images, parameterMap: convertedParameterMap, variableMap };

  return {project};
}

function convertParametersUnit (parameterMap) {
  if (isEmpty(parameterMap))return null;
  const { baseSize, innerBaseSize } = parameterMap;
  const outObj = merge({}, parameterMap);
  outObj.baseSize = {
    height: getPxByInch(baseSize.heightInInch),
    width: getPxByInch(baseSize.widthInInch)
  };
  outObj.innerBaseSize = {
    height: getPxByInch(innerBaseSize.heightInInch),
    width: getPxByInch(innerBaseSize.widthInInch)
  };
  return outObj;
};

function createPhotoElement(page) {
  return {
    id: guid(),
    type: elementTypes.photo,
    elType: 'image',
    x: 0,
    y: 0,
    width: page.width,
    height: page.height,
    px: 0,
    py: 0,
    pw: 1,
    ph: 1,
    imgFlip: false,
    rot: 0,
    imgRot: 0,
    encImgId: '',
    imageid: '',
    dep: 0,
    cropLUX: 0,
    cropLUY: 0,
    cropRLX: 0,
    cropRLY: 0,
    lastModified: Date.now()
  }
}