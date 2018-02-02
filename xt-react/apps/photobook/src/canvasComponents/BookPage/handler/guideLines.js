import { get, merge } from 'lodash';
import React from 'react';
import Immutable from 'immutable';

import GuideLine from '../../../canvasComponents/GuideLine';
import BleedGuideLine from '../../../components/GuideLine';
import { transform } from '../../../../../common/utils/transform';
import {
  pageTypes,
  elementAction,
  elementTypes
} from '../../../contants/strings';

const NEAR_OFFSET = 8;
const CHECK_OFFSET = 8;
let isAttachedX = false;
let isAttachedY = false;

export const convertLinePositionToStyle = (
  that,
  guideLine,
  needOffset = false
) => {
  const { startPosition, endPosition, lineOptions } = guideLine;
  const defaultLineOptions = {
    lineStyle: 'solid',
    lineColor: '#4CC1FC',
    lineWidth: 1
  };

  const mergedLineOptions = Object.assign({}, defaultLineOptions, lineOptions);

  const objStyle = {
    left: startPosition.x,
    top: startPosition.y,
    width: endPosition.x - startPosition.x || 1,
    height: endPosition.y - startPosition.y || 1,
    display: guideLine.isShown ? 'block' : 'none',
    ...mergedLineOptions
  };

  const { containerRect } = that.state;

  if (needOffset && containerRect) {
    objStyle.left += containerRect.left;
    objStyle.top += containerRect.top;
  }

  return objStyle;
};

export const renderBleedGuideLines = that => {
  const { staticGuideLines } = that.state;

  if (staticGuideLines && staticGuideLines.length) {
    const bleedGuideLines = staticGuideLines.slice(0, 4);

    return (
      <div>
        {bleedGuideLines.map((guideLine, index) => {
          const guideLineStyle = convertLinePositionToStyle(
            that,
            guideLine,
            true
          );
          return (
            <BleedGuideLine
              style={guideLineStyle}
              direction={guideLine.direction}
              lineStyle={guideLineStyle.lineStyle}
              lineColor={guideLineStyle.lineColor}
              lineWidth={guideLineStyle.lineWidth}
              isShown={guideLine.isShown}
              key={index}
            />
          );
        })}
      </div>
    );
  }

  return null;
};

export const renderGuideLines = that => {
  const { staticGuideLines, dynamicGuideLines } = that.state;
  const guideLines = [];
  if (staticGuideLines && staticGuideLines.length) {
    staticGuideLines.map((guideLine, key) => {
      const guideLineStyle = convertLinePositionToStyle(that, guideLine);
      guideLines.push(
        <GuideLine
          style={guideLineStyle}
          isShown={guideLine.isShown}
          direction={guideLine.direction}
          lineStyle={guideLineStyle.lineStyle}
          lineColor={guideLineStyle.lineColor}
          lineWidth={guideLineStyle.lineWidth}
          key={key}
        />
      );
    });
  }
  if (dynamicGuideLines && dynamicGuideLines.length) {
    dynamicGuideLines.map((g, key) => {
      const guideLineStyle = convertLinePositionToStyle(that, g);
      guideLines.push(
        <GuideLine
          style={guideLineStyle}
          isShown={g.isShown}
          key={staticGuideLines.length + key}
        />
      );
    });
  }
  return guideLines;
};

