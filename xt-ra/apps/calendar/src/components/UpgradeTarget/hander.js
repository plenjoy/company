import Immutable from 'immutable';
import { get, merge } from 'lodash';
import { computeNewData, transformPageArray, transformCover } from '../../actions/project/settingActions';
import projectParser from '../../../../common/utils/projectParser';
import {
  computedSizeForUpgrade,
  getRenderAllSpreads,
  getRenderPaginationSpread
} from '../../utils/sizeCalculator';

export const getNewState = (props) => {
  const { data } = props;
  const {
    settings,
    specData,
    project,
    allImages,
    pagination,
    size,
    ratios
  } = data;
  const { configurableOptionArray,
    parameterArray,
    variableArray,
    allOptionMap
    } = specData;
  const oldCover = get(project, 'cover');
  const pageArray = get(project, 'pageArray');
  const imageArray = get(project, 'imageArray');
  if(!pageArray.size) return null;
  const originalSetting = Immutable.fromJS(get(settings, 'spec'));
  const calendarSetting = Immutable.fromJS(get(settings, 'calendarSetting'));
  const stateData = {
    configurableOptionArray,
    parameterArray,
    variableArray,
    allOptionMap,
    setting: originalSetting,
    calendarSetting
  };
  const result = Immutable.fromJS(computeNewData(stateData, { size: '8X6' }, true));

  const transformedPageArray = transformPageArray(
    pageArray,
    result.get('pageArray'),
    result.get('parameterMap'),
    imageArray
  );

  const transformedCover = transformCover(
    result.get('cover'),
    result.get('parameterMap'),
    oldCover,
    imageArray
  );
  const paginationSpread = getRenderPaginationSpread(
    transformedPageArray,
    transformedCover,
    allImages,
    { spec: result.get('setting').toJS(), calendarSetting },
    pagination
  );
  const newAllSheets = getRenderAllSpreads(
    transformedPageArray,
    transformedCover,
    allImages,
    { spec: result.get('setting').toJS(), calendarSetting }
  );
  const newProject = merge({}, project, {
    pageArray: transformedPageArray,
    cover: transformedCover,
    setting: result.get('setting'),
    parameterMap: result.get('parameterMap'),
    variableMap: result.get('variableMap'),
    availableOptionMap: result.get('availableOptionMap')
  });
  const newSize = computedSizeForUpgrade(
    newProject,
    null,
    ratios,
    result.get('parameterMap'),
    result.get('variableMap')
  );
  const newState = {
   project: newProject,
   settings: { spec: result.get('setting').toJS(), calendarSetting },
   paginationSpread,
   parameters: result.get('parameterMap'),
   allSheets: newAllSheets,
   size: newSize
 };
  return newState;
};
