import moment from 'moment';

export function getValidString(str = '') {
  // return str.replace(/[^\u0020-\u007e\u00a1-\u017e\u0384-\u0513\n]/g, '*');
  return str;
}

export function formatUser(user) {
  return {
    id: user.id,
    username: getValidString(user.username),
    fullName: user.username,
    avatar: user.profile_picture,
    _originalData: user
  }
}

export function formatImage(media) {
  if(!media._originalData) {
    const originalImageUrl = media.images.standard_resolution.url.replace('p640x640/', '');
    const thumbnail = media.images.low_resolution;
    const caption = media.caption ? media.caption.text : '';
    const location = media.location ? media.location.name : '';

    return {
      id: media.id,
      caption: getValidString(caption),
      width: media.images.standard_resolution.width,
      height: media.images.standard_resolution.height,
      thumbnail: {
        width: thumbnail.width,
        height: thumbnail.height,
        url: thumbnail.url
      },
      originalImageUrl,
      tags: media.tags,
      type: media.type,
      place: getValidString(media.place),
      location: getValidString(location),
      likes: media.likes.count,
      created_time: media.created_time && moment(media.created_time * 1000).toDate().getTime(),
      posted_time: media.backdated_time && moment(media.backdated_time * 1000).toDate().getTime(),
      updated_time: media.updated_time && moment(media.updated_time * 1000).toDate().getTime(),
      _originalData: media
    };
  }

  return media;
}