import { SHOW_LOADING, HIDE_LOADING } from '../../contants/actionTypes';

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
