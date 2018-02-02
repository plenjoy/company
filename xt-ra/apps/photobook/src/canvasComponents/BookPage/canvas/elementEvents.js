import qs from 'qs';
import { merge } from 'lodash';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
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
      isSelected: element.get('id') === id,
      dateSelected: Date.now()
    });
  });
}

export function selectElements(that, element, e) {
  const { elementArray } = that.state;
  const elementId = element.get('id');

  // 如果是 spinetext 不能多选
  const isSelectSpine = elementArray.find(
    ele => ele.get('isSelected') && ele.get('isSpineText')
  );
  const isBackground = elementArray.find(
    ele => ele.get('isSelected') && ele.get('type') == elementTypes.background
  );
  let newElementArray = elementArray;

  // 单选逻辑
  if ((!e.ctrlKey && !e.metaKey) || isSelectSpine || isBackground) {
    if (!element.get('isSelected')) {
      newElementArray = getSingleSelectedElementArray(elementArray, elementId);
      that.clicksObj.clickElementId = elementId;
    }
  } else {
    // 多选逻辑.
    newElementArray = elementArray.map((ele) => {
      // spineText 不能被多选
      if (
        ele.get('isSpineText') ||
        ele.get('type') == elementTypes.background
      ) {
        return ele;
      }

      if (elementId === ele.get('id')) {
        const isSelected = !ele.get('isSelected');
        const mergeObj = {
          isSelected
        };

        if (isSelected) {
          mergeObj.dateSelected = Date.now();
        }

        return ele.merge(mergeObj);
      }

      return ele;
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
  const { t, data } = that.props;
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

    const elementGroupRect = groupNode.getClientRect();

    const { summary, size } = data;
    const isCover = summary.get('isCover');

    let containerHeight = 0;
    if (isCover) {
      containerHeight =
        size.renderCoverSheetSizeWithoutBleed.height +
        (size.renderCoverSheetSize.height -
          size.renderInnerSheetSizeWithoutBleed.height) /
          2;
    } else {
      containerHeight =
        size.renderInnerSheetSizeWithoutBleed.height +
        (size.renderInnerSheetSize.height -
          size.renderInnerSheetSizeWithoutBleed.height) /
          2;
    }

    that.setState({
      tooltip: {
        isShown: true,
        content: t('DOUBLE_CLICK_TO_EDIT_TEXT'),
        elementRect: elementGroupRect,
        containerHeight
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

export const onMouseOver = (that, elementGroupNode, e) => {
  const { capability } = that.props.data;
  if (elementGroupNode && capability.get('canSelectElement')) {
    elementGroupNode.getStage().content.style.cursor = 'pointer';
  }
};

export const onMouseOut = (that, elementGroupNode, e) => {
  if (elementGroupNode) {
    elementGroupNode.getStage().content.style.cursor = 'default';
  }

  const { capability } = that.props.data;
  if (capability.get('canShowOriginalPhotoLayer')) {
    that.setState({
      originalPhotoLayer: {
        isShown: false
      }
    });
  }
};

function getOriginalImageUrl(element) {
  const imageUrl = element.getIn(['computed', 'imgUrl']);

  switch (element.get('type')) {
    case elementTypes.text:
    case elementTypes.photo: {
      if (!imageUrl || imageUrl.indexOf('?') === -1) return '';
      const arr = imageUrl.split('?');
      const apiUrl = arr[0];
      const queryObj = qs.parse(arr[1]);
      queryObj.px = 0;
      queryObj.py = 0;
      queryObj.pw = 1;
      queryObj.ph = 1;

      return `${apiUrl}?${qs.stringify(queryObj)}`;
    }

    case elementTypes.sticker: {
      return imageUrl.replace(/\w+\.(png|gif|jpg|jpeg)$/, 'original.$1');
    }

    default:
      return '';
  }
}

export const onMouseMove = (that, element, e) => {
  const { capability } = that.props.data;

  if (capability.get('canShowOriginalPhotoLayer')) {
    const OFFSET = 30;
    const { evt } = e;
    let newX = evt.pageX + OFFSET;
    const newY = evt.pageY + OFFSET;
    if (newX + 500 > window.innerWidth) {
      newX = evt.pageX - 500 - OFFSET;
    }

    that.setState({
      originalPhotoLayer: {
        isShown: true,
        x: newX,
        y: newY,
        imageUrl: getOriginalImageUrl(element)
      }
    });
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

  if (!elementProps) {
    return;
  }

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
    const elementData = {
      id: elementId,
      encImgId: curElement.encImgId,
      imageid: curElement.imageid,
      imgRot: curElement.orientation || 0
    };

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
      type: elementTypes.sticker,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: elementProps.width,
      height: elementProps.height,
      decorationId: elementProps.guid,
      picPath: elementProps.picPath,
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
