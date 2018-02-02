import moment from 'moment';

export function getValidString(str = '') {
  // return str.replace(/[^\u0020-\u007e\u00a1-\u017e\u0384-\u0513\n]/g, '*'); //'\uFFFD'
  return str;
}

export function fbCookieClear() {
  // 获取cookies
  const cookies = document.cookie.split(';');
  
  for(const cookie of cookies) {
    // 找出FB的cookie
    if(cookie.includes('fbm_') || cookie.includes('fblo_')) {
      // 设置超时时间
      const expires = new Date();
      expires.setTime(expires.getTime() - 1000);

      // 把多余的fbcookie设置超时清除
      const fbCookieName = cookie.split('=')[0];
      document.cookie = `${fbCookieName}=; Path=/; Domain=.${window.location.hostname}; Expires=${expires.toGMTString()}`;
    }
  }
}

export function formatUser(user) {
  return {
    id: user.id,
    username: getValidString(user.name),
    fullName: user.name,
    avatar: user.picture && user.picture.data.url,
    _originalData: user
  }
}

export function formatImage(media) {
  const originalImageUrl = media.images[0].source;
  const thumbnailUrl = media.picture;
  const caption = media.name ? media.name : '';
  const locationObj = (media.place && media.place.location) || {};
  const locationName = media.place && media.place.name || '';
  const locationArray = [];

  locationObj.city ? locationArray.push(locationObj.city) : '';
  locationObj.country ? locationArray.push(locationObj.country) : '';
  locationArray.length === 0 && locationName ? locationArray.push(locationName) : '';

  const images = [...media.images];

  const imagesFromSmallToBig = images.sort(
    (preImage, nextImage) => preImage.width * preImage.height - nextImage.width * nextImage.height
  );

  const thumbnail = imagesFromSmallToBig.find(
    image => image.width > 200 || image.height > 200
  ) || imagesFromSmallToBig[0];

  return {
    id: media.id,
    caption: getValidString(caption),
    width: media.images[0].width,
    height: media.images[0].height,
    thumbnail: {
      width: thumbnail.width,
      height: thumbnail.height,
      url: thumbnail.source
    },
    originalImageUrl,
    tags: media.tags,
    type: media.type,
    location: getValidString(locationArray.join(',')),
    likes: media.likes && media.likes.summary.total_count,
    created_time: media.created_time && moment(media.created_time).toDate().getTime(),
    posted_time: media.backdated_time && moment(media.backdated_time).toDate().getTime(),
    updated_time: media.updated_time && moment(media.updated_time).toDate().getTime(),
    _originalData: media
  };
}

export function formatPost() {
  const photos = [];
  return photos;
}

export function formatAlbum(album) {
  return {
    id: album.id,
    cover_photo: album.cover_photo ? formatImage(album.cover_photo) : null,
    count: album.count,
    name: album.name,
    _originalData: album
  };
}

export function loadSDK() {
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

export const albumsFields = [
  'cover_photo{images}',
  'location',
  'name',
  'privacy',
  'picture',
  'message',
  'count',
  'created_time',
  'description',
  'from',
  'link',
  'place',
  'type',
  'updated_time'
].join(',');

export const photosFields = [
  'picture',
  'images',
  'backdated_time',
  'created_time',
  'height',
  'icon',
  'link',
  'name',
  'place',
  'updated_time',
  'width',
  'likes.summary(true)',
  'tags'
].join(',');

export const userFields = [
  'age_range',
  'birthday',
  'picture',
  'devices',
  'first_name',
  'gender',
  'languages',
  'last_name',
  'name',
  'name_format',
  'updated_time'
].join(',');