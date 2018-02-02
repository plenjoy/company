import { html2canvas } from '../../../common/utils/html2Canvas/core';
import { toObjectUrl } from '../../../common/utils/draw';

/**
 * 把指定的节点转成canvas
 * @param  {[HTMLElement]} node HTML节点.
 * @param  [Function]
 */
export const toCanvas = (canvas, canvasWidth, type = 'base64') => {
  const promise = new Promise((resolve, reject) => {
    if (canvas) {
      // 计算需要的小图尺寸.
      const oWidth = canvas.width;
      const oHeight = canvas.height;

      if (oWidth && oHeight) {
        const width = canvasWidth || oWidth;
        const height = width * oHeight / oWidth;

        if (canvas) {
          if (type && type === 'blob') {
            toObjectUrl(canvas).then((url) => {
              resolve({
                url,
                canvas
              });
            });
          } else {
             // 缩放到指定大小.
            const newCanvas = document.createElement('canvas');
            newCanvas.width = width;
            newCanvas.height = height;
            const newCtx = newCanvas.getContext('2d');
            newCtx.drawImage(canvas, 0, 0, oWidth, oHeight, 0, 0, width, height);

             // TODO: 使用blob数据，提升性能
            resolve({
              url: newCanvas.toDataURL().replace('data:image/png;base64,', ''),
              canvas
            });
          }
        }
      } else {
        reject();
      }
    } else {
      reject();
    }
  });

  return promise;
};
