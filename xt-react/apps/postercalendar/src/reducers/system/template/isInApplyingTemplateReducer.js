import {merge} from 'lodash';
import { IS_IN_APPLY_TEMPLATE } from '../../../constants/actionTypes';

const isInApplyingTemplate = (state = false, action) => {
  switch (action.type) {
    case IS_IN_APPLY_TEMPLATE:{
      return action.value;
    }
    default:
      return state;
  }
}

export default isInApplyingTemplate;
