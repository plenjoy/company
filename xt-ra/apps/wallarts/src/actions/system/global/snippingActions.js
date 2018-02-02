import { UPDATE_SNIPPING_IMAGES } from '../../../constants/actionTypes';

/**
 * 更新在my projects上的前端截图.
 */
export const updateSnippingImages = (data) => {
  return {
    type: UPDATE_SNIPPING_IMAGES,
    data
  };
};

