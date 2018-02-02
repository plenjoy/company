import { toDecode, isEncode, toEncode } from '../../../common/utils/encode';
import { hexString2Number } from '../../../common/utils/colorConverter';
import * as apiUrls from '../constants/apiUrl';
import { getPxByPt } from '../../../common/utils/math';
import { template } from 'lodash';
import qs from 'qs';

export async function getTextBlobSrc(baseUrl, params, isWithoutSize) {
  const paramsObj = getEncodeTextParams(params.toJS());
  
  if(isWithoutSize) {
    delete paramsObj.height;
    delete paramsObj.width;
  }

  const fullUrl = template(apiUrls.LTB_PRAINTEDTEXT_SRC)({ baseUrl });
  // const fullUrl = template(apiUrls.EMOJI_TEXT_SRC)({ baseUrl });
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
      body: qs.stringify(paramsObj)
    }));
  };

  const response = await promisePool.loadPromiseProducer(promiseProducer);

  return URL.createObjectURL(await response.blob());
}

export function getEncodeTextParams(params) {
  return {
    width: params.width,
    height: params.height,
    fontSize: params.fontSize,
    color: hexString2Number(params.fontColor),
    font: params.fontFamily,
    align: params.textAlign,
    verticalTextAlign: params.verticalTextAlign,
    text: params.text,
    ratio: params.ratio
  };
}