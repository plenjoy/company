import { SHOW_ORDER, HIDE_ORDER , SHOW_ORDER_LOADING ,HIDE_ORDER_LOADING } from '../../../constants/actionTypes';

export function showOrder() {
  return {
    type: SHOW_ORDER
  };
}

export function hideOrder() {
  return {
    type: HIDE_ORDER
  };
}

export function showOrderLoading() {
  return {
    type: SHOW_ORDER_LOADING
  };
}

export function hideOrderLoading() {
  return {
    type: HIDE_ORDER_LOADING
  };
}

