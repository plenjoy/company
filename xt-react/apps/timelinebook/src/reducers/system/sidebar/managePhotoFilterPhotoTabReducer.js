import { CHANGE_FILTER_PHOTO_TAB } from '../../../constants/actionTypes';
import { managePhotoViewTypes } from '../../../constants/strings';

/**
 * 处理系统级别action的reducer, 包括alert, 上传的图片等.
 * @param state
 * @param action
 * @returns {*}
 */
const tabIndex = (state = managePhotoViewTypes.included, action) => {
  switch (action.type) {
    case CHANGE_FILTER_PHOTO_TAB: {
      return action.tabIndex;
    }
    default:
      return state;
  }
};

export default tabIndex;
