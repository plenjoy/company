import { merge } from 'lodash';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import {
  onEditText,
  onEditImage,
  onUploadImage
} from '../handler/actionbarEvents';
import { elementTypes, pageTypes } from '../../../contants/strings';
import {
  getTransferData,
  setTransferDataByNode,
  getTransferDataByNode
} from '../../../../../common/utils/drag';
import { findKonvaObjectById } from '../../../utils/canvas/konvaSelector';

function getSingleSelectedElementArray(elementArray, id) {
  return elementArray.map((element) => {
    return element.merge({
      isSelected: element.get('id') === id
    });
  });
}

export function selectElements(that, element, e) {
  const { elementArray } = that.state;
  const elementId = element.get('id');

  let newElementArray = elementArray;

  if (!e.ctrlKey && !e.metaKey) {
    if (!element.get('isSelected')) {
      newElementArray = getSingleSelectedElementArray(elementArray, elementId);
    }
  } else {
    newElementArray = elementArray.map((o) => {
      if (elementId === o.get('id')) {
        return o.merge({
          isSelected: !o.get('isSelected')
        });
      }
      return o;
    });
  }

  that.setState({
    elementArray: newElementArray
  });
}

/**
 * 点击元素时的处理函数
 * @param  {[type]} that
 * @param  {konva} layer 元素的layer konva对象
 * @param  {Immutable.Map} element 元素的数据
 * @param  {konva event} ev 事件对象.
 */
export const onMouseUp = (that, element, e) => {
  that.setState({
    tooltip: {
      isShown: false
    }
  });
};

export const onMouseEnter = (that, element, e) => {
  const { t } = that.props;
  const { elementArray } = that.state;
  const selectedElementArray = elementArray.filter(o => o.get('isSelected'));

  const isSelectMousePointElement = selectedElementArray.filter((o) => {
    return o.get('id') === element.get('id');
  }).size;

  const textTypeList = [elementTypes.text, elementTypes.paintedText];

  if (
    !element.get('text') &&
    !isSelectMousePointElement &&
    textTypeList.indexOf(element.get('type')) !== -1
  ) {
    const elementNode = findKonvaObjectById(
      that.unselectElements,
      element.get('id')
    );
    const groupNode = elementNode.getParent();

    const { x, y, width, height } = groupNode.getClientRect();

    const halfWidth = width / 2;
    const tooltipWidth = 168;

    that.setState({
      tooltip: {
        isShown: true,
        style: {
          x: x + halfWidth - tooltipWidth / 2,
          y: y + height + 15,
          width: tooltipWidth
        },
        content: t('CLICK_TO_EDIT_TEXT')
      }
    });
  }
};

export const onMouseLeave = (that, element, e) => {
  that.setState({
    tooltip: {
      isShown: false
    }
  });
};

export const onClick = (that, element, ev) => {
  switch (element.get('type')) {
    case elementTypes.photo: {
      const hasImage = Boolean(element.get('encImgId'));
      if (hasImage) {
        onEditImage(that, element, ev);
      } else {
        onUploadImage(that, element, ev);
      }
      break;
    }
    case elementTypes.paintedText:
    case elementTypes.text: {
      onEditText(that, element, ev);
      break;
    }
    default:
  }
};

export const handleDragOver = (that, event) => {
  stopEvent(event);
};

export const handleDragEnter = (that, event) => {
  that.setState({
    isDragOver: true
  });
};

export const handleDragLeave = (that, event) => {
  that.setState({
    isDragOver: false
  });
};

export const handleDragEnd = (that, event) => {
  that.setState({
    isDragOver: false
  });
};

/**
 * drop处理函数
 * @param   {object} that CameoElement的this指向
 */
export const onDrop = (that, element, event) => {
  const { data, actions } = that.props;
  const { downloadedImages } = that.state;

  const { page, ratio, paginationSpread, pagination, parameters } = data;
  const { boundProjectActions, boundPaginationActions } = actions;
  const elementArray = data.elements;

  const maxDepElement = elementArray.maxBy((item) => {
    return item.get('dep');
  });
  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1;

  const ev = event || window.event;

  const elementProps = getTransferData(ev);

  if (
    page &&
    pagination.pageId !== page.get('id') &&
    page.get('type') !== pageTypes.spine
  ) {
    const index = pagination.pageIndex === 1 ? 0 : 1;
    boundPaginationActions.switchPage(index, page.get('id'));
  }
  if (elementProps.length) {
    const curElement = elementProps[0];
    const elementId = element.get('id');
    const elementData = merge(
      {},
      {
        id: elementId,
        width: element.get('pw') * page.get('width'),
        height: element.get('ph') * page.get('height'),
        encImgId: curElement.encImgId,
        imageid: curElement.imageid,
        imgRot: 0,
        style: {
          effectId: 0,
          opacity: 100
        },
        imgFlip: false
      }
    );
    boundProjectActions.updateElement(elementData);
  } else if (elementProps.type === elementTypes.sticker) {
    const containerProps = document.querySelector('.inner-sheet')
      ? getOffset(document.querySelector('.inner-sheet'))
      : getOffset(document.querySelector('.cover-sheet'));
    // 计算鼠标放开位置的真实坐标
    let viewX = event.pageX - containerProps.left;
    const viewY = event.pageY - containerProps.top;

    // 如果为右页，减去左页的宽度
    if (pagination.pageIndex === 1) {
      const leftPage = paginationSpread.getIn(['pages', 0]);
      const innerPageBleed = parameters.get('innerPageBleed');
      viewX -=
        (leftPage.get('width') -
          innerPageBleed.get('left') -
          innerPageBleed.get('right')) *
        ratio.workspace;
    }

    const defaultPosition = {
      x: viewX / ratio.workspace,
      y: viewY / ratio.workspace
    };
    const sElement = {
      type: elementTypes.decoration,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: elementProps.width,
      height: elementProps.height,
      decorationid: elementProps.guid,
      decorationtype: elementTypes.sticker,
      rot: 0,
      dep
    };
    boundProjectActions.createElement(sElement, page.get('id'));
  }
  const newDownloadedImages = merge({}, downloadedImages);
  newDownloadedImages[element.get('id')] = null;
  that.setState({
    isDragOver: false,
    downloadedImages: newDownloadedImages
  });
  stopEvent(event);
};

export const onExchangeClick = (that) => {
  that.setState({
    showVisualExchange: true
  });
};

export const onExchangeDragStart = (
  that,
  pageId,
  elementId,
  exchangeImageThumbnail,
  e
) => {
  const ev = e.evt || window.event;

  setTransferDataByNode({
    pageId,
    elementId
  });

  that.setState({
    isExchangeImage: true,
    exchangeImageThumbnail
  });

  __app.isExchangeImage = true;

  stopEvent(ev);
};

export const onExchangeDragMove = (that, e) => {
  const ev = e.evt || window.event;
  const x = ev.pageX;
  const y = ev.pageY;
  const exchangeThumbnailRect = {
    x,
    y
  };
  that.setState({
    exchangeThumbnailRect
  });
};

export const onExchangeDragEnd = (that, e) => {
  const ev = e.evt || window.event;
  that.setState({
    isExchangeImage: false,
    isDragOver: false
  });
  getTransferDataByNode(ev);
  delete __app.isExchangeImage;
};

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};
