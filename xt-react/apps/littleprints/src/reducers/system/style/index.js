import {
  API_SUCCESS
} from '../../../constants/actionTypes';
import {
  GET_STYLE_LIST
} from '../../../constants/apiUrl';

import {
  merge,
  get
} from 'lodash';

import {
  convertObjIn
} from '../../../../../common/utils/typeConverter';

const styles = (state = [], action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_STYLE_LIST:

          const {
            response
          } = action;

          const resStyleList = convertObjIn(response.styles.style);

          return merge([], resStyleList);

        default:
          return state;
      }
    default:
      return state;
  }
};

export default styles;