export const snapToGuideLine = (that, params) => {
  const { deltaX, deltaY, baseDelta, eleAction, e } = params;
  const { dynamicGuideLines, staticGuideLines } = that.state;
  const { paginationSpread, page, capability } = that.props.data;

  const summary = paginationSpread.get('summary');
  const isSupportPaintedText = summary.get('isSupportPaintedText');
  const isCover = summary.get('isCover');

  const spinePage = paginationSpread.get('pages').find(p => {
    return p.get('type') === pageTypes.spine;
  });

  const allGuideLines = staticGuideLines.concat(dynamicGuideLines);
  const [minPos, middlePos, maxPos] = getSelectedElementPosition(that);

  let newDeltaX = deltaX;
  let newDeltaY = deltaY;

  isAttachedX = false;
  isAttachedY = false;

  allGuideLines.find(guideLine => {
    // 如果不吸附 则跳过
    if (guideLine.noSnap) {
      return false;
    }
    const { startPosition, endPosition } = guideLine;
    const isVerticalLine = startPosition.x === endPosition.x;
    if (isVerticalLine) {
      if (
        startPosition.x === minPos.x ||
        startPosition.x === middlePos.x ||
        startPosition.x === maxPos.x
      ) {
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
    } else if (
      startPosition.y === minPos.y ||
      startPosition.y === middlePos.y ||
      startPosition.y === maxPos.y
    ) {
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
        deltaX,
        deltaY,
        e
      });
      newDeltaX = newDelta[0];
      newDeltaY = newDelta[1];
    }
  } else if (capability.get('useMoveLimit')) {
    const newDelta = checkElementEdge(that, {
      deltaX: newDeltaX,
      deltaY: newDeltaY,
      e
    });

    newDeltaX = newDelta[0];
    newDeltaY = newDelta[1];
  }

  return [Math.round(newDeltaX), Math.round(newDeltaY)];
};

export const getAbsoluteMinValue = arr => {
  let min = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (Math.abs(min) > Math.abs(arr[i])) {
      min = arr[i];
    }
  }
  return min;
};

