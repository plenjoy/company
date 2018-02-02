import 'isomorphic-fetch';
import { template } from 'lodash';
import * as apiUrls from '../../../constants/apiUrl';

export async function getTextImageUrl(baseUrl, paramsStr) {
  const fullUrl = template(apiUrls.PAINETEXT_BASESRC)({ baseUrl });
  const defaultOptions = {
    method: 'GET',
    credentials: 'same-origin'
  };

  const promiseProducer = function () {
    return fetch(fullUrl, Object.assign({}, defaultOptions, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: paramsStr
    }));
  };

  const response = await promisePool.loadPromiseProducer(promiseProducer);

  return URL.createObjectURL(await response.blob());
}

export function getParamsStr(props) {
  const { data } = props;
  const { element, env: { urls } } = data;
  const baseUrl = urls.get('baseUrl');
  const computedSize = element.get('computedSize');
  const textBaseUrl = `${template(apiUrls.PAINETEXT_BASESRC)({ baseUrl })}?`;

  return computedSize.get('url').replace(textBaseUrl, '');
}
