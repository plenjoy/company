import Immutable from 'immutable';
import { get } from 'lodash';

export function getDataFromState(state) {
  const setting = get(state, 'project.data.setting');
  const pageArray = get(state, 'project.data.pageArray.present');
  const cover = get(state, 'project.data.cover');
  const imageArray = get(state, 'project.data.imageArray');
  const property = get(state, 'project.data.property');
  const parameterMap = get(state, 'project.data.parameterMap');
  const variableMap = get(state, 'project.data.variableMap');

  const configurableOptionArray = get(state, 'spec').get('configurableOptionArray').toJS();
  const parameterArray = get(state, 'spec').get('parameterArray').toJS();
  const variableArray = get(state, 'spec').get('variableArray').toJS();
  const allOptionMap = get(state, 'spec').get('allOptionMap').toJS();
  const disableOptionArray = get(state, 'spec').get('disableOptionArray').toJS();

  const urls = get(state, 'system.env.urls');
  const queryStringObj = get(state, 'system.env.qs');

  const currentPageId = get(state, 'system.global.pagination').get('pageId');
  const snipping = get(state, 'system.global.snipping');
  const ratioMap = get(state, 'system.global.ratio');

  let thePage = null;
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
  const currentPage = thePage;

  const userId = get(state, 'system.env.userInfo').get('id');
  const fontList = get(state, 'system.fontList');

  return {
    setting,
    cover,
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
    disableOptionArray,

    queryStringObj,
    urls,
    currentPage,
    snipping,
    ratioMap,

    userId,
    fontList
  };
}
