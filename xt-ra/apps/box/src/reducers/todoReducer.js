import assign from 'object-assign';
import { ADD_TODO, COMPLETE_TODO, API_SUCCESS } from '../contants/actionTypes';
import { GET_TODO_LIST } from '../contants/apiUrl';

/**
 * 创建todos列表的reducer
 * @param state
 * @param action
 */
export default function todos(state = [], action) {
  switch (action.type) {
    // 如果是新增的action, 那就直接添加一条新的.
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ];
    // 如果是completed的action, 就要把制定的item的completed改成true
    case COMPLETE_TODO:
      return [
        ...state.slice(0, action.index),
        assign({}, state[action.index], {
          completed: true
        }),
        ...state.slice(action.index + 1)
      ];
    case API_SUCCESS:
      if (action.api === GET_TODO_LIST) {
        return [...state, ...action.response];
      }
      return state;
    default:
      return state;
  }
}
