import { get } from 'lodash';

import * as types from '../constants/actionTypes';

import specParser from '../../../common/utils/specParser';

import devSpecData from 'raw!../../../common/sources/photobookSpec.xml';
import x2jsInstance from '../../../common/utils/xml2js';

export function getSpecData() {
  return (dispatch, getState) => {
    const specData = x2jsInstance.xml2js(devSpecData);
    if (specData) {
      const specObj = get(specData, 'product-spec');
      const configurableOptionArray = specParser.prepareConfigurableOptionMap(
        specObj
      );
      const allOptionMap = specParser.prepareOptionGroup(specObj);
      const parameterArray = specParser.prepareParameters(specObj);
      const variableArray = specParser.prepareVariables(specObj);
      const disableOptionArray = specParser.prepareDisableOptionMap(specObj);

      dispatch({
        type: types.INIT_SPEC_DATA,
        configurableOptionArray,
        allOptionMap,
        parameterArray,
        variableArray,
        disableOptionArray,
        version: specObj.version
      });
    }

    return Promise.resolve();
  };
}
