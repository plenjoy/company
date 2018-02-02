import Immutable from 'immutable';
import * as types from '../../constants/actionTypes';

import { guid } from '../../../../common/utils/math';
import { getDataFromState } from '../../utils/getDataFromState';
import { getImageUsedMap } from './imageUsedMapActions';
import setElementByType from '../../utils/setElementByType';
import { elementTypes, productTypes, coverTypes } from '../../constants/strings';

export function createElements(elements, pageId) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());

    const { currentPage, imageArray, pageArray, containers } = stateData;
    const immutableElements = Immutable.fromJS(elements);
    let newElements = Immutable.List();

    const thePage = pageArray.find(o => o.get('id') === pageId) ||
      containers.find(o => o.get('id') === pageId) || currentPage;


    immutableElements.forEach((element) => {
      newElements = newElements.push(
        setElementByType(element, thePage, imageArray).merge({ id: guid() })
      );
    });

    const thePageId = thePage.get('id');

    dispatch({
      type: types.CREATE_ELEMENTS,
      pageId: thePageId,
      elements: newElements
    });

    dispatch({
      type: types.UPDATE_PAGE_TEMPLATE_ID,
      pageId: thePageId,
      templateId: ''
    });

    return Promise.resolve();
  };
}

export function createElement(element, pageId) {
  return createElements([element], pageId);
}

export function deleteElements(elementIds) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { elementPageIdMap } = stateData;

    const thePageId = elementPageIdMap.get(elementIds[0]);

    dispatch({
      type: types.DELETE_ELEMENTS,
      pageId: thePageId,
      elementIds
    });

    dispatch({
      type: types.UPDATE_PAGE_TEMPLATE_ID,
      pageId: thePageId,
      templateId: ''
    });

    dispatch({
      type: types.SET_IMAGE_USED_MAP,
      imageUsedMap: getImageUsedMap(getDataFromState(getState()).elementArray)
    });

    return Promise.resolve();
  };
}

export function deleteElement(elementId) {
  return deleteElements([elementId]);
}

function removeCameoImage(containers, elementArray, dispatch) {
  const cameoElement = elementArray.find((o) => {
    return o.get('type') === elementTypes.cameo;
  });
  if (cameoElement) {
    const theContainer = containers.find((container) => {
      return container.get('elements').find((o) => {
        return o.get('id') === cameoElement.get('id');
      });
    });

    if (theContainer) {
      dispatch({
        type: types.UPDATE_ELEMENTS,
        updateObjectArray: Immutable.fromJS([
          {
            elements: [{
              id: cameoElement.get('id'),
              encImgId: ''
            }],
            pageId: theContainer.get('id')
          }
        ])
      });
    }
  }
}

export function deleteAll() {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { setting, elementArray, containers } = stateData;

    const product = setting.get('product');
    const cover = setting.get('cover');

    const needCameoCoverTypes = [coverTypes.PSNC, coverTypes.PSLC];

    let willDeleteElements = elementArray;
    if (product === productTypes.PS &&
      needCameoCoverTypes.indexOf(cover) !== -1) {
      willDeleteElements = elementArray.filter((element) => {
        return element.get('type') !== elementTypes.cameo;
      });

      removeCameoImage(containers, elementArray, dispatch);
    }

    dispatch({
      type: types.DELETE_ALL,
      willDeleteElementIds: willDeleteElements.map(o => o.get('id'))
    });

    dispatch({
      type: types.SET_IMAGE_USED_MAP,
      imageUsedMap: getImageUsedMap(getDataFromState(getState()).elementArray)
    });

    return Promise.resolve();
  };
}

export function updateElements(updateObjectArray) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const {
      imageArray,
      pageArray,
      containers,
      elementPageIdMap
    } = stateData;

    let fixedUpdateObjectArray = Immutable.List();
    const immutableUpdateObjectArray = Immutable.fromJS(updateObjectArray);

    if (!immutableUpdateObjectArray.size) {
      return Promise.resolve();
    }

    immutableUpdateObjectArray.forEach((updateObject) => {
      const elements = updateObject.get('elements') || Immutable.List([updateObject]);

      const thePageId = elementPageIdMap.get(elements.getIn(['0', 'id']));

      const thePage = pageArray.find(o => o.get('id') === thePageId) ||
        containers.find(o => o.get('id') === thePageId);

      const theElements = thePage.get('elements');

      let immutableElements = Immutable.fromJS(elements);
      immutableElements.forEach((element, index) => {
        const theElement = theElements.find((o) => {
          return o.get('id') === element.get('id');
        });
        if (theElement) {
          const mergedElements = element.set('type', theElement.get('type'));
          immutableElements = immutableElements.set(
            String(index), mergedElements
          );
        }
      });

      let newElements = Immutable.List();

      immutableElements.forEach((element) => {
        newElements = newElements.push(
          setElementByType(element, thePage, imageArray)
        );
      });

      fixedUpdateObjectArray = fixedUpdateObjectArray.push(Immutable.Map({
        pageId: thePageId,
        elements: newElements
      }));

      // dispatch({
      //   type: types.UPDATE_PAGE_TEMPLATE_ID,
      //   pageId: thePageId,
      //   templateId: ''
      // });
    });

    dispatch({
      type: types.UPDATE_ELEMENTS,
      updateObjectArray: fixedUpdateObjectArray
    });

    const firstElement = fixedUpdateObjectArray.getIn(['0', 'elements', '0']);

    if (typeof firstElement.get('encImgId') !== 'undefined') {
      dispatch({
        type: types.SET_IMAGE_USED_MAP,
        imageUsedMap: getImageUsedMap(getDataFromState(getState()).elementArray)
      });
    }

    return Promise.resolve();
  };
}

export function updateElement(element) {
  return updateElements([{ elements: [element] }]);
}

