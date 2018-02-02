import { get } from 'lodash';
import { pageTypes } from '../../contants/strings';

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


/**
 * 计算渲染内页page容器(包括两个容器: 一个是不加出血的, 另一个加上出血,)的宽高和坐标.
 * - 不加出血的容器, 是为了隐藏出血部分的渲染, 因为在我们的效果图中, 看到的样子就是客户最终拿到手的产品的样子.
 * - 加上出血的容器, 是为了给page的元素做定位.
 */
export const computedCoverSheetStyle = (params) => {
  const {
    page,
    pages,
    rate
  } = params;

  let renderCoverSheetSize;
  let renderCoverSheetSizeWithoutBleed;
  const pageType = page.type;
  const bleed = page.bleed;
  const wrapSize = page.wrapSize;
  const bleedWidth = get(bleed, 'left') + get(bleed, 'right');
  const bleedHeight = get(bleed, 'top') + get(bleed, 'bottom');
  const wrapHeight = get(wrapSize, 'top') + get(wrapSize, 'bottom');

  switch (pageType) {
    case pageTypes.back: {
      // 而back page的宽的计算方式是.
      renderCoverSheetSize = {
        width: `${page.width * rate}px`,
        height: `${page.height * rate}px`,
        top: `-${(bleed.top + get(wrapSize, 'top')) * rate}px`,
        left: `-${(bleed.left + get(wrapSize, 'left')) * rate}px`
      };

      // 不含出血
      renderCoverSheetSizeWithoutBleed = {
        width: `${(page.width - bleedWidth - get(wrapSize, 'left')) * rate}px`,
        height: `${(page.height - bleedHeight - wrapHeight) * rate}px`,
        top: 0,
        left: 0
      };
      break;
    }
    case pageTypes.spine: {
      const spineWidth = page.width + get(page, 'spineExpanding.expandingOverBackcover') + get(page, 'spineExpanding.expandingOverFrontcover');
      let spineLeft = 0;
      const fullPage = pages.find(p => p.type === pageTypes.full);
      if (fullPage) {
        const fullPageCenterWidth = fullPage.width - fullPage.bleed.left - fullPage.bleed.right -  fullPage.wrapSize.left - fullPage.wrapSize.right;
        spineLeft = (fullPageCenterWidth - page.width) / 2 * rate;
      } else {
        const backPage = pages.find(p => p.type === pageTypes.back);
        const backPageWidth = backPage.width - get(backPage, 'bleed.left') - get(backPage, 'bleed.right') - get(backPage, 'wrapSize.left');
        spineLeft = (backPageWidth + get(page, 'spineExpanding.expandingOverBackcover')) * rate;
      }

      // spine page的宽的计算方式是.
      renderCoverSheetSize = {
        width: `${page.width * rate}px`,
        height: `${page.height * rate}px`,
        top: `-${get(wrapSize, 'top') * rate}px`,
        left: 0
      };

      // 不含出血
      renderCoverSheetSizeWithoutBleed = {
        width: `${page.width * rate}px`,
        height: `${(page.height - get(wrapSize, 'top') - get(wrapSize, 'bottom')) * rate}px`,
        top: 0,
        left: `${spineLeft}px`
      };
      break;
    }
    case pageTypes.front: {
      const backPage = pages.find(p => p.type === pageTypes.back);
      const spinePage = pages.find(p => p.type === pageTypes.spine);
      const backPageWidth = backPage.width - get(backPage, 'bleed.left') - get(backPage, 'bleed.right') - get(backPage, 'wrapSize.left');
      const spineAndExpandingWidth = spinePage.width + get(spinePage, 'spineExpanding.expandingOverBackcover') + get(spinePage, 'spineExpanding.expandingOverFrontcover');
      const frontPageLeft = (backPageWidth + spineAndExpandingWidth) * rate;
      const pageBleedWidth = get(page, 'bleed.left') + get(page, 'bleed.right');
      const pageBleedHeight = get(page, 'bleed.top') + get(page, 'bleed.bottom');
      const pageWrapSizeHeight = get(page, 'wrapSize.top') + get(page, 'wrapSize.bottom');
      // 而front page的宽的计算方式是.
      renderCoverSheetSize = {
        width: `${page.width * rate}px`,
        height: `${page.height * rate}px`,
        top: `-${(get(page, 'bleed.top') + get(page, 'wrapSize.top')) * rate}px`,
        left: `-${get(page, 'bleed.left') * rate}px`
      };

      renderCoverSheetSizeWithoutBleed = {
        width: `${(page.width - pageBleedWidth - get(page, 'wrapSize.right')) * rate}px`,
        height: `${(page.height - pageBleedHeight - pageWrapSizeHeight) * rate}px`,
        top: 0,
        left: `${frontPageLeft}px`
      };

      break;
    }
    case pageTypes.full: {
      // 而back page的宽的计算方式是.
      renderCoverSheetSize = {
        width: `${page.width * rate}px`,
        height: `${page.height * rate}px`,
        top: `-${(bleed.top + wrapSize.top) * rate}px`,
        left: `-${(bleed.left + wrapSize.left) * rate}px`
      };

      // 不含出血
      renderCoverSheetSizeWithoutBleed = {
        width: `${(page.width - bleed.left - bleed.right - wrapSize.left - wrapSize.right) * rate}px`,
        height: `${(page.height - bleed.top - bleed.bottom - wrapSize.top - wrapSize.bottom) * rate}px`,
        top: 0,
        left: 0
      };

      break;
    }
    default: {
      break;
    }
  }

  return {
    renderCoverSheetSize,
    renderCoverSheetSizeWithoutBleed
  };
};

