import { Map } from 'immutable';
import { UPDATE_RATIO } from '../../../constants/actionTypes';

const initialState = Map({
  workspace: 0,

  // preview
  previewWorkspace: 0,

  // arrange pages
  workspaceForArrangePages: 0
});

/**
 * 更新workspace或preview的ratio
 */
const ratio = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RATIO: {
      const ratios = action.ratios;
      const obj = {};
      ratios.forEach((item) => {
        obj[item.type] = item.ratio;
      });

      return state.merge(obj);
    }
    default:
      return state;
  }
};

export default ratio;
