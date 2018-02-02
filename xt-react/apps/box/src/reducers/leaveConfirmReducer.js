import { NEED_LEAVE_CONFIRM, NO_NEED_LEAVE_CONFIRM } from '../contants/actionTypes';

const leaveConfirm = (state = true, action) => {
  switch (action.type) {
    case NEED_LEAVE_CONFIRM:
      return true;
    case NO_NEED_LEAVE_CONFIRM:
      return false;
    default:
      return state;
  }
};

export default leaveConfirm;

