import qs from 'qs';
import { merge, get } from 'lodash';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { elementTypes, pageTypes, productTypes } from '../../../constants/strings';
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
  // calendarElement 不给选中逻辑。
  if (element.get('type') === elementTypes.calendar) return null;

  const { elementArray } = that.state;
  const elementId = element.get('id');

  // 如果是 spinetext 不能多选
  const isSelectSpine = elementArray.find(ele => ele.get('isSelected') && ele.get('isSpineText'));
  let newElementArray = elementArray;

  // 单选逻辑
  if ((!e.ctrlKey && !e.metaKey) || isSelectSpine) {
    if (!element.get('isSelected')) {
      newElementArray = getSingleSelectedElementArray(elementArray, elementId);
      that.clicksObj.clickElementId = elementId;
    }
  } else {
    // 多选逻辑.
    newElementArray = elementArray.map((ele) => {
      // spineText 不能被多选
      if (ele.get('isSpineText')) {
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
  const { capability } = data;
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

  if(elementTypes.photo === element.get('type')) {
    if (capability.get('canShowSnackBar') && element.get('encImgId')) {
      const { page, ratio, settings, summary } = data;

      const isCover = summary.get('isCover');
      const computed = element.get('computed');
      const templateId = element.get('templateId');
      const isLeft = computed.get('isLeft');
      const SNACK_BAR_HEIGHT = 46;
      const bleed = page.get('bleed');
      const productType = get(settings, 'spec.product');
      const isInnderOfWC = productType === productTypes.WC && !isCover;
      const safeTopRatio = isInnderOfWC ? 0.965 : 1;
      const actualBleed = bleed.map(o => Math.floor(o * ratio.workspace));

      const realPageHeight = Math.round(page.get('height') * ratio.workspace);
      let maxSnackBarTop =
        (realPageHeight * safeTopRatio) - SNACK_BAR_HEIGHT - actualBleed.get('bottom');

      let snackBarTop =
        computed.get('top') + computed.get('height') - SNACK_BAR_HEIGHT;

      const snackBarLeft = computed.get('left');

      let snackBarWidth = computed.get('width');
      let spineShodawWidth = 0;

      that.setState({
        snackBar: {
          isShown: true,
          left: snackBarLeft,
          top: snackBarTop > maxSnackBarTop ? maxSnackBarTop : snackBarTop,
          width: snackBarWidth,
          templateId
        },
        currentPointPhotoElementId: element.get('id')
      });

      that.clearHideSnackBarTimer();
    }
  }

};

export const onMouseLeave = (that, element, e) => {
  that.setState({
    tooltip: {
      isShown: false
    }
  });
  if (elementTypes.photo === element.get('type')) {
    that.delayHideSnackBar();
  }
};

export const onMouseOver = (that, elementGroupNode, element, e) => {
  const { capability } = that.props.data;
  if (elementGroupNode && capability.get('canSelectElement') && (element.get('encImgId') || element.get('type') === elementTypes.text)) {
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

function getOriginalImageUrl(imageUrl) {
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
        imageUrl: getOriginalImageUrl(element.getIn(['computed', 'imgUrl']))
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
      imgRot: 0,
      style: {
        effectId: 0,
        opacity: 100,
        brightness: 0
      },
      imgFlip: false
    };

    boundProjectActions.updateElement(elementData);
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
