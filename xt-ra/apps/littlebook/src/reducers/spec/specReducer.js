import { Map } from 'immutable';
import { get } from 'lodash';
import * as types from '../../contants/actionTypes';

import { convertObjIn } from '../../../../common/utils/typeConverter';
import specParser from '../../../../common/utils/specParser';

const specData = (state = Map(), action) => {
  switch (action.type) {
    case types.GET_SPEC_DATA: {
      const specObj = get(action, 'response.product-spec');

      return state.merge({
        __originalData__: specObj,
        version: get(specObj, 'version'),
        dpi: get(specObj, 'global.dpi'),
        imageQualityBufferPercent: get(specObj,
          'global.imageQualityBufferPercent'),
        imagedimenstions: get(specObj,
          'global.imagedimenstions.imagedimenstion'),
        allOptionMap: convertObjIn(specParser.prepareOptionGroup(specObj))
      });
    }
    default:
      return state;
  }
};


export default specData;
