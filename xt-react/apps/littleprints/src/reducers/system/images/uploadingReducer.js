import { merge, set } from 'lodash';
import { guid } from '../../../../../common/utils/math';
import {
  ADD_IMAGES,
  UPDATE_IMAGEID,
  UPLOAD_COMPLETE,
  RETRY_IMAGE,
  UPDATE_PERCENT,
  UPDATE_FIELDS,
  CLEAR_IMAGES,
  DELETE_IMAGE,
  ERROR_TO_FIRST
} from '../../../constants/actionTypes';

/**
 * 处理上传中的图片信息.
 * @param state
 * @param action
 * @returns {*}
 */
const uploading = (state = [], action) => {
  switch (action.type) {
    case ADD_IMAGES: {
      const files = Array.from(action.files);
      const newState = files.map(file => {
        file.guid = guid();
        return {
          file
        };
      });
      return [...state, ...newState];
    }
    case RETRY_IMAGE: {
      const newState = merge([], state);
      const index = newState.findIndex(item => {
        return item.file.guid == action.guid;
      });
      return set(
        newState,
        `${index}`,
        merge({}, newState[index], {
          retryCount: newState[index].retryCount
            ? newState[index].retryCount + 1
            : 1
        })
      );
    }
    case CLEAR_IMAGES: {
      return [];
    }
    case DELETE_IMAGE: {
      const index = state.findIndex(item => {
        return item.file.guid === action.guid;
      });
      let newState = merge([], state);
      if (index !== -1) {
        newState = [...state.slice(0, index), ...state.slice(index + 1)];
      }
      return newState;
    }
    case ERROR_TO_FIRST: {
      const index = state.findIndex(item => {
        return item.imageId == action.imageId;
      });
      const copyState = merge([], state);
      const errorItem = copyState.splice(index, 1);
      copyState.unshift(errorItem[0]);
      return copyState;
    }
    case UPLOAD_COMPLETE: {
      const { fields } = action;
      const index = state.findIndex(item => {
        return item.file.guid === fields.guid;
      });

      if (index !== -1) {
        return [...state.slice(0, index), ...state.slice(index + 1)];
      }
      return state;
    }
    default: {
      return state;
    }
  }
};

export default uploading;
