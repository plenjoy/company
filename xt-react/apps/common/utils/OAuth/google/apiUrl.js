export const GET_ALBUMS_URL = userId => `https://picasaweb.google.com/data/feed/api/user/${userId}`;

export const GET_ALBUM_IMAGE_URL = (userId, albumId) => `https://picasaweb.google.com/data/feed/api/user/${userId}/albumid/${albumId}`;