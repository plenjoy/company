import qs from 'qs';
import 'isomorphic-fetch';

export function cancelRequest() {
  this.isCancelRequest = true;
}

export function addRequestToPending() {
  this.pendingRequestCount++;
}

export function clearPendingRequest() {
  this.pendingRequestCount = 0;
  this.isCancelRequest = false;
}

export function request(url, params) {

  const basicParams = {
    alt: 'json',
    access: 'all',
    access_token: this.accessToken
  };

  const paramStr = qs.stringify({...basicParams, ...params});
  const fullUrl = `${url}?${paramStr}`;

  return fetch(fullUrl);
}
