import { SHOW_APPROVAL_PAGE, HIDE_APPROVAL_PAGE } from '../../contants/actionTypes';

export function showApprovalPage(data) {
  return {
    type: SHOW_APPROVAL_PAGE,
    data
  };
}

export function hideApprovalPage(){
  return {
    type: HIDE_APPROVAL_PAGE
  };
}
