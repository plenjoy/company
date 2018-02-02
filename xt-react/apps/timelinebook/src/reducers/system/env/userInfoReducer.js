import { fromJS } from 'immutable';
import { securityString } from '../../../constants/strings';
import { API_SUCCESS } from '../../../constants/actionTypes';
import { GET_SESSION_USER_INFO } from '../../../constants/apiUrl';
import { convertObjIn } from '../../../../../common/utils/typeConverter';

const initialState = fromJS({
  id: -1
});

const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === GET_SESSION_USER_INFO) {
        const result = action.response;
        const user = result.userSessionData.user;
        if (user.id) {
          securityString.set({
            customerId: user.id,
            token: user.authToken, 
            timestamp: user.timestamp
          });
          return state.merge(convertObjIn(user));
        }
        return state.merge(convertObjIn(user), {
          id: -1
        });
      }
      return state;
    default:
      return state;
  }
};

export default userInfo;
