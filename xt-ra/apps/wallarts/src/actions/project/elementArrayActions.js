import Immutable from 'immutable';
import * as types from '../../constants/actionTypes';
import { guid } from '../../../../common/utils/math';
import { getDataFromState } from '../../utils/getDataFromState';
import { getImageUsedMap } from '../../utils/countUsed';
import setElementByType from '../../utils/setElementByType';
import {
  elementTypes,
  productTypes,
  coverTypes,
  BACKGROUND_ELEMENT_DEP
} from '../../constants/strings';

export function updateElements(updateObjectArray) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const {
      imageArray,
      pageArray,
      containers,
      elementPageIdMap,
      backgroundArray,
      stickerArray,
      ratioMap,
      cover
    } = stateData;

    let fixedUpdateObjectArray = Immutable.List();
    const immutableUpdateObjectArray = Immutable.fromJS(updateObjectArray);

    if (!immutableUpdateObjectArray.size) {
      return Promise.resolve();
    }

    immutableUpdateObjectArray.forEach((updateObject) => {
      const elements =
        updateObject.get('elements') || Immutable.List([updateObject]);

      const thePageId = elementPageIdMap.get(elements.getIn(['0', 'id']));

      const thePage =
        pageArray.find(o => o.get('id') === thePageId) ||
        containers.find(o => o.get('id') === thePageId);

      const ratio = ratioMap.get('workspace');

      const theElements = thePage.get('elements');

      let immutableElements = Immutable.fromJS(elements);
      immutableElements.forEach((element, index) => {
        const theElement = theElements.find((o) => {
          return o.get('id') === element.get('id');
        });
        if (theElement) {
          const mergedElements = element.set('type', theElement.get('type'));
          immutableElements = immutableElements.set(
            String(index),
            mergedElements
          );
        }
      });

      let newElements = Immutable.List();

      immutableElements.forEach((element) => {
        newElements = newElements.push(
          setElementByType(
            element,
            thePage,
            imageArray,
            ratio
          )
        );
      });

      fixedUpdateObjectArray = fixedUpdateObjectArray.push(
        Immutable.Map({
          pageId: thePageId,
          elements: newElements
        })
      );

      if (updateObjectArray.size) {
        dispatch({
          type: types.UPDATE_PAGE_TEMPLATE_ID,
          pageId: thePageId,
          templateId: ''
        });
      }
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
