import { merge, get, isArray } from 'lodash';
import { numberToHex } from '../../../../../common/utils/colorConverter';
import { API_SUCCESS } from '../../../contants/actionTypes';
import { APPLY_LAYOUT } from '../../../contants/apiUrl';
import { convertResultToJson, formatTemplateInstance } from '../../../utils/template';

import x2jsInstance from '../../../../../common/utils/xml2js';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

const details = (state = {}, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case APPLY_LAYOUT:
          const { response } = action;
          const templateIds = get(action, 'apiPattern.params.templateIds');
          const size = get(action, 'apiPattern.params.size');

          // 把请求返回值中的xml转成json.
          const results = convertResultToJson(response);

          // 格式化template的原始数据, 使它可以在app中可以使用的格式
          const newTemplates = formatTemplateInstance(results, templateIds, size);

          return merge({}, state, ...newTemplates);
        default:
          return state;
      }
    default:
      return state;
  }
}

export default details;
