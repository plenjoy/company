import { get } from 'lodash';
import { pageTypes, elementTypes } from '../../../contants/strings';

export const handleTextMouseDown = (that, elementId, event) => {
  const { actions } = that.props;
  const {
    boundProjectActions,
    selectElementOnMainContainer
  } = actions;

  boundProjectActions.selectElement({id: elementId});
  selectElementOnMainContainer(event.target);
};

export const handleTextRemove = (that, elementId) => {
  const { actions, data } = that.props;
  const { page, rate } = data;
  const {
    boundProjectActions
  } = actions;

  boundProjectActions.deleteElement(page.id, elementId);
}

/**
 * 处理textElement移动，主要做便捷检测
 */
export const handleTextMove = (that, opt) => {
  const { page, rate } = that.props.data;
  const { width, height, bleed, wrapSize } = page;
  const topLimit = (get(bleed, 'top') + get(wrapSize, 'top')) * rate;
  const RightLimit = (width - get(bleed, 'right') - get(wrapSize, 'right')) * rate;
  const bottomLimit = (height - get(bleed, 'bottom') - get(wrapSize, 'bottom')) * rate;
  const leftLimit = (get(bleed, 'left') + get(wrapSize, 'left')) * rate;
  //边界检测
  if (opt.x <= leftLimit) {
    opt.x = leftLimit;
  } else if (opt.x >= RightLimit - 30) {
    opt.x = RightLimit - 30;
  }
  if (opt.y <= topLimit) {
    opt.y = topLimit;
  } else if (opt.y >= bottomLimit - 10) {
    opt.y = bottomLimit - 10;
  }
  return opt;
};

/**
 * 当textElement移动鼠标弹起时 校验 printedText 和 天窗的 位置关系。
 */
export const checkPrintedTextPosition = (that, opt) => {
  const { page, rate, summary, elements } = that.props.data;
  const { width, height, bleed, wrapSize } = page;
  const { hasCameoElement } = summary;

  if (hasCameoElement && get(page, 'type') === pageTypes.front) {
    const cameoElement = elements.find(ele => get(ele, 'type') === elementTypes.cameo);
    const cameoWidth = get(cameoElement, 'width');
    const cameoHeight = get(cameoElement, 'height');

    const cameoTop = (height - cameoHeight) / 2 * rate;
    const cameoLeft = (width - cameoWidth) / 2 * rate;
    const cameoRight = (width * rate) - cameoLeft;
    const cameoBottom = (height * rate) - cameoTop;

    //边界检测
    if ((
          (opt.x < cameoLeft && cameoLeft < (opt.x + opt.width))
          || (opt.x < cameoRight && cameoRight < (opt.x + opt.width))
          || (cameoLeft <= opt.x && opt.x <= cameoRight)
        )
        && ((opt.y < cameoTop && cameoTop < (opt.y + opt.height))
          || (opt.y < cameoBottom && cameoBottom < (opt.y + opt.height))
          || (cameoTop <= opt.y && opt.y <= cameoBottom)
        )
    ) {
      opt.x = ((width * rate) - opt.width) / 2;
      opt.y = (opt.y + (opt.height / 2)) <= (height * rate / 2)
        ? ((cameoTop - get(page, 'bleed.top') * rate) -  opt.height) / 2 + get(page, 'bleed.top')
        : (cameoBottom + (cameoTop - get(page, 'bleed.bottom')) / 2) - opt.height / 2;
    }
  }
  return opt;
};

/**
 * 当textElement移动鼠标弹起时更新真实数据
 */
export const handleTextMouseUp = (that, elementId, mx, my, rwidth, rheight) => {
  const { actions, data } = that.props;
  const { page, rate } = data;
  const { boundProjectActions } = actions;
  const { width, height } = page;
  const px = mx / (width * rate);
  const py = my / (height * rate);
  const x = mx / rate;
  const y = my / rate;
  const pw = rwidth / (width * rate);
  const ph = rheight / (height * rate);
  const eWidth = rwidth / rate;
  const eHeight = rheight / rate;
  boundProjectActions.updateElement({
    id: elementId,
    x,
    y,
    px,
    py,
    pw,
    ph,
    width: eWidth,
    height: eHeight
  });
};

