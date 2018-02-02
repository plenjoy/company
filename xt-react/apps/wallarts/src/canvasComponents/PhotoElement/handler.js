import { get } from 'lodash';
import { List } from 'immutable';
import { getCropOptionsByRect } from '../../utils/crop';

export const onMoveStart = (that, event) => {
  that.startPoint = {
    x: event.pageX,
    y: event.pageY
  };
  document.onmousemove = that.onMove;
  document.onmouseup = that.onMoveStop;
}

export const onMove = (that, event) => {
  const { imageObj, element, actions } = that.props;

  if (!element.get('encImgId') || !imageObj) {
    return ;
  }

  const { onElementArrayChange } = actions;

  let elementArray = new List([]);

  let newElement;

  const currentPoint = {
    x: event.pageX,
    y: event.pageY
  };

  let offsetX = that.startPoint.x - currentPoint.x;
  let offsetY = that.startPoint.y - currentPoint.y;


  // 取得当前的图片截取区域rect
  const imageCrop = that.elementNode.getCrop();

  // 需要根据当前的位置对偏移量进行校验，防止溢出。
  if (imageCrop.x + offsetX <= 0) {
    offsetX = -imageCrop.x;
  }
  if (imageCrop.y + offsetY <= 0) {
    offsetY = -imageCrop.y;
  }
  if (((imageCrop.x + offsetX) + imageCrop.width) >= imageObj.width) {
    offsetX = imageObj.width - imageCrop.x - imageCrop.width;
  }
  if (((imageCrop.y + offsetY) + imageCrop.height) >= imageObj.height) {
    offsetY = imageObj.height - imageCrop.y - imageCrop.height;
  }

  // 计算图片截取区域新的x,y
  const newCropX = imageCrop.x + offsetX;
  const newCropY = imageCrop.y + offsetY;

  // 做边界检测 避免图片四边被拖出
  if (newCropX >= 0 && newCropX + imageCrop.width <= imageObj.width && newCropY >= 0 && newCropY + imageCrop.height <= imageObj.height) {
     imageCrop.x = newCropX;
     imageCrop.y = newCropY;

     // 根据图片截取的区域反算元素crop信息
     const cropOptions = getCropOptionsByRect(imageCrop, imageObj);

     newElement = element.merge(cropOptions);

     elementArray = elementArray.push(newElement);

     onElementArrayChange(elementArray);
  }

  that.startPoint = {
     x: currentPoint.x,
     y: currentPoint.y
   };
}

export const onMoveStop = (that, e) => {

  document.onmousemove = null;
  document.onmouseup = null;

  const { element, actions } = that.props;
  const { updateElement, changeCurrentElement } = actions;

  updateElement({
    id: element.get('id'),
    cropLUX: element.get('cropLUX'),
    cropRLX: element.get('cropRLX'),
    cropLUY: element.get('cropLUY'),
    cropRLY: element.get('cropRLY')
  });
  changeCurrentElement(element.get('id'));
}

