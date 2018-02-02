import Immutable from 'immutable';
import { loadImgWithBase64 } from '../../../utils/image';
import { limitImagesLoading } from '../../../contants/strings';

export const lazyLoadingImage = (that, imgUrl) => {
  const imagePool = window.initImagePool(limitImagesLoading);

  that.setState({
    isImgLoading: true
  });

  imagePool.load(imgUrl, {
    success: (src) => {
      that.setState({
        src: imgUrl,
        isImgLoading: false
      });
    },
    error: (src) => {
      that.setState({
        isImgLoading: false
      });
      const { boundTrackerActions } = that.props.actions;
      boundTrackerActions.addTracker('AutoRenderFailed');
    }
  });
};

export const componentWillReceiveProps = (that, nextProps) => {
  const oldImgUrl = that.props.data.element.getIn(['computed', 'imgUrl']);
  const newImgUrl = nextProps.data.element.getIn(['computed', 'imgUrl']);

  if (oldImgUrl !== newImgUrl && newImgUrl) {
    // 清空原来的图片.
    that.setState({
      src: null
    });

    lazyLoadingImage(that, newImgUrl);
  }
};
