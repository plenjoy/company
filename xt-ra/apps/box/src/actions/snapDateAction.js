import { UPDATE_COVER_SNAP } from '../contants/actionTypes';

/**
 * 更新封面截图数据.
 */
export function updataCoverSnap(coverSnapData) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_COVER_SNAP,
      coverSnapData
    });

    return Promise.resolve();
  };
}
