import Immutable from 'immutable';
import {
  elementTypes,
  pageTypes,
  downloadStatus
} from '../../../contants/strings';
import fetchTextBlobAndInfo from '../../../utils/fetchTextBlobAndInfo';
import CancelablePromise from '../../../../../common/utils/cancelablePromise';

function downloadText(element, imgUrl) {
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');
  const elementId = element.get('id');

  return new CancelablePromise((resolve, reject) => {
    fetchTextBlobAndInfo(imgUrl, elementWidth, elementHeight)
      .then(
        ({ isShowTextNotFit, blobUrl }) => {
          const imageObj = new window.Image();
          imageObj.onload = () => {
            resolve({
              elementId,
              imageObj,
              isShowTextNotFit,
              downloadStatus: downloadStatus.DOWNLOAD_SUCCESS
            });
          };

          imageObj.onerror = () => {
            reject({
              elementId,
              downloadStatus: downloadStatus.DOWNLOAD_FAIL
            });
          };

          imageObj.src = blobUrl;
        },
        () => {
          reject({
            elementId,
            downloadStatus: downloadStatus.DOWNLOAD_FAIL
          });
        }
      )
      .catch((error) => {
        reject({
          elementId,
          downloadStatus: downloadStatus.DOWNLOAD_FAIL
        });
      });
  });
}

function downloadPhoto(element, imgUrl) {
  const elementId = element.get('id');

  return new CancelablePromise((resolve, reject) => {
    const imageObj = new window.Image();

    imageObj.onload = () => {
      resolve({
        elementId,
        imageObj,
        downloadStatus: downloadStatus.DOWNLOAD_SUCCESS
      });
    };

    imageObj.onerror = () => {
      reject({
        elementId,
        downloadStatus: downloadStatus.DOWNLOAD_FAIL
      });
    };

    imageObj.src = imgUrl;
  });
}

export const toDownload = (that, newElementArray, tryToDownload = false) => {
  const { page } = that.props.data;
  // 如果是spine不渲染任何text
  if (page.get('type') === pageTypes.spine) {
    return;
  }

  const { downloadData } = that.state;

  let newDownloadData = downloadData;

  const requestArray = [];

  if (newElementArray && newElementArray.size) {
    newElementArray.forEach((element) => {
      const elementId = element.get('id');
      if (element.get('isSpineText')) {
        return;
      }
      const imgUrl = element.getIn(['computed', 'imgUrl']);

      const theDownloadData = newDownloadData.get(elementId) || Immutable.Map();

      // 避免前一个请求中，图片更换后，前一个请求慢于当前请求完成，覆盖当前图片
      // 所以要cancel前一个promise
      if (
        theDownloadData.get('downloadStatus') === downloadStatus.DOWNLOADING &&
        theDownloadData.get('downloadPromise')
      ) {
        theDownloadData.get('downloadPromise').cancel();
      }

      if (
        imgUrl &&
        (theDownloadData.get('downloadUrl') !== imgUrl ||
          theDownloadData.get('downloadStatus') !==
            downloadStatus.DOWNLOAD_SUCCESS)
      ) {
        let downloadPromise = null;

        switch (element.get('type')) {
          case elementTypes.photo: {
            const url = tryToDownload
              ? `${imgUrl}&randomNumber=${Math.random()}`
              : imgUrl;

            downloadPromise = downloadPhoto(element, url);
            break;
          }
          case elementTypes.sticker:
          case elementTypes.background: {
            downloadPromise = downloadPhoto(element, imgUrl);
            break;
          }
          case elementTypes.paintedText: {
            if (page.get('type') !== pageTypes.spine) {
              downloadPromise = downloadText(element, imgUrl);
            }
            break;
          }
          case elementTypes.text: {
            if (!element.get('isSpineText')) {
              downloadPromise = downloadText(element, imgUrl);
            }
            break;
          }
          default:
        }

        if (downloadPromise) {
          requestArray.push(downloadPromise);

          newDownloadData = newDownloadData.set(
            elementId,
            theDownloadData.merge({
              downloadStatus: downloadStatus.DOWNLOADING,
              downloadUrl: imgUrl,
              downloadPromise
            })
          );
        }
      }
    });
  }

  const setDownloadData = (successData) => {
    const { downloadData } = that.state;
    const { elementId } = successData;
    delete successData.elementId;

    const existsData = downloadData.get(elementId) || Immutable.Map();
    that.setState({
      downloadData: downloadData.set(elementId, existsData.merge(successData))
    });
  };

  requestArray.forEach((request) => {
    request.then(setDownloadData, setDownloadData);
  });

  that.setState({
    downloadData: newDownloadData
  });
};
