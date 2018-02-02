import {
  UPDATE_FRAME_MATERIAL,
  SET_ORIGINAL_MATERIALS,
  UPDATE_MATTE_MATERIAL,
  DOWNLOAD_MATERIALS_STATUS,
  UPDATE_PREVIEW_FRAME_MATERIAL
} from '../../../constants/actionTypes';

/**
 * 更新 frame 效果图
 */
export const updateFrameMaterial = (data) => {
  return {
    type: UPDATE_FRAME_MATERIAL,
    data
  };
};


/**
 * 更新 preview frame 效果图
 */
export const updatePreviewFrameMaterial = (data) => {
  return {
    type: UPDATE_PREVIEW_FRAME_MATERIAL,
    data
  };
};


/**
 * 更新 matte 图片
 */
export const updateMatteMaterial = (data) => {
  return {
    type: UPDATE_MATTE_MATERIAL,
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
