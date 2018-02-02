import Immutable from 'immutable';
import * as types from '../../contants/actionTypes';
import * as apiUrl from '../../contants/apiUrl';
import { getQueryStingObj } from '../../utils/url';
import { convertObjIn } from '../../../../common/utils/typeConverter';
import securityString from '../../../../common/utils/securityString';
const queryStringObj = getQueryStingObj();
const initGuid = queryStringObj.initGuid || queryStringObj.mainProjectUid;

const bookThemeId = queryStringObj.themeGuid;
const hasCoverType = !!queryStringObj.cover && !!(queryStringObj.source === 'designer');
 if(initGuid){
  securityString.encProjectId=initGuid
 }
const initialState = Immutable.Map({
  projectId: +initGuid || -1,
  bookThemeId: bookThemeId || '',
  encProjectIdString: +initGuid ? '' : initGuid || '',
  title: queryStringObj.title,
  webClientId: queryStringObj.webClientId,
  isProjectLoadCompleted: false,
  isProjectEdited: false,
  isParentBook: queryStringObj.isParentBook || false,
  hasParentBook: false,
  createdDate: new Date(),
  hasCoverType
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.GET_PROJECT_TITLE: {
          return state.merge({
            title: action.response.projectName
          });
        }
        case apiUrl.HAS_PARENT_BOOK: {
          let hasParentBook = false;

          if (action.response && action.response.data) {
            const responseData = convertObjIn(JSON.parse(action.response.data));
            hasParentBook = responseData.hasParentBook;
          }

          return state.merge({
            hasParentBook
          });
        }
        default:
          return state;
      }
    }
    case types.PROJECT_LOAD_COMPLETED: {
      return state.merge({
        isProjectLoadCompleted: true
      });
    }
    case types.UPDATE_PROJECT_ID: {
      securityString.encProjectId = action.projectId;
      return state.merge({
        projectId: action.projectId
      });
    }
    case types.CHANGE_PROJECT_TITLE: {
      return state.merge({
        title: action.title
      });
    }
    case types.SET_APPLY_BOOK_THEME_ID: {
      return state.merge({
        applyBookThemeId: action.bookThemeId
      });
    }
    default:
      return state;
  }
};
