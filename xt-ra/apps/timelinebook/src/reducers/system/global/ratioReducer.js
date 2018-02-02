import { fromJS } from 'immutable';
import { UPDATE_RATIO } from '../../../constants/actionTypes';

const initialState = fromJS({
  coverWorkspace: 0,
  innerWorkspace: 0
});

/**
 * 更新workspace或preview的ratio
 */
const ratio = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RATIO: {
      const ratios = action.ratios;
      return state.merge(ratios);
    }
    default:
      return state;
  }
};

export default ratio;
