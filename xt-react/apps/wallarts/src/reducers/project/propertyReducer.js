import Immutable from 'immutable';
import * as types from '../../constants/actionTypes';
import * as apiUrl from '../../constants/apiUrl';
import { getQueryStingObj } from '../../utils/url';
import { convertObjIn } from '../../../../common/utils/typeConverter';
import securityString from '../../../../common/utils/securityString';
const queryStringObj = getQueryStingObj();
const initGuid = queryStringObj.initGuid;

if(initGuid){
  securityString.encProjectId = initGuid;
}

const initialState = Immutable.Map({
  projectId: +initGuid || -1,
  encProjectIdString: +initGuid ? '' : (initGuid || ''),
  title: queryStringObj.title,
  webClientId: queryStringObj.webClientId,
  isProjectLoadCompleted: false,
  isProjectEdited: false,
  mainProjectUid: queryStringObj.mainProjectUid,
  crossSellMainEncImgId: queryStringObj.encImageId,
  isNewProject: initGuid === -1,
  crossSell: queryStringObj.crossSell,
  createdDate: new Date()
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
    case types.CHANGE_PROJECT_PROPERTY: {
      return state.merge(action.data);
    }
    default:
      return state;
  }
};
