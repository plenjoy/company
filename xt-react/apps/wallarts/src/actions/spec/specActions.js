import { get } from 'lodash';
import Immutable from 'immutable';
import * as types from '../../constants/actionTypes';

import { computeNewData } from '../project/settingActions';
import { getDataFromState } from '../../utils/getDataFromState';

import specParser from '../../../../common/utils/specParser';
import devSpecData from 'raw!../../sources/spec.xml';
import x2jsInstance from '../../../../common/utils/xml2js';

/**
 * action, 获取用户的会话信息
 */
export function getSpecData() {
  //  这一步有问题， 请求的是 photobook 的版本信息。
  return (dispatch, getState) => {
    const specData = x2jsInstance.xml2js(devSpecData);
    if (specData) {
      const specObj = get(specData, 'product-spec');
      const configurableOptionArray = specParser
      .prepareConfigurableOptionMap(specObj);
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
      const isNewProject = (property.get('projectId') === -1);

      if (!isPreview && isNewProject) {
        const result = Immutable.fromJS(computeNewData(newStateData));

        dispatch({
          type: types.INIT_PROJECT_SETTING,
          setting: result.get('setting')
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
          type: types.SET_OPTION_MAP,
          availableOptionMap: result.get('availableOptionMap')
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
