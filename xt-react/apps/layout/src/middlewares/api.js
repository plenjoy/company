import 'isomorphic-fetch';
import { template } from 'lodash';
import { API_REQUEST, API_SUCCESS, API_FAILURE } from '../constants/actionTypes';
import x2jsInstance from '../../../common/utils/xml2js';

function callApi(apiPattern, options) {
  const fullUrl = template(apiPattern.name)(apiPattern.params);

  const defaultOptions = {
    method: 'GET',
    credentials: 'same-origin'
  };

  return fetch(
    fullUrl,
    Object.assign({}, defaultOptions, options)
  ).then(response => response.text().then(text => ({ text, response })))
    .then(({ text, response }) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      let outObj = null;
      try {
        outObj = JSON.parse(text);
      } catch (e) {
        outObj = x2jsInstance.xml2js(text);
      } finally {
        return outObj;
      }
    });
}

export const CALL_API = Symbol('Call API');

export default store => next => (action) => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { apiPattern, options } = callAPI;


  next({
    apiPattern,
    type: API_REQUEST,
    options
  });

  return callApi(apiPattern, options).then(
    (response) => {
      next({
        apiPattern,
        type: API_SUCCESS,
        response
      });
      return response;
    },
    (result) => {
      next({
        apiPattern,
        type: API_FAILURE,
        result
      });
      return result;
    }
  );
};
