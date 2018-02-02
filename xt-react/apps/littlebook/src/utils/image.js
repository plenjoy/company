import { merge } from 'lodash';

/**
 * 下载图片并返回promise对象
 * @param url 图片的地址
 * @returns {Promise}
 */
export const loadImg = (url) => {
  const promise = new Promise((resolve, reject) => {
    if (url) {
      const img = new Image();
      img.onload = () =>{
        resolve({
          msg: 'done',
          url,
          img: img
        });
      };

      img.onerror = ev =>{
        reject({
          msg: ev.message,
          url,
          img: null
        });
      };
      img.src = url;
    } else {
      reject({
        msg: 'url is not empty',
        url,
        img: null
      });
    }
  });

  return promise;
};

/**
 * 下载图片并以base64的格式返回.
 */
export const loadImgWithBase64 = (url, done, error)=>{
  loadImg(url).then(data =>{
    const canvas = document.createElement('CANVAS');
    const ctx = canvas.getContext('2d');

    canvas.height = data.img.height;
    canvas.width = data.img.width;
    ctx.drawImage(data.img, 0, 0);
    const dataURL = canvas.toDataURL();

    done && done(merge({}, data, {
      img: dataURL
    }));
  }, errorObj=>{
    error && error(errorObj);

  });
}


export const getOriImageWidth = (width, height) => {
  // 以宽高中最大的计算原图宽高
  const maxScale = Math.max(width, height);
  if (maxScale > 1200) {
    return 1500;
  } else if (maxScale > 700) {
    return 1000;
  }
  return 800;
}
