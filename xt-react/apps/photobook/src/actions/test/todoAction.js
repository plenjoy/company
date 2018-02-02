import { ADD_TODO, REMOVE_TODO } from '../../contants/actionTypes';

export function addTodo(title) {
  return {
    type: ADD_TODO,
    title
  };
}

export function removeTodo(index) {
  return {
    type: REMOVE_TODO,
    index
  };
}
