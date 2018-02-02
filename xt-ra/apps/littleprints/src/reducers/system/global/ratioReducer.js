import { Map } from 'immutable';
import { UPDATE_RATIO } from '../../../constants/actionTypes';

const initialState = Map({
  coverWorkspace: 0,
  innerWorkspace: 0,
  innerWorkspaceLandscape: 0,

  // preview
  previewCoverWorkspace: 0,
  previewInnerWorkspace: 0,

  // arrange pages
  coverWorkspaceForArrangePages: 0,
  innerWorkspaceForArrangePages: 0,

  // upgrade 的相关比例
  coverWorkspaceForUpgrade: 0,
  innerWorkspaceForUpgrade: 0,
  innerWorkspaceForUpgradeLandscape: 0
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
