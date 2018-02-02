import Immutable from 'immutable';
import { merge } from 'lodash';
import { pageTypes, bookShapeTypes } from '../../contants/strings';

/**
 * 计算渲染内页page容器(包括两个容器: 一个是不加出血的, 另一个加上出血,)的宽高和坐标.
 * - 不加出血的容器, 是为了隐藏出血部分的渲染, 因为在我们的效果图中, 看到的样子就是客户最终拿到手的产品的样子.
 * - 加上出血的容器, 是为了给page的元素做定位.
 */
export const computedCoverSheet = (
  workspaceRatio,
  size,
  pages,
  pageIndex,
  position,
  isCrystalOrMetal = false,
  isHardCover = false,
  bookShape = bookShapeTypes.square) => {
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

  // 获取当前的page.
  const page = pages.get(pageIndex);

  if (page) {
    // TODO: expandingOverFrontcover的渲染效果没有, 所以暂时先不考虑这个渲染.
    // 书脊压线.
    // const expandingOverBackcover = Math.ceil(size.spainExpanding.expandingOverBackcover * workspaceRatio);
    // const expandingOverFrontcover = Math.ceil(size.spainExpanding.expandingOverFrontcover * workspaceRatio);
    const expandingOverBackcover = 0;
    const expandingOverFrontcover = 0;

    const renderSpainWidth = size.renderSpainWidth;

    // 出血:
    const bleed = {
      top: Math.ceil(page.getIn(['bleed', 'top']) * workspaceRatio),
      right: Math.ceil(page.getIn(['bleed', 'right']) * workspaceRatio),
      bottom: Math.ceil(page.getIn(['bleed', 'bottom']) * workspaceRatio),
      left: Math.ceil(page.getIn(['bleed', 'left']) * workspaceRatio),
    };

    const pageSize = {
      width: Math.ceil(page.get('width') * workspaceRatio),
      height: Math.ceil(page.get('height') * workspaceRatio)
    };

    const renderCoverSheetSizeWidth = Math.ceil(isCrystalOrMetal ? size.renderCoverSheetSize.width + expandingOverFrontcover : size.renderCoverSheetSize.width);
    const renderCoverSheetSizeWithoutBleedWidth = Math.ceil(isCrystalOrMetal ? size.renderCoverSheetSizeWithoutBleed.width + expandingOverFrontcover : size.renderCoverSheetSizeWithoutBleed.width);

    // back
    switch (page.get('type')) {
      case pageTypes.back: {
        // 而back page的宽的计算方式是.
        renderCoverSheetSize = {
          width: Math.ceil((renderCoverSheetSizeWidth - size.renderSpainWidth) / 2 + (page.getIn(['bleed', 'right']) + page.getIn(['bleed', 'left'])) * workspaceRatio),
          height: Math.ceil(size.renderCoverSheetSize.height),
          top: -bleed.top,
          left: -bleed.left
        };

        // 不含出血
        renderCoverSheetSizeWithoutBleed = {
          width: Math.ceil((renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2),
          height: size.renderCoverSheetSizeWithoutBleed.height,
          top: newPosition.render.top,
          left: newPosition.render.left
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
          top: newPosition.render.top,
          left: Math.ceil(newPosition.render.left + (renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2)
        };
        break;
      }
      case pageTypes.front: {
        const halfPageWidth = Math.ceil((renderCoverSheetSizeWidth - size.renderSpainWidthWithoutBleed) / 2 + page.getIn(['bleed', 'left']) * workspaceRatio);
        const halfPageLeft = Math.ceil((renderCoverSheetSizeWidth - size.renderSpainWidthWithoutBleed) / 2 + size.renderSpainWidthWithoutBleed);

        // 而front page的宽的计算方式是.
        renderCoverSheetSize = {
          width: isCrystalOrMetal ? (halfPageWidth - expandingOverFrontcover) : halfPageWidth,
          height: size.renderCoverSheetSize.height,
          top: -bleed.top,
          left: isCrystalOrMetal ? (-bleed.left + expandingOverFrontcover) : -bleed.left
        };

        // 不含出血
        const halfPageWidthWithoutBleed = Math.ceil((renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2);
        const halfPageLeftWithoutBleed = Math.ceil((renderCoverSheetSizeWithoutBleedWidth - size.renderSpainWidthWithoutBleed) / 2 + size.renderSpainWidthWithoutBleed);

        // offset
        const offset = {
          width: isCrystalOrMetal & halfPageWidthWithoutBleed > 130 ? -expandingOverFrontcover : 0,
          height: halfPageWidthWithoutBleed > 130 ? 4 : 0,
          top: halfPageWidthWithoutBleed > 130 ? -2 : 0,
          left: isCrystalOrMetal & halfPageWidthWithoutBleed > 130 ? expandingOverFrontcover : 0
        };

        switch (bookShape) {
          case bookShapeTypes.landscape: {
            // offset.top += size.renderCoverSheetSizeWithoutBleed.height < 80 ? 1 : 0;
            // offset.height += 1;
            break;
          }
          case bookShapeTypes.square: {
            break;
          }
          case bookShapeTypes.portrait: {
            break;
          }
          default: {
            break;
          }
        }

        renderCoverSheetSizeWithoutBleed = {
          width: halfPageWidthWithoutBleed + offset.width,
          height: size.renderCoverSheetSizeWithoutBleed.height + offset.height,
          top: newPosition.render.top + offset.top,
          left: newPosition.render.left + halfPageLeftWithoutBleed + offset.left
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

        const offset = {
          height: isHardCover ? (size.renderCoverSheetSizeWithoutBleed.height >= 100 ? 6 : 2) : 0,
          width: 0,
          top: isHardCover ? (size.renderCoverSheetSizeWithoutBleed.height >= 100 ? -3 : -1) : 0,
          left: 0
        };

        // 不含出血
        renderCoverSheetSizeWithoutBleed = {
          width: renderCoverSheetSizeWithoutBleedWidth + offset.width,
          height: size.renderCoverSheetSizeWithoutBleed.height + offset.height,
          top: newPosition.render.top + offset.top,
          left: newPosition.render.left + offset.left
        };

        break;
      }
      default: {
        break;
      }
    }
  }

  return {
    renderCoverSheetSize,
    renderCoverSheetSizeWithoutBleed
  };
};

export const hasBleed = (pages) => {
  let value = 0;

  if (pages && pages.size) {
    const page = pages.find(p => p.get('type') === pageTypes.full || p.get('type') === pageTypes.back || p.get('type') === pageTypes.front);

    if (page) {
      value = page.getIn(['bleed', 'top']);
    }
  }

  return value !== 0;
};

export const isSmallView = (renderCoverSheetSize) => {
  let value = false;

  if(renderCoverSheetSize){
    const { width, height } = renderCoverSheetSize;

    value = width < 150;
  }

  return value;
};

export const onMouseOverInnerSheet = (that, page, event) => {
  that.setState({
    pageHovers: [{
      id: page.get('id'),
      value: true
    }]
  });
};

export const onMouseOutInnerSheet = (that, page, event) => {
  that.setState({ pageHovers: [] });
};
