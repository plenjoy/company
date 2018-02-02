import { merge } from 'lodash';
import { UPDATE_COVER_SNAP } from '../contants/actionTypes';

const initialState = {
  coverSnap: ''
};

/**
 * 更新封面截图
 */
const snapData = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COVER_SNAP: {
      if (action.coverSnapData) {
        return merge({}, state, {
          coverSnap: action.coverSnapData
        });
      }
      return state;
    }
    default:
      return state;
  }
};

export default snapData;
