import Immutable from 'immutable';

import { pick } from 'lodash';

import * as types from '../../contants/actionTypes';
import { getQueryStingObj } from '../../utils/url';

const queryStringObj = getQueryStingObj();

const settingObj = pick(
  queryStringObj,
  [
    'size', 'paperThickness', 'gilding',
    'paper', 'product', 'cover', 'leatherColor',
    'cameo', 'cameoShape'
  ]
);

const initialState = Immutable.Map(
  Object.assign({}, { client: 'h5' }, settingObj)
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
