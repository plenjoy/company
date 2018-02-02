import Immutable from 'immutable';
import * as types from '../../constants/actionTypes';


const specData = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.INIT_SPEC_DATA: {
      const {
        configurableOptionArray,
        allOptionMap,
        parameterArray,
        variableArray,
        disableOptionArray,
        version
      } = action;

      return Immutable.fromJS({
        version,
        configurableOptionArray,
        allOptionMap,
        parameterArray,
        variableArray,
        disableOptionArray
      });
    }
    default:
      return state;
  }
};


export default specData;
