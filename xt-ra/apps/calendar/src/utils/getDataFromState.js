import Immutable from 'immutable';
import { get } from 'lodash';

export function getDataFromState(state) {
  const setting = get(state, 'project.data.setting');
  const pageArray = get(state, 'project.data.pageArray');
  const cover = get(state, 'project.data.cover');
  const containers = cover.get('containers');
  const imageArray = get(state, 'project.data.imageArray');
  const property = get(state, 'project.data.property');
  const calendarSetting = get(state, 'project.data.calendarSetting');
  const parameterMap = get(state, 'project.data.parameterMap');
  const variableMap = get(state, 'project.data.variableMap');

  const configurableOptionArray = get(state, 'spec.data.configurableOptionArray');
  const parameterArray = get(state, 'spec.data.parameterArray');
  const variableArray = get(state, 'spec.data.variableArray');
  const allOptionMap = get(state, 'spec.data.allOptionMap');

  const urls = get(state, 'system.env.urls');
  const queryStringObj = get(state, 'system.env.qs');

  const currentPageId = get(state, 'system.global.pagination').get('pageId');
  const snipping = get(state, 'system.global.snipping');
  const ratioMap = get(state, 'system.global.ratio');

  let thePage = null;
  let theContainer = null;
  let elementArray = Immutable.List();
  let elementPageIdMap = Immutable.Map();

  if (pageArray && pageArray.size) {
    pageArray.forEach((page) => {
      if (page.get('id') === currentPageId) {
        thePage = page;
      }

      page.get('elements').forEach((element) => {
        elementPageIdMap = elementPageIdMap.set(
          element.get('id'),
          page.get('id')
        );
      });

      elementArray = elementArray.concat(page.get('elements'));
    });
  }

  if (containers && containers.size) {
    containers.forEach((container) => {
      if (container.get('id') === currentPageId) {
        theContainer = container;
      }

      container.get('elements').forEach((element) => {
        elementPageIdMap = elementPageIdMap.set(
          element.get('id'),
          container.get('id')
        );
      });

      elementArray = elementArray.concat(container.get('elements'));
    });
  }


  const currentPage = thePage || theContainer;

  const userId = get(state, 'system.env.userInfo').get('id');
  const fontList = get(state, 'system.fontList');

  return {
    setting,
    calendarSetting,
    cover,
    containers,
    elementArray,
    pageArray,
    imageArray,
    property,
    parameterMap,
    variableMap,
    elementPageIdMap,

    configurableOptionArray,
    parameterArray,
    variableArray,
    allOptionMap,

    queryStringObj,
    urls,
    currentPage,
    snipping,
    ratioMap,

    userId,
    fontList
  };
}
