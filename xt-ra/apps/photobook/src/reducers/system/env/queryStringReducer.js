import { Map } from 'immutable';
import { PARSER_QUERYSTRING } from '../../../contants/actionTypes';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

const initValues = Map({
  // 从my projects过来时, 会传递这些参数.
  initGuid: -1,
  webClientId: 1,
  isParentBook: false,
  redirectParentBook: false
});

/**
 * cookies的reducer, 把新获取的cookie更新到store.
 * @param state
 * @param action
 */
const qs = (state = initValues, action) => {
  switch (action.type) {
    case PARSER_QUERYSTRING:
      return state.merge(convertObjIn(action.value));
    default:
      return state;
  }
};

export default qs;
