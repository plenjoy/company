import Immutable from 'immutable';
import { loadImgWithBase64 } from '../../../utils/image';
import { limitImagesLoading } from '../../../constants/strings';

window.__allPhotosUrls = [];
export const lazyLoadingImage = (that, imgUrl) => {
  const imagePool = initImagePool(limitImagesLoading);

  that.setState({
    isImgLoading: true
  });
  const isSetUrl = __allPhotosUrls.find(url => (url.imgUrl == imgUrl));
  if (!isSetUrl) {
    imagePool.load(imgUrl, {
      success: (src) => {
        that.setState({
          src,
          isImgLoading: false
        });
        __allPhotosUrls.push({ imgUrl });
      },
      error: (src) => {
        that.setState({
          isImgLoading: false
        });
      }
    });
  } else {
    that.setState({
      src: imgUrl,
      isImgLoading: false
    });
  }
};

