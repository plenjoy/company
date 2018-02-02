
// 获取用户信息URL
export const GET_USER_URL = () => '/me';

// 获取用户相册URL
export const GET_ALBUMS_URL = () => '/me/albums';

// 获取相册图片URL
export const GET_ALBUM_IMAGE_URL = albumId => `/${albumId}/photos`;

// 获取用户图片URL
export const GET_USER_PHOTOS_URL = () => `/me/photos?fields=picture,images,backdated_time,created_time,height,icon,link,name,place,updated_time,width,likes.summary(true),tags&type=uploaded&limit=100&order=reverse_chronological`

// 获取用户post图片URL
export const GET_POST_IMAGE_URL = () => `me/posts?fields=created_time,message,from{picture.width(200).height(200)},place,attachments{media,type,subattachments.limit(42){media,type}},likes.limit(1).summary(true),story`

export const GET_IMAGE_BY_ID = photoId => `/${photoId}?fields=picture,images,backdated_time,created_time,height,icon,link,name,place,updated_time,width,likes.summary(true),tags,target`