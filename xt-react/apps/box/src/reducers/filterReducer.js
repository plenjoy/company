/**
 * Created by Administrator on 2016/9/13.
 */
import { SET_VISIBILITY_FILTER } from '../contants/actionTypes';
import { SHOW_ALL }  from '../contants/visibilityFilters';

/**
 * 创建filter的reducer.
 * @param state 下一个的state
 * @param action 下一个的action
 * @returns {*}
 */
export default function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state || 'SHOW_ALL';
  }
}
