import { get, merge } from 'lodash';

import projectParser from '../../../../common/utils/projectParser';
import { cameoShapeTypes, cameoSizeTypes, cameoPaddingsRatio } from '../../../contants/strings';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { computedCameoElementOptions } from '../../../utils/cameo';
import { getTransferData } from '../../../../common/utils/drag';

export const getCameoShadowStyle = (cameoShape, widthoutBleedSize, bleedSize) => {
  let width; let height; let top; let left;
  if (cameoShape === cameoShapeTypes.rect) {
    width = widthoutBleedSize.width / (1 - cameoPaddingsRatio.rectCameoPaddingLeft * 2);
    height = widthoutBleedSize.height / (1 - cameoPaddingsRatio.rectCameoPaddingTop * 2);
    top = bleedSize.top - height * cameoPaddingsRatio.rectCameoPaddingTop;
    left = bleedSize.left - height * cameoPaddingsRatio.rectCameoPaddingLeft;
  } else if (cameoShape === cameoShapeTypes.round) {
    width = widthoutBleedSize.width / (1 - cameoPaddingsRatio.roundCameoPaddingLeft * 2);
    height = widthoutBleedSize.height / (1 - cameoPaddingsRatio.roundCameoPaddingTop * 2);
    top = bleedSize.top - height * cameoPaddingsRatio.roundCameoPaddingTop;
    left = bleedSize.left - height * cameoPaddingsRatio.roundCameoPaddingLeft;
  }
  return {
    width: `${width}px`,
    height: `${height}px`,
    top: `${top}px`,
    left: `${left}px`
  };
};


export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

export const handleDragOver = (that, event) => {
  stopEvent(event);
};

/**
 * 天窗drop处理函数
 * @param   {object} that CameoElement的this指向
 */
export const onDrop = (that, event) => {
  const { data, actions } = that.props;

  const { element, page, ratio } = data;
  const { boundProjectActions } = actions;

  const imgRot = 0;

  const elementWidth = get(element, 'computed.width');
  const elementHeight = get(element, 'computed.height');

  const ev = event || window.event;

  const elementProps = getTransferData(event);
  const { width, height } = elementProps;
  const elementId = get(element, 'id');

  const options = getCropOptions(width, height, elementWidth, elementHeight, imgRot);
  const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
  const elementData = merge({}, {
    id: elementId,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY,
    imgRot,
    encImgId: elementProps.encImgId,
    imageid: elementProps.imageid
  });
  boundProjectActions.updateElement(elementData);
  stopEvent(ev);
};

/**
 * 显示或者隐藏 cameoActionbar
 * @param  {[type]} that [description]
 * @return {[type]}      [description]
 */
export const handleClick = (that, Eventdata, ev) => {
  const { actions, data } = that.props;
  const { openUploadImageModal, boundWorkspaceActions } = actions;
  const { element } = data;

  const imgId = get(element, 'encImgId');

  if (!imgId) {
    const elementId = get(element, 'id');
    const elementWidth = get(element, 'computed.width');
    const elementHeight = get(element, 'computed.height');
    boundWorkspaceActions.autoAddPhotoToCanvas(true, elementId, elementWidth, elementHeight);
    openUploadImageModal();
  } else {
    that.showCameoActionBar(ev);
  }
};
