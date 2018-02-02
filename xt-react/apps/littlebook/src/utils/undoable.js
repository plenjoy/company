import { merge } from 'lodash';

const defaultConfig = {
  // 仅仅允许的action type.
  filter: [],
  limit: 10,

  undoType: 'UNDO',
  redoType: 'REDO',
  clearHistoryType: 'CLEAR_HISTORY'
};

/**
 * 从右边开始, 截取指定长度的数组内容.
 * @param  {[type]} arr  待截取的原数组.
 * @param  {Number} size 截取指定长度
 */
const doSlice = (arr, size) => {
  if (!arr || !arr.length || !size) {
    return [];
  }

  let newArr = arr;

  if (arr.length > size) {
    newArr = arr.slice(newArr.length - size);
  }

  return newArr;
};

const doFilter = (filter, actionType) => {
  return filter.indexOf(actionType) !== -1;
};

export default function undoable(reducer, options) {
  // 以一个空的 action 调用 reducer 来产生初始的 state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
    inUndo: false
  };

  const config = merge({}, defaultConfig, options);

  // 返回一个可以执行撤销和重做的新的reducer
  return (state = initialState, action) => {
    const { past, present, future } = state;

    switch (action.type) {
      case config.undoType:
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
          inUndo: true
        };
      case config.redoType:
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
          inUndo: true
        };
      case config.clearHistoryType: {
        return {
          past: [],
          present,
          future: [],
          inUndo: true
        };
      }
      default: {
        // 将其他 action 委托给原始的 reducer 处理
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state;
        }

        // 处理fitler逻辑.
        if (doFilter(config.filter, action.type)) {
          // 限制回滚的次数.
          const newArr = [...past, present];

          return {
            past: doSlice(newArr, config.limit),
            present: newPresent,
            future: [],
            inUndo: false
          };
        }

        return {
          past,
          present: newPresent,
          future,
          inUndo: false
        };
      }
    }
  };
}
