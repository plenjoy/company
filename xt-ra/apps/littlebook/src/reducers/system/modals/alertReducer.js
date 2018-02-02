import { List } from  'immutable';
import { SHOW_ALERT, CLOSED_ALERT } from '../../../contants/actionTypes';

const initialState = List([]);
/**
 * 处理系统级别action的reducer, 包括alert, 上传的图片等.
 * @param state
 * @param action
 * @returns {*}
 */
const alerts = (state = initialState, action) => {
  switch (action.type) {
    // 显示alert弹框
    case SHOW_ALERT: {
      return state.push({
        title: action.title,
        content: action.content,
        alertType: action.alertType
      });
    }

    // 关闭alert弹框
    case CLOSED_ALERT: {
      return state.splice(action.index, 1);
    }
    default:
      return state;
  }
};

export default alerts;
