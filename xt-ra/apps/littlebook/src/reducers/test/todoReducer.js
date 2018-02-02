import { List } from 'immutable';
import { ADD_TODO, REMOVE_TODO } from '../../contants/actionTypes';

const initialState = List([]);
const todos = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO: {
      return state.push({
        title: action.title
      });
    }

    case REMOVE_TODO: {
      return state.splice(action.index, 1);
    }
    default:
      return state;
  }
};

export default todos;
