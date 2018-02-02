import { get } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import { GET_SPEC_VERSION_DATA } from '../../contants/apiUrl';
import { GET_SPEC_DATA } from '../../contants/actionTypes';

import devSpecData from 'raw!../../sources/spec.xml';
import x2jsInstance from '../../../../common/utils/xml2js';

export function getSpecData() {
  return (dispatch, getState) => {
      const specObj = x2jsInstance.xml2js(devSpecData);
      dispatch({
        type: GET_SPEC_DATA,
        response: specObj
      });

      return Promise.resolve();
  };
}
