import { get } from 'lodash';

import * as types from '../constants/actionTypes';
import * as apiUrl from '../constants/apiUrl';

import { convertObjIn } from '../../../common/utils/typeConverter';

const tagList = (state = [], action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.GET_TAG_LIST: {
          const data = get(action, 'response.data');
          if (data) {
            return convertObjIn(JSON.parse(data));
          }

          return state;
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

export default tagList;
