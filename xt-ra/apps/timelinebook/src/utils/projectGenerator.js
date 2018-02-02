import moment from 'moment';
import { fromJS } from 'immutable';
import { get } from 'lodash';
import { guid } from '../../../common/utils/math';
import { formatDateTime } from '../../../common/utils/dateFormat';

export function selectVolume(volumes, volumeIdx) {
  const currentSelectedIdx = volumes.findIndex(volume => volume.get('isSelected'));
  if(currentSelectedIdx !== volumeIdx) {
    volumes = volumes.setIn([String(volumeIdx), 'isSelected'], true);
    volumes = volumes.setIn([String(currentSelectedIdx), 'isSelected'], false);
  }
  return volumes;
}

/**
 * 根据photoArray生成volumeArray
 * 
 * @param {*} oAuthUser 
 * @param {*} photoArray 
 * @param {*} volumeLength 
 * @param {*} preVolumeArray 
 * @param {*} settings 
 * @param {*} coverPhotoId 
 */
export function generateVolumeArray(oAuthUser, photoArray = [], volumeLength, preVolumeArray, settings, coverPhotoId) {
  const volumeArray = [];
  const photoGroups = generatePhotoGroup(photoArray, volumeLength, settings);

  // 遍历photoGroups，每一个photoGroup都生成一个volume
  photoGroups.forEach((photoGroup, index) => {

    // 生成volume
    let volumeIdx = volumeArray.length;
    let volume = generateVolume(oAuthUser, photoGroup, volumeIdx, preVolumeArray, settings, coverPhotoId, volumeLength);

    // 只有最后一个volume才会有Incomplete的情况，其他情况下isComplete都为真
    if(index !== photoGroups.size - 1) {
      volume.isComplete = true;
    }

    // 完成的volume默认不下单
    if(volume.isComplete) {
      volume.isOrder = false;
    }

    // 保存进volumeArray
    volumeArray.push(volume);
  });

  // 是否有已经选中的volume
  const hasSelectedVolume = volumeArray.some(volume => volume.isSelected);

  // 如果没有选中volume，则默认第一个volume为选中状态
  if(!hasSelectedVolume && volumeArray[0]) {
    volumeArray[0].isSelected = true;
  }

  return volumeArray;
}

/**
 * 给photoArray按指定长度分组，volumeLength长度为一组
 * @param {Array} photoArray
 * @return {Array} photoGroups
 */
export function generatePhotoGroup(photoArray, volumeLength, settings) {
  let photoGroups = fromJS([]);
  let photoGroup = fromJS([]);
  let pageLength = 0;

  const usedPhotoArray = photoArray.filter(photo => photo.get('isIncluded'));

  usedPhotoArray.forEach((photo, index) => {

    // 先预算下一页图片有没有超过最后一页
    pageLength += 1;

    // 如果显示caption的情况下，下一页caption需要单独成页，则再加一页
    if(photo.get('isCaptionOutOfSize') && settings.get('isShowCaption')) {
      pageLength++;
    }

    // 如果下一页超过volume长度，则新建一个volume
    if(pageLength > volumeLength - 1) {
      photoGroups = photoGroups.push(photoGroup);
      photoGroup = fromJS([]);

      // 将下一张图片计入volume
      pageLength = 1;
      // 计算下一张图片volume的caption
      if(photo.get('isCaptionOutOfSize') && settings.get('isShowCaption')) {
        pageLength++;
      }
    }

    // 存入photo
    photoGroup = photoGroup.push(photo);

    if(index === usedPhotoArray.size - 1) {
      photoGroups = photoGroups.push(photoGroup);
    }
  });

  return photoGroups;
}

/**
 * 遍历photoGroup，生成volumeGroup
 * 
 * @param {*} oAuthUser 
 * @param {*} photoGroup 
 * @param {*} volumeIdx 
 * @param {*} preVolumeArray 
 * @param {*} settings 
 * @param {*} coverPhotoId 
 * @param {*} volumeLength 
 */
export function generateVolume(oAuthUser, photoGroup, volumeIdx, preVolumeArray, settings, coverPhotoId, volumeLength) {
  const preVolumeGuid = preVolumeArray.getIn([String(volumeIdx), 'guid']);
  const preCoverPhotoId = preVolumeArray.getIn([String(volumeIdx), 'cover', 'photo', 'id']);
  const preCoverGuid = preVolumeArray.getIn([String(volumeIdx), 'cover', 'guid']);
  const prePages = preVolumeArray.getIn([String(volumeIdx), 'pages']);

  const spineUserName = oAuthUser ? oAuthUser.get('username') : preVolumeArray.getIn([String(volumeIdx), 'cover', 'spineUserName']);
  const date = getPhotoDateRange(photoGroup);
  const cover = getVolumeCover(spineUserName, photoGroup, volumeIdx, date, coverPhotoId, preCoverPhotoId, preCoverGuid);
  const pages = getVolumePages(photoGroup, cover, settings, prePages);
  const isSelected = preVolumeArray.get(String(volumeIdx)) && preVolumeArray.getIn([String(volumeIdx), 'isSelected']) || false;
  const isOrder = preVolumeArray.get(String(volumeIdx)) && preVolumeArray.getIn([String(volumeIdx), 'isOrder']) || false;
  const isComplete = pages.filter(page => page.get('layout') !== 'empty').size === volumeLength - 1;

  return {
    guid: preVolumeGuid || guid(),
    idx: volumeIdx,
    cover,
    pages,
    date,
    isSelected,
    isOrder,
    isComplete
  };
}

