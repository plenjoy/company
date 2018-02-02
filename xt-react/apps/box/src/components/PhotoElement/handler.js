import { get, merge } from 'lodash';
import { getCropOptions, getCropLRByOptions } from '../../utils/crop';
import { elementTypes, pageTypes } from '../../contants/strings';
import { getTransferData } from '../../../common/utils/drag';

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

export const handleDragOver = (that, event) => {
  stopEvent(event);
};

/**
 * photoElement drop 处理函数
 * @param   {object} that photoElement的this指向
 */
export const onDrop = (that, event) => {

  const { data, actions } = that.props;

  const { element, page, rate, pagination } = data;
  const { boundProjectActions, boundPaginationActions, toggleOperationPanel } = actions;

  const elementWidth = get(element, 'pw') * get(page, 'width') * rate;
  const elementHeight = get(element, 'ph') * get(page, 'height') * rate;

  const ev = event || window.event;

  const elementProps = getTransferData(ev);

  if (page && pagination.pageId !== get(page, 'id') && get(page, 'type') !== pageTypes.spine) {
    const index = pagination.pageIndex === 1 ? 0 : 1;
    boundPaginationActions.switchPage(index, get(page, 'id'));
  }
  if (elementProps) {
    const curElement = elementProps;
    const orientation = parseInt(curElement.orientation) || 0;
    const { width, height } = curElement;
    const elementId = get(element, 'id');
    const options = getCropOptions(width, height, elementWidth, elementHeight, orientation);
    const elementData = merge(
      {},
      getCropLRByOptions(options.px, options.py, options.pw, options.ph),
      {
        id: elementId,
        encImgId: curElement.encImgId,
        imageid: curElement.imageid,
        imgRot: orientation,
        style: {
          effectId: 0,
          opacity: 100
        },
        imgFlip: false
      }
    );
    boundProjectActions.updateElement(elementData);
  }
  toggleOperationPanel(false);
  stopEvent(event);
};

/**
 * 显示或者影藏actionbar
 * @param  {[type]} that [description]
 * @return {[type]}      [description]
 */
export const handlerClick = (that, Eventdata, ev) => {
  const { actions, data } = that.props;
  const { toggleOperationPanel, openUploadImageModal, boundWorkspaceActions } = actions;
  const { element } = data;
  const imgId = get(element, 'encImgId');

  if (!imgId) {
    const elementId = get(element, 'id');
    const elementWidth = get(element, 'computed.width');
    const elementHeight = get(element, 'computed.height');
    boundWorkspaceActions.autoAddPhotoToCanvas(true, elementId, elementWidth, elementHeight);
    openUploadImageModal();
  } else {
    const event = ev || window.event;
    const offset = {
      top: event.clientY,
      left: event.clientX
    };
    toggleOperationPanel(true, offset, merge({}, element));
  }
};

export const onMouseMove =(that,ev)=>{
   const { actions, data } = that.props;
    const { setShowSnackBarStatus } = actions;
    setShowSnackBarStatus(true)
}

export const onMouseOut =(that,ev)=>{
   const { actions, data } = that.props;
  const { setShowSnackBarStatus } = actions;
  setShowSnackBarStatus(false)
}

