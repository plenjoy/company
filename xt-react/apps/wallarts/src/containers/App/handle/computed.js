import { get } from 'lodash';
import { computedWorkSpaceRatio } from '../../../utils/screen';
import { ratioTypes, percent, productTypes } from '../../../constants/strings';
import draw from '../../../utils/point9Scale';
let timer = null;
let effectTimer = null;
let matteTimer = null;
let previewEffectTimer = null;
/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 * @param spreadSize
 */
export const recomputedWorkspaceRatio = (props) => {
  const { boundRatioActions, size } = props;
  const offset = { top: 135, right: 150, bottom: 80, left: 370 };
  const workspaceRatio = computedWorkSpaceRatio(size.bgParams, offset, 0.98);
  // 更新workspace和preview的ratio
  boundRatioActions.updateRatio([
    { type: ratioTypes.workspace, ratio: workspaceRatio }
  ]);
};

/**
console.log()
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 */
export const recomputedPreviewRatios = (props) => {
  const { boundRatioActions, size } = props;
  const offset = { top: 100, right: 50, bottom: 50, left: 100 };
  const previewWorkspaceRatio = computedWorkSpaceRatio(size.bgParams, offset, 0.98);
  boundRatioActions.updateRatio([
    { type: ratioTypes.previewWorkspace, ratio: previewWorkspaceRatio }
  ]);
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

/**
 * 生成封面上的渲染效果图.
 * @param that
 * @param props
 */
export const getEffectImage = (that, props, done) => {
  clearTimeout(effectTimer);
  effectTimer = setTimeout(() => {
    const { boundMaterialActions } = that.props;
    const { size, settings, materials, pagination, variables } = props;
    const sheetIndex = pagination.sheetIndex;
    const product = settings.get('product');
    const frameStyle = settings.get('frameStyle');
    const color = settings.get('color');
    const canvasBorderSize = settings.get('canvasBorderSize');
    const finish = settings.get('finish');
    const product_size = settings.get('size');
    const roundForegroundAsset = variables.get('roundForegroundAsset');
    let backgroundSource;
    if(settings.get('shape') === 'Round' && roundForegroundAsset){

      backgroundSource = get(window._APPMATERIALS, 'round.'+product+'_'+product_size);
      //console.log('shape',backgroundSource);
      boundMaterialActions.updateFrameMaterial({
              sheetIndex:0,
              img: backgroundSource,
              padding: {},
              container: {}
      });
    }else{
      backgroundSource = get(window._APPMATERIALS, 'backgrounds.'+product+'_'+frameStyle+'_'+color+'_'+canvasBorderSize+'_'+finish);
      if (size && size.renderFrameBorderInnerSize && size.renderFrameBorderInnerSize.width && backgroundSource) {
        draw(backgroundSource,
          size.renderFrameBorderInnerSize.width,
          size.renderFrameBorderInnerSize.height,
          size.renderFrameBorderSize,
          size.renderWhitePadding,
          size.renderInnerWhitePadding
          ).then((result) => {
            // 更新 frame 的效果图到store.
            boundMaterialActions.updateFrameMaterial({
              sheetIndex,
              img: result.img,
              padding: result.padding,
              container: result.container
            });
            done && done(result);
          });
      }
    }
  }, 300);
};

/**
 * 生成 preview 封面上的渲染效果图.
 * @param that
 * @param props
 */
export const getPreviewEffectImage = (that, props, done) => {
  clearTimeout(previewEffectTimer);
  previewEffectTimer = setTimeout(() => {
    const { boundMaterialActions } = that.props;
    const { previewSize, settings, pagination, variables } = props;
    const sheetIndex = pagination.sheetIndex;
    const product = settings.get('product');
    const frameStyle = settings.get('frameStyle');
    const color = settings.get('color');
    const canvasBorderSize = settings.get('canvasBorderSize');
    const finish = settings.get('finish');
    const product_size = settings.get('size');
    const roundForegroundAsset = variables.get('roundForegroundAsset');
    let backgroundSource;
    if(settings.get('shape') === 'Round' && roundForegroundAsset){

      backgroundSource = get(window._APPMATERIALS, 'round.'+product+'_'+product_size);
      boundMaterialActions.updatePreviewFrameMaterial({
              sheetIndex:0,
              img: backgroundSource,
              padding: {},
              container: {}
      });
    }else{
      backgroundSource = get(window._APPMATERIALS, 'backgrounds.'+product+'_'+frameStyle+'_'+color+'_'+canvasBorderSize+'_'+finish);
      if (previewSize && previewSize.renderFrameBorderInnerSize && previewSize.renderFrameBorderInnerSize.width && backgroundSource) {
        draw(backgroundSource,
          previewSize.renderFrameBorderInnerSize.width,
          previewSize.renderFrameBorderInnerSize.height,
          previewSize.renderFrameBorderSize,
          previewSize.renderWhitePadding,
          previewSize.renderInnerWhitePadding
          ).then((result) => {
            // 更新 preview frame 的效果图到store.
            boundMaterialActions.updatePreviewFrameMaterial({
              sheetIndex,
              img: result.img,
              padding: result.padding,
              container: result.container
            });
            done && done(result);
          });
      }
    }
  }, 300);
};

export const getMatteImage = (that, props, done) => {
  clearTimeout(matteTimer);
  matteTimer = setTimeout(() => {
    const { boundMaterialActions } = that.props;
    const { size, settings, materials, pagination } = props;
    const sheetIndex = pagination.sheetIndex;
    const matteSource = get(window._APPMATERIALS, 'matte');
    if (size && size.renderInnerMatteSize && size.renderInnerMatteSize.width && matteSource) {
      draw(matteSource,
        size.renderInnerMatteSize.width,
        size.renderInnerMatteSize.height,
        size.renderMatteSize,
        null).then((result) => {
          // 更新 matte 的效果图到store.
          boundMaterialActions.updateMatteMaterial({
            sheetIndex,
            img: result.img
          });
          done && done(result);
        });
    }
  }, 300);
};
