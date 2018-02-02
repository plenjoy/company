import {
  SHOW_CONFIRM,
  HIDE_CONFIRM,
  SHOW_NOTIFY,
  HIDE_NOTIFY,
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_IMAGE_EDIT_MODAL,
  HIDE_IMAGE_EDIT_MODAL,
  NEED_LEAVE_CONFIRM,
  NO_NEED_LEAVE_CONFIRM,
  SHOW_CLONE_MODAL,
  HIDE_CLONE_MODAL

} from '../contants/actionTypes';

import { get } from 'lodash';
import { CALL_API } from '../middlewares/api';
import * as apiUrl from '../contants/apiUrl';

/**
 * [showConfirm description]
 * 用于弹出一个 confirm 确认框
 * @param  {[object]} confirmData [传入确认弹框的信息对象]
 * confirmData的数据结构 ｛
 *   confirmMessage：[string]  必传   确认框中的显示内容，
 *   okButtonText：[string]    非必传 确认按钮的显示内容，
 *   cancelButtonText: [string] 非必传 取消按钮的显示内容,
 *   onOkClick: [function]      必传   点击确认按钮的执行逻辑，
 *   onCancelClick: [function]  非必传 点击取消按钮的执行逻辑
 * ｝
 */
export function showConfirm(confirmData) {
  return {
    type: SHOW_CONFIRM,
    confirmData
  };
}

/**
 * [hideConfirm 关闭 confirm 确认弹框]
 */
export function hideConfirm() {
  return {
    type: HIDE_CONFIRM
  };
}

/**
 * [showNotify 用于弹出提示框]
 * @param  {[string]} notifyMessage [提示语的提示内容]
 */
export function showNotify(notifyMessage) {
  return {
    type: SHOW_NOTIFY,
    notifyMessage
  };
}

/**
 * [hideNotify 关闭 提示框]
 */
export function hideNotify() {
  return {
    type: HIDE_NOTIFY
  };
}

export function showImageEditModal(imageEditModalData) {
  return {
    type: SHOW_IMAGE_EDIT_MODAL,
    imageEditModalData
  };
}

export function hideImageEditModal() {
  return {
    type: HIDE_IMAGE_EDIT_MODAL
  };
}

/**
 * [showLoading  用于显示 loading 图标 ]
 * @param  {Boolean} isModalShow  [传参确定是否需要显示模态层] 可不传，不传表示无模态层
 */
export function showLoading(isModalShow) {
  return {
    type: SHOW_LOADING,
    isModalShow
  };
}

/**
 * [hideLoading 用于隐藏  loading 图标 ]
 */
export function hideLoading() {
  return {
    type: HIDE_LOADING
  };
}

export function getFontList() {
  return (dispatch, getState) => {
    const urls = getState().system.env.urls;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_FONTS,
          params: {
            baseUrl: urls.baseUrl
          }
        }
      }
    });
  };
}

export function showCloneModal() {
  return {
    type: SHOW_CLONE_MODAL
  };
}

export function hideCloneModal() {
  return {
    type: HIDE_CLONE_MODAL
  };
}
