import Immutable from 'immutable';
import { get } from 'lodash';

export function getDataFromState(state) {
  const setting = get(state, 'project.data.present').get('setting');
  const pageArray = get(state, 'project.data.present').get('pageArray');
  const cover = get(state, 'project.data.present').get('cover');
  const containers = cover.get('containers');
  const imageArray = get(state, 'project.data.present').get('imageArray');
  const property = get(state, 'project.data.property');
  const bookSetting = get(state, 'project.data.bookSetting');
  const parameterMap = get(state, 'project.data.parameterMap');
  const variableMap = get(state, 'project.data.variableMap');

  const configurableOptionArray = get(state, 'spec.data.configurableOptionArray');
  const parameterArray = get(state, 'spec.data.parameterArray');
  const variableArray = get(state, 'spec.data.variableArray');

  const urls = get(state, 'system.env.urls');
  const queryStringObj = get(state, 'system.env.qs');

  const currentPageId = get(state, 'system.global.pagination').get('pageId');
  const snipping = get(state, 'system.global.snipping');
  const ratioMap = get(state, 'system.global.ratio');

  let thePage = null;
  let theContainer = null;
  let elementArray = Immutable.List();

  if (pageArray && pageArray.size) {
    pageArray.forEach((page) => {
      if (page.get('id') === currentPageId) {
        thePage = page;
      }

      elementArray = elementArray.concat(page.get('elements'));
    });
  }

  if (containers && containers.size) {
    containers.forEach((container) => {
      if (container.get('id') === currentPageId) {
        theContainer = container;
      }

      elementArray = elementArray.concat(container.get('elements'));
    });
  }


  const currentPage = thePage || theContainer;

  const userId = get(state, 'system.env.userInfo').get('id');
  const fontList = get(state, 'system.fontList');

  return {
    setting,
    bookSetting,
    cover,
    containers,
    elementArray,
    pageArray,
    imageArray,
    property,
    parameterMap,
    variableMap,

    configurableOptionArray,
    parameterArray,
    variableArray,

    queryStringObj,
    urls,
    currentPage,
    snipping,
    ratioMap,

    userId,
    fontList
  };
}
