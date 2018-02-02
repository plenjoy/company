import GuideLine from '../../GuideLine';
import { get, merge } from 'lodash';
import React from 'react';
import { transform } from '../../../../../common/utils/transform';
import { pageTypes, elementAction } from '../../../contants/strings';

const NEAR_OFFSET = 8;
const CHECK_OFFSET = 8;
let isAttachedX = false;
let isAttachedY = false;

export const convertLinePositionToStyle = (that, guideLine) => {
  const { containerOffset } = that.state;
  const offsetLeft = containerOffset.left;
  const offsetTop = containerOffset.top;
  const { startPosition, endPosition, lineOptions } = guideLine;
  const { lineStyle, lineColor, lineWidth } = lineOptions || {
    lineStyle: 'solid',
    lineColor: '#4CC1FC',
    lineWidth: 1
  };

  const objStyle = {
    left: offsetLeft + startPosition.x,
    top: offsetTop + startPosition.y,
    width: endPosition.x - startPosition.x || 1,
    height: endPosition.y - startPosition.y || 1,
    display: guideLine.isShown ? 'block' : 'none',
    lineStyle,
    lineColor,
    lineWidth
  };
  return objStyle;
};

export const renderGuideLines = (that) => {
  const { staticGuideLines, dynamicGuideLines, containerOffset } = that.state;
  if (containerOffset) {
    const guideLines = [];
    if (staticGuideLines.length) {
      staticGuideLines.map((g, key) => {
        const guideLineStyle = convertLinePositionToStyle(that, g);
        guideLines.push(
          <GuideLine
            style={guideLineStyle}
            isShown={g.isShown}
            direction={g.direction}
            lineStyle={guideLineStyle.lineStyle}
            lineColor={guideLineStyle.lineColor}
            lineWidth={guideLineStyle.lineWidth}
            key={key}
          />
        );
      });
    }
    if (dynamicGuideLines.length) {
      dynamicGuideLines.map((g, key) => {
        const guideLineStyle = convertLinePositionToStyle(that, g);
        guideLines.push(
          <GuideLine style={guideLineStyle} isShown={g.isShown} direction={g.direction} key={staticGuideLines.length + key} />
        );
      });
    }
    return guideLines;
  }
  return null;
};

