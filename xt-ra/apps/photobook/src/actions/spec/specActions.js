import Immutable from 'immutable';

import { get } from 'lodash';
import * as types from '../../contants/actionTypes';
import { getDataFromState } from '../../utils/getDataFromState';

import { computeNewData } from '../project/settingActions';

import specParser from '../../../../common/utils/specParser';

import devSpecData from 'raw!../../../../common/sources/photobookSpec.xml';
import x2jsInstance from '../../../../common/utils/xml2js';

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

      const newStateData = getDataFromState(getState());
      const { property, queryStringObj } = newStateData;

      const isPreview = queryStringObj.get('isPreview');
      const isNewProject =
        (property.get('projectId') === -1 && !property.get('bookThemeId')) ||
        (property.get('bookThemeId') &&
          queryStringObj.get('product') &&
          queryStringObj.get('size'));

      if (!isPreview && isNewProject) {
        const result = Immutable.fromJS(computeNewData(newStateData));

        dispatch({
          type: types.INIT_PROJECT_SETTING,
          setting: result.get('setting')
        });

        dispatch({
          type: types.SET_COVER,
          cover: result.get('cover')
        });

        dispatch({
          type: types.SET_PAGE_ARRAY,
          pageArray: result.get('pageArray')
        });

        dispatch({
          type: types.SET_VARIABLE_MAP,
          variableMap: result.get('variableMap')
        });

        dispatch({
          type: types.SET_PARAMETER_MAP,
          parameterMap: result.get('parameterMap')
        });
      }
    }

    return Promise.resolve();
  };
}
