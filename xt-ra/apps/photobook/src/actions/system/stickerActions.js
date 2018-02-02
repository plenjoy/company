import { get } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import { GET_STICKER_LIST } from '../../contants/apiUrl';

export function getStickerList() {
  return (dispatch, getState) => {
    const productBaseURL = get(getState(), 'system.env.urls').get('productBaseURL');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_STICKER_LIST,
          params: {
            productBaseURL,
            autoRandomNum: new Date().getTime()
          }
        }
      }
    });
  };
}