export const snapToGuideLine = (that, params) => {
  const { deltaX, deltaY, baseDelta, eleAction, e } = params;
  const { dynamicGuideLines, staticGuideLines } = that.state;
  const { paginationSpread, page } = that.props.data;

  const summary = paginationSpread.get('summary');
  const isSupportPaintedText = summary.get('isSupportPaintedText');
  const isCover = summary.get('isCover');

  const spinePage = paginationSpread.get('pages').find((p) => {
    return p.get('type') === pageTypes.spine;
  });

  const allGuideLines = staticGuideLines.concat(dynamicGuideLines);
  const [minPos, middlePos, maxPos] = getSelectedElementPosition(that);

  let newDeltaX = deltaX;
  let newDeltaY = deltaY;

  isAttachedX = false;
  isAttachedY = false;

  allGuideLines.find((guideLine) => {
    const { startPosition, endPosition } = guideLine;
    const isVerticalLine = (startPosition.x === endPosition.x);
    if (isVerticalLine) {
      if (startPosition.x === minPos.x || startPosition.x === middlePos.x || startPosition.x === maxPos.x) {
        newDeltaX = 0;
        isAttachedX = true;
        return true;
      } else if (Math.abs(startPosition.x - minPos.x) < NEAR_OFFSET) {
        newDeltaX = startPosition.x - minPos.x;
        isAttachedX = true;
        return true;
      } else if (Math.abs(startPosition.x - middlePos.x) < NEAR_OFFSET) {
        newDeltaX = startPosition.x - middlePos.x;
        isAttachedX = true;
        return true;
      } else if (Math.abs(startPosition.x - maxPos.x) < NEAR_OFFSET) {
        newDeltaX = startPosition.x - maxPos.x;
        isAttachedX = true;
        return true;
      }
    } else if (startPosition.y === minPos.y || startPosition.y === middlePos.y || startPosition.y === maxPos.y) {
      newDeltaY = 0;
      isAttachedY = true;
      return true;
    } else if (Math.abs(startPosition.y - minPos.y) < NEAR_OFFSET) {
      newDeltaY = startPosition.y - minPos.y;
      isAttachedY = true;
      return true;
    } else if (Math.abs(startPosition.y - middlePos.y) < NEAR_OFFSET) {
      newDeltaY = startPosition.y - middlePos.y;
      isAttachedY = true;
      return true;
    } else if (Math.abs(startPosition.y - maxPos.y) < NEAR_OFFSET) {
      newDeltaY = startPosition.y - maxPos.y;
      isAttachedY = true;
      return true;
    }
  });
  if (isAttachedX && Math.abs(deltaX) > 1) {
    if (eleAction === elementAction.MOVE) {
      // 通过baseDelta计算元素新位置，再计算newDeltaX
      const newElementX = e.pageX - baseDelta.x;
      newDeltaX = newElementX - minPos.x;
    } else {
      // 竖向吸附状态下，左右移动一个NEAR_OFFSET避免拖不动
      const symbolX = deltaX > 0 ? 1 : -1;
      newDeltaX = NEAR_OFFSET * symbolX;
    }
  }
  if (isAttachedY && Math.abs(deltaY) > 1) {
    if (eleAction === elementAction.MOVE) {
      // 通过baseDelta计算元素新位置，再计算newDeltaY
      const newElementY = e.pageY - baseDelta.y;
      newDeltaY = newElementY - minPos.y;
    } else {
      // 横向吸附状态下，左右移动移动一个NEAR_OFFSET避免拖不动
      const symbolY = deltaY > 0 ? 1 : -1;
      newDeltaY = NEAR_OFFSET * symbolY;
    }
  }

  // 如果是封面，做边界检测
  if (isSupportPaintedText && isCover) {
    // 除了封面上的front page, 其他的page(back, spine, full)等都需要做边界检测.
    // 因为font page上放置的是用户的照片, 而不是painted text.
    if (page.get('type') !== pageTypes.front) {
      const newDelta = checkSpineEdge(that, {
        deltaX, deltaY, e
      });
      newDeltaX = newDelta[0];
      newDeltaY = newDelta[1];
    }
  }

  return [newDeltaX, newDeltaY];
};

export const checkSpineEdge = (that, params) => {
  const { deltaX, deltaY, e } = params;
  const { paginationSpread, page, ratio } = that.props.data;

  const spinePage = paginationSpread.get('pages').find((p) => {
    return p.get('type') === pageTypes.spine;
  });

  const [minPos, middlePos, maxPos] = getSelectedElementPosition(that);

  const { containerOffset } = that.state;

  const offsetX = e.pageX - containerOffset.left;

  const pageWidth = page.get('width') * ratio.workspace;
  const pageHeight = page.get('height') * ratio.workspace;

  const pageBleed = page.get('bleed');
  const bleedLeft = pageBleed.get('left') * ratio.workspace;
  const bleedRight = pageBleed.get('right') * ratio.workspace;
  const bleedTop = pageBleed.get('top') * ratio.workspace;
  const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

  let centerLine = pageWidth / 2;
  const bottomEdge = pageHeight - bleedBottom;
  let rightEdge = pageWidth - bleedRight;

  let newDeltaX = deltaX;
  let newDeltaY = deltaY;

  const spineWidth = spinePage.get('width') * ratio.workspace;
  let spineLeft = (pageWidth - spineWidth) / 2 + bleedLeft;
  const spineRight = (pageWidth + spineWidth) / 2 - bleedLeft;

  const isHalfCover = page.get('type') === pageTypes.back || page.get('type') === pageTypes.front;

  if (isHalfCover) {
    spineLeft = pageWidth - spineWidth / 2 + bleedLeft;
    centerLine = pageWidth;
    rightEdge = pageWidth;
  }

  // 封面左侧
  if (maxPos.x < centerLine) {
    // x轴方向检测
    if (maxPos.x + deltaX >= spineLeft && deltaX >= 0) { // 右边界检测
      newDeltaX = spineLeft - maxPos.x;
      if (offsetX >= spineRight + CHECK_OFFSET && !isHalfCover) { // 如果鼠标到右页CHECK_OFFSET位置，元素整体移动到右页
        newDeltaX = spineRight - minPos.x;
      }
    } else if (minPos.x + deltaX <= bleedLeft && deltaX <= 0) { // 左边界检测
      newDeltaX = bleedLeft - minPos.x;
    }
  } else if (minPos.x > centerLine) { // 封面右侧
    // x轴方向检测
    if (maxPos.x + deltaX >= rightEdge && deltaX >= 0) { // 右边界检测
      newDeltaX = rightEdge - maxPos.x;
    } else if (minPos.x + deltaX <= spineRight && deltaX <= 0) { // 左边界检测
      newDeltaX = spineRight - minPos.x;
      if (offsetX <= spineLeft - CHECK_OFFSET && !isHalfCover) { // 如果鼠标到左页CHECK_OFFSET位置，元素整体移动到左页
        newDeltaX = spineLeft - maxPos.x;
      }
    }
  } else if (minPos.x < centerLine && maxPos.x > centerLine) { // 选择元素跨页
    // x轴方向检测
    if (maxPos.x + deltaX >= rightEdge && deltaX >= 0) { // 右边界检测
      newDeltaX = rightEdge - maxPos.x;
    } else if (minPos.x + deltaX <= bleedLeft && deltaX <= 0) { // 左边界检测
      newDeltaX = bleedLeft - minPos.x;
    }
  }
  // y轴方向检测
  if (maxPos.y + deltaY >= bottomEdge && deltaY >= 0) { // 下边界检测
    newDeltaY = bottomEdge - maxPos.y;
  } else if (minPos.y + deltaY <= bleedTop && deltaY <= 0) { // 上边界检测
    newDeltaY = bleedTop - minPos.y;
  }
  return [newDeltaX, newDeltaY];
};

