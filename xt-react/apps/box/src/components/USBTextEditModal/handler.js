import { template } from 'lodash';
import * as apiUrl from '../../contants/apiUrl';

export const getFontOptionList = (urls, fontList) => {
  if(!urls) return [];

  const avaiableFontList = fontList.filter(font => !font.deprecated);

  const fontOptionList = avaiableFontList.map((font) => {
    return {
      disabled: font.deprecated,
      title: font.displayName,
      label: font.displayName,
      value: font.id,
      fontThumbnailUrl: template(apiUrl.GET_FONT_THUMBNAIL)({
        baseUrl: urls.baseUrl,
        fontName: font.name
      })
    };
  });

  return fontOptionList;
}

export const getFontWeightList = (selectedFont) => {
  return selectedFont.font.map((o) => {
    const displayName = o.displayName.replace(/\s*\d+/, '');
    return {
      disabled: selectedFont.deprecated,
      title: displayName,
      label: displayName,
      value: o.id,
      weight: o.weight,
      fontFamily: o.fontFamily
    };
  });
}