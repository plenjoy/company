import { get } from 'lodash';
import { ratioTypes, percent, smallViewWidthInArrangePages, productTypes } from '../../../constants/strings';
import { computedWorkSpaceRatio } from '../../../utils/screen';
import { getSize } from '../../../../../common/utils/helper';
import { updateWorkspaceRatio, computedWorkSpaceOffset } from '../../../utils/computedRatio';


let timer = null;
/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 * @param spreadSize
 */
export const recomputedWorkspaceRatio = (props) => {
  const { boundRatioActions, size, settings, togglePanel, pagination } = props;

  // 判断当前的书是landscape/square/portrait
  const productType = get(settings, 'spec.product');
  const productSize = get(settings, 'spec.size');
  // const isCover = get(pagination, 'sheetIndex') === 0;
  const isCover = true;

  // const step = togglePanel ? togglePanel.get('step') : 1;
  const offset = computedWorkSpaceOffset(productType, isCover);

  updateWorkspaceRatio(boundRatioActions, size, offset, productType);
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 */
export const recomputedPreviewRatios = (props) => {
  let previewCoverWorkspaceRatio = 0;
  let previewInnerWorkspaceRatio = 0;
  const { boundRatioActions, size, settings } = props;
  const productType = get(settings, 'spec.product');
  const isWallCalendar = productType === productTypes.WC;
  if (productType !== productTypes.PC) {
    const innerOffset = {
      top: isWallCalendar ? 50 : 100,
      right: 50,
      bottom: isWallCalendar ? 50 : 100,
      left: 50
    };

    previewCoverWorkspaceRatio = computedWorkSpaceRatio(size.coverBgParams, {
      top: 100,
      right: 50,
      bottom: 100,
      left: 50
    }, percent.lg);

    previewInnerWorkspaceRatio = computedWorkSpaceRatio(size.innerBgParams, innerOffset, percent.lg);
  } else if (productType === productTypes.PC) {
    const orientation = get(settings, 'spec.orientation');
    const screenWidth = getSize().width;
    // let contentRatio = orientation === 'Portrait' ? 0.55 : 0.8;
    const maxWidth = orientation === 'Portrait' ? 1040 : 1520;
    const contentRatio = 0.8;
    let pageWidth = Math.floor(screenWidth * contentRatio);
    if (pageWidth > maxWidth) {
      pageWidth = maxWidth;
    }
    previewCoverWorkspaceRatio = pageWidth / get(size.coverBgParams, 'width');
    previewInnerWorkspaceRatio = pageWidth / get(size.innerBgParams, 'width');
  }
  // 更新workspace和preview的ratio
  boundRatioActions.updateRatio([
    { type: ratioTypes.previewCoverWorkspace, ratio: previewCoverWorkspaceRatio },
    { type: ratioTypes.previewInnerWorkspace, ratio: previewInnerWorkspaceRatio }
  ]);
};

/**
 * 计算渲染效果图白边的缩放比
 * 计算渲染效果图sheet非内容区(sheet的原始大小减去出血)
 * @param that editPage组件的this指向.
 */
export const recomputedRenderRatios = (props) => {
  const { boundRatioActions, size } = props;
  const { coverWorkspaceSize, innerWorkspaceSize, renderCoverSize, renderCoverSheetSize, renderInnerSize, renderInnerSheetSizeWithoutBleed } = size;

  // 计算封面渲染效果图上白边的缩放比
  const renderCoverSheetPaddingLeft = (coverWorkspaceSize.width - renderCoverSheetSize.width) / 2;
  const renderCoverSheetPaddingTop = (coverWorkspaceSize.height - renderCoverSheetSize.height) / 2;

  // 计算内页渲染效果图上白边的缩放比
  const renderInnerSheetPaddingLeft = (innerWorkspaceSize.width - renderInnerSheetSizeWithoutBleed.width) / 2;
  const renderInnerSheetPaddingTop = (innerWorkspaceSize.height - renderInnerSheetSizeWithoutBleed.height) / 2;

  // 更新封面白边的ratio.
  // 更新内页白边的ratio.
  boundRatioActions.updateRatio([
    { type: ratioTypes.coverSheetPaddingLeft, ratio: renderCoverSheetPaddingLeft / coverWorkspaceSize.width },
    { type: ratioTypes.coverSheetPaddingTop, ratio: renderCoverSheetPaddingTop / coverWorkspaceSize.height },

    { type: ratioTypes.innerSheetPaddingLeft, ratio: renderInnerSheetPaddingLeft / innerWorkspaceSize.width },
    { type: ratioTypes.innerSheetPaddingTop, ratio: renderInnerSheetPaddingTop / innerWorkspaceSize.height }
  ]);
};

/**
 * 获取spread的原始宽高.
 * @param that editPage组件的this指向.
 * @return {object} {width, height}
 */
export const getSpreadSize = (that) => {
  return get(that.props, 'size.coverSpreadSize');
};

/**
 * window resizing的处理函数.
 * @param that editPage组件的this指向.
 */
export const resizingHandler = (that) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    // 重新计算ratio.
    recomputedWorkspaceRatio(that.props);
    recomputedPreviewRatios(that.props);
  }, 500);
};
