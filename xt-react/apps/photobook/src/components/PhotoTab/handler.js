import { isNumber, merge, get } from 'lodash';
import Immutable, { fromJS } from 'immutable';
import {
  elementTypes,
  pageTypes,
  defaultFrameOptions
} from '../../contants/strings';
import { getNewPosition } from '../../utils/elementPosition';
import { mergeTemplateElements } from '../../utils/template/mergeTemplateElements';
import { onSortImages, onGroupImages } from '../../../../common/utils/sort';
import { getCropOptions } from '../../utils/crop';

export const getSortOptions = t => {
  return [
    {
      label: t('DATE_TOKEN_O_T_N'),
      value: '>-shotTime'
    },
    {
      label: t('DATE_TOKEN_N_T_O'),
      value: '<-shotTime'
    },
    {
      label: t('UPLOAD_TIME_O_T_N'),
      value: '>-uploadTime'
    },
    {
      label: t('UPLOAD_TIME_N_T_O'),
      value: '<-uploadTime'
    },
    {
      label: t('TITLE_A_Z'),
      value: '>-name'
    },
    {
      label: t('TITLE_Z_A'),
      value: '<-name'
    }
  ];
};

export const getGroupOptions = t => {
  return [
    {
      label: t('DAY'),
      value: 'day'
    },
    {
      label: t('WEEK'),
      value: 'week'
    },
    {
      label: t('MONTH'),
      value: 'month'
    },
    {
      label: t('NONE'),
      value: 'none'
    }
  ];
};

export const onToggleHideUsed = that => {
  const { actions, data } = that.props;
  const { boundTrackerActions } = actions;
  const { isUsePhotoGroup } = data;
  const {
    uploadedImages,
    copyUploadedImages,
    currentGroupOption,
    isNoneGroup
  } = that.state;
  const isHideUseChecked = !that.state.isHideUseChecked;
  if (isHideUseChecked) {
    const newImages = copyUploadedImages.filter(item => {
      return item.usedCount === 0;
    });
    const groupedImages =
      isUsePhotoGroup && isNoneGroup
        ? groupImages(newImages, currentGroupOption.value)
        : newImages;
    that.setState(
      {
        uploadedImages: groupedImages,
        isHideUseChecked
      },
      () => {
        boundTrackerActions.addTracker('ChangeHideUsed,on');
      }
    );
  } else {
    const groupedImages =
      isUsePhotoGroup && isNoneGroup
        ? groupImages(copyUploadedImages, currentGroupOption.value)
        : copyUploadedImages;
    that.setState(
      {
        uploadedImages: groupedImages,
        isHideUseChecked
      },
      () => {
        boundTrackerActions.addTracker('ChangeHideUsed,off');
      }
    );
  }
};

export const sortImages = (uploadedImages, param) => {
  const { value } = param;

  const valueArr = value.split('-');
  const diffTag = valueArr[0];
  const realValue = valueArr[1];

  // 判断是否升序.
  const asc = diffTag === '>';
  return onSortImages(uploadedImages, realValue, asc);
};

export const groupImages = (uploadedImages, geoupValue) => {
  return onGroupImages(uploadedImages, geoupValue);
};

export const onSorted = (that, param) => {
  const { actions, data } = that.props;
  const { boundTrackerActions } = actions;

  const { isUsePhotoGroup } = data;

  const { currentGroupOption, isNoneGroup, copyUploadedImages } = that.state;
  const uploadedImages = sortImages(copyUploadedImages || [], param);

  // 用户点击 图片排序操作的 埋点  asc 升序， dsc 降序;
  const { value } = param;
  const valueArr = value.split('-');
  const diffTag = valueArr[0];
  const realValue = valueArr[1];
  const trackerMessage =
    diffTag === '<' ? `${realValue}Dsc` : `${realValue}Asc`;

  if (that.state.isHideUseChecked) {
    const nonUsedImages = uploadedImages.filter(item => {
      return item.usedCount === 0;
    });
    const groupedImages =
      isUsePhotoGroup && isNoneGroup
        ? groupImages(nonUsedImages, currentGroupOption.value)
        : nonUsedImages;
    that.setState(
      {
        uploadedImages: groupedImages,
        currentOption: param
      },
      () => {
        boundTrackerActions.addTracker(`ChangeSort,${trackerMessage}`);
      }
    );
  } else {
    const groupedImages =
      isUsePhotoGroup && isNoneGroup
        ? groupImages(uploadedImages, currentGroupOption.value)
        : uploadedImages;
    that.setState(
      {
        uploadedImages: groupedImages,
        currentOption: param
      },
      () => {
        boundTrackerActions.addTracker(`ChangeSort,${trackerMessage}`);
      }
    );
  }
};

export const onGrouped = (that, param) => {
  const { actions, data } = that.props;
  const { boundTrackerActions } = actions;

  const { isUsePhotoGroup } = data;
  const { currentOption, copyUploadedImages } = that.state;

  const { value } = param;

  const isNoneGroup = value !== 'none';

  const uploadedImages = sortImages(copyUploadedImages || [], currentOption);

  if (that.state.isHideUseChecked) {
    const nonUsedImages = uploadedImages.filter(item => {
      return item.usedCount === 0;
    });
    const groupedImages =
      isUsePhotoGroup && isNoneGroup
        ? groupImages(nonUsedImages, value)
        : nonUsedImages;
    that.setState(
      {
        uploadedImages: groupedImages,
        isNoneGroup,
        currentGroupOption: param
      },
      () => {
        // boundTrackerActions.addTracker(`ChangeSort,${trackerMessage}`);
      }
    );
  } else {
    const groupedImages =
      isUsePhotoGroup && isNoneGroup
        ? groupImages(uploadedImages, value)
        : uploadedImages;
    that.setState(
      {
        uploadedImages: groupedImages,
        isNoneGroup,
        currentGroupOption: param
      },
      () => {
        // boundTrackerActions.addTracker(`ChangeSort,${trackerMessage}`);
      }
    );
  }
};

export const uploadFileClicked = that => {
  const { actions, data } = that.props;
  const { boundImagesActions, boundTrackerActions } = actions;
  const { useNewUpload } = data;

  // 用户点击 addPhotos 时的 埋点。因为 该事件会触发 四次，所以这里做一个
  // 隔时延迟处理来消除过多的被执行。
  const timerFunc = () => {
    boundTrackerActions.addTracker('ClickAddPhotos');
    const method = useNewUpload ? 'asynchronous' : 'synchronous';
    boundTrackerActions.addTracker(`UploadPhotosMethod,${method}`);
    boundImagesActions.autoAddPhotoToCanvas({
      status: false,
      elementId: '',
      elementWidth: 0,
      elementHeight: 0
    });
  };
  that.timer && clearTimeout(that.timer);
  const timer = setTimeout(timerFunc, 30);

  that.timer = timer;
};

/**
 * 设置图片的使用次数.
 * @param imageArr 图片数组
 * @param imageUsedCountMap 包含使用次数的对象.
 */
export const checkUsageCount = (imageArr, imageUsedCountMap) => {
  if (imageArr && imageArr.length) {
    imageArr.forEach(v => {
      const count =
        imageUsedCountMap && imageUsedCountMap[v.encImgId]
          ? imageUsedCountMap[v.encImgId]
          : 0;
      v.usedCount = count;
    });
  }

  return imageArr;
};

export const tipClick = that => {
  that.fileUpload.onClickInput();
  that.uploadFileClicked();
};

export const addGroupElements = (that, groupTitle) => {
  const { uploadedImages } = that.state;
  const { actions, data } = that.props;
  const { page, allImages, summary, bookSetting } = data;

  const isEnableAutoLayout = get(bookSetting, 'autoLayout');
  const pageElements = page.get('elements');
  const images = uploadedImages[groupTitle];

  const { boundProjectActions, doAutoLayout, boundTrackerActions } = actions;

  if (!summary.get('isEnable')) {
    if (pageElements && pageElements.size) {
      updateCameoElement(that, pageElements, images[0]);
    }
    return;
  }

  const emptyPhotoElement = pageElements.filter(ele => {
    return !ele.get('encImgId') && ele.get('type') === elementTypes.photo;
  });
  const emptyPhotoSize = emptyPhotoElement.size;

  // 埋点
  boundTrackerActions.addTracker(`AddGroupPhotoPageByButton,${images.length}`);

  // 如果页面不存在空图片框或者图片数大于空坑数并且启用了autolayout则应用autolayout
  if (emptyPhotoSize === 0) {
    const addElements = [];
    // 将图片填充到空的图片框
    if (images && images.length) {
      images.forEach((image, index) => {
        const newElement = createElement(
          page,
          image,
          index,
          fromJS(addElements)
        );
        addElements.push(newElement);
      });
    }

    if (isEnableAutoLayout) {
      doAutoLayout(addElements);
    } else {
      boundProjectActions.createElements(addElements);
    }
  } else {
    let addedPhotoElements = Immutable.List();
    let existsBlankPhotoElements = Immutable.List();
    let existsPhotoElements = Immutable.List();
    let otherElements = Immutable.List();

    pageElements.forEach(element => {
      if (element.get('type') === elementTypes.photo) {
        if (!element.get('encImgId')) {
          const image = images.pop();
          if (image) {
            addedPhotoElements = addedPhotoElements.push(
              element.set('encImgId', image.encImgId)
            );
          } else {
            existsBlankPhotoElements = existsBlankPhotoElements.push(element);
          }
        } else {
          existsPhotoElements = existsPhotoElements.push(element);
        }
      } else {
        otherElements = otherElements.push(element);
      }
    });

    const sortedAddedPhotoElements = mergeTemplateElements(
      page.set('elements', addedPhotoElements),
      addedPhotoElements.concat(existsBlankPhotoElements),
      allImages
    );

    boundProjectActions.applyTemplate(
      page.get('id'),
      '',
      sortedAddedPhotoElements.concat(existsPhotoElements).concat(otherElements)
    );
  }
};

export const addGroupElement = (that, image) => {
  const { actions, data } = that.props;
  const { page, allImages, summary, bookSetting } = data;

  const { boundProjectActions, doAutoLayout, boundTrackerActions } = actions;

  const isEnableAutoLayout = get(bookSetting, 'autoLayout');
  const pageElements = page.get('elements');

  if (!summary.get('isEnable')) {
    if (pageElements && pageElements.size) {
      updateCameoElement(that, pageElements, image);
    }
    return;
  }

  const emptyPhotoElementIndex = pageElements.findIndex(ele => {
    return !ele.get('encImgId') && ele.get('type') === elementTypes.photo;
  });

  // 埋点
  boundTrackerActions.addTracker('AddPhotoToPageByButton');

  if (emptyPhotoElementIndex === -1) {
    const newElement = createElement(page, image);
    if (isEnableAutoLayout) {
      doAutoLayout([newElement]);
    } else {
      boundProjectActions.createElement(newElement);
    }
  } else {
    const images = [image];

    let addedPhotoElements = Immutable.List();
    let existsBlankPhotoElements = Immutable.List();
    let existsPhotoElements = Immutable.List();
    let otherElements = Immutable.List();

    pageElements.forEach(element => {
      if (element.get('type') === elementTypes.photo) {
        if (!element.get('encImgId')) {
          const img = images.pop();
          if (img) {
            addedPhotoElements = addedPhotoElements.push(
              element.set('encImgId', img.encImgId)
            );
          } else {
            existsBlankPhotoElements = existsBlankPhotoElements.push(element);
          }
        } else {
          existsPhotoElements = existsPhotoElements.push(element);
        }
      } else {
        otherElements = otherElements.push(element);
      }
    });

    const sortedAddedPhotoElements = mergeTemplateElements(
      page.set('elements', addedPhotoElements),
      addedPhotoElements.concat(existsBlankPhotoElements),
      allImages
    );

    boundProjectActions.applyTemplate(
      page.get('id'),
      '',
      sortedAddedPhotoElements.concat(existsPhotoElements).concat(otherElements)
    );
  }
};

export const createElement = (
  page,
  image,
  index = 0,
  addElements = fromJS([])
) => {
  let currentElementArray = page.get('elements');

  const maxDepElement = page.get('elements').maxBy(item => {
    return item.get('dep');
  });
  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1 + index;

  currentElementArray = currentElementArray.filter(
    ele => ele.get('type') !== elementTypes.background
  );

  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  currentElementArray = currentElementArray.concat(addElements);

  const newElementPosition = getNewPosition(currentElementArray, page);

  const isSwitched = (Math.abs(image.orientation) / 90) % 2 === 1;

  const whRatio = isSwitched
    ? image.height / image.width
    : image.width / image.height;

  const defaultFrameSize = calcDefaultFrameSize(page, whRatio, false);

  const cropOptions = getCropOptions(
    image.width,
    image.height,
    defaultFrameSize.width,
    defaultFrameSize.height,
    image.orientation
  );

  return merge({}, newElementPosition, defaultFrameSize, {
    type: elementTypes.photo,
    encImgId: image.encImgId,
    imageid: image.imageid,
    px: newElementPosition.x / pageWidth,
    py: newElementPosition.y / pageHeight,
    pw: defaultFrameSize.width / pageWidth,
    ph: defaultFrameSize.height / pageHeight,
    dep,
    rot: 0,
    imgRot: image.orientation,
    imgFlip: false,
    cropLUX: cropOptions.cropLUX,
    cropLUY: cropOptions.cropLUY,
    cropRLX: cropOptions.cropRLX,
    cropRLY: cropOptions.cropRLY
  });
};

/**
 * 计算添加的图片框和文本框, painted text的大小.
 * @param  {[type]} page [description]
 * @param  {number} whRatio 宽高比.
 * @return {[type]}      [description]
 */
const calcDefaultFrameSize = (page, whRatio = 2, isSticker = false) => {
  let width = 0;
  let height = 0;

  if (page) {
    const pageWidth = page.get('width');
    const defaultOptions = isSticker
      ? defaultStickerOptions
      : defaultFrameOptions;

    // 框的宽与page的宽的比.
    let wRatio = defaultOptions.default.value;

    if (
      page.get('type') === pageTypes.page ||
      page.get('type') === pageTypes.back ||
      page.get('type') === pageTypes.front
    ) {
      wRatio = defaultOptions.ps.value;
    }

    width = pageWidth * wRatio;
    height = width / whRatio;

    if (whRatio < 1) {
      height = width;
      width = height * whRatio;
    }
  }

  return {
    width,
    height
  };
};

export const updateCameoElement = (that, pageElements, image) => {
  const { actions } = that.props;
  const cameoElement = pageElements.find(ele => {
    return ele.get('type') === elementTypes.cameo;
  });
  const imageId = image.encImgId;
  if (cameoElement && cameoElement.get('encImgId') !== imageId) {
    actions.boundProjectActions.updateElement({
      id: cameoElement.get('id'),
      encImgId: imageId,
      imgRot: image.orientation
    });
  }
};

export const onSelectFile = (that, files) => {};
