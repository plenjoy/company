import Immutable from 'immutable';
import {
  elementTypes,
  pageTypes,
  downloadStatus
} from '../../../constants/strings';
import fetchTextBlobAndInfo from '../../../utils/fetchTextBlobAndInfo';


function downloadText(element, imgUrl) {
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');
  const elementId = element.get('id');

  return new Promise((resolve, reject) => {
    fetchTextBlobAndInfo(
      imgUrl, elementWidth, elementHeight
    ).then(({ isShowTextNotFit, blobUrl }) => {
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
    }, () => {
      reject({
        elementId,
        downloadStatus: downloadStatus.DOWNLOAD_FAIL
      });
    }).catch((error) => {
      reject({
        elementId,
        downloadStatus: downloadStatus.DOWNLOAD_FAIL
      });
    });
  });
}

function downloadPhoto(element, imgUrl) {
  const elementId = element.get('id');

  return new Promise((resolve, reject) => {
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

      if (imgUrl && (theDownloadData.get('downloadUrl') !== imgUrl ||
        theDownloadData.get('downloadStatus') !== downloadStatus.DOWNLOAD_SUCCESS)) {
        newDownloadData = newDownloadData.set(elementId, theDownloadData.merge({
          downloadStatus: downloadStatus.DOWNLOADING,
          downloadUrl: imgUrl,
          // imageObj: null
        }));
        switch (element.get('type')) {
          case elementTypes.photo: {
            const url = tryToDownload ? `${imgUrl}&randomNumber=${Math.random()}` : imgUrl;
            requestArray.push(downloadPhoto(element, url));
            break;
          }
          case elementTypes.calendar: {
            requestArray.push(downloadPhoto(element, imgUrl));
            break;
          }
          case elementTypes.text: {
            if (element.get('isSpineText')) {
              return;
            }
            requestArray.push(downloadText(element, imgUrl));
            break;
          }
          default:
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
      downloadData: downloadData.set(
        elementId,
        existsData.merge(successData)
      )
    });
  };

  requestArray.forEach((request) => {
    request.then(setDownloadData, setDownloadData);
  });


  that.setState({
    downloadData: newDownloadData
  });
};