/**
 * 创建volume的cover
 * @param {*} oAuthUser
 * @param {*} photoGroup
 * @param {*} volumeIdx
 */
export function getVolumeCover(spineUserName, photoGroup, volumeIdx, dateRange, newCoverPhotoId, preCoverPhotoId, preCoverGuid) {
  let coverPhoto = null;

  // 获取尺寸最合适的照片：规则高宽比>0.9且<1.1
  let suitablePhotos = photoGroup.filter(photo => {
    const ratio = parseFloat(photo.get('height')) / parseFloat(photo.get('width'));
    return ratio > 0.9 && ratio < 1.1;
  });

  // 如果高宽比有合适的，使用点赞数最多的图；反之选取所有图片中点赞数最多的图
  if(suitablePhotos.size === 0) {
    coverPhoto = getMostLikePhoto(photoGroup);
  } else {
    coverPhoto = getMostLikePhoto(suitablePhotos);
  }

  // 如果有新的coverId，使用新的cover；没有则使用旧的cover；如果没有cover则使用计算合适的cover
  coverPhoto =
    photoGroup.find(photo => photo.get('id') === newCoverPhotoId) ||
    photoGroup.find(photo => photo.get('id') === preCoverPhotoId) ||
    coverPhoto;

  // 整理成cover数据
  return fromJS({
    guid: preCoverGuid || guid(),
    spineUserName,
    spineText: `Vol ${volumeIdx + 1}: ${dateRange}`,
    photo: {
      id: coverPhoto.get('id'),
      url: coverPhoto.get('originalImageUrl'),
      width: coverPhoto.get('width'),
      height: coverPhoto.get('height'),
      thumbnail: coverPhoto.get('thumbnail')
    },
    layout: 'default'
  });
}

/**
 * 生成volume的pages
 * @param {*} photoGroup
 * @param {*} cover
 */
export function getVolumePages(photoGroup, cover, settings, prePages) {
  let pages = [];
  // const pagePhotos = photoGroup.filter(
  //   photo => cover.getIn(['photo', 'id']) !== photo.get('id')
  // );

  photoGroup.forEach((photo, photoIdx) => {

    const date = settings.get('isShowDate') ? moment(photo.get('created_time')).format('DD MMM YYYY') : '';
    const location = settings.get('isShowLocation') ? photo.get('location') : '';
    const caption = settings.get('isShowCaption') ? photo.get('caption') : '';
    let pageGuid = null;

    const pageInfo = {
      index: pages.length + 1,
      date,
      caption,
      location,
      layout: 'default',
      photo: {
        id: photo.get('id'),
        url: photo.get('originalImageUrl'),
        width: photo.get('width'),
        height: photo.get('height'),
        thumbnail: photo.get('thumbnail')
      }
    };

    pageGuid = prePages && prePages.getIn([String(pageInfo.index - 1), 'guid']);

    pages.push({
      guid: pageGuid || guid(),
      ...pageInfo,
      layout: 'default',
      caption: !(photo.get('isCaptionOutOfSize') && settings.get('isShowCaption')) ? caption : ''
    });

    if(photo.get('isCaptionOutOfSize') && settings.get('isShowCaption')) {
      pageGuid = prePages && prePages.getIn([String(pageInfo.index), 'guid']);

      pages.push({
        guid: pageGuid || guid(),
        ...pageInfo,
        date: null,
        location: null,
        index: pageInfo.index + 1,
        layout: 'caption-only',
        photo: null,
        caption
      });
    }
  });

  while(pages.length < 100) {
    pages.push({
      index: pages.length + 1,
      layout: 'empty'
    });
  }

  return fromJS(pages);
}

export function getMostLikePhoto(photoGroup) {
  let mostLikedPhoto = null;

  for (const photo of photoGroup) {
    if (mostLikedPhoto) {
      if (photo.get('likes') > mostLikedPhoto.get('likes')) {
        mostLikedPhoto = photo;
      }
    } else {
      mostLikedPhoto = photo;
    }
  }

  return mostLikedPhoto;
}

