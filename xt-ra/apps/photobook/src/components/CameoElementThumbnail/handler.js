import { cameoShapeTypes } from '../../contants/strings';
import { limitImagesLoading } from '../../contants/strings';

/**
 * 获取天窗背景图的路径
 * @param  {string} cameoShape 天窗的形状.
 */
export const getCameoBackgroundImage = (that, cameoShape) => {
  const { data } = that.props;
  const { materials } = data;
  let image = '';
  if (cameoShape === cameoShapeTypes.rect) {
    image = materials.getIn(['originalMaterials', 'cameo', 'rect']);
  } else {
    image = materials.getIn(['originalMaterials', 'cameo', 'round']);
  }

  return image;
};

export const hideLoading = that => {
  that.setState({
    isImgLoading: false
  });
};

export const lazyLoadingImage = (that, imgUrl) => {
  const imagePool = initImagePool(limitImagesLoading);

  that.setState({
    isImgLoading: true
  });

  imagePool.load(imgUrl, {
    success: src => {
      that.setState({
        src,
        isImgLoading: false
      });
    },
    error: src => {
      that.setState({
        isImgLoading: false
      });
    }
  });
};
