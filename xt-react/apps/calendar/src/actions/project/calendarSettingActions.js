import Immutable from 'immutable';
import { get } from 'lodash';
import * as types from '../../constants/actionTypes';

import { getDataFromState } from '../../utils/getDataFromState';
import { elementTypes, pageStepMap } from '../../constants/strings';

export function changeCalendarSetting(calendarSetting) {
  return (dispatch, getState) => {
    if ('startMonth' in calendarSetting) {
      dispatch({
        type: types.CHANGE_CALENDAR_SETTING,
        calendarSetting: Immutable.fromJS(calendarSetting)
      });
      let pageArray = get(getState(), 'project.data.pageArray');
      const { startMonth, startYear } = calendarSetting;
      const setting = get(getState(), 'project.data.setting');
      const productType = setting.get('product');
      const pageStep = pageStepMap[productType];
      pageArray = pageArray.map((page, index) => {
        const addMonth = Math.floor(index / pageStep);
        const targetMonth = startMonth - 0 + addMonth;
        const pageMonth = targetMonth > 12 ? targetMonth - 12 : targetMonth;
        const pageYear = targetMonth > 12 ? startYear - 0 + 1 : startYear;
        page = page.set('month', pageMonth);
        page = page.set('year', pageYear);
        let pageElements = page.get('elements');
        if (pageElements && pageElements.size) {
          pageElements = pageElements.map((element) => {
            if (element.get('type') === elementTypes.calendar) {
              element = element.set('month', pageMonth);
              element = element.set('year', pageYear);
              return element;
            }
            return element;
          });
        }
        return page.set('elements', pageElements);
      });

      dispatch({
        type: types.SET_PAGE_ARRAY,
        pageArray
      });
    }
  };
}
