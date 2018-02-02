import Immutable from 'immutable';
import * as types from '../../contants/actionTypes';

import { getDataFromState } from '../../utils/getDataFromState';
import { elementTypes } from '../../contants/strings';
import { getPxByPt } from '../../../../common/utils/math';

function getFontUpdatedElements(fontList, bookSetting, pageArray, containers) {
  const fontSetting = bookSetting.get('font');

  const selectedFont = fontList.find((font) => {
    return font.id === fontSetting.get('fontFamilyId');
  });

  const fontObj = selectedFont.font.find((o) => {
    return o.id === fontSetting.get('fontId');
  });

  let updateObjectArray = Immutable.List();

  const newPageArray = pageArray.concat(containers);

  newPageArray.forEach((page) => {
    const elements = page.get('elements');

    elements.forEach((element) => {
      if (element.get('type') === elementTypes.text) {
        const newAttributes = {
          id: element.get('id'),
          fontWeight: fontObj.weight,
          fontFamily: fontObj.fontFace,
          fontColor: fontSetting.get('color'),
          fontSize: getPxByPt(fontSetting.get('fontSize')) / page.get('height')
        };
        const newElement = element.merge(newAttributes);

        if (!Immutable.is(newElement, element)) {
          updateObjectArray = updateObjectArray.push(Immutable.fromJS({
            elements: [newAttributes],
            pageId: page.get('id')
          }));
        }
      }
    });
  });

  return updateObjectArray;
}

function getBorderUpdatedElements(bookSetting, pageArray, containers) {
  const border = bookSetting.get('border');

  let updateObjectArray = Immutable.List([]);

  const newPageArray = pageArray.concat(containers);

  newPageArray.forEach((page) => {
    const elements = page.get('elements');

    elements.forEach((element) => {
      if (element.get('type') === elementTypes.photo) {
        const newAttributes = {
          id: element.get('id'),
          border
        };
        const newElement = element.merge(newAttributes);

        if (!Immutable.is(newElement, element)) {
          updateObjectArray = updateObjectArray.push(Immutable.fromJS({
            elements: [newAttributes],
            pageId: page.get('id')
          }));
        }
      }
    });
  });

  return updateObjectArray;
}

export function changeBookSetting(bookSetting) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { fontList, pageArray, containers } = stateData;

    const immutableBookSetting = Immutable.fromJS(bookSetting);

    dispatch({
      type: types.CHANGE_BOOK_SETTING,
      bookSetting: immutableBookSetting
    });

    const isApplyFont = immutableBookSetting.get('applyFont');
    if (isApplyFont) {
      const fontUpdatedElements = getFontUpdatedElements(
        fontList, immutableBookSetting, pageArray, containers
      );
      if (fontUpdatedElements.size) {
        dispatch({
          type: types.UPDATE_ELEMENTS,
          updateObjectArray: fontUpdatedElements
        });
      }
    }

    const isApplyBorderFrame = immutableBookSetting.get('applyBorderFrame');
    if (isApplyBorderFrame) {
      const borderUpdatedElements = getBorderUpdatedElements(
        immutableBookSetting, pageArray, containers
      );

      if (borderUpdatedElements.size) {
        dispatch({
          type: types.UPDATE_ELEMENTS,
          updateObjectArray: borderUpdatedElements
        });
      }
    }

    return Promise.resolve();
  };
}
