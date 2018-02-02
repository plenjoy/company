import Immutable from 'immutable';
import {
  elementTypes,
  pageTypes,
  downloadStatus
} from '../../../contants/strings';


function downloadText(element, imgUrl) {
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');
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


export const toDownload = (that, newElementArray) => {
  const { page } = that.props.data;

  const { downloadData } = that.state;

  let newDownloadData = downloadData;

  const requestArray = [];

  if (newElementArray && newElementArray.size) {
    newElementArray.forEach((element) => {
      const elementId = element.get('id');
      const imgUrl = element.getIn(['computed', 'imgUrl']);

      const theDownloadData = newDownloadData.get(elementId) || Immutable.Map();

      if (imgUrl && (theDownloadData.get('downloadUrl') !== imgUrl ||
        theDownloadData.get('downloadStatus') !== downloadStatus.DOWNLOAD_SUCCESS)) {
        newDownloadData = newDownloadData.set(elementId, theDownloadData.merge({
          downloadStatus: downloadStatus.DOWNLOADING,
          downloadUrl: imgUrl
        }));
        switch (element.get('type')) {
          case elementTypes.photo: {
            requestArray.push(downloadPhoto(element, imgUrl));
            break;
          }
          case elementTypes.paintedText: {
            if (page.get('type') !== pageTypes.spine) {
              requestArray.push(downloadText(element, imgUrl));
            }
            break;
          }
          case elementTypes.text: {
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
