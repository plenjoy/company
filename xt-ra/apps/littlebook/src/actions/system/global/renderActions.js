import {
  UPDATE_COVER_MATERIAL,
  UPDATE_INNER_MATERIAL,
  SET_ORIGINAL_MATERIALS,
  DOWNLOAD_MATERIALS_STATUS
} from '../../../contants/actionTypes';

/**
 * 更新使用在封面上的效果图
 */
export const updateCoverMaterial = (data) => {
  return {
    type: UPDATE_COVER_MATERIAL,
    data
  };
};

/**
 * 更新使用在内页上的效果图
 */
export const updateInnerMaterial = (data) => {
  return {
    type: UPDATE_INNER_MATERIAL,
    data
  };
};

/**
 * 更新下载好的封面素材到store.
 */
export const setOriginalMaterials = (data) => {
  return {
    type: SET_ORIGINAL_MATERIALS,
    data
  };
};

/**
 * 更新封面素材图是否下载完成的状态.
 */
export const changeMaterialsStatus = (isCompeleted = false) => {
  return {
    type: DOWNLOAD_MATERIALS_STATUS,
    isCompeleted
  };
};
