import React from 'react';
import { merge } from 'lodash';

let safeZoneTimer = null;
let bleedTimer = null;

const clampElementRect = (rect, outerBound, innerBound, isExtend = false) => {
  const newRect = merge({}, rect);
  const { x, y, width, height } = rect;
  let hasClamp = false;

  // 左边检测
  if (x > outerBound.left && x <= innerBound.left) {
    if (isExtend) {
      const diff = x - outerBound.left;
      newRect.x = outerBound.left;
      newRect.width += diff;
    } else {
      const diff = innerBound.left - x;
      newRect.x = innerBound.left;
      newRect.width -= diff;
    }

    hasClamp = true;
  }

  // 右边检测
  if (x + width >= innerBound.right && x + width < outerBound.right) {
    if (isExtend) {
      newRect.width = outerBound.right - x;
    } else {
      const diff = x + width - innerBound.right;
      newRect.width -= diff;
    }

    hasClamp = true;
  }

  // 上边检测
  if (y > outerBound.top && y <= innerBound.top) {
    if (isExtend) {
      const diff = y - outerBound.top;
      newRect.y = outerBound.top;
      newRect.height += diff;
    } else {
      const diff = innerBound.top - y;
      newRect.y = innerBound.top;
      newRect.height -= diff;
    }

    hasClamp = true;
  }

  // 下边检测
  if (y + height >= innerBound.bottom && y + height < outerBound.bottom) {
    if (isExtend) {
      newRect.height = outerBound.bottom - y;
    } else {
      const diff = y + height - innerBound.bottom;
      newRect.height -= diff;
    }

    hasClamp = true;
  }

  return {
    rect: newRect,
    hasClamp
  };
};

export const clampBySafezone = (that, element) => {
  const { data, t, actions } = that.props;
  const { parameters, page } = data;
  const { boundNotificationActions } = actions;

  let hasClamp;

  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  const safeZone = parameters.get('safeZone');
  const bleed = page.get('bleed');

  const safeLeft = safeZone.get('left');
  const safeRight = safeZone.get('right');
  const safeBottom = safeZone.get('bottom');
  const safeTop = safeZone.get('top');

  const outerBound = {
    left: 0,
    top: 0,
    right: page.get('width'),
    bottom: page.get('height')
  };

  const centerBound = {
    left: bleed.get('left'),
    top: bleed.get('top'),
    right: page.get('width') - bleed.get('right'),
    bottom: page.get('height') - bleed.get('top')
  };

  const innerBound = {
    left: bleed.get('left') + safeLeft,
    top: bleed.get('top') + safeTop,
    right: page.get('width') - bleed.get('right') - safeRight,
    bottom: page.get('height') - bleed.get('bottom') - safeBottom
  };

  let elementRect = {
    x: element.get('x'),
    y: element.get('y'),
    width: element.get('width'),
    height: element.get('height')
  };

  // bleed 区域
  const bleedClampObj = clampElementRect(elementRect, outerBound, centerBound, true);
  elementRect = bleedClampObj.rect;

  hasClamp = bleedClampObj.hasClamp;

  // safeZone区域
  const safeZoneClampObj = clampElementRect(elementRect, centerBound, innerBound);
  elementRect = safeZoneClampObj.rect;

  if (!hasClamp) {
    hasClamp = safeZoneClampObj.hasClamp;
  }

  return {
    element: element.merge({
      x: elementRect.x,
      y: elementRect.y,
      width: elementRect.width,
      height: elementRect.height
    }),
    hasClamp
  };
};