export const restrictResize = (that, params) => {
  const { deltaX, deltaY, dir, e } = params;
  const { paginationSpread, page, ratio } = that.props.data;

  const summary = paginationSpread.get('summary');
  const isCover = summary.get('isCover');
  const isSupportPaintedText = summary.get('isSupportPaintedText');

  const spinePage = paginationSpread.get('pages').find(p => {
    return p.get('type') === pageTypes.spine;
  });

  const [minPos, middlePos, maxPos] = getSelectedElementPosition(that);

  const pageWidth = page.get('width') * ratio.workspace;
  const pageHeight = page.get('height') * ratio.workspace;

  const pageBleed = page.get('bleed');
  const bleedLeft = pageBleed.get('left') * ratio.workspace;
  const bleedRight = pageBleed.get('right') * ratio.workspace;
  const bleedTop = pageBleed.get('top') * ratio.workspace;
  const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

  let centerLine = pageWidth / 2;
  const bottomEdge = pageHeight - bleedBottom;
  let rightEdge = pageWidth - bleedRight;

  let newDeltaX = deltaX;
  let newDeltaY = deltaY;

  let spineWidth = 0;
  let spineLeft = 0;
  let spineRight = 0;

  if(isSupportPaintedText){
    if(isCover && page.get('type') !== pageTypes.front){
      if(spinePage){
        spineWidth = spinePage.get('width') * ratio.workspace;
        spineLeft = (pageWidth - spineWidth) / 2 + bleedLeft;
        spineRight = (pageWidth + spineWidth) / 2 - bleedLeft;

        const isHalfCover = page.get('type') === pageTypes.back || page.get('type') === pageTypes.front;

        if (isHalfCover) {
          spineLeft = pageWidth - spineWidth / 2  + bleedLeft;
          centerLine = pageWidth;
          rightEdge = pageWidth;
        }
      }

      if (/left/i.test(dir)) { // 往左侧缩放
        if (maxPos.x < centerLine) { // 左侧物体
          if (minPos.x + deltaX <= bleedLeft) { // 左边界检测
            newDeltaX = bleedLeft - minPos.x;
          }
        } else if (maxPos.x > centerLine) { // 右侧物体
          if (minPos.x + deltaX <= spineRight) { // 左边界检测
            newDeltaX = spineRight - minPos.x;
          }
        }
      } else if (/right/i.test(dir)) {
        if (minPos.x < centerLine) {
          if (maxPos.x + deltaX >= spineLeft) { // 右边界检测
            newDeltaX = spineLeft - maxPos.x;
          }
        } else if (minPos.x > centerLine) {
          if (maxPos.x + deltaX >= rightEdge) { // 右边界检测
            newDeltaX = rightEdge - maxPos.x;
          }
        }
      }

      // y轴方向检测
      if (maxPos.y + deltaY >= bottomEdge && deltaY >= 0 && /bottom/i.test(dir)) { // 下边界检测
        newDeltaY = bottomEdge - maxPos.y;
      } else if (minPos.y + deltaY <= bleedTop && deltaY <= 0 && /top/i.test(dir)) { // 上边界检测
        newDeltaY = bleedTop - minPos.y;
      }
    }
  }

  return [ newDeltaX, newDeltaY ];
}

