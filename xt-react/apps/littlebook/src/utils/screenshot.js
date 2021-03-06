import { toCanvas } from './snippingHelper';
import { smallViewWidthInMyProjects } from '../contants/strings';
const RETRY_DELAY = 1000;
let timer = null;

export const getScreenShot = (selector, isRetry = false, stopFlagInWindow = 'isStopRetry') => {
  let count = 0;

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
      clearInterval(timer);
      timer = setInterval(() => {
        count += 1;

        const isStopRetry = window[stopFlagInWindow];
        // 是否需要停止重试
        if (isStopRetry || count > 5) {
          clearInterval(timer);

          setTimeout(() => {
            getCanvasData(resolve, reject);
          }, 1000);
        }
      }, RETRY_DELAY);
    } else {
      getCanvasData(resolve, reject);
    }
  });

  return promise;
};
