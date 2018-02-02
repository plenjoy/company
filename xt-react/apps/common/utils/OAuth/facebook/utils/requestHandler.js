import qs from 'qs';

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

  return new Promise((resolve, reject) => {
    FB.api(fullUrl, 'GET', {}, response => resolve(response));
  })
}