export const showGuideLineIfNear = that => {
  const controllBoxPosition = getSelectedElementPosition(that);
  const { staticGuideLines } = that.state;
  const dynamicGuideLines = filterDynamicGuideLines(
    that,
    that.state.dynamicGuideLines
  );

  const { paginationSpread, page, ratio } = that.props.data;
  const pageType = page.get('type');

  const summary = paginationSpread.get('summary');
  const isCover = summary.get('isCover');
  const pageWidth = page.get('width') * ratio.workspace;
  const pageHeight = page.get('height') * ratio.workspace;

  const pageBleed = page.get('bleed');
  const bleedLeft = pageBleed.get('left') * ratio.workspace;
  const bleedRight = pageBleed.get('right') * ratio.workspace;
  const bleedTop = pageBleed.get('top') * ratio.workspace;
  const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

  const sheetCenterLines = [
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
    if (isCover) {
      const spinePage = paginationSpread.get('pages').find(p => {
        return p.get('type') === pageTypes.spine;
      });
      const spineWidth = spinePage.get('width') * ratio.workspace;
      // 左边page中线
      sheetCenterLines.push({
        startPosition: {
          x: (pageWidth - spineWidth) / 4 + bleedLeft,
          y: 0
        },
        endPosition: {
          x: (pageWidth - spineWidth) / 4 + bleedLeft,
          y: pageHeight
        },
        isShown: false,
        direction: 'vertical'
      });
      // 右边page中线
      sheetCenterLines.push({
        startPosition: {
          x: 3 * pageWidth / 4 + spineWidth / 4 - bleedLeft,
          y: 0
        },
        endPosition: {
          x: 3 * pageWidth / 4 + spineWidth / 4 - bleedLeft,
          y: pageHeight
        },
        isShown: false,
        direction: 'vertical'
      });
    } else {
      // 左边page中线
      sheetCenterLines.push({
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
      sheetCenterLines.push({
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
  }

  const newDynamicGuideLines = checkClampedGuideLine(
    that,
    dynamicGuideLines.concat(sheetCenterLines),
    controllBoxPosition
  );

  that.setState({
    dynamicGuideLines: newDynamicGuideLines,
    staticGuideLines: staticGuideLines.map(guideLine => {
      return Object.assign({}, guideLine, {
        isShown: true
      });
    })
  });
};

export const hideAllGuideLines = that => {
  const capability = get(that.props, 'data.capability');
  const isAdvancedMode = capability ? capability.get('isAdvancedMode') : false;

  const { staticGuideLines, dynamicGuideLines } = that.state;
  const newStaticGuidelines = [];
  const newDynamicGuidelines = [];
  if (!isAdvancedMode) {
    staticGuideLines.forEach(g => {
      const newGuideLine = merge({}, g, { isShown: false });
      newStaticGuidelines.push(newGuideLine);
    });
  }
  dynamicGuideLines.forEach(g => {
    const newGuideLine = merge({}, g, { isShown: false });
    newDynamicGuidelines.push(newGuideLine);
  });
  that.setState({
    dynamicGuideLines: newDynamicGuidelines,
    staticGuideLines: newStaticGuidelines.length
      ? newStaticGuidelines
      : staticGuideLines
  });
};

export const checkElementEdge = (that, params) => {
  const { elementArray, containerRect } = that.state;
  const { data } = that.props;
  const { ratio, page, parameters } = data;

  const { deltaX, deltaY, e } = params;

  const bleed = page.get('bleed');
  const bleedLeft = bleed.get('left') * ratio.workspace;
  const bleedRight = bleed.get('right') * ratio.workspace;
  const bleedBottom = bleed.get('bottom') * ratio.workspace;
  const bleedTop = bleed.get('top') * ratio.workspace;

  const pageWidth = page.get('width') * ratio.workspace;
  const pageHeight = page.get('height') * ratio.workspace;

  let newDeltaX = deltaX;
  let newDeltaY = deltaY;

  let selectedElementArray = Immutable.List();
  elementArray.forEach(element => {
    if (element.get('isSelected')) {
      selectedElementArray = selectedElementArray.push(element);
    }
  });
  const selectedElement = selectedElementArray.get(0);
  if (
    selectedElementArray.size === 1 &&
    [0, 180].indexOf(selectedElement.get('rot')) >= 0
  ) {
    const computed = selectedElement.get('computed');

    const x = computed.get('left');
    const y = computed.get('top');
    const width = computed.get('width');
    const height = computed.get('height');

    switch (selectedElement.get('type')) {
      case elementTypes.text: {
        if (x + deltaX <= 0) {
          newDeltaX = -x;
        } else if (x + width + deltaX >= pageWidth) {
          newDeltaX = pageWidth - x - width;
        }
        if (y + deltaY <= 0) {
          newDeltaY = -y;
        } else if (y + height + deltaY >= pageHeight) {
          newDeltaY = pageHeight - y - height;
        }
        break;
      }
    }
  }
  return [newDeltaX, newDeltaY];
};

export const checkSpineEdge = (that, params) => {
  const { deltaX, deltaY, e } = params;
  const { paginationSpread, page, ratio } = that.props.data;

  const spinePage = paginationSpread.get('pages').find(p => {
    return p.get('type') === pageTypes.spine;
  });

  const [minPos, middlePos, maxPos] = getSelectedElementPosition(that);

  const { containerRect } = that.state;

  const offsetX = e.pageX - containerRect.left;

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

  const isHalfCover =
    page.get('type') === pageTypes.back || page.get('type') === pageTypes.front;

  if (isHalfCover) {
    spineLeft = pageWidth - spineWidth / 2 + bleedLeft;
    centerLine = pageWidth;
    rightEdge = pageWidth;
  }

  // 封面左侧
  if (maxPos.x < centerLine) {
    // x轴方向检测
    if (maxPos.x + deltaX >= spineLeft && deltaX >= 0) {
      // 右边界检测
      newDeltaX = spineLeft - maxPos.x;
      if (offsetX >= spineRight + CHECK_OFFSET && !isHalfCover) {
        // 如果鼠标到右页CHECK_OFFSET位置，元素整体移动到右页
        newDeltaX = spineRight - minPos.x;
      }
    } else if (minPos.x + deltaX <= bleedLeft && deltaX <= 0) {
      // 左边界检测
      newDeltaX = bleedLeft - minPos.x;
    }
  } else if (minPos.x > centerLine) {
    // 封面右侧
    // x轴方向检测
    if (maxPos.x + deltaX >= rightEdge && deltaX >= 0) {
      // 右边界检测
      newDeltaX = rightEdge - maxPos.x;
    } else if (minPos.x + deltaX <= spineRight && deltaX <= 0) {
      // 左边界检测
      newDeltaX = spineRight - minPos.x;
      if (offsetX <= spineLeft - CHECK_OFFSET && !isHalfCover) {
        // 如果鼠标到左页CHECK_OFFSET位置，元素整体移动到左页
        newDeltaX = spineLeft - maxPos.x;
      }
    }
  } else if (minPos.x < centerLine && maxPos.x > centerLine) {
    // 选择元素跨页
    // x轴方向检测
    if (maxPos.x + deltaX >= rightEdge && deltaX >= 0) {
      // 右边界检测
      newDeltaX = rightEdge - maxPos.x;
    } else if (minPos.x + deltaX <= bleedLeft && deltaX <= 0) {
      // 左边界检测
      newDeltaX = bleedLeft - minPos.x;
    }
  }
  // y轴方向检测
  if (maxPos.y + deltaY >= bottomEdge && deltaY >= 0) {
    // 下边界检测
    newDeltaY = bottomEdge - maxPos.y;
  } else if (minPos.y + deltaY <= bleedTop && deltaY <= 0) {
    // 上边界检测
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

  if (isSupportPaintedText) {
    if (isCover && page.get('type') !== pageTypes.front) {
      if (spinePage) {
        spineWidth = spinePage.get('width') * ratio.workspace;
        spineLeft = (pageWidth - spineWidth) / 2 + bleedLeft;
        spineRight = (pageWidth + spineWidth) / 2 - bleedLeft;

        const isHalfCover =
          page.get('type') === pageTypes.back ||
          page.get('type') === pageTypes.front;

        if (isHalfCover) {
          spineLeft = pageWidth - spineWidth / 2 + bleedLeft;
          centerLine = pageWidth;
          rightEdge = pageWidth;
        }
      }

      if (/left/i.test(dir)) {
        // 往左侧缩放
        if (maxPos.x < centerLine) {
          // 左侧物体
          if (minPos.x + deltaX <= bleedLeft) {
            // 左边界检测
            newDeltaX = bleedLeft - minPos.x;
          }
        } else if (maxPos.x > centerLine) {
          // 右侧物体
          if (minPos.x + deltaX <= spineRight) {
            // 左边界检测
            newDeltaX = spineRight - minPos.x;
          }
        }
      } else if (/right/i.test(dir)) {
        if (minPos.x < centerLine) {
          if (maxPos.x + deltaX >= spineLeft) {
            // 右边界检测
            newDeltaX = spineLeft - maxPos.x;
          }
        } else if (minPos.x > centerLine) {
          if (maxPos.x + deltaX >= rightEdge) {
            // 右边界检测
            newDeltaX = rightEdge - maxPos.x;
          }
        }
      }

      // y轴方向检测
      if (
        maxPos.y + deltaY >= bottomEdge &&
        deltaY >= 0 &&
        /bottom/i.test(dir)
      ) {
        // 下边界检测
        newDeltaY = bottomEdge - maxPos.y;
      } else if (
        minPos.y + deltaY <= bleedTop &&
        deltaY <= 0 &&
        /top/i.test(dir)
      ) {
        // 上边界检测
        newDeltaY = bleedTop - minPos.y;
      }
    }
  }

  return [newDeltaX, newDeltaY];
};

export const filterDynamicGuideLines = (that, dynamicGuideLines) => {
  const elementArray = that.state.elementArray.toJS();
  const selectedElementIds = [];
  elementArray.forEach(e => {
    if (e.isSelected) {
      selectedElementIds.push(e.id);
    }
  });
  return dynamicGuideLines.filter(g => {
    return selectedElementIds.indexOf(g.eid) === -1;
  });
};

export const checkClampedGuideLine = (
  that,
  guideLines,
  controllBoxPosition
) => {
  const [minPos, middlePos, maxPos] = controllBoxPosition;

  const newGuidelines = [];

  guideLines.forEach(guideLine => {
    const { startPosition, endPosition } = guideLine;
    const isVerticalLine = startPosition.x === endPosition.x;
    const newGuideLine = merge({}, guideLine, { isShown: false });
    if (isVerticalLine) {
      if (
        startPosition.x === minPos.x ||
        startPosition.x === middlePos.x ||
        startPosition.x === maxPos.x
      ) {
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
    } else if (
      startPosition.y === minPos.y ||
      startPosition.y === middlePos.y ||
      startPosition.y === maxPos.y
    ) {
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

const showGuideLines = guidelines => {
  const newGuideLines = [];
  guidelines.forEach(guideline => {
    const newGuideline = merge({}, guideline, {
      isShown: true
    });
    newGuideLines.push(newGuideline);
  });
  return newGuideLines;
};

export const covertStaticGuideLines = (
  that,
  page,
  ratio,
  paginationSpread,
  size,
  parameters
) => {
  const capability = get(that.props, 'data.capability');
  const isDesignerMode = capability ? capability.get('isDesignerMode') : false;
  const isAdvancedMode = capability ? capability.get('isAdvancedMode') : false;

  const isCover = paginationSpread.getIn(['summary', 'isCover']);
  const isCrystal = paginationSpread.getIn(['summary', 'isCrystal']);
  const isMetal = paginationSpread.getIn(['summary', 'isMetal']);

  const pageType = page.get('type');
  if (isCover && pageType === pageTypes.spine) {
    return;
  }

  const actualBleed = page
    .get('bleed')
    .map(o => Math.floor(o * ratio.workspace));

  const bleedLeft = actualBleed.get('left');
  const bleedRight = actualBleed.get('right');
  const bleedTop = actualBleed.get('top');
  const bleedBottom = actualBleed.get('bottom');

  const sheetSize = isCover
    ? size.renderCoverSheetSize
    : size.renderInnerSheetSize;

  const pageWidth = sheetSize.width;
  const pageHeight = sheetSize.height;

  const OUT_BLEED_LINE_OPTIONS = {
    lineStyle: 'solid',
    lineColor: '#DE3418',
    lineWidth: 1
  };

  const INNER_BLEED_LINE_OPTIONS = {
    lineStyle: 'dashed',
    lineColor: '#de3418',
    lineWidth: 1
  };

  const SAFE_LINE_OPTIONS = {
    lineStyle: 'solid',
    lineColor: '#73CCFA',
    lineWidth: 1
  };

  const SPINE_LINE_OPTIONS = {
    lineStyle: 'solid',
    lineColor: '#FF8325',
    lineWidth: 1
  };

  // 压痕线 Indentation
  const INDENTATION_LINE_OPTIONS = {
    lineStyle: 'dashed',
    lineColor: '#FF8325',
    lineWidth: 1
  };

  const CENTER_LINE_OPTIONS = {
    lineStyle: 'dashed',
    lineColor: '#4CC1FC',
    lineWidth: 1
  };

  let guideLines = [
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
      lineOptions: OUT_BLEED_LINE_OPTIONS
    },
    // 右边出血辅助线
    {
      startPosition: {
        x: pageWidth + (isCrystal || isMetal ? 0 : -2), // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: 0
      },
      endPosition: {
        x: pageWidth + (isCrystal || isMetal ? 0 : -2), // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: pageHeight
      },
      isShown: false,
      direction: 'vertical',
      lineOptions: OUT_BLEED_LINE_OPTIONS
    },
    // 上边出血辅助线
    {
      startPosition: {
        x: 0,
        y: 0
      },
      endPosition: {
        x: pageWidth, // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: 0
      },
      isShown: false,
      direction: 'horizontal',
      lineOptions: OUT_BLEED_LINE_OPTIONS
    },
    // 下边出血辅助线
    {
      startPosition: {
        x: 0,
        y: pageHeight - 2
      },
      endPosition: {
        x: pageWidth, // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: pageHeight - 2
      },
      isShown: false,
      direction: 'horizontal',
      lineOptions: OUT_BLEED_LINE_OPTIONS
    },
    // 上侧内出血线
    {
      startPosition: {
        x: bleedLeft,
        y: bleedTop + 2
      },
      endPosition: {
        x: pageWidth - bleedRight, // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: bleedTop + 2
      },
      noSnap: true,
      isShown: false,
      direction: 'horizontal',
      lineOptions: INNER_BLEED_LINE_OPTIONS
    },
    // 下侧内出血线
    {
      startPosition: {
        x: bleedLeft,
        y: pageHeight - bleedBottom - 2
      },
      endPosition: {
        x: pageWidth - bleedRight, // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: pageHeight - bleedBottom - 2
      },
      noSnap: true,
      isShown: false,
      direction: 'horizontal',
      lineOptions: INNER_BLEED_LINE_OPTIONS
    },
    // 左侧内出血线
    {
      startPosition: {
        x: bleedLeft,
        y: bleedTop + 2
      },
      endPosition: {
        x: bleedLeft, // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: pageHeight - bleedBottom - 2
      },
      noSnap: true,
      isShown: false,
      direction: 'horizontal',
      lineOptions: INNER_BLEED_LINE_OPTIONS
    },
    // 右侧内出血线
    {
      startPosition: {
        x: pageWidth - bleedRight,
        y: bleedTop + 2
      },
      endPosition: {
        x: pageWidth - bleedRight, // pageType === pageTypes.front ? pageWidth - bleedLeft: pageWidth,
        y: pageHeight - bleedBottom - 2
      },
      noSnap: true,
      isShown: false,
      direction: 'horizontal',
      lineOptions: INNER_BLEED_LINE_OPTIONS
    }
  ];

  if (parameters && parameters.size) {
    const safeZone = parameters
      .get('safeZone')
      .map(o => Math.floor(o * ratio.workspace));

    const safeZoneLeft = safeZone.get('left') + bleedLeft;
    const safeZoneRight = safeZone.get('right') + bleedRight;
    const safeZoneTop = safeZone.get('top') + bleedTop;
    const safeZoneBottom = safeZone.get('bottom') + bleedBottom;

    guideLines.push(
      // 左侧安全线
      {
        startPosition: {
          x: safeZoneLeft,
          y: safeZoneTop
        },
        endPosition: {
          x: safeZoneLeft,
          y: pageHeight - safeZoneBottom
        },
        isShown: false,
        direction: 'vertical',
        lineOptions: SAFE_LINE_OPTIONS
      }
    );

    guideLines.push(
      // 右侧安全线
      {
        startPosition: {
          x: pageWidth - safeZoneRight,
          y: safeZoneTop
        },
        endPosition: {
          x: pageWidth - safeZoneRight,
          y: pageHeight - safeZoneBottom
        },
        isShown: false,
        direction: 'vertical',
        lineOptions: SAFE_LINE_OPTIONS
      }
    );

    guideLines.push(
      // 上边安全线
      {
        startPosition: {
          x: safeZoneLeft,
          y: safeZoneTop
        },
        endPosition: {
          x: pageWidth - safeZoneRight,
          y: safeZoneTop
        },
        isShown: false,
        direction: 'vertical',
        lineOptions: SAFE_LINE_OPTIONS
      }
    );

    guideLines.push(
      // 下边安全线
      {
        startPosition: {
          x: safeZoneLeft,
          y: pageHeight - safeZoneBottom
        },
        endPosition: {
          x: pageWidth - safeZoneRight,
          y: pageHeight - safeZoneBottom
        },
        isShown: false,
        direction: 'vertical',
        lineOptions: SAFE_LINE_OPTIONS
      }
    );
  }

  // 封面加书脊线
  if (isCover) {
    const spinePage = paginationSpread.get('pages').find(p => {
      return p.get('type') === pageTypes.spine;
    });
    const spineWidth = Math.floor(spinePage.get('width') * ratio.workspace);
    const spineLeft = (pageWidth - spineWidth) / 2 + bleedLeft;
    const spineRight = (pageWidth + spineWidth) / 2 - bleedLeft;

    if (pageType === pageTypes.full || pageType === pageTypes.sheet) {
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
        lineOptions: SPINE_LINE_OPTIONS
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
        lineOptions: SPINE_LINE_OPTIONS
      });

      if (parameters && parameters.size) {
        const spineExpanding = parameters
          .get('spineExpanding')
          .map(o => Math.floor(o * ratio.workspace));

        if (spineExpanding.get('expandingOverBackcover')) {
          const spineExpandingLeft =
            spineLeft - spineExpanding.get('expandingOverBackcover');
          // 书脊左侧压线
          guideLines.push({
            startPosition: {
              x: spineExpandingLeft,
              y: 0
            },
            endPosition: {
              x: spineExpandingLeft,
              y: pageHeight
            },
            isShown: false,
            direction: 'vertical',
            lineOptions: INDENTATION_LINE_OPTIONS
          });
        }

        if (spineExpanding.get('expandingOverFrontcover')) {
          const spineExpandingRight =
            spineRight + spineExpanding.get('expandingOverFrontcover');
          // 书脊右侧压线
          guideLines.push({
            startPosition: {
              x: spineExpandingRight,
              y: 0
            },
            endPosition: {
              x: spineExpandingRight,
              y: pageHeight
            },
            isShown: false,
            direction: 'vertical',
            lineOptions: INDENTATION_LINE_OPTIONS
          });
        }
      }
    } else if (pageType === pageTypes.back) {
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
        lineOptions: SPINE_LINE_OPTIONS
      });
    }
  }

  if (isDesignerMode) {
    guideLines.push(
      // page纵向中线
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
        direction: 'vertical',
        lineOptions: CENTER_LINE_OPTIONS
      }
    );
    guideLines.push(
      // page横向中线
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
        direction: 'horizontal',
        lineOptions: CENTER_LINE_OPTIONS
      }
    );
  }

  if (isAdvancedMode) {
    guideLines = showGuideLines(guideLines);
  }

  return guideLines;
};

export const convertElementsGuideLines = (that, page, elements, ratio) => {
  let dynamicGuideLines = [];
  if (page.get('isActive')) {
    elements.forEach(element => {
      dynamicGuideLines = dynamicGuideLines.concat(
        getElementGuideLines(page, element, ratio)
      );
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
    const transformedPosition = transform(
      {
        width,
        height,
        x,
        y
      },
      degree
    );
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

export const getSelectedElementPosition = that => {
  const elementArray = get(that.state, 'elementArray').toJS();
  const selectedElementArray = elementArray.filter(o => o.isSelected);

  const firstElement = selectedElementArray[0];
  const degree = firstElement.rot;
  const computed = firstElement.computed;
  let minX = computed.left;
  let minY = computed.top;
  let maxX = 0;
  let maxY = 0;

  if (degree % 360 !== 0) {
    const transformedPosition = transform(
      {
        width: computed.width,
        height: computed.height,
        x: computed.left,
        y: computed.top
      },
      degree
    );
    minX = transformedPosition.left;
    minY = transformedPosition.top;
  }

  selectedElementArray.forEach(element => {
    const { computed } = element;
    let x = computed.left;
    let y = computed.top;
    let width = computed.width;
    let height = computed.height;
    const degree = element.rot;

    if (degree % 360 !== 0) {
      const transformedPosition = transform(
        {
          width,
          height,
          x,
          y
        },
        degree
      );
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
