import { merge, get } from 'lodash';
import { API_SUCCESS } from '../../contants/actionTypes';
import { GET_SPEC_VERSION_DATA } from '../../contants/apiUrl';

import { convertObjIn } from '../../../../common/utils/typeConverter';

const versions = (state = {}, action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        // 从服务器获取到spec.xml数据后，将xml数据转化为js对象
        case GET_SPEC_VERSION_DATA: {
          const specObj = get(action, 'response.resultData.specVersionData');
          return convertObjIn(specObj);
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
};


export default versions;
