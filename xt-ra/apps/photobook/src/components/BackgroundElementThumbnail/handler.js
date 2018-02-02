import { getCropOptions, getCropLRByOptions } from '../../utils/crop';
import { merge, isFunction } from 'lodash';
import { getTransferData } from '../../../../common/utils/drag';

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

  const elementWidth = element.get('pw') * page.get('width') * ratio.workspace;
  const elementHeight = element.get('ph') * page.get('height') * ratio.workspace;

  const ev = event || window.event;

  const elementProps = getTransferData(event);

  const { width, height } = elementProps[0];
  const elementId = element.get('id');
  const options = getCropOptions(width, height, elementWidth, elementHeight, imgRot);
  const elementData = merge(
    {},
    getCropLRByOptions(options.px, options.py, options.pw, options.ph),
    {
      id: elementId,
      encImgId: elementProps[0].encImgId,
      imageid: elementProps[0].imageid
    }
  );
  boundProjectActions.updateElement(elementData);
  stopEvent(event);
};

/**
 * 显示或者影藏actionbar
 * @param  {[type]} that [description]
 * @return {[type]}      [description]
 */
export const toggleActionBar = (that, data, event) => {
  const { actions } = that.props;
  const { handleClick } = actions || {};

  if (isFunction(handleClick)) {
    handleClick(data);
  }

  stopEvent(event);
};
