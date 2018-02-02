import AppStore from '../stores/AppStore';
import { GET_IMAGE_SRC } from '../constants/apiUrls';
import { imageTypes } from '../constants/string';

export function isCollision(elementP1, elementP2, selectionP1, selectionP2) {
  const a = {
    x: elementP1.x,
    y: elementP1.y,
    w: Math.abs(elementP1.x - elementP2.x),
    h: Math.abs(elementP1.y - elementP2.y)
  };

  const b = {
    x: selectionP1.x,
    y: selectionP1.y,
    w: Math.abs(selectionP1.x - selectionP2.x),
    h: Math.abs(selectionP1.y - selectionP2.y)
  };

  return !(
    a.x > b.x + b.w ||
    b.x > a.x + a.w ||
    a.y > b.y + b.h ||
    b.y > a.y + a.h
  );
}

export const formatImagesInfo = function (orgImages = []) {
  return orgImages.map(orgImage => {
    const imageType = imageTypes[orgImage.imageType - 1];
    const name = `${orgImage.imageName}.${imageType}`.trim();

    const frontReg = /^.{6}/g;
    const endReg = /.{6}$/g;

    const shortName = name.length > 15
      ? `${name.match(frontReg)}...${name.match(endReg)}`
      : name;

    return {
      id: orgImage.uidpk,
      guid: orgImage.guid,
      encImgId: orgImage.encImageId,
      name,
      shortName,
      width: orgImage.pixelWidth,
      height: orgImage.pixelHeight,
      size: orgImage.size,
      imageType: orgImage.imageType,
      imageVersion: orgImage.imageVersion,
      regionCode: orgImage.regionCode,
      status: orgImage.status,
      createTime: orgImage.insTime,
      uploadTime: orgImage.updTime,
      shotTime: orgImage.shotTime,
      orientation: orgImage.orientation,
      url: orgImage.url,
      thumbnailUrl: GET_IMAGE_SRC({
        baseUrl: AppStore.env.uploadBaseUrl,
        pUid: orgImage.encImageId,
        renderSize: 'fit350'
      }),
      previewUrl: GET_IMAGE_SRC({
        baseUrl: AppStore.env.uploadBaseUrl,
        pUid: orgImage.encImageId,
        renderSize: 'fit1000'
      })
    }
  })
};

export const formatProjectsInfo = function (projects = []) {
  return projects.map(project => {
    const { productInfo = {} } = project;
    const photoNum = project.imageList ? project.imageList.length : 0;

    return {
      id: project.projectId,
      name: project.projectName,
      product: productInfo.productName,
      size: productInfo.size,
      createTime: project.createTime,
      photoNum,
      images: formatImagesInfo(project.imageList),
    };
  });
};

export const formatSavedImagesData = (images) => {
  console.log('str',images)
  return images.map((image, index) => ({
    id: image.id,
    guid: image.guid,
    name: image.name,
    width: image.width,
    height: image.height,
    order: index,
    encImgId: image.encImgId,
    shotTime: image.shotTime,
    uploadTime: image.uploadTime,
    createTime: image.createTime,
    orientation: image.orientation,
  }))
};

export const toDouble = (num) => {
  return num <= 9 ? `0${num}` : num;
};

export const getDateTitle = function (timeStamp) {
  let timeObj = new Date(+timeStamp);
  let year = timeObj.getFullYear();
  // let month = toDouble(timeObj.getMonth() + 1);
  let month = getMonthStr(timeObj.getMonth());
  let date = toDouble(timeObj.getDate());

  return `${month} ${date}, ${year}`;
};

export const getDate = function (timeStamp) {
  const timeObj = new Date(+timeStamp);
  const year = timeObj.getFullYear();
  // const month = toDouble(timeObj.getMonth() + 1);
  const month = getMonthStr(timeObj.getMonth());
  const date = toDouble(timeObj.getDate());
  return `${month} ${date}, ${year}`;
};

export const getDateTime = function (timeStamp) {
  let timeObj = new Date(+timeStamp);
  let year = timeObj.getFullYear();
  // let month = toDouble(timeObj.getMonth() + 1);
  let month = getMonthStr(timeObj.getMonth());
  let date = toDouble(timeObj.getDate());
  // let hour = toDouble(timeObj.getHours());
  let hour = timeObj.getHours();
  let minute = toDouble(timeObj.getMinutes());
  let apm = hour > 12 ? 'PM' : 'AM';

  hour = toDouble(hour > 12 ? hour - 12 : hour);

  return `${month} ${date}, ${year} ${hour}:${minute} ${apm}`;
};

export function getMonthStr(month) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
}
