import { UPDATE_SNIPPING_THUMBNAIL } from '../../contants/actionTypes';

/**
 * 更新在my projects上的前端截图.
 */
export const updateSnippingThumbnail = (data) => {
  return {
    type: UPDATE_SNIPPING_THUMBNAIL,
    data
  };
};

