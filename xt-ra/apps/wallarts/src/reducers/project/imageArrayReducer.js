import Immutable from 'immutable';
import { convertObjIn } from '../../../../common/utils/typeConverter';
import { unique } from '../../../../common/utils/immutableHelper';
import * as apiUrl from '../../constants/apiUrl';
import * as types from '../../constants/actionTypes';
import { get } from 'lodash';

export default (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.MY_PHOTOS: {
          const data = JSON.parse(get(action, 'response.data'));
          const newImageArray = state.concat(Immutable.fromJS(convertObjIn(data)));
          console.log('newImageArray',newImageArray);
          return newImageArray;
        }
      }
    }
    case types.SET_IMAGE_ARRAY: {
      const { imageArray } = action;
      if (Immutable.List.isList(imageArray)) {
        let newState = state.concat(imageArray);
        // 给所有图片加一个orientation字段如果没有的话.
        newState = newState.map((m) => {
          if (!m.get('orientation')) {
            return m.set('orientation', 0);
          }

          return m;
        });
        // 去重.
        return unique(newState, (m, n) => m.get('encImgId') === n.get('encImgId'));
      }
      return state;
    }
    case types.UPLOAD_COMPLETE: {
      const { fields } = action;
      const imageObj = Immutable.Map(convertObjIn({
        id: fields.imageId,
        imageid: fields.imageId,
        guid: fields.guid,
        encImgId: fields.encImgId,
        name: fields.name,
        height: fields.height,
        width: fields.width,
        uploadTime: fields.uploadTime,
        order: state.size,
        orientation: fields.orientation,
        shotTime: fields.shotTime
      }));
      console.log('imageObj',imageObj);
      return state.push(imageObj);
    }
    case types.DELETE_PROJECT_IMAGE: {
      const { encImgId } = action;
      return state.filter((image) => {
        return image.get('encImgId') !== encImgId;
      });
    }
    default:
      return state;
  }
};
