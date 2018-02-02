import Immutable from 'immutable';

import { pick } from 'lodash';

import * as types from '../../constants/actionTypes';
import { getQueryStingObj } from '../../utils/url';

const queryStringObj = getQueryStingObj();

const settingObj = pick(
  queryStringObj,
  [
    'size', 'product', 'numberOfMonth'
  ]
);

const initialState = Immutable.Map(
  Object.assign({}, settingObj, { orientation: 'Portrait' })
);


export default (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_PROJECT_SETTING:
    case types.CHANGE_PROJECT_SETTING: {
      return state.merge(action.setting);
    }
    default:
      return state;
  }
};