export function getPhotoDateRange(photoGroup) {
  let minDate = null;
  let maxDate = null;

  if (photoGroup.get('0')) {
    const minDatePhoto = photoGroup.get('0');
    const maxDatePhoto = photoGroup.get(String(photoGroup.size - 1));

    minDate = moment(minDatePhoto.get('created_time')).format('MMM YYYY');
    maxDate = moment(maxDatePhoto.get('created_time')).format('MMM YYYY');
  }

  return `${minDate} - ${maxDate}`;
}

export function generateProject(volume, settings, userInfo, pageInfo, specVersion) {
  const { pages, cover } = volume.toJS();
  const newPages = [];
  pages.forEach((page) => {
    newPages.push({
      date: page.date,
      location: page.location,
      index: page.index,
      caption: page.caption,
      layout: page.layout,
      photo: {
        height: get(page, 'photo.height'),
        width: get(page, 'photo.width'),
        url: get(page, 'photo.url'),
        id: get(page, 'photo.id')
      }

    });
  });

  const newCover = {
    spineText: get(cover, 'spineText'),
    spineUserName: get(cover, 'spineUserName'),
    layout: get(cover, 'layout'),
    photo: {
      height: get(cover, 'photo.height'),
      width: get(cover, 'photo.width'),
      url: get(cover, 'photo.url'),
      id: get(cover, 'photo.id')
    }
  };

  const spec = {
    client: settings.get('client'),
    product: settings.get('product'),
    size: settings.get('size'),
    paper: settings.get('paper'),
    paperThickness: settings.get('paperThickness'),
    cover: settings.get('cover'),
    leatherColor: settings.get('leatherColor')
  };

  const summary = {
    pageBase: pageInfo.get('max') * 2,
    pageAdded: pageInfo.get('pageBase') || 0,
    pageCount: pageInfo.get('max') * 2
  };
  const now = new Date();

  return {
    project: {
      summary,
      userId: userInfo.get('id'),
      artisan: userInfo.get('firstName'),
      createdDate: formatDateTime(now),
      clientId: 'web-h5',
      createAuthor: 'web-h5|1.1|1',
      updatedDate: formatDateTime(now),
      version: specVersion,
      spec,
      cover: newCover,
      pages: newPages
    }
  };
}

export function generateSku(projectJson) {
  const { project } = projectJson;
  const { summary, version, clientId, createAuthor, userId, artisan } = project;

  const skuObj = {
    project: {
      version,
      clientId,
      createAuthor,
      artisan,
      userId,
      ...summary,
      ...project.spec
    }
  };
  return skuObj;
}


function _getCoverPhoto(photoGroup) {
  let coverPhoto = {};

  let suitablePhotos = photoGroup.filter(photo => {
    const ratio = parseFloat(photo.get('height')) / parseFloat(photo.get('width'));
    return ratio > 0.9 && ratio < 1.1;
  });

  if(suitablePhotos.size === 0) {
    coverPhoto = getMostLikePhoto(photoGroup);
  } else {
    coverPhoto = getMostLikePhoto(suitablePhotos);
  }

  return coverPhoto;
}

/**
 * 创建preview volume的cover
 */
export function getPreviewVolumeCover(projectCover) {
  return fromJS({
    guid: guid(),
    spineUserName: projectCover.get('spineUserName'),
    spineText: projectCover.get('spineText'),
    photo: {
      id: projectCover.getIn(['photo', 'id']),
      url: projectCover.getIn(['photo', 'url']),
      width: projectCover.getIn(['photo', 'width']),
      height: projectCover.getIn(['photo', 'height']),
      thumbnail: {
        url: projectCover.getIn(['photo', 'url']),
        width: projectCover.getIn(['photo', 'width']),
        height: projectCover.getIn(['photo', 'height']),
      }
    },
    layout: 'default'
  });
}

/**
 * 生成preview volume的pages
 */
export function getPreviewVolumePages(projectPages) {
  return projectPages.map(projectPage => {
    return {
      guid: guid(),
      index: projectPage.get('index'),
      date: projectPage.get('date'),
      caption: projectPage.get('caption'),
      location: projectPage.get('location'),
      layout: projectPage.get('layout'),
      photo: projectPage.get('photo') ? {
        id: projectPage.getIn(['photo', 'id']),
        url: projectPage.getIn(['photo', 'url']),
        width: projectPage.getIn(['photo', 'width']),
        height: projectPage.getIn(['photo', 'height']),
        thumbnail: {
          url: projectPage.getIn(['photo', 'url']),
          width: projectPage.getIn(['photo', 'width']),
          height: projectPage.getIn(['photo', 'height'])
        }
      } : null
    };
  });
}

export function generatePreviewVolume(projectSpec, projectCover, projectPages){
  const volumeIdx = +projectCover.get('spineText').replace(/^Vol|:[\s\S]*$/, '').trim();

  return {
    guid: guid(),
    idx: volumeIdx,
    cover: getPreviewVolumeCover(projectCover),
    pages: getPreviewVolumePages(projectPages)
  };
}