import Immutable from 'immutable';
import { merge } from 'lodash';
import { pageTypes, bookShapeTypes } from '../../contants/strings';

/**
 * 计算渲染内页page容器(包括两个容器: 一个是不加出血的, 另一个加上出血,)的宽高和坐标.
 * - 不加出血的容器, 是为了隐藏出血部分的渲染, 因为在我们的效果图中, 看到的样子就是客户最终拿到手的产品的样子.
 * - 加上出血的容器, 是为了给page的元素做定位.
 */
export const computedCoverSheet = (workspaceRatio, size, pages, pageIndex, position, isCrystalOrMetal = false) => {
  let renderCoverSheetSize = {
    width: size.renderCoverSheetSize.width,
    height: size.renderCoverSheetSize.height,
    top: 0,
    left: 0
  };

  let renderCoverSheetSizeWithoutBleed = {
    width: size.renderCoverSheetSizeWithoutBleed.width,
    height: size.renderCoverSheetSizeWithoutBleed.height,
    top: 0,
    left: 0
  };

  // 给position添加默认值.
  const newPosition = merge({}, {
    render: {
      top: 0,
      left: 0
    }
  }, position);

  if (!newPosition.cover) {
    newPosition.cover = merge({}, newPosition);
  }

  // 获取当前的page.
  const page = pages.get(pageIndex);

  // TODO: expandingOverFrontcover的渲染效果没有, 所以暂时先不考虑这个渲染.
  // 书脊压线.
  // const expandingOverBackcover = Math.floor(size.spainExpanding.expandingOverBackcover * workspaceRatio);
  // const expandingOverFrontcover = Math.floor(size.spainExpanding.expandingOverFrontcover * workspaceRatio);
  const expandingOverBackcover = 0;
  const expandingOverFrontcover = 0;

  const renderSpainWidth = size.renderSpainWidth;

  // 出血:
  const bleed = {
    top: Math.floor(page.getIn(['bleed', 'top']) * workspaceRatio),
    right: Math.floor(page.getIn(['bleed', 'right']) * workspaceRatio),
    bottom: Math.floor(page.getIn(['bleed', 'bottom']) * workspaceRatio),
    left: Math.floor(page.getIn(['bleed', 'left']) * workspaceRatio),
  };

  const pageSize = {
    width: Math.floor(page.get('width') * workspaceRatio),
    height: Math.floor(page.get('height') * workspaceRatio)
  };

  const renderCoverSheetSizeWidth = Math.floor(isCrystalOrMetal ? size.renderCoverSheetSize.width + expandingOverFrontcover : size.renderCoverSheetSize.width);
  const renderCoverSheetSizeWithoutBleedWidth = Math.floor(isCrystalOrMetal ? size.renderCoverSheetSizeWithoutBleed.width + expandingOverFrontcover : size.renderCoverSheetSizeWithoutBleed.width);

  // back
  switch (page.get('type')) {
    case pageTypes.back: {
      // 而back page的宽的计算方式是.
      renderCoverSheetSize = {
        width: Math.floor((renderCoverSheetSizeWidth - size.renderSpainWidth) / 2 + (page.getIn(['bleed', 'right']) + page.getIn(['bleed', 'left'])) * workspaceRatio),
        height: Math.floor(size.renderCoverSheetSize.height),
        top: -bleed.top,
        left: -bleed.left
      };

      // 不含出血
      renderCoverSheetSizeWithoutBleed = {
        width: Math.floor((renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2),
        height: size.renderCoverSheetSizeWithoutBleed.height,
        top: newPosition.cover.render.top,
        left: newPosition.cover.render.left
      };
      break;
    }
    case pageTypes.spine: {
      // 而back page的宽的计算方式是.
      renderCoverSheetSize = {
        width: size.renderSpainWidth,
        height: size.renderCoverSheetSize.height,
        top: -bleed.top,
        left: -bleed.left
      };

      // 不含出血
      renderCoverSheetSizeWithoutBleed = {
        width: size.renderSpainWidthWithoutBleed,
        height: size.renderCoverSheetSizeWithoutBleed.height,
        top: newPosition.cover.render.top,
        left: Math.floor(newPosition.cover.render.left + (renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2)
      };
      break;
    }
    case pageTypes.front: {
      const halfPageWidth = Math.floor((renderCoverSheetSizeWidth - size.renderSpainWidthWithoutBleed) / 2 + page.getIn(['bleed', 'left']) * workspaceRatio);
      const halfPageLeft = Math.floor((renderCoverSheetSizeWidth - size.renderSpainWidthWithoutBleed) / 2 + size.renderSpainWidthWithoutBleed);

      // 而front page的宽的计算方式是.
      renderCoverSheetSize = {
        width: isCrystalOrMetal ? (halfPageWidth - expandingOverFrontcover) : halfPageWidth,
        height: size.renderCoverSheetSize.height,
        top: -bleed.top,
        left: isCrystalOrMetal ? (-bleed.left + expandingOverFrontcover) : -bleed.left
      };

      // 不含出血
      const halfPageWidthWithoutBleed = Math.floor((renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2);
      const halfPageLeftWithoutBleed = Math.floor((renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2 + size.renderSpainWidthWithoutBleed);

      renderCoverSheetSizeWithoutBleed = {
        width: isCrystalOrMetal ? (halfPageWidthWithoutBleed - expandingOverFrontcover) : halfPageWidthWithoutBleed,
        height: size.renderCoverSheetSizeWithoutBleed.height,
        top: newPosition.cover.render.top,
        left: isCrystalOrMetal ? (newPosition.cover.render.left + halfPageLeftWithoutBleed + expandingOverFrontcover) : (newPosition.cover.render.left + halfPageLeftWithoutBleed)
      };
      break;
    }
    case pageTypes.full: {
      // 而back page的宽的计算方式是.
      renderCoverSheetSize = {
        width: renderCoverSheetSizeWidth,
        height: size.renderCoverSheetSize.height,
        top: -bleed.top,
        left: -bleed.left
      };

      // 不含出血
      renderCoverSheetSizeWithoutBleed = {
        width: renderCoverSheetSizeWithoutBleedWidth,
        height: size.renderCoverSheetSizeWithoutBleed.height,
        top: newPosition.cover.render.top,
        left: newPosition.cover.render.left
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


/**
 * 计算渲染内页page容器(包括两个容器: 一个是不加出血的, 另一个加上出血,)的宽高和坐标.
 * - 不加出血的容器, 是为了隐藏出血部分的渲染, 因为在我们的效果图中, 看到的样子就是客户最终拿到手的产品的样子.
 * - 加上出血的容器, 是为了给page的元素做定位.
 */
export const computedInnerSheet = (
  workspaceRatio,
  size,
  pages,
  pageIndex,
  bookShape = bookShapeTypes.square) => {
  let renderInnerSheetSize = {
    width: size.renderInnerSheetSize.width,
    height: size.renderInnerSheetSize.height,
    top: 0,
    left: 0
  };

  // 修复颜色线.
  const offset = { width: 0, height: 0, top: 0, left: 0 };

  if(bookShape === bookShapeTypes.portrait){
    offset.height = 1;
  }

  if (size.renderInnerSheetSizeWithoutBleed.height > 300) {
    offset.width = 3;
  } else if (size.renderInnerSheetSizeWithoutBleed.height > 80) {
    offset.width = 2;
  }

  let renderInnerSheetSizeWithoutBleed = {
    width: size.renderInnerSheetSizeWithoutBleed.width + offset.width,
    height: size.renderInnerSheetSizeWithoutBleed.height + offset.height,
    top: offset.top,
    left: offset.left
  };

  // 获取当前的page.
  const page = pages.get(pageIndex);

  // 判断当前的page是不是page,
  if (page.get('type') === pageTypes.page) {
    // 当前, 一个sheet之多有两个page
    if (pages.size > 1) {
      // 如果是第一个page
      if (pageIndex === 0) {
        // 包含出血,
        // 第一个page, 还要把page的右出血加上因为在selector上计算renderInnerSheetSize时, 把右出血给去除了.
        renderInnerSheetSize = {
          width: size.renderInnerSheetSize.width / 2 + page.getIn(['bleed', 'right']) * workspaceRatio,
          height: size.renderInnerSheetSize.height,
          top: 0,
          left: 0
        };

        // 不含出血
        renderInnerSheetSizeWithoutBleed = {
          width: size.renderInnerSheetSizeWithoutBleed.width / 2,
          height: size.renderInnerSheetSizeWithoutBleed.height,
          top: 0,
          left: 0
        };
      } else if (pageIndex === 1) {
        // 包含出血,
        // 第二个page, 还要把page的右出血加上因为在selector上计算renderInnerSheetSize时, 把左出血给去除了.
        renderInnerSheetSize = {
          width: size.renderInnerSheetSize.width / 2 + page.getIn(['bleed', 'left']) * workspaceRatio,
          height: size.renderInnerSheetSize.height,
          top: 0,
          left: 0 // -page.getIn(['bleed', 'left']) * workspaceRatio
        };

        // 不含出血
        renderInnerSheetSizeWithoutBleed = {
          width: size.renderInnerSheetSizeWithoutBleed.width / 2 + offset.width,
          height: size.renderInnerSheetSizeWithoutBleed.height + offset.height,
          top: offset.top,
          left: size.renderInnerSheetSizeWithoutBleed.width / 2 + offset.left
        };
      }
    }
  }

  return {
    renderInnerSheetSize,
    renderInnerSheetSizeWithoutBleed
  };
};
