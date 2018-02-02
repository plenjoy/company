import * as types from '../../../constants/actionTypes';

/**
 * 更新使用在封面上的效果图
 */
export const updateCoverMaterial = () => {
  return {
    type: types.UPDATE_COVER_MATERIAL,
    cover
  };
};

/**
 * 更新使用在内页上的效果图
 */
export const updateInnerMaterial = () => {
  return {
    type: types.UPDATE_INNER_MATERIAL,
    inner
  };
};
