import { merge } from 'lodash';

import { API_SUCCESS } from '../../../contants/actionTypes';
import { GET_STICKER_LIST } from '../../../contants/apiUrl';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

const stickerList = (state=[], action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name){
        case GET_STICKER_LIST:
          const { response } = action;
          return merge([], convertObjIn(response.result.decorate.items.item));
        default:
          return state;
      }
    default:
      return state;
  }
}

export default stickerList;
