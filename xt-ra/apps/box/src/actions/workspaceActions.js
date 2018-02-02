import {
  CHANGE_WORKSPACE_SPREAD,
  AUTO_ADD_PHOTO_TO_CANVAS,
  TOGGLE_OPERATION_PNAEL,
  UPDATE_WORKSPACE_SPREADS,
  IN_PREVIEW_WORKSPACE,
  UPDATE_WORKSPACE_RATIO
} from '../contants/actionTypes';

/**
 * 更改workspace中的活动的spread.
 * @param spread
 */
export function changeSpread(spread) {
  return {
    type: CHANGE_WORKSPACE_SPREAD,
    spread
  };
}

/**
 * 更改workspace中的活动的spread.
 * @param spread
 */
export function updateSpreads(spreads) {
  return {
    type: UPDATE_WORKSPACE_SPREADS,
    spreads
  };
}

/**
 * 用于设置, 在图片上传完成后, 自动添加到画布中去.
 * @param {boolean} status true: 自动添加到画布, false: 不需要添加
 * @param {string} spreadId
 * @param targetWidth 当前容器, 或画布的宽, 用于图片裁剪
 * @param targetHeight 当前容器, 或画布的高, 用于图片裁剪
 * @returns {{type, status: *, spreadId: *, targetWidth: *, targetHeight: *}}
 */
export function autoAddPhotoToCanvas(status, elementId, targetWidth, targetHeight) {
  return {
    type: AUTO_ADD_PHOTO_TO_CANVAS,
    status,

    // 用于图片裁剪.
    elementId,
    targetWidth,
    targetHeight
  };
}

/**
 * 显示或隐藏workspace上的操作面板
 * @param status
 */
export function toggleOperationPanel(status = false, offset = { top: 150, left: 500 }) {
  return {
    type: TOGGLE_OPERATION_PNAEL,
    status,
    offset
  };
}

/**
 * 标记当前的workspace视图为预览视图
 * @param status
 */
export function takeWorkspaceToPreview(status = false) {
  return {
    type: IN_PREVIEW_WORKSPACE,
    status
  };
}

/**
 * 标记当前的workspace的 视口比例（显示尺寸 / 实际尺寸）
 * @param ratio
 */
export function updateWorkspaceRatio(ratio = false) {
  return {
    type: UPDATE_WORKSPACE_RATIO,
    ratio
  };
}
