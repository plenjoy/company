// 导入worker task. task的名称必须以.worker.js结尾.
import Worker from '../../../workers/exif.worker';

export const initWorker = () => {
  const worker = new Worker();

  worker.postMessage({ a: 1 });
  worker.onmessage = function (event) {
    console.log('app onmessage', event);
  };
};

