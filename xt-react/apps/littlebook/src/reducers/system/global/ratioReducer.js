import { Map } from 'immutable';
import { UPDATE_RATIO } from '../../../contants/actionTypes';

const initialState = Map({
  coverWorkspace: 0,
  innerWorkspace: 0,

  // preview
  previewCoverWorkspace: 0,
  previewInnerWorkspace: 0,

  // order
  orderCoverWorkspace: 0,
  orderInnerWorkspace: 0,

  screen: 0,

  // 渲染效果图与封面workspace大小的比例
  coverRenderWidth: 0,
  coverRenderHeight: 0,

  coverRenderPaddingLeft: 0,
  coverRenderPaddingTop: 0,
  coverSheetPaddingLeft: 0,
  coverSheetPaddingTop: 0,

  // 渲染效果图与内页workspace大小的比例
  innerRenderWidth: 0,
  innerRenderHeight: 0,

  innerRenderPaddingLeft: 0,
  innerRenderPaddingTop: 0,
  innerSheetPaddingLeft: 0,
  innerSheetPaddingTop: 0,

  coverRenderOutPaddingLeft: 0,
  coverRenderOutPaddingTop: 0,
  innerRenderOutPaddingLeft: 0,
  innerRenderOutPaddingTop: 0,
  coverSheetOutPaddingLeft: 0,
  coverSheetOutPaddingTop: 0,
  innerSheetOutPaddingLeft: 0,
  innerSheetOutPaddingTop: 0,

  // arrange pages
  coverWorkspaceForArrangePages: 0,
  innerWorkspaceForArrangePages: 0
});

/**
 * 更新workspace或preview的ratio
 */
const ratio = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RATIO: {
      const ratios = action.ratios;
      const obj = {};
      ratios.forEach((item)=>{
        obj[item.type] = item.ratio
      });

      return state.merge(obj);
    }
    default:
      return state;
  }
};

export default ratio;
