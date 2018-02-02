import moment from 'moment';

export function getValidString(str = '') {
  // return str.replace(/[^\u0020-\u007e\u00a1-\u017e\u0384-\u0513\n]/g, '*'); //'\uFFFD'
  return str;
}

export function formatUser(user) {
  return {
    id: user.getId(),
    username: getValidString(user.getName()),
    fullName: user.getName(),
    avatar: user.getImageUrl(),
    _originalData: user
  }
}

export function formatAlbum(albumData) {
  const album = {};
  const cover_photo = albumData['media$group']['media$thumbnail'][0];

  return {
    id: albumData['gphoto$id'].$t,
    cover_photo: {
      width: cover_photo.width,
      height: cover_photo.height,
      thumbnail: {
        width: cover_photo.width,
        height: cover_photo.height,
        url: cover_photo.url
      }
    },
    count: albumData['gphoto$numphotos'].$t,
    name: albumData['gphoto$albumType'] ? albumData['gphoto$albumType'].$t : albumData.title.$t,
    _originalData: albumData
  };
}

export function formatImage(photoData) {
  const photoDetail = photoData['media$group']['media$content'][0];
  const photoThumbnail = photoData['media$group']['media$thumbnail'][1];
  const takenTime = photoData['gphoto$timestamp'] ? parseInt(photoData['gphoto$timestamp'].$t) : 0;

  return {
    id: photoData['gphoto$id'].$t,
    caption: '',
    width: photoDetail.width,
    height: photoDetail.height,
    thumbnail: {
      width: photoThumbnail.width,
      height: photoThumbnail.height,
      url: photoThumbnail.url
    },
    originalImageUrl: photoDetail.url,
    tags: '',
    type: '',
    location: '',
    likes: '',
    taken_time: takenTime,
    created_time: '',
    posted_time: '',
    updated_time: '',
    _originalData: photoData
  };
}