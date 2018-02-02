import { get, merge } from 'lodash';
import { getLimitSize } from '../../../../../common/utils/helper';
import { isMobileDevice } from '../../../../../common/utils/mobile';
import { ratioType, percent, smallViewWidthInArrangePages } from '../../../contants/strings';
import { computedWorkSpaceRatio, computedScreeRatio } from '../../../utils/screen';
import { updateWorkspaceRatio, computedWorkSpaceOffset, computedPreviewWorkSpaceOffset } from '../../../utils/computedRatio';
import { makeCoverImage, makeInnerImage } from '../../../utils/renderGenerator';

let timer = null;
let coverTimer = null;
let innerTimer = null;

/**
 * 对合成后的数据做反缩放处理, 使得数据和缩放前一致.
 * @param  {Object} data       {outPaddings, paddings, size}
 * @param  {Number} options.wR [description]
 * @param  {Number} options.hR [description]
 * @return {Object}            [description]
 */
const transformCombineResult = (data, { wR, hR }) => {
  const { outPaddings, paddings, size } = data;

  return merge({}, data, {
    outPaddings: {
      top: outPaddings.top * hR,
      bottom: outPaddings.bottom * hR,
      left: outPaddings.left * wR,
      right: outPaddings.right * wR
    },
    paddings: {
      top: paddings.top * hR,
      bottom: paddings.bottom * hR,
      left: paddings.left * wR,
      right: paddings.right * wR
    },
    size: {
      height: size.height * hR,
      width: size.width * wR,
      innerHeight: size.innerHeight * hR,
      innerWidth: size.innerWidth * wR
    }
  });
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 * @param spreadSize
 */
export const recomputedWorkspaceRatio = (props) => {
  const { boundRatioActions, size, settings, togglePanel, capabilities } = props;

  const isAdvancedMode = capabilities.getIn(['editPages', 'isAdvancedMode']);

  // 判断当前的书是landscape/square/portrait
  const productSize = get(settings, 'spec.size');

  const step = togglePanel ? togglePanel.get('step') : 1;
  const offset = computedWorkSpaceOffset(productSize, step, isAdvancedMode);

  updateWorkspaceRatio(boundRatioActions, size, offset);
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 */
export const recomputedPreviewRatios = (props) => {
  const { boundRatioActions, size, settings } = props;

  // 判断当前的书是landscape/square/portrait
  const productSize = get(settings, 'spec.size');
  const offset = computedPreviewWorkSpaceOffset(productSize);

  const previewCoverWorkspaceRatio = computedWorkSpaceRatio(size.coverSpreadSize, offset, percent.lg);
  const previewInnerWorkspaceRatio = computedWorkSpaceRatio(size.innerSpreadSize, offset, percent.lg);

  // 更新workspace和preview的ratio
  boundRatioActions.updateRatio([
    { type: ratioType.previewCoverWorkspace, ratio: previewCoverWorkspaceRatio },
    { type: ratioType.previewInnerWorkspace, ratio: previewInnerWorkspaceRatio }
  ]);
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 */
export const recomputedOrderRatios = (props) => {
  const { boundRatioActions, size } = props;

  const orderCoverWorkspaceRatio = computedWorkSpaceRatio(size.coverSpreadSize, {
    top: 70,
    right: 380,
    bottom: 250,
    left: 0
  }, percent.lg);

  const orderInnerWorkspaceRatio = computedWorkSpaceRatio(size.innerSpreadSize, {
    top: 70,
    right: 380,
    bottom: 250,
    left: 0
  }, percent.lg);

  // 更新workspace和preview的ratio
  boundRatioActions.updateRatio([
    { type: ratioType.orderCoverWorkspace, ratio: orderCoverWorkspaceRatio },
    { type: ratioType.orderInnerWorkspace, ratio: orderInnerWorkspaceRatio }
  ]);
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 */
export const recomputedScreenRatios = (props) => {
  const { boundRatioActions, size } = props;

  const screenRatio = computedScreeRatio(size.coverSpreadSize, {
    top: 140,
    right: 0,
    bottom: 70,
    left: 320
  }, percent.lg);

  // 更新workspace和preview的ratio
  boundRatioActions.updateRatio([{ type: ratioType.screen, ratio: screenRatio }]);
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
    { type: ratioType.coverSheetPaddingLeft, ratio: renderCoverSheetPaddingLeft / coverWorkspaceSize.width },
    { type: ratioType.coverSheetPaddingTop, ratio: renderCoverSheetPaddingTop / coverWorkspaceSize.height },

    { type: ratioType.innerSheetPaddingLeft, ratio: renderInnerSheetPaddingLeft / innerWorkspaceSize.width },
    { type: ratioType.innerSheetPaddingTop, ratio: renderInnerSheetPaddingTop / innerWorkspaceSize.height }
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
    recomputedOrderRatios(that.props);
    recomputedRenderRatios(that.props);
  }, 500);
};

/**
 * 生成封面上的渲染效果图.
 * @param that
 * @param props
 */
export const getCoverImage = (that, props, done) => {
  clearTimeout(coverTimer);

  coverTimer = setTimeout(() => {
    const { boundRenderActions, boundRatioActions, boundGlobalLoadingActions } = that.props;
    const { size, settings, materials } = props;
    const originalMaterials = materials.get('originalMaterials');

    if (size && size.renderCoverSheetSizeWithoutBleed && size.renderCoverSheetSizeWithoutBleed.width && originalMaterials) {
      // 移动端多以2倍/3倍图为主，这个现象应该是由于1倍图在手机上被放大后的显示效果
      // 700: 以iphone6的宽的2倍.
      const { width, height, wR, hR } = getLimitSize({
        width: size.renderCoverSheetSizeWithoutBleed.width,
        height: size.renderCoverSheetSizeWithoutBleed.height
      }, isMobileDevice() ? 700 : 0);

      makeCoverImage(
        originalMaterials.toJS(),
        settings.spec.cover, {
          width,
          height
        },
        size.renderSpainWidthWithoutBleed,
        (result) => {
          const { coverWorkspaceSize } = size;
          const data = transformCombineResult(result, { wR, hR });

          const paddingLeft = (data.size.width - data.size.innerWidth) / 2;
          const paddingTop = (data.size.height - data.size.innerHeight) / 2;

          boundRatioActions.updateRatio([
            { type: ratioType.coverRenderPaddingLeft, ratio: paddingLeft / coverWorkspaceSize.width },
            { type: ratioType.coverRenderPaddingTop, ratio: paddingTop / coverWorkspaceSize.height },

            { type: ratioType.coverRenderOutPaddingLeft, ratio: data.outPaddings.left / coverWorkspaceSize.width },
            { type: ratioType.coverRenderOutPaddingTop, ratio: data.outPaddings.top / coverWorkspaceSize.width },

            // 渲染效果图与workspace大小的比例
            { type: ratioType.coverRenderWidth, ratio: data.size.width / coverWorkspaceSize.width },
            { type: ratioType.coverRenderHeight, ratio: data.size.height / coverWorkspaceSize.height }
          ]);

          // 更新cover的效果图到store.
          boundRenderActions.updateCoverMaterial({
            img: data.img,
            base64: data.base64,
            size: data.size,
            paddings: data.paddings,
            outPaddings: data.outPaddings
          });

          done && done(data);
        });
    }
  }, 500);
};

/**
 * 生成内页的渲染效果图.
 * @param that
 * @param props
 */
export const getInnerImage = (that, props, done) => {
  clearTimeout(innerTimer);

  innerTimer = setTimeout(() => {
    const { boundRenderActions, boundRatioActions } = that.props;
    const { size, settings, materials } = props;
    const originalMaterials = materials.get('originalMaterials');

    if (size && size.renderInnerSheetSizeWithoutBleed && size.renderInnerSheetSizeWithoutBleed.width && originalMaterials) {
      // 移动端多以2倍/3倍图为主，这个现象应该是由于1倍图在手机上被放大后的显示效果
      // 700: 以iphone6的宽的2倍.
      const { width, height, wR, hR } = getLimitSize({
        width: size.renderInnerSheetSizeWithoutBleed.width,
        height: size.renderInnerSheetSizeWithoutBleed.height
      }, isMobileDevice() ? 700 : 0);

      makeInnerImage(
        originalMaterials.toJS(),
        settings.spec.cover, {
          width,
          height
        },
        (result) => {
          const { innerWorkspaceSize } = size;
          const data = transformCombineResult(result, { wR, hR });

          // 白边的ratio
          const paddingLeft = (data.size.width - data.size.innerWidth) / 2;
          const paddingTop = (data.size.height - data.size.innerHeight) / 2;

          boundRatioActions.updateRatio([
            { type: ratioType.innerRenderPaddingLeft, ratio: paddingLeft / innerWorkspaceSize.width },
            { type: ratioType.innerRenderPaddingTop, ratio: paddingTop / innerWorkspaceSize.height },

            { type: ratioType.innerRenderOutPaddingLeft, ratio: data.outPaddings.left / innerWorkspaceSize.width },
            { type: ratioType.innerRenderOutPaddingTop, ratio: data.outPaddings.top / innerWorkspaceSize.height },

            // 渲染效果图与workspace大小的比例
            { type: ratioType.innerRenderWidth, ratio: data.size.width / innerWorkspaceSize.width },
            { type: ratioType.innerRenderHeight, ratio: data.size.height / innerWorkspaceSize.height }
          ]);

          boundRenderActions.updateInnerMaterial({
            img: data.img,
            size: data.size,
            paddings: data.paddings,
            outPaddings: data.outPaddings
          });

          done && done(data);
        });
    }
  }, 500);
};
