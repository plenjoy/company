import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';
import todos from './todoReducer';
import randoms from './randomReducer';
import { REDO, UNDO } from '../../contants/actionTypes';

// reducer合成器, 用于分别处理不同的reducer.
const undoData = combineReducers({
  todos,
  randoms
});

export default combineReducers({
  undoData: undoable(undoData, {
    undoType: UNDO,
    redoType: REDO
  })
});
