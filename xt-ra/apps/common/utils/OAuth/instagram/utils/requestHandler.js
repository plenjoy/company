import qs from 'qs';
import jsonp from '../../../jsonp';

export function cancelRequest() {
  this.isCancelRequest = true;
}

export function clearPendingRequest() {
  this.isCancelRequest = false;
}

export function request(baseUrl, params) {
  let fullUrl = params
    ? `${baseUrl}?${qs.stringify(params)}`
    : baseUrl;

  return jsonp(fullUrl);
}