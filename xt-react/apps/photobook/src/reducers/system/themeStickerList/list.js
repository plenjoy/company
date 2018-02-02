import { merge } from 'lodash';

import {
  API_SUCCESS,
  SET_CURRENT_THEME_TYPE
} from '../../../contants/actionTypes';
import { GET_THEME_STICKER_LIST } from '../../../contants/apiUrl';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

const themestickerList = (state = [], action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_THEME_STICKER_LIST: {
          const { response } = action;
          const themestickerListDatas = convertObjIn(
            response.data ? response.data : []
          );

          return themestickerListDatas;
        }
        default:
          return state;
      }
    default:
      return state;
  }
};

export default themestickerList;