export const showGuideLineIfNear = (that) => {
  const controllBoxPosition = getSelectedElementPosition(that);
  const { staticGuideLines } = that.state;
  const dynamicGuideLines = filterDynamicGuideLines(that, that.state.dynamicGuideLines);
  const newStaticGuideLines = checkClampedGuideLine(that, staticGuideLines, controllBoxPosition);
  const newDynamicGuideLines = checkClampedGuideLine(that, dynamicGuideLines, controllBoxPosition);

  that.setState({
    dynamicGuideLines: newDynamicGuideLines,
    staticGuideLines: newStaticGuideLines
  });
};

export const hideAllGuideLines = (that) => {
  const { staticGuideLines, dynamicGuideLines } = that.state;
  const newStaticGuidelines = [];
  const newDynamicGuidelines = [];
  staticGuideLines.forEach((g) => {
    const newGuideLine = merge({}, g, { isShown: false });
    newStaticGuidelines.push(newGuideLine);
  });
  dynamicGuideLines.forEach((g) => {
    const newGuideLine = merge({}, g, { isShown: false });
    newDynamicGuidelines.push(newGuideLine);
  });
  that.setState({
    dynamicGuideLines: newDynamicGuidelines,
    staticGuideLines: newStaticGuidelines
  });
};

export const filterDynamicGuideLines = (that, dynamicGuideLines) => {
  const elementArray = that.state.elementArray.toJS();
  const selectedElementIds = [];
  elementArray.forEach((e) => {
    if (e.isSelected) {
      selectedElementIds.push(e.id);
    }
  });
  return dynamicGuideLines.filter((g) => {
    return selectedElementIds.indexOf(g.eid) === -1;
  });
};

export const checkClampedGuideLine = (that, guideLines, controllBoxPosition) => {
  const [minPos, middlePos, maxPos] = controllBoxPosition;

  const newGuidelines = [];

  guideLines.forEach((guideLine) => {
    const { startPosition, endPosition } = guideLine;
    const isVerticalLine = (startPosition.x === endPosition.x);
    const newGuideLine = merge({}, guideLine, { isShown: false });
    if (isVerticalLine) {
      if (startPosition.x === minPos.x || startPosition.x === middlePos.x || startPosition.x === maxPos.x) {
        newGuideLine.isShown = true;
      } else {
        if (Math.abs(startPosition.x - minPos.x) < 2) {
          newGuideLine.isShown = true;
        }
        if (Math.abs(startPosition.x - middlePos.x) < 2) {
          newGuideLine.isShown = true;
        }
        if (Math.abs(startPosition.x - maxPos.x) < 2) {
          newGuideLine.isShown = true;
        }
      }
    } else if (startPosition.y === minPos.y || startPosition.y === middlePos.y || startPosition.y === maxPos.y) {
      newGuideLine.isShown = true;
    } else {
      if (Math.abs(startPosition.y - minPos.y) < 2) {
        newGuideLine.isShown = true;
      }
      if (Math.abs(startPosition.y - middlePos.y) < 2) {
        newGuideLine.isShown = true;
      }
      if (Math.abs(startPosition.y - maxPos.y) < 2) {
        newGuideLine.isShown = true;
      }
    }
    newGuidelines.push(newGuideLine);
  });
  return newGuidelines;
};

