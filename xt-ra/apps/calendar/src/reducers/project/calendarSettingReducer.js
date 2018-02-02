import Immutable from 'immutable';
import { get } from 'lodash';

import { CHANGE_CALENDAR_SETTING, INIT_CALENDAR_SETTING } from '../../constants/actionTypes';

import { getQueryStingObj } from '../../utils/url';

const queryStringObj = getQueryStingObj();

const initialState = Immutable.fromJS({
  styleId: 'null',
  startYear: '2018',
  startMonth: '1'
});

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_CALENDAR_SETTING:
    case CHANGE_CALENDAR_SETTING: {
      return state.merge(action.calendarSetting);
    }
    default:
      return state;
  }
};
