import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { elementTypes, pageTypes, dragTypes } from '../../../contants/strings';
import { getTransferData } from '../../../../../common/utils/drag';
import { merge } from 'lodash';

export const handleDragOver = (that, event) => {
  stopEvent(event);
};

export const handleDragEnter = (that, event) => {
  let isDragTemplate = false;
  if (window.__type === dragTypes.template) {
    isDragTemplate = true;
  }
  that.setState({
    isHover: true,
    isDragTemplate
  });
};

export const handleDragLeave = (that, event) => {
  that.setState({
    isHover: false
  });
};

export const handleDragEnd = (that, event) => {
  that.setState({
    isHover: false
  });
};

/**
 * 天窗drop处理函数
 * @param   {object} that CameoElement的this指向
 */
export const onDrop = (that, event) => {
  const { data, actions } = that.props;

  const { element, page, ratio, elementArray, paginationSpread, pagination, parameters } = data;
  const { boundProjectActions, boundPaginationActions, applyTemplate, boundTrackerActions } = actions;

  const maxDepElement = elementArray.maxBy((item) => {
    return item.get('dep');
  });
  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1;

  const elementWidth = element.get('pw') * page.get('width') * ratio.workspace;
  const elementHeight = element.get('ph') * page.get('height') * ratio.workspace;

  const ev = event || window.event;

  const elementProps = getTransferData(ev);

  if (page && pagination.pageId !== page.get('id') && page.get('type') !== pageTypes.spine) {
    const index = pagination.pageIndex === 1 ? 0 : 1;
    boundPaginationActions.switchPage(index, page.get('id'));
  }
  if (elementProps.length) {
    const curElement = elementProps[0];
    const { width, height } = curElement;
    const elementId = element.get('id');

    // 计算旋转角度.
    const angle = 0; //width < height ? -90 : 0;

    const options = getCropOptions(width, height, elementWidth, elementHeight, angle);
    const elementData = merge(
      {},
      getCropLRByOptions(options.px, options.py, options.pw, options.ph),
      {
        id: elementId,
        encImgId: curElement.encImgId,
        imageid: curElement.imageid,
        imgRot: angle,
        style: {
          effectId: 0,
          opacity: 100
        },
        imgFlip: false
      }
    );
    boundProjectActions.updateElement(elementData);
  } else if (elementProps.type === elementTypes.sticker) {
    const containerProps = document.querySelector('.inner-sheet') ? getOffset(document.querySelector('.inner-sheet')) : getOffset(document.querySelector('.cover-sheet'));
    // 计算鼠标放开位置的真实坐标
    let viewX = event.pageX - containerProps.left;
    const viewY = event.pageY - containerProps.top;

    // 如果为右页，减去左页的宽度
    if (pagination.pageIndex === 1) {
      const leftPage = paginationSpread.getIn(['pages', 0]);
      const innerPageBleed = parameters.get('innerPageBleed');
      viewX -= (leftPage.get('width') - innerPageBleed.get('left') - innerPageBleed.get('right')) * ratio.workspace;
    }

    const defaultPosition = { x: viewX / ratio.workspace, y: viewY / ratio.workspace };
    const sElement = {
      type: elementTypes.decoration,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: elementProps.width,
      height: elementProps.height,
      px: defaultPosition.x / page.get('width'),
      py: defaultPosition.y / page.get('height'),
      pw: elementProps.width / page.get('width'),
      ph: elementProps.height / page.get('height'),
      decorationid: elementProps.guid,
      decorationtype: elementTypes.sticker,
      rot: 0,
      dep
    };
    boundProjectActions.createElement(page.get('id'), sElement);
  } else if (elementProps.type === dragTypes.template) {
    applyTemplate(elementProps.guid);
  }
  that.setState({
    isHover: false
  });
  boundTrackerActions.addTracker('DragPhotoToPage');
  delete window.__type;
  stopEvent(event);
};

export const getOffset = (el) => {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};
