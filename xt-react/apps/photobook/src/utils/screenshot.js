import { toCanvas } from './snippingHelper';
import { smallViewWidthInMyProjects } from '../contants/strings';
const RETRY_DELAY = 1000;
let timer = null;

export const getScreenShot = (selector, isRetry = false, stopFlagInWindow = 'isStopRetry', keepOriginSize = false) => {
  // 真是获取canvas截图
  const getCanvasData = (resolve, reject) => {
    const screenshot = document.querySelector(selector);
    const widthLimit = keepOriginSize ? screenshot.width : smallViewWidthInMyProjects;
    toCanvas(screenshot, widthLimit).then((params) => {
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
