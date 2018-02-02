import * as types from '../../contants/actionTypes';


const specData = (state = {}, action) => {
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

      return Object.assign({}, {
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
