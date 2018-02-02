import {
  merge
} from 'lodash';

import {
  API_SUCCESS,
  SET_TEMPLATE_LIST
} from '../../../constants/actionTypes';
import {
  GET_TEMPLATE_LIST
} from '../../../constants/apiUrl';
import {
  convertObjIn
} from '../../../../../common/utils/typeConverter';

const defaultState = {
  coverTemplateList: [],
  innerTemplateList: [],
  coverDefaultTemplateGuid: '',
  innerDefaultTemplateGuid: ''
};

const templateList = (state = defaultState, action) => {
  switch (action.type) {
    // case API_SUCCESS:
    //   {
    //     switch (action.apiPattern.name) {
    //       case GET_TEMPLATE_LIST:
    //         {
    //           const {
    //             response
    //           } = action;

    //           const resTemplateList = convertObjIn(response.result.list.template);

    //           return merge([], resTemplateList);
    //         }

    //       default:
    //         return state;
    //     }
    //   }
    case SET_TEMPLATE_LIST:
      const newList = {};
      merge(newList, action.ListInfo);
      return newList;
    default:
      return state;
  }
};

export default templateList;
