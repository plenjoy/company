import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER } from '../contants/actionTypes';
import { CALL_API } from '../middlewares/api';
import { GET_TODO_LIST } from '../contants/apiUrl';

/*
 * action创建函数, 用于定义创建一个新的todo的action
 * @param {string} text to do项的描述
 */
export function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}

/**
 * action创建函数, 用于定义完成一个todo的action
 * @param {int} index 待完成的todo的索引.
 */
export function completeTodo(index) {
  return {
    type: COMPLETE_TODO,
    index
  };
}

/**
 * action创建函数, 用于创建一个用于异步获取todo列表的请求.
 */
export function getTodoList() {
  return (dispatch) => {
    return dispatch({
      [CALL_API]: {
        api: GET_TODO_LIST
      }
    });
  };
}

/**
 * action创建函数, 用于定义过滤todo列表的action
 * @param filter 过滤条件.
 */
export function setVisibilityFilter(filter) {
  return {
    type: SET_VISIBILITY_FILTER,
    filter
  };
}
