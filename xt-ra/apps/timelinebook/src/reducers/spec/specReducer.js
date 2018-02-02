import { fromJS } from 'immutable';
import { get, set } from 'lodash';
import { API_SUCCESS } from '../../constants/actionTypes';
import { GET_SPEC } from '../../constants/apiUrl';
import { convertObjIn } from '../../../../common/utils/typeConverter';
import { getPxByInch } from '../../../../common/utils/math';

const initialState = fromJS({});

const spec = (state = initialState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === GET_SPEC) {
        const { cover, size } = action.apiPattern.params;

        const result = action.response;
        const status = get(result, 'state');
        const data = get(result, 'data');

        const newData = convertObjIn(data);

        if (status === 'success') {
          const specData = newData.spec;
          const parameters = newData.parameters;

          // bookBaseSize转为px.
          const heightInInch = get(parameters, 'bookBaseSize.heightInInch');
          const widthInInch = get(parameters, 'bookBaseSize.widthInInch');
          set(parameters, 'bookBaseSize.height', getPxByInch(heightInInch));
          set(parameters, 'bookBaseSize.width', getPxByInch(widthInInch));

          const newState = state.setIn([size, cover], fromJS({
            spec: specData,
            parameters
          }));

          return newState;
        }

        return state;
      }

      return state;
    default:
      return state;
  }
};

export default spec;
