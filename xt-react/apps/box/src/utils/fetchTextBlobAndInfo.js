import 'isomorphic-fetch';
import x2jsInstance from '../../common/utils/xml2js';
import { convertObjIn } from '../../common/utils/typeConverter';

export default (previewTextImageSrc, elementWidth, elementHeight) => {
  if (!previewTextImageSrc) {
    return null;
  }
  const previewTextInfoSrc = previewTextImageSrc.replace(
    /\/textImage\?/, '/textinfo?'
  );

  const textInfoRequest = fetch(previewTextInfoSrc).then((resp) => {
    if (resp.ok) {
      return resp.text();
    }
    return Promise.reject(new Error(resp.statusText));
  }).then(text => convertObjIn(x2jsInstance.xml2js(text)));

  const textImageRequest = fetch(previewTextImageSrc).then((resp) => {
    if (resp.ok) {
      return resp.blob();
    }
    return Promise.reject(new Error(resp.statusText));
  });

  return Promise.all([textInfoRequest, textImageRequest]).then((dataArray) => {
    if (Object.keys(dataArray[0]).length) {
      const textInfo = dataArray[0].textInfo;
      const blobUrl = URL.createObjectURL(dataArray[1]);
      const isShowTextNotFit = textInfo.textAreaIdeaWidth > elementWidth ||
        textInfo.textAreaIdeaHeight > elementHeight;

      return Promise.resolve({
        isShowTextNotFit, blobUrl
      });
    }
  });
};
