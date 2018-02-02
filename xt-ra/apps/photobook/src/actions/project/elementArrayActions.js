import Immutable from 'immutable';
import * as types from '../../contants/actionTypes';

import { guid } from '../../../../common/utils/math';
import { filterInvalidKeysOfPhotobook } from '../../../../common/utils/elements';

import {
  elementTypes,
  productTypes,
  coverTypes,
  BACKGROUND_ELEMENT_DEP
} from '../../contants/strings';
import { getDataFromState } from '../../utils/getDataFromState';
import { getImageUsedMap } from '../../utils/countUsed';
import setElementByType from '../../utils/setElementByType';

const checkIsAffectLayout = elements => {
  // 只有photoelement, textelement会影响模板.
  const effectKeys = [elementTypes.photo, elementTypes.text];

  const is = !!elements.find(m => effectKeys.indexOf(m.get('type')) !== -1);

  return is;
};

export function createElements(elements, pageId) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());

    const {
      currentPage,
      imageArray,
      pageArray,
      containers,
      backgroundArray,
      stickerArray
    } = stateData;
    const immutableElements = Immutable.fromJS(elements);
    let newElements = Immutable.List();

    const thePage =
      pageArray.find(o => o.get('id') === pageId) ||
      containers.find(o => o.get('id') === pageId) ||
      currentPage;

    immutableElements.forEach(element => {
      newElements = newElements.push(
        setElementByType(
          element,
          thePage,
          imageArray,
          backgroundArray,
          stickerArray
        ).merge({
          id: guid()
        })
      );
    });

    const thePageId = thePage.get('id');

    dispatch({
      type: types.CREATE_ELEMENTS,
      pageId: thePageId,
      elements: newElements
    });

    if (checkIsAffectLayout(newElements)) {
      dispatch({
        type: types.UPDATE_PAGE_TEMPLATE_ID,
        pageId: thePageId,
        templateId: ''
      });
    }

    return Promise.resolve();
  };
}

export function createElement(element, pageId) {
  return createElements([element], pageId);
}

export function deleteElements(elementIds) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { elementPageIdMap, elementArray } = stateData;

    const thePageId = elementPageIdMap.get(elementIds[0]);
    const elements = elementIds.reduce((prev, id) => {
      const element = elementArray.find(m => m.get('id') === id);
      if (element) {
        return prev.push(element);
      }
      return prev;
    }, Immutable.fromJS([]));

    dispatch({
      type: types.DELETE_ELEMENTS,
      pageId: thePageId,
      elementIds
    });

    if (checkIsAffectLayout(elements)) {
      dispatch({
        type: types.UPDATE_PAGE_TEMPLATE_ID,
        pageId: thePageId,
        templateId: ''
      });
    }

    const newElementArray = getDataFromState(getState()).elementArray;

    dispatch({
      type: types.SET_IMAGE_USED_MAP,
      imageUsedMap: getImageUsedMap(newElementArray)
    });

    return Promise.resolve();
  };
}

export function deleteElement(elementId) {
  return deleteElements([elementId]);
}

function removeCameoImage(containers, elementArray, dispatch) {
  const cameoElement = elementArray.find(o => {
    return o.get('type') === elementTypes.cameo;
  });
  if (cameoElement) {
    const theContainer = containers.find(container => {
      return container.get('elements').find(o => {
        return o.get('id') === cameoElement.get('id');
      });
    });

    if (theContainer) {
      dispatch({
        type: types.UPDATE_ELEMENTS,
        updateObjectArray: Immutable.fromJS([
          {
            elements: [
              {
                id: cameoElement.get('id'),
                encImgId: ''
              }
            ],
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
    if (
      product === productTypes.PS &&
      needCameoCoverTypes.indexOf(cover) !== -1
    ) {
      willDeleteElements = elementArray.filter(element => {
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

    immutableUpdateObjectArray.forEach(updateObject => {
      const elements =
        updateObject.get('elements') || Immutable.List([updateObject]);

      const thePageId = elementPageIdMap.get(elements.getIn(['0', 'id']));

      const thePage =
        pageArray.find(o => o.get('id') === thePageId) ||
        containers.find(o => o.get('id') === thePageId);

      const isCover = thePageId === cover.get('id');
      const ratio = isCover
        ? ratioMap.get('coverWorkspace')
        : ratioMap.get('innerWorkspace');

      const theElements = thePage.get('elements');

      let immutableElements = Immutable.fromJS(elements);
      immutableElements.forEach((element, index) => {
        const theElement = theElements.find(o => {
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

      immutableElements.forEach(element => {
        newElements = newElements.push(
          setElementByType(
            element,
            thePage,
            imageArray,
            backgroundArray,
            stickerArray,
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

      if (fixedUpdateObjectArray.size && checkIsAffectLayout(newElements)) {
        dispatch({
          type: types.UPDATE_PAGE_TEMPLATE_ID,
          pageId: thePageId,
          templateId: ''
        });
      }
    });

    dispatch({
      type: types.UPDATE_ELEMENTS,
      updateObjectArray: filterInvalidKeysOfPhotobook(fixedUpdateObjectArray)
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

export function applyBackground(backgroundProps) {
  const backgroundId = backgroundProps.code;
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { currentPage } = stateData;
    const elements = currentPage.get('elements');
    const background = elements.find(
      ele => ele.get('type') === elementTypes.background
    );
    // 将现在使用的background添加到backgroundArray中
    dispatch({
      type: types.ADD_PROJECT_BACKGROUND,
      background: {
        code: backgroundProps.code,
        width: backgroundProps.width,
        height: backgroundProps.height,
        name: backgroundProps.name
      }
    });
    if (!background) {
      const newElement = {
        type: elementTypes.background,
        x: 0,
        y: 0,
        width: currentPage.get('width'),
        height: currentPage.get('height'),
        backgroundId,
        rot: 0,
        suffix: backgroundProps.suffix,
        dep: BACKGROUND_ELEMENT_DEP
      };
      dispatch(createElement(newElement));
    } else if (background.get('backgroundId') !== backgroundId) {
      // 清掉之前使用的background
      dispatch({
        type: types.DELETE_PROJECT_BACKGROUND,
        backgroundId: background.get('backgroundId')
      });
      dispatch(
        updateElement({
          id: background.get('id'),
          suffix: backgroundProps.suffix,
          backgroundId
        })
      );
    } else {
      return Promise.resolve();
    }
  };
}

export function applyDefaultBackground() {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { currentPage } = stateData;
    const elements = currentPage.get('elements');
    const background = elements.find(
      ele => ele.get('type') === elementTypes.background
    );
    if (background) {
      // 清掉之前使用的background
      dispatch({
        type: types.DELETE_PROJECT_BACKGROUND,
        backgroundId: background.get('backgroundId')
      });
      dispatch(deleteElement(background.get('id')));
    } else {
    }
  };
}
