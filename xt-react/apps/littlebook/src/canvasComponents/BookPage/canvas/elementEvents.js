import qs from 'qs';
import { merge } from 'lodash';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import {
  elementTypes,
  pageTypes,
  spineShodawRatioForHardCover,
  spineShodawRatioForPaperCover,
  coverTypes
} from '../../../contants/strings';
import {
  getTransferData,
  setTransferDataByNode,
  getTransferDataByNode
} from '../../../../../common/utils/drag';
import { customeTemplateIds } from '../../../utils/customeTemplate';
import { getImageShapeString } from '../../../utils/template/getTemplateId';

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

  let newElementArray = elementArray;

  if (!e.ctrlKey && !e.metaKey) {
    if (!element.get('isSelected')) {
      newElementArray = getSingleSelectedElementArray(elementArray, elementId);

      that.clicksObj.clickElementId = elementId;
    }
  } else {
    newElementArray = elementArray.map((o) => {
      if (elementId === o.get('id')) {
        const isSelected = !o.get('isSelected');
        const mergeObj = {
          isSelected
        };
        if (isSelected) {
          mergeObj.dateSelected = Date.now();
        }
        return o.merge(mergeObj);
      }
      return o;
    });
  }

  that.setState({
    elementArray: newElementArray
  });
}

export const onMouseEnter = (that, element, e) => {
  const { t, data } = that.props;
  const { page, ratio, summary, capability } = data;
  const isHardCover = summary.get('isHardCover');
  const bleed = page.get('bleed');
  const { containerRect } = that.state;
  const actualBleed = bleed.map(o => Math.floor(o * ratio.workspace));
  const bleedBottom = actualBleed.get('bottom');
  const coverSpacing = 13;
  switch (element.get('type')) {
    case elementTypes.text: {
      if (capability.get('canShowTextTooltip')) {
        const computed = element.get('computed');
        const halfWidth = computed.get('width') / 2;

        that.setState({
          tooltip: {
            isShown: true,
            content: t('CLICK_TO_EDIT_TEXT'),
            style: {
              left: computed.get('left') + containerRect.left + halfWidth,
              top: isHardCover
                ? containerRect.height +
                  containerRect.top -
                  bleedBottom +
                  coverSpacing
                : computed.get('top') +
                  computed.get('height') +
                  containerRect.top +
                  coverSpacing,
              height: 14,
              transform: 'translate(-50%, 0)'
            }
          }
        });
      }
      break;
    }
    case elementTypes.photo: {
      if (capability.get('canShowSnackBar') && element.get('encImgId')) {
        const { page, ratio, project, summary } = data;

        const computed = element.get('computed');
        const templateId = element.get('templateId');
        const isLeft = computed.get('isLeft');
        const SNACK_BAR_HEIGHT = 46;

        const realPageHeight = Math.round(page.get('height') * ratio.workspace);
        let maxSnackBarTop =
          realPageHeight - SNACK_BAR_HEIGHT - actualBleed.get('bottom');

        let snackBarTop =
          computed.get('top') + computed.get('height') - SNACK_BAR_HEIGHT;

        const snackBarLeft = computed.get('left');
        const isCover = summary.get('isCover');

        let snackBarWidth = computed.get('width');
        let spineShodawWidth = 0;

        if (isCover) {
          switch (project.getIn(['setting', 'cover'])) {
            case coverTypes.LBPAC:
              spineShodawWidth = snackBarWidth * 0.00932021554890567;
              maxSnackBarTop += 4;
              snackBarTop += 1;
              break;
            case coverTypes.LBHC:
              spineShodawWidth = snackBarWidth * 0.01338404929733967;
              maxSnackBarTop += 3;
              snackBarTop += 1;
              break;
            default:
          }

          if (templateId === customeTemplateIds.full && !isLeft) {
            snackBarWidth -= Math.round(spineShodawWidth);
          }
        }

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

      break;
    }
    default:
      break;
  }
};

export const onMouseLeave = (that, element, e) => {
  that.delayHideSnackBar();

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

export const onClick = (that, element, e) => {
  switch (element.get('type')) {
    case elementTypes.text: {
      that.actionbarActions.onEditText(element);
      break;
    }
    case elementTypes.photo: {
      that.actionbarActions.onEditImage(element);
      break;
    }
    default:
      break;
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

  const {
    page,
    ratio,
    paginationSpread,
    pagination,
    parameters,
    allImages,
    summary
  } = data;
  const { boundProjectActions, boundPaginationActions, doAutoLayout } = actions;
  const elementArray = data.elements;
  const isCover = summary.get('isCover');

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

    const encImgId = curElement.encImgId;

    // 只有拖拽的图片不是同一张图片时, 才需要替换.
    if (encImgId !== element.get('encImgId')) {
      const imageDetail = getImage(allImages, encImgId);

      if (imageDetail) {
        const cropOptions = getCropOptions(
          imageDetail.get('width'),
          imageDetail.get('height'),
          element.get('width'),
          element.get('height'),
          imageDetail.get('orientation') || 0
        );

        const { cropLUX, cropLUY, cropRLX, cropRLY } = cropOptions;

        const elementData = {
          id: elementId,
          encImgId,
          imageid: curElement.imageid,
          imgRot: imageDetail.get('orientation') || 0,
          style: {
            effectId: 0,
            opacity: 100
          },
          imgFlip: false,
          cropLUX,
          cropLUY,
          cropRLX,
          cropRLY
        };

        const dropImageDetail = getImage(allImages, element.get('encImgId'));
        const dragImageShapeString = getImageShapeString(imageDetail.toJS());
        const dropImageShapeString = getImageShapeString((dropImageDetail || element).toJS());

        boundProjectActions.updateElement(elementData).then(() => {
          // 封面上图片替换时, 不需要更新模板.
          if (!isCover && dragImageShapeString !== dropImageShapeString) {
            doAutoLayout([]);
          }
        });
      }
    }
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

export const getImage = (images, encImgId) => {
  return images.find((im) => {
    return im.get('encImgId') === encImgId;
  });
};
