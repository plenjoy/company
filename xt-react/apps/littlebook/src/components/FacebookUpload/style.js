import { get } from 'lodash';
import box from './icon/box.svg';
import selectedBox from './icon/boxSelected.svg';
import disabledBox from './icon/boxDisabled.svg';

export function getCheckBoxImgStyle() {
  const { currentAlbumImgs: currentAlbums, albumsId, selectedAll } = this.state;
  const currentAlbumImgs = currentAlbums[albumsId] || [];
  let boxImageClass = '';
  let boxTitleClass = '';
  let boxImageSrc = '';

  // 是否所有图片都不可选，如：视频
  const isAllImgsInvalid = currentAlbumImgs.every(
    img => get(img, '_originalData.gphoto$videostatus')
  );

  // 如果所有图片都不可选，则禁用
  if(isAllImgsInvalid) {
    boxImageSrc = disabledBox;
    boxTitleClass = boxImageClass = 'disabled';
  }
  // 如果图片全选，则勾上checkbox
  else if(selectedAll) {
    boxImageSrc = selectedBox;
    boxTitleClass = boxImageClass = '';
  }
  // 否则为未勾选的checkbox
  else {
    boxImageSrc = box;
    boxTitleClass = boxImageClass = '';
  }

  return {
    boxImageClass,
    boxTitleClass,
    boxImageSrc
  };
};