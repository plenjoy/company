import { get } from 'lodash';
import { elementTypes, pageTypes } from '../../../contants/strings';
import { getTransferData } from '../../../../common/utils/drag';
import { getCropOptions } from '../../../utils/crop';

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

/**
 * 切换当前的page为工作目录.
 * @param  {object} that BookPage的this指向
 */
export const switchPage = (that, e, callback) => {
  const { actions, data } = that.props;
  const { boundPaginationActions } = actions;
  const { page, index, pagination } = data;
  const event = e || window.event;
  // event.stopPropagation();

  if (page && page.enabled && pagination.pageId !== get(page, 'id') && get(page, 'type') !== pageTypes.spine) {
    boundPaginationActions.switchPage(index, get(page, 'id')).then(() => {
      callback && callback();
    });
  }
};

export const convertElement = (that, elementInfo) => {
  const { data, actions } = that.props;
  const { page } = data;
  const { width, height } = elementInfo;
  const currentPageType = get(page, 'type');
  const options = getCropOptions(width, height, page.width, page.height, 0);
  const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
  const elementType = currentPageType === pageTypes.dvd ? elementTypes.dvd : elementTypes.photo;
  const elType = currentPageType === pageTypes.dvd ? 'dvd' : 'image';
  const newPhotoElement = {
    type: elementType,
    elType,
    x: 0,
    y: 0,
    width: page.width,
    height: page.height,
    px: 0,
    py: 0,
    pw: 1,
    ph: 1,
    imgFlip: false,
    rot: 0,
    imgRot: 0,
    encImgId: elementInfo.encImgId,
    imageid: elementInfo.imageid,
    dep: 0,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY,
    lastModified: Date.now()
  };

  return newPhotoElement;
};

export const onPageDragOver = (e) => {
  stopEvent(e);
};

const addElement = (that, elementInfo) => {
  const { data, actions } = that.props;
  const { page } = data;
  const { boundProjectActions } = actions;
  const pageType = get(page, 'type');

  const currentPageId = page.id;
  const newPhotoElement = convertElement(that, elementInfo);

  boundProjectActions.createElement(currentPageId, newPhotoElement);
  if (pageType === pageTypes.page) {
    boundProjectActions.changeProjectSetting({ type: 'IW' });
  }
};

export const onPageDroped = (that, e) => {
  const event = e || window.event;
  const { data, actions } = that.props;
  const {
    rate,
    paginationSpread,
    pagination,
    page
  } = data;

  let elementsProps;
  elementsProps = getTransferData(event);
  if (elementsProps) {
    addElement(that, elementsProps);
  }
  stopEvent(event);
};

export const setShowSnackBarStatus = (that,status)=> {
    that.setState({
      showSnackBar: status
    });
  }
