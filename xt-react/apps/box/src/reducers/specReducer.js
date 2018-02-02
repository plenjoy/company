import { merge, get } from 'lodash';
import { API_SUCCESS } from '../contants/actionTypes';
import { GET_SPEC_DATA } from '../contants/apiUrl';

import specParser from '../../common/utils/specParser';

const spec = (state = {}, action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        // 从服务器获取到spec.xml数据后，将xml数据转化为js对象
        case GET_SPEC_DATA: {
          const specObj = get(action, 'response.product-spec');

          return merge({}, state, {
            __originalData__: specObj,
            version: get(specObj, 'version'),
            dpi: get(specObj, 'global.dpi'),
            imageQualityBufferPercent: get(specObj,
              'global.imageQualityBufferPercent'),
            allOptionMap: specParser.prepareOptionGroup(specObj)
          });
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
};


export default spec;