export const covertStaticGuideLines = (that, page, ratio, paginationSpread, size) => {
  const isCover = paginationSpread.getIn(['summary', 'isCover']);
  const pageType = page.get('type');
  if (isCover && pageType === pageTypes.spine) {
    return;
  }
  const pageBleed = page.get('bleed');

  const bleedLeft = pageBleed.get('left') * ratio.workspace;
  const bleedRight = pageBleed.get('right') * ratio.workspace;
  const bleedTop = pageBleed.get('top') * ratio.workspace;
  const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

  const sheetSize = isCover ? size.renderCoverSheetSize : size.renderInnerSheetSize;

  const pageWidth = sheetSize.width; //page.get('width') * ratio.workspace;
  const pageHeight = sheetSize.height; //page.get('height') * ratio.workspace;

  const lineOptions = {
    lineStyle: 'dashed',
    lineColor: '#de3418',
    lineWidth: 2
  };

  const guideLines = [
    // 左边出血辅助线
    {
      startPosition: {
        x: 0,
        y: 0
      },
      endPosition: {
        x: 0,
        y: pageHeight
      },
      isShown: false,
      direction: 'vertical',
      lineOptions
    },
    // 右边出血辅助线
    {
      startPosition: {
        x: pageWidth, //pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: 0
      },
      endPosition: {
        x: pageWidth, //pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: pageHeight
      },
      isShown: false,
      direction: 'vertical',
      lineOptions
    },
    // 纵向中线辅助线
    {
      startPosition: {
        x: pageWidth / 2,
        y: 0
      },
      endPosition: {
        x: pageWidth / 2,
        y: pageHeight
      },
      isShown: false,
      direction: 'vertical'
    },
    // 上边出血辅助线
    {
      startPosition: {
        x: 0,
        y: 0
      },
      endPosition: {
        x: pageWidth, //pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: 0
      },
      isShown: false,
      direction: 'horizontal',
      lineOptions
    },
    // 下边出血辅助线
    {
      startPosition: {
        x: 0,
        y: pageHeight
      },
      endPosition: {
        x: pageWidth, //pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: pageHeight
      },
      isShown: false,
      direction: 'horizontal',
      lineOptions
    },
    // 横向中线辅助线
    {
      startPosition: {
        x: 0,
        y: pageHeight / 2
      },
      endPosition: {
        x: pageWidth,
        y: pageHeight / 2
      },
      isShown: false,
      direction: 'horizontal'
    }
  ];
  if (pageType === pageTypes.full || pageType === pageTypes.sheet) {
    // 左边page中线
    guideLines.push({
      startPosition: {
        x: (pageWidth + bleedLeft) / 4,
        y: 0
      },
      endPosition: {
        x: (pageWidth + bleedLeft) / 4,
        y: pageHeight
      },
      isShown: false,
      direction: 'vertical'
    });
    // 右边page中线
    guideLines.push({
      startPosition: {
        x: pageWidth / 2 + (pageWidth - bleedLeft) / 4,
        y: 0
      },
      endPosition: {
        x: pageWidth / 2 + (pageWidth - bleedLeft) / 4,
        y: pageHeight
      },
      isShown: false,
      direction: 'vertical'
    });
  }
  // 封面加书脊线
  if (isCover) {
    const spinePage = paginationSpread.get('pages').find((p) => {
      return p.get('type') === pageTypes.spine;
    });
    const spineWidth = spinePage.get('width') * ratio.workspace;
    const spineLeft = (pageWidth - spineWidth) / 2 + bleedLeft;
    const spineRight = (pageWidth + spineWidth) / 2 - bleedLeft;

    if(pageType === pageTypes.full || pageType === pageTypes.sheet){
      // 书脊左侧辅助线
      guideLines.push({
        startPosition: {
          x: spineLeft,
          y: 0
        },
        endPosition: {
          x: spineLeft,
          y: pageHeight
        },
        isShown: false,
        direction: 'vertical',
        lineOptions
      });
      // 书脊右侧辅助线
      guideLines.push({
        startPosition: {
          x: spineRight,
          y: 0
        },
        endPosition: {
          x: spineRight,
          y: pageHeight
        },
        isShown: false,
        direction: 'vertical',
        lineOptions
      });
    }else if(pageType === pageTypes.back){
      const spineWidthWithoutBleed = spineWidth - (bleedLeft + bleedRight);

      // 书脊左侧辅助线
      guideLines.push({
        startPosition: {
          x: pageWidth - bleedRight,
          y: 0
        },
        endPosition: {
          x: pageWidth - bleedRight,
          y: pageHeight
        },
        isShown: false,
        direction: 'vertical',
        lineOptions
      });
    }
  }
  return guideLines;
};

