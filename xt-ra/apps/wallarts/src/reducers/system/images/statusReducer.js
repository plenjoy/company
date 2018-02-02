import { get, set } from 'lodash';
import * as types from '../../../constants/actionTypes';

const status = (state = { total: 0, errored: 0, uploaded: 0 }, action) => {
  switch (action.type) {
    case types.ADD_STATUS_COUNT: {
      const { params } = action;
      const { fieldName, count } = params;
      const fieldValue = get(state, fieldName);
      const newState = set(state, fieldName, fieldValue + count);
      return newState;
    }
    case types.UPDATE_STATUS_COUNT: {
      const { params } = action;
      const { fieldName, count } = params;
      const fieldValue = get(state, fieldName);
      const newState = set(state, fieldName, count);
      return newState;
    }
    case types.RESET_STATUS_COUNT: {
      return {
        total: 0,
        errored: 0,
        uploaded: 0
      };
    }
    default: {
      return state;
    }
  }
}

export default status;
