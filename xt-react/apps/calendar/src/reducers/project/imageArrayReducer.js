import Immutable from 'immutable';

import { convertObjIn } from '../../../../common/utils/typeConverter';
import * as apiUrl from '../../constants/apiUrl';
import * as types from '../../constants/actionTypes';
import { get } from 'lodash';

export default (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.MY_PHOTOS: {
          const data = JSON.parse(get(action, 'response.data'));

          if (data && data.length) {
            const newData = data.filter(m => m.id);
            const newImageArray = state.concat(Immutable.fromJS(convertObjIn(newData)));

            // 去除id为空的images.
            return newImageArray;
          }

          return state;
        }
      }
    }
    case types.SET_IMAGE_ARRAY: {
      const { imageArray } = action;
      if (Immutable.List.isList(imageArray)) {
        return imageArray;
      }
      return state;
    }
    case types.UPLOAD_COMPLETE: {
      const { fields } = action;
      const checkedGuid = (typeof fields.guid) === 'object'
        ? fields.guid.__text.replace(/\s/g, '')
        : fields.guid && fields.guid.replace(/\s/g, '');
      const imageObj = Immutable.Map(convertObjIn({
        id: fields.imageId,
        guid: checkedGuid,
        encImgId: fields.encImgId,
        name: fields.name,
        height: fields.height,
        width: fields.width,
        uploadTime: fields.uploadTime,
        order: state.size,
        shotTime: fields.shotTime,
        orientation:fields.orientation
      }));

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