export const convertElementsGuideLines = (that, page, elements, ratio) => {
  let dynamicGuideLines = [];
  if (page.get('isActive')) {
    elements.forEach((element) => {
      dynamicGuideLines = dynamicGuideLines.concat(getElementGuideLines(page, element, ratio));
    });
  }
  return dynamicGuideLines;
};

export const getElementGuideLines = (page, element, ratio) => {
  const computed = element.get('computed');

  const pageWidth = page.get('width') * ratio;
  const pageHeight = page.get('height') * ratio;

  const eid = element.get('id');
  const degree = element.get('rot');

  let x = computed.get('left');
  let y = computed.get('top');

  let width = computed.get('width');
  let height = computed.get('height');

  const guideLines = [];

  if (degree % 360 !== 0) {
    const transformedPosition = transform({
      width,
      height,
      x,
      y
    }, degree);
    x = transformedPosition.left;
    y = transformedPosition.top;
    width = transformedPosition.width;
    height = transformedPosition.height;
  }

  // 元素顶部辅助线
  guideLines.push({
    eid,
    startPosition: {
      x: 0,
      y
    },
    endPosition: {
      x: pageWidth,
      y
    },
    isShown: false,
    direction: 'horizontal'
  });

  // 元素竖中部辅助线
  guideLines.push({
    eid,
    startPosition: {
      x: 0,
      y: y + height / 2
    },
    endPosition: {
      x: pageWidth,
      y: y + height / 2
    },
    isShown: false,
    direction: 'horizontal'
  });

  // 元素底部辅助线
  guideLines.push({
    eid,
    startPosition: {
      x: 0,
      y: y + height
    },
    endPosition: {
      x: pageWidth,
      y: y + height
    },
    isShown: false,
    direction: 'horizontal'
  });

  // 元素左边辅助线
  guideLines.push({
    eid,
    startPosition: {
      x,
      y: 0
    },
    endPosition: {
      x,
      y: pageHeight
    },
    isShown: false,
    direction: 'vertical'
  });

  // 元素横中边辅助线
  guideLines.push({
    eid,
    startPosition: {
      x: x + width / 2,
      y: 0
    },
    endPosition: {
      x: x + width / 2,
      y: pageHeight
    },
    isShown: false,
    direction: 'vertical'
  });

  // 元素右边辅助线
  guideLines.push({
    eid,
    startPosition: {
      x: x + width,
      y: 0
    },
    endPosition: {
      x: x + width,
      y: pageHeight
    },
    isShown: false,
    direction: 'vertical'
  });

  return guideLines;
};

export const getSelectedElementPosition = (that) => {
  const elementArray = get(that.state, 'elementArray').toJS();
  const selectedElementArray = elementArray.filter(o => o.isSelected);

  const firstElement = selectedElementArray[0];
  let minX = firstElement.computed.left;
  let minY = firstElement.computed.top;
  let maxX = 0;
  let maxY = 0;

  selectedElementArray.forEach((element) => {
    const { computed } = element;
    let x = computed.left;
    let y = computed.top;
    let width = computed.width;
    let height = computed.height;
    const degree = element.rot;

    if (degree % 360 !== 0) {
      const transformedPosition = transform({
        width,
        height,
        x,
        y
      }, degree);
      x = transformedPosition.left;
      y = transformedPosition.top;
      width = transformedPosition.width;
      height = transformedPosition.height;
    }

    const rightX = x + width;
    const rightY = y + height;

    if (x < minX) {
      minX = x;
    }

    if (rightX > maxX) {
      maxX = rightX;
    }

    if (y < minY) {
      minY = y;
    }

    if (rightY > maxY) {
      maxY = rightY;
    }
  });
  return [
    {
      x: minX,
      y: minY
    },
    {
      x: minX + (maxX - minX) / 2,
      y: minY + (maxY - minY) / 2
    },
    {
      x: maxX,
      y: maxY
    }
  ];
};
