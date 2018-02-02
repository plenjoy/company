import { limitImagesLoading } from '../../contants/strings';

export const lazyLoadingImage = (that, imgUrl) => {
  const imagePool = initImagePool(limitImagesLoading);

  that.setState({
    isImgLoading: true
  });

  imagePool.load(imgUrl, {
    success: (src) => {
      that.setState({
        src,
        isImgLoading: false
      });
    },
    error: (src) => {
      that.setState({
        isImgLoading: false
      });
    }
  });
};

export const imgLoaded = (that) => {
  that.setState({
    isImgLoading: false
  });
};

export const imgErrored = (that) => {
  that.setState({
    isImgLoading: false
  });
};

export const handleMouseOver = (that) => {
  const { actions, imageObj } = that.props;
  const { onOverImageItem } = actions;
  onOverImageItem(imageObj);
};

export const handleMouseOut = (that) => {
  const { actions } = that.props;
  const { onOutImageItem } = actions;
  onOutImageItem();
};

export const handleMouseDown = (that, event) => {
  const { actions, imageObj } = that.props;
  const { guid } = imageObj;
  const { toggleImageItemSelected } = actions;
  toggleImageItemSelected(guid, event);
};

export const handleImageName = (name) => {
  return name = name.length > 15 ? name.substr(0, 5) + "..." + name.substr(name.length - 6) : name;
};

