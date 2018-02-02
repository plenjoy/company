import Immutable from 'immutable';
import { loadImgWithBase64 } from '../../../utils/image';
import { limitImagesLoading } from '../../../contants/strings';
window.__allPhotosUrls = [];
export const lazyLoadingImage = (that, imgUrl) => {
  const imagePool = initImagePool(limitImagesLoading);

  that.setState({
    isImgLoading: true
  });
  const isSetUrl = __allPhotosUrls.find(url => (url.imgUrl == imgUrl) )
  if (!isSetUrl) {
    imagePool.load(imgUrl, {
      success: (src) => {
        that.setState({
          src,
          isImgLoading: false
        });
        __allPhotosUrls.push({imgUrl});

      },
      error: (src) => {
        that.setState({
          isImgLoading: false
        });
      }
    });
  }else{
    that.setState({
          src:imgUrl,
          isImgLoading: false
        });
  }
};


export const componentWillReceiveProps = (that, nextProps) => {
  const oldImgUrl = that.props.data.element.getIn(['computed', 'imgUrl']);
  const newImgUrl = nextProps.data.element.getIn(['computed', 'imgUrl']);
  if (oldImgUrl !== newImgUrl) {
    that.setState({
      src: null
    });

    lazyLoadingImage(that, newImgUrl);
  }
};

export const handleMouseOver = (that, data, event) => {
  that.props.actions.handleMouseOver(data, event);
  event.stopPropagation();
  that.setState({
    isShowHover: true
  });
};

export const handleMouseOut = (that, data, event) => {
  that.props.actions.handleMouseOut(data, event);
  event.stopPropagation();
  that.setState({
    isShowHover: false
  });
};
