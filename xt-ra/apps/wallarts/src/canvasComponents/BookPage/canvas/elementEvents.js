import qs from 'qs';
import { merge, get } from 'lodash';
import { getCropOptions } from '../../../utils/crop';
import {
  elementTypes,
  productTypes,
  canvasBorderTypes,
  enumPhotoQuantity
} from '../../../constants/strings';
import {
  getTransferData,
  setTransferDataByNode,
  getTransferDataByNode
} from '../../../../../common/utils/drag';
import { customeTemplateIds } from '../../../utils/customeTemplate';
import { getImageShapeString } from '../../../utils/template/getTemplateId';

function getSingleSelectedElementArray(elementArray, id) {
  return elementArray.map(element => {
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
    newElementArray = elementArray.map(o => {
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
  const { t, data, actions } = that.props;
  const { changeBookSheetState, clearHideSnackBarTimer } = actions;
  const { page, ratio, summary, capability } = data;
  const isHardCover = summary.get('isHardCover');
  const bleed = page.get('bleed');
  const { containerRect } = that.state;
  const actualBleed = bleed.map(o => Math.floor(o * ratio));
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
        const { settings, size } = data;
        const productType = settings.get('product');
        const matteStyle = settings.get('matteStyle');
        const templateId = element.get('templateId');

        const backgroundCenterPosition = {
          x:
            get(size, 'renderContainerProps.x') +
            get(size, 'renderBgSize.centerLeft'),
          y:
            get(size, 'renderContainerProps.y') +
            get(size, 'renderBgSize.centerTop')
        };

        const centerWidth = get(size, 'renderFrameBorderInnerSize.width');
        const centerHeight = get(size, 'renderFrameBorderInnerSize.height');

        const isFloatFrame =
          productType === productTypes.floatFrame ||
          productType === productTypes.floatFrame_metalFrame ||
          productType === productTypes.floatFrame_classicFrame;

        const snackBarLeft =
          matteStyle !== 'none' || isFloatFrame
            ? backgroundCenterPosition.x +
              Math.floor(get(size, 'renderMatteSize.left')) +
              get(size, 'renderFloatBgSize.left') -
              Math.ceil(get(size, 'renderBoardInFrameSize.left'))
            : backgroundCenterPosition.x;

        const snackBarTop =
          matteStyle !== 'none' || isFloatFrame
            ? backgroundCenterPosition.y +
              centerHeight -
              46 -
              get(size, 'renderMatteSize.bottom') -
              get(size, 'renderFloatBgSize.bottom') +
              get(size, 'renderBoardInFrameSize.bottom')
            : backgroundCenterPosition.y + centerHeight - 44;

        const snackBarWidth =
          matteStyle !== 'none' || isFloatFrame
            ? centerWidth -
              get(size, 'renderMatteSize.left') -
              get(size, 'renderMatteSize.right') -
              Math.floor(get(size, 'renderFloatBgSize.left')) -
              Math.floor(get(size, 'renderFloatBgSize.right')) +
              Math.floor(get(size, 'renderBoardInFrameSize.left')) +
              Math.floor(get(size, 'renderBoardInFrameSize.right'))
            : Math.ceil(centerWidth);
        changeBookSheetState({
          snackBar: {
            isShown: true,
            left: snackBarLeft,
            top: snackBarTop,
            width: snackBarWidth,
            templateId
          },
          currentPointPhotoElementId: element.get('id')
        });

        clearHideSnackBarTimer();
      }

      break;
    }
    default:
      break;
  }
};

export const onMouseLeave = (that, element, e) => {
  const { actions } = that.props;
  const { delayHideSnackBar } = actions;
  delayHideSnackBar();

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
    summary,
    settings
  } = data;
  const { boundProjectActions, boundPaginationActions, doAutoLayout } = actions;
  const elementArray = data.elements;
  const isCover = summary.get('isCover');

  const maxDepElement = elementArray.maxBy(item => {
    return item.get('dep');
  });
  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1;

  const ev = event || window.event;

  const elementProps = getTransferData(ev);

  if (!elementProps) {
    return;
  }
  // if (
  //   page &&
  //   pagination.pageId !== page.get('id') &&
  //   page.get('type') !== pageTypes.spine
  // ) {
  //   const index = pagination.pageIndex === 1 ? 0 : 1;
  //   boundPaginationActions.switchPage(index, page.get('id'));
  // }
  if (elementProps.length) {
    const curElement = elementProps[0];
    const elementId = element.get('id');
    const elementData = {
      id: elementId,
      imgRot: 0,
      encImgId: curElement.encImgId,
      imageid: curElement.imageid,
      imgRot: curElement.orientation || 0
    };

    if (curElement.encImgId !== element.get('encImgId')) {
      const orientation = settings.get('orientation');
      const imageDetail = getImage(allImages, curElement.encImgId);
      const imageWidth = imageDetail && imageDetail.get('width');
      const imageHeight = imageDetail && imageDetail.get('height');

      const isSwitched = Math.abs((elementData.imgRot / 90) % 2) === 1;
      const w = isSwitched ? imageHeight : imageWidth;
      const h = isSwitched ? imageWidth : imageHeight;

      const imageOrientation = w >= h ? 'Landscape' : 'Portrait';

      if (
        orientation !== imageOrientation &&
        settings.get('photoQuantity') === enumPhotoQuantity.one
      ) {
        boundProjectActions
          .changeProjectSetting({ orientation: imageOrientation })
          .then(() => {
            boundProjectActions.updateElement(elementData);
          });
      } else {
        boundProjectActions.updateElement(elementData);
      }
    }

    // 只有拖拽的图片不是同一张图片时, 才需要替换.
    // if (encImgId !== element.get('encImgId')) {
    //   const imageDetail = getImage(allImages, encImgId);

    //   if (imageDetail) {
    //     const cropOptions = getCropOptions(
    //       imageDetail.get('width'),
    //       imageDetail.get('height'),
    //       element.get('width'),
    //       element.get('height'),
    //       0
    //     );

    //     const { cropLUX, cropLUY, cropRLX, cropRLY } = cropOptions;

    //     const elementData = {
    //       id: elementId,
    //       encImgId,
    //       imageid: curElement.imageid,
    //       imgRot: 0,
    //       style: {
    //         effectId: 0,
    //         opacity: 100
    //       },
    //       imgFlip: false,
    //       cropLUX,
    //       cropLUY,
    //       cropRLX,
    //       cropRLY
    //     };

    //     const dropImageDetail = getImage(allImages, element.get('encImgId'));
    //     const dragImageShapeString = getImageShapeString(imageDetail.toJS());
    //     const dropImageShapeString = getImageShapeString((dropImageDetail || element).toJS());

    //     boundProjectActions.updateElement(elementData).then(() => {
    //       // 封面上图片替换时, 不需要更新模板.
    //       // if (!isCover && dragImageShapeString !== dropImageShapeString) {
    //       //   doAutoLayout([]);
    //       // }
    //     });
    //   }
    // }
  }
  const newDownloadedImages = merge({}, downloadedImages);
  newDownloadedImages[element.get('id')] = null;
  that.setState({
    isDragOver: false,
    downloadedImages: newDownloadedImages
  });
  stopEvent(event);
};

export const onMouseWheel = (that, element, event) => {
  const wheelDir = event.wheelDelta
    ? -event.wheelDelta / 120
    : event.detail / 3;
  const encImgId = element.get('encImgId');
  if (!encImgId) return;
  const { data, actions } = that.props;
  const { allImages, capability } = data;
  const { boundProjectActions } = actions;
  if (!capability.get('canScaleImageByMouseWheel')) return;
  const theImage = allImages.find(img => img.get('encImgId') === encImgId);
  const imageWidth = theImage.get('width');
  const imageHeight = theImage.get('height');

  const zoomRatio = wheelDir > 0 ? 1.1 : 0.9;

  const oldCropPw = element.get('cropRLX') - element.get('cropLUX');
  const oldCropPh = element.get('cropRLY') - element.get('cropLUY');
  const oldCropX = element.get('cropLUX') * imageWidth;
  const oldCropY = element.get('cropLUY') * imageHeight;
  const oldCropWidth = imageWidth * oldCropPw;
  const oldCropHeight = imageHeight * oldCropPh;

  let newCropWidth = oldCropWidth * zoomRatio;
  let newCropHeight = oldCropHeight * zoomRatio;
  // 如果用户裁剪的区域已经小于 300 像素，就不能继续裁更小的尺寸。
  if (newCropWidth <= 100 && zoomRatio === 0.9) return;

  if (newCropWidth >= imageWidth) {
    newCropWidth = imageWidth;
    newCropHeight = oldCropHeight / oldCropWidth * newCropWidth;
  }
  if (newCropHeight >= imageHeight) {
    newCropHeight = imageHeight;
    newCropWidth = oldCropWidth / oldCropHeight * newCropHeight;
  }
  let newCropX = oldCropX + (oldCropWidth - newCropWidth) / 2;
  let newCropY = oldCropY + (oldCropHeight - newCropHeight) / 2;

  if (newCropX <= 0) {
    newCropX = 0;
  }
  if (newCropY <= 0) {
    newCropY = 0;
  }
  if (newCropX + newCropWidth >= imageWidth) {
    newCropX = imageWidth - newCropWidth;
  }
  if (newCropY + newCropHeight >= imageHeight) {
    newCropY = imageHeight - newCropHeight;
  }
  const elementData = {
    id: element.get('id'),
    cropLUX: newCropX / imageWidth,
    cropRLX: (newCropX + newCropWidth) / imageWidth,
    cropLUY: newCropY / imageHeight,
    cropRLY: (newCropY + newCropHeight) / imageHeight
  };
  boundProjectActions.updateElement(elementData);
};

export const onExchangeClick = that => {
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

export const stopEvent = event => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

export const getImage = (images, encImgId) => {
  return images.find(im => {
    return im.get('encImgId') === encImgId;
  });
};
