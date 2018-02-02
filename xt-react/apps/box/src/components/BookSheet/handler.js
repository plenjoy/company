import { get } from 'lodash';

/**
 * 查找该page下的所有elements.
 * @param  {object} page
 * @param  {array} elements
 */
export const getPageElements = (that, page, elements) => {
  const newElements = [];
  const pageElements = get(page, 'elements');

  if (page && pageElements && pageElements.length && elements) {
    pageElements.forEach((id) => {
      const element = get(elements, id);
      if (element) {
        newElements.push(element);
      }
    });
  }

  return newElements;
};

export const computedInnerSheet = (params) => {
  const {
    page,
    pageIndex,
    rate,
    backgroundSize
  } = params;

  let renderInnerSheetSize;
  let renderInnerSheetSizeWithoutBleed;

  const bleed = page.bleed;
  const wrapSize = page.wrapSize;

  const {
    lPagePaddingTop,
    lPagePaddingLeft,
    rPagePaddingTop,
    rPagePaddingLeft
  } = backgroundSize;

  switch (page.position) {
    case 'left': {
      // 而back page的宽的计算方式是.
      renderInnerSheetSize = {
        width: `${page.width * rate}px`,
        height: `${page.height * rate}px`,
        top: `-${(bleed.top + wrapSize.top) * rate}px`,
        left: `-${(bleed.left + wrapSize.left) * rate}px`
      };

      // 不含出血
      renderInnerSheetSizeWithoutBleed = {
        width: `${(page.width - bleed.left - bleed.right - wrapSize.left - wrapSize.right) * rate}px`,
        height: `${(page.height - bleed.top - bleed.bottom - wrapSize.top - wrapSize.bottom) * rate}px`,
        top: `${lPagePaddingTop * rate}px`,
        left: `${lPagePaddingLeft * rate}px`
      };
      break;
    }
    case 'right': {
      renderInnerSheetSize = {
        width: `${page.width * rate}px`,
        height: `${page.height * rate}px`,
        top: `-${(bleed.top + wrapSize.top) * rate}px`,
        left: `-${(bleed.left + wrapSize.left) * rate}px`
      };

      // 不含出血
      renderInnerSheetSizeWithoutBleed = {
        width: `${(page.width - bleed.left - bleed.right - wrapSize.left - wrapSize.right) * rate}px`,
        height: `${(page.height - bleed.top - bleed.bottom - wrapSize.top - wrapSize.bottom) * rate}px`,
        top: `${rPagePaddingTop * rate}px`,
        left: `${rPagePaddingLeft * rate}px`
      };
      break;
    }
    default: {
      break;
    }
  }

  return {
    renderInnerSheetSize,
    renderInnerSheetSizeWithoutBleed
  };
};
