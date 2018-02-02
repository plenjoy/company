import React from 'react';
import { get, merge, mapValues } from 'lodash';
import GuideLine from '../../GuideLine';
import { transform } from '../../../../../common/utils/transform';
import { elementAction } from '../../../constants/strings';

const NEAR_OFFSET = 2;
let isAttachedX = false;
let isAttachedY = false;

export const convertLinePositionToStyle = (that, guideLine) => {
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

  return objStyle;
};

export const renderGuideLines = that => {
  const { staticGuideLines, dynamicGuideLines } = that.state;
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
        <GuideLine
          style={guideLineStyle}
          isShown={g.isShown}
          direction={g.direction}
          lineStyle={guideLineStyle.lineStyle}
          lineColor={guideLineStyle.lineColor}
          lineWidth={guideLineStyle.lineWidth}
          key={staticGuideLines.length + key}
        />
      );
    });
  }
  return <div className="guide-lines">{guideLines}</div>;
};

export const snapToGuideLine = (that, params) => {
  const { deltaX, deltaY, baseDelta, eleAction, e } = params;
  const { dynamicGuideLines, staticGuideLines } = that.state;
  const allGuideLines = staticGuideLines.concat(dynamicGuideLines);
  const [minPos, middlePos, maxPos] = getSelectedElementPosition(that);

  let newDeltaX = deltaX;
  let newDeltaY = deltaY;

  isAttachedX = false;
  isAttachedY = false;

  allGuideLines.find(guideLine => {
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
  // console.log(deltaX, deltaY, newDeltaX, newDeltaY)
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
  const newStaticGuideLines = checkClampedGuideLine(
    that,
    staticGuideLines,
    controllBoxPosition
  );
  const newDynamicGuideLines = checkClampedGuideLine(
    that,
    dynamicGuideLines,
    controllBoxPosition
  );

  that.setState({
    dynamicGuideLines: newDynamicGuideLines,
    staticGuideLines: newStaticGuideLines
  });
};

export const hideAllGuideLines = that => {
  const { staticGuideLines, dynamicGuideLines } = that.state;
  const newStaticGuidelines = [];
  const newDynamicGuidelines = [];
  staticGuideLines.forEach(g => {
    const newGuideLine = merge({}, g, { isShown: false });
    if (g.showForever) {
      newGuideLine.isShown = true;
    }
    newStaticGuidelines.push(newGuideLine);
  });
  dynamicGuideLines.forEach(g => {
    const newGuideLine = merge({}, g, { isShown: false });
    newDynamicGuidelines.push(newGuideLine);
  });
  that.setState({
    dynamicGuideLines: newDynamicGuidelines,
    staticGuideLines: newStaticGuidelines
  });
};

export const filterDynamicGuideLines = (that, dynamicGuideLines) => {
  const elementArray = that.state.elementArray;
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
    if (guideLine.showForever) {
      newGuideLine.isShown = true;
    }
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

export const covertStaticGuideLines = (that, spreadOptions) => {
  const {
    bleed,
    viewWidth,
    viewHeight,
    ratio,
    safeZone,
    spineWidth,
    spineExpanding
  } = spreadOptions;
  const viewBleed = mapValues(bleed, (v, k) => {
    return Math.floor(v * ratio);
  });

  const viewSafeZone = mapValues(safeZone, (v, k) => {
    return Math.floor(v * ratio) + viewBleed[k];
  });

  const SAFE_LINE_OPTIONS = {
    lineStyle: 'solid',
    lineColor: '#FF8325',
    lineWidth: 1
  };

  const SPINE_LINE_OPTIONS = {
    lineStyle: 'dashed',
    lineColor: '#FF8325',
    lineWidth: 1
  };

  const EXTRA_LINE_OPTIONS = {
    lineStyle: 'dashed'
  };

  const viewWidthWithoutBleed = viewWidth - (viewBleed.left + viewBleed.right);

  const centerX = viewWidthWithoutBleed / 2 + viewBleed.left;

  let guideLines = [
    // 左边出血辅助线
    {
      startPosition: {
        x: viewBleed.left,
        y: 0
      },
      endPosition: {
        x: viewBleed.left,
        y: viewHeight
      },
      isShown: false,
      direction: 'vertical'
    },
    // 右边出血辅助线
    {
      startPosition: {
        x: viewWidth - viewBleed.right,
        y: 0
      },
      endPosition: {
        x: viewWidth - viewBleed.right,
        y: viewHeight
      },
      isShown: false,
      direction: 'vertical'
    },
    // 上边出血辅助线
    {
      startPosition: {
        x: 0,
        y: viewBleed.top
      },
      endPosition: {
        x: viewWidth,
        y: viewBleed.top
      },
      isShown: false,
      direction: 'horizontal'
    },
    // 下边出血辅助线
    {
      startPosition: {
        x: 0,
        y: viewHeight - viewBleed.bottom
      },
      endPosition: {
        x: viewWidth,
        y: viewHeight - viewBleed.bottom
      },
      isShown: false,
      direction: 'horizontal'
    },
    // 横向中线辅助线
    {
      startPosition: {
        x: 0,
        y: viewHeight / 2
      },
      endPosition: {
        x: viewWidth,
        y: viewHeight / 2
      },
      isShown: false,
      direction: 'horizontal'
    },
    // 纵向中线辅助线
    {
      startPosition: {
        x: centerX,
        y: 0
      },
      endPosition: {
        x: centerX,
        y: viewHeight
      },
      isShown: true,
      showForever: true,
      direction: 'vertical'
    }
  ];

  if (safeZone) {
    guideLines = guideLines.concat([
      // 左侧安全线
      {
        startPosition: {
          x: viewSafeZone.left,
          y: viewSafeZone.top
        },
        endPosition: {
          x: viewSafeZone.left,
          y: viewHeight - viewSafeZone.bottom
        },
        isShown: true,
        showForever: true,
        direction: 'vertical',
        lineOptions: SAFE_LINE_OPTIONS
      },

      // 右侧安全线
      {
        startPosition: {
          x: viewWidth - viewSafeZone.right,
          y: viewSafeZone.top
        },
        endPosition: {
          x: viewWidth - viewSafeZone.right,
          y: viewHeight - viewSafeZone.bottom
        },
        isShown: true,
        showForever: true,
        direction: 'vertical',
        lineOptions: SAFE_LINE_OPTIONS
      },

      // 上边安全线
      {
        startPosition: {
          x: viewSafeZone.left,
          y: viewSafeZone.top
        },
        endPosition: {
          x: viewWidth - viewSafeZone.right,
          y: viewSafeZone.top
        },
        isShown: true,
        showForever: true,
        direction: 'horizontal',
        lineOptions: SAFE_LINE_OPTIONS
      },

      // 下边安全线
      {
        startPosition: {
          x: viewSafeZone.left,
          y: viewHeight - viewSafeZone.bottom
        },
        endPosition: {
          x: viewWidth - viewSafeZone.right,
          y: viewHeight - viewSafeZone.bottom
        },
        isShown: true,
        showForever: true,
        direction: 'horizontal',
        lineOptions: SAFE_LINE_OPTIONS
      }
    ]);
  }

  if (spineWidth) {
    const viewSpineWidth = Math.floor(spineWidth.baseValue * ratio);
    const viewSpineLeft = (viewWidth - viewSpineWidth) / 2;
    const viewSpineRight = (viewWidth + viewSpineWidth) / 2;
    guideLines = guideLines.concat([
      {
        startPosition: {
          x: viewSpineLeft,
          y: 0
        },
        endPosition: {
          x: viewSpineLeft,
          y: viewHeight
        },
        isShown: true,
        direction: 'vertical',
        showForever: true,
        lineOptions: SPINE_LINE_OPTIONS
      },
      // 书脊右侧辅助线
      {
        startPosition: {
          x: viewSpineRight,
          y: 0
        },
        endPosition: {
          x: viewSpineRight,
          y: viewHeight
        },
        isShown: true,
        direction: 'vertical',
        showForever: true,
        lineOptions: SPINE_LINE_OPTIONS
      }
    ]);

    if (spineExpanding) {
      const viewSpineExpanding = mapValues(spineExpanding, (v, k) => {
        return Math.floor(v * ratio);
      });

      if (viewSpineExpanding.expandingOverFrontcover) {
        const viewSpineExpandingRight =
          viewSpineRight + viewSpineExpanding.expandingOverFrontcover;
        guideLines = guideLines.concat([
          {
            startPosition: {
              x: viewSpineExpandingRight,
              y: 0
            },
            endPosition: {
              x: viewSpineExpandingRight,
              y: viewHeight
            },
            isShown: true,
            direction: 'vertical',
            showForever: true,
            lineOptions: SPINE_LINE_OPTIONS
          },
          {
            startPosition: {
              x:
                viewSpineExpandingRight +
                (viewWidth - viewSpineExpandingRight - viewBleed.right) / 2,
              y: 0
            },
            endPosition: {
              x:
                viewSpineExpandingRight +
                (viewWidth - viewSpineExpandingRight - viewBleed.right) / 2,
              y: viewHeight
            },
            isShown: true,
            direction: 'vertical',
            showForever: true,
            lineOptions: EXTRA_LINE_OPTIONS
          }
        ]);
      } else {
        guideLines = guideLines.concat([
          {
            startPosition: {
              x: (viewSpineLeft - viewBleed.left) / 2 + viewBleed.left,
              y: 0
            },
            endPosition: {
              x: (viewSpineLeft - viewBleed.left) / 2 + viewBleed.left,
              y: viewHeight
            },
            isShown: true,
            direction: 'vertical',
            showForever: true,
            lineOptions: EXTRA_LINE_OPTIONS
          }
        ]);
      }

      if (viewSpineExpanding.expandingOverBackcover) {
        const viewSpineExpandingLeft =
          viewSpineLeft - viewSpineExpanding.expandingOverBackcover;
        guideLines = guideLines.concat([
          {
            startPosition: {
              x: viewSpineExpandingLeft,
              y: 0
            },
            endPosition: {
              x: viewSpineExpandingLeft,
              y: viewHeight
            },
            isShown: true,
            direction: 'vertical',
            showForever: true,
            lineOptions: SPINE_LINE_OPTIONS
          },
          {
            startPosition: {
              x: (viewSpineExpandingLeft - viewBleed.left) / 2 + viewBleed.left,
              y: 0
            },
            endPosition: {
              x: (viewSpineExpandingLeft - viewBleed.left) / 2 + viewBleed.left,
              y: viewHeight
            },
            isShown: true,
            direction: 'vertical',
            showForever: true,
            lineOptions: EXTRA_LINE_OPTIONS
          }
        ]);
      } else {
        guideLines = guideLines.concat([
          // 书脊右侧辅助线
          {
            startPosition: {
              x:
                (viewWidth - viewSpineRight - viewBleed.right) / 2 +
                viewSpineRight,
              y: 0
            },
            endPosition: {
              x:
                (viewWidth - viewSpineRight - viewBleed.right) / 2 +
                viewSpineRight,
              y: viewHeight
            },
            isShown: true,
            direction: 'vertical',
            showForever: true,
            lineOptions: EXTRA_LINE_OPTIONS
          }
        ]);
      }
    }
  } else {
    guideLines = guideLines.concat([
      // 内页纵向4/1辅助线
      {
        startPosition: {
          x: centerX - viewWidthWithoutBleed / 4,
          y: 0
        },
        endPosition: {
          x: centerX - viewWidthWithoutBleed / 4,
          y: viewHeight
        },
        isShown: true,
        showForever: true,
        direction: 'vertical',
        lineOptions: EXTRA_LINE_OPTIONS
      },

      // 内页纵向4/3辅助线
      {
        startPosition: {
          x: centerX + viewWidthWithoutBleed / 4 - 1,
          y: 0
        },
        endPosition: {
          x: centerX + viewWidthWithoutBleed / 4 - 1,
          y: viewHeight
        },
        isShown: true,
        showForever: true,
        direction: 'vertical',
        lineOptions: EXTRA_LINE_OPTIONS
      }
    ]);
  }

  const newGuideLines = [];

  guideLines.forEach(guideLine => {
    const newGuideLine = merge({}, guideLine, {
      startPosition: {
        x: Math.round(guideLine.startPosition.x),
        y: Math.round(guideLine.startPosition.y)
      },
      endPosition: {
        x: Math.round(guideLine.endPosition.x),
        y: Math.round(guideLine.endPosition.y)
      }
    });
    newGuideLines.push(newGuideLine);
  });

  return newGuideLines;
};

export const convertElementsGuideLines = (that, spreadOptions, elements) => {
  let dynamicGuideLines = [];
  elements.forEach(element => {
    dynamicGuideLines = dynamicGuideLines.concat(
      getElementGuideLines(spreadOptions, element)
    );
  });
  return dynamicGuideLines;
};

export const getElementGuideLines = (spreadOptions, element) => {
  const pageWidth = spreadOptions.viewWidth;
  const pageHeight = spreadOptions.viewHeight;

  const eid = element.id;
  const degree = element.rot;

  let x = get(element, 'position.x');
  let y = get(element, 'position.y');

  let width = element.width;
  let height = element.height;

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
  const { elementArray } = that.state;
  const selectedElementArray = elementArray.filter(o => o.isSelected);

  const firstElement = selectedElementArray[0];
  let minX = firstElement.position.x;
  let minY = firstElement.position.y;
  let maxX = 0;
  let maxY = 0;

  selectedElementArray.forEach(element => {
    const { position } = element;
    let x = position.x;
    let y = position.y;
    let width = element.width;
    let height = element.height;
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
