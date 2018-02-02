import { smallViewWidthInMyProjects } from '../constants/strings';
import { toObjectUrl } from '../../../common/utils/draw';

const RETRY_DELAY = 1000;
let timer = null;

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


export const getScreenShot = (selector, isRetry = false, stopFlagInWindow = 'isStopRetry') => {
  // 真是获取canvas截图
  const getCanvasData = (resolve, reject) => {
    const screenshot = document.querySelector(selector);
    toCanvas(screenshot, smallViewWidthInMyProjects).then((params) => {
      const { url } = params;
      resolve(url);
    }, () => {
      reject();
    });
  };

  const promise = new Promise((resolve, reject) => {
    // 是否重试
    if (isRetry) {
      timer = setInterval(() => {
        const isStopRetry = window[stopFlagInWindow];
        // 是否需要停止重试
        if (isStopRetry) {
          clearInterval(timer);
          // 等待绘制
          setTimeout(() => {
            getCanvasData(resolve, reject);
          }, 2000);
        }
      }, RETRY_DELAY);
    } else {
      getCanvasData(resolve, reject);
    }
  });

  return promise;
};
