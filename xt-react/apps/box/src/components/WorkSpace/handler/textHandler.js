import { merge, template, get, set, isEqual } from 'lodash';

import { TEXT_SRC } from '../../../contants/apiUrl';
import { loadImg } from '../../../../common/utils/image';
import { getNewPosition } from '../../../utils/elementPosition';
import { getPxByPt, getPtByPx } from '../../../../common/utils/math';
import { defaultFontStyle, elementTypes, pageTypes, defaultFrameOptions } from '../../../contants/strings';
import { numberToHex, hexString2Number } from '../../../../common/utils/colorConverter';

export const addText = (options) => {
  const { boundProjectActions, ratio, pagination, paginationSpread, elementArray } = options;
  const { pages } = paginationSpread;
  const pageId = get(pagination, 'pageId');
  const currentPage = pages.find(p => p.id === pageId);
  const elements = get(currentPage, 'elements');
  const { height } = currentPage;
  const text = '';
  let fontSize = defaultFontStyle.defaultFontSize / ratio;
  const fontFamily = encodeURIComponent(defaultFontStyle.defaultFontFamily);
  const fontWeight = encodeURIComponent(defaultFontStyle.defaultFontWeight);
  const color = '#000000';
  const textAlign = 'center';
  const elementWidth = currentPage.width * defaultFrameOptions.default.value;
  const elementHeight = elementWidth / defaultFrameOptions.default.whRatio;
  const newElementPosition = getNewPosition(elementArray, currentPage, elementWidth, elementHeight);
  const textVAlign = 'middle';

  const rot = 0;
  const elType = 'text';

  let maxDep = 0;
  elementArray.forEach((ele) => {
    if (elements.indexOf(get(ele, 'id')) !== -1) {
      maxDep = maxDep < get(ele, 'dep') ? get(ele, 'dep') : maxDep;
    }
  });

  const dep = maxDep + 1;

  fontSize /= height;

  boundProjectActions.createElement(pageId, {
    type: elementTypes.text,
    text,
    fontFamily,
    fontSize,
    fontColor: color,
    fontWeight,
    textAlign,
    textVAlign,
    width: elementWidth,
    height: elementHeight,
    x: newElementPosition.x,
    y: newElementPosition.y,
    px: newElementPosition.x / currentPage.width,
    py: newElementPosition.y / currentPage.height,
    pw: elementWidth / currentPage.width,
    ph: elementHeight / currentPage.height,
    rot,
    dep,
    elType
  });
}
