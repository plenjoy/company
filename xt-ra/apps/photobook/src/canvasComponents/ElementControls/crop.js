import { List } from 'immutable';
import { getCropOptionsByRect } from '../../utils/crop';
import { findKonvaObjectById } from '../../utils/canvas/konvaSelector';

export const onCropStart = (that, event) => {
  that.startPoint = {
    x: event.pageX,
    y: event.pageY
  };
  __app.isFastCrop = true;
  document.onmousemove = that.onCrop;
  document.onmouseup = that.onCropStop;
  that.setState({
    isMouseOver: false
  });
}

export const onCrop = (that, event) => {
  const { selectedElements, selectedElementArray, onElementArrayChange, downloadData } = that.props;

  const firstElement = selectedElementArray.first();

  if (!firstElement) {
    return;
  }

  const elementId = firstElement.get('id');
  const firstElementNode = findKonvaObjectById(
    selectedElements,
    elementId
  );

  const imageObj = downloadData.getIn([elementId, 'imageObj']);

  if (!firstElement.get('encImgId')) {
    return ;
  }

  let elementArray = new List([]);

  let newElement;

  const currentPoint = {
    x: event.pageX,
    y: event.pageY
  };

  let offsetX = that.startPoint.x - currentPoint.x;
  let offsetY = that.startPoint.y - currentPoint.y;

  // 取得当前的图片截取区域rect
  const imageCrop = firstElementNode.getCrop();

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

     newElement = firstElement.merge(cropOptions);

     elementArray = elementArray.push(newElement);

     onElementArrayChange(elementArray);
  }

  that.startPoint = {
     x: currentPoint.x,
     y: currentPoint.y
   };
}

export const onCropStop = (that, e) => {

  const { selectedElementArray, submitElementArray, boundProjectActions } = that.props;

  const element = selectedElementArray.first();

  if (element) {
    boundProjectActions.updateElement({
      id: element.get('id'),
      cropLUX: element.get('cropLUX'),
      cropRLX: element.get('cropRLX'),
      cropLUY: element.get('cropLUY'),
      cropRLY: element.get('cropRLY')
    });
  }

  __app.isFastCrop = false;
  document.onmousemove = null;
  document.onmouseup = null;
}
