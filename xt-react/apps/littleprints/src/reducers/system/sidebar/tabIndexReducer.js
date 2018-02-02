import { CHANGE_TAB_IN_SIDEBAR } from '../../../constants/actionTypes';

/**
 * 处理系统级别action的reducer, 包括alert, 上传的图片等.
 * @param state
 * @param action
 * @returns {*}
 */
const tabIndex = (state = 1, action) => {
  switch (action.type) {
    // 显示alert弹框
    case CHANGE_TAB_IN_SIDEBAR: {
      return action.tabIndex;
    }
    default:
      return state;
  }
};

export default tabIndex;
