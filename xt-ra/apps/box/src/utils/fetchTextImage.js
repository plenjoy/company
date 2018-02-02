import 'isomorphic-fetch';
import qs from 'qs';
import x2jsInstance from '../../common/utils/xml2js';
import { convertObjIn } from '../../common/utils/typeConverter';
import * as apiUrl from '../contants/apiUrl';

export default (urls, textElement) => {
  if (!urls) {
    return null;
  }

  const {
    fontColor: color,
    textAlign: align,
    fontFamily: font,
    rate: ratio,
    text,
    computed: {height},
    computed: {width}
  } = textElement;

  const encodeText = decodeURIComponent(text);

  return fetch(`${urls.baseUrl}api/product/text/textImage?` + 
    (color || color === 0 ? `color=${color}&` : '') + 
    (align ? `align=${align}&` : '') +
    (font ? `font=${font}&` : '') +
    (text ? `text=${text}&` : '') +
    (height ? `height=${height}&` : '') +
    (width ? `width=${width}&` : ''))
    .then(
      res => res.blob()
    );
};
