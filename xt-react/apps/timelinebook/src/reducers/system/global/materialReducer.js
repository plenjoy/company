import { fromJS } from 'immutable';
import * as types from '../../../constants/actionTypes';

const imgObj = {
  img: null,
  base64: null,
  size: { width: 0, height: 0 },
  paddings: { top: 0, right: 0, bottom: 0, left: 0 }
};
const initialState = fromJS({
  cover: JSON.parse(JSON.stringify(imgObj)),
  inner: JSON.parse(JSON.stringify(imgObj))
});

const material = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_COVER_MATERIAL: {
      return state.merge({
        cover: action.data
      });
    }
    case types.UPDATE_INNER_MATERIAL: {
      return state.merge({
        inner: action.data
      });
    }
    default:
      return state;
  }
};

export default material;
