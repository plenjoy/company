import { get } from 'lodash';
import { hexToDec, decToHex } from '../../../common/utils/math';
import projectParser from '../../../common/utils/projectParser';
import { configurableOptionArray, allOptionMap, variableArray } from '../reducers/project/projectReducer';

/**
 * 获取spec中, 指定封面的全名.
 * @param  {string} coverType i.e. 'LBHC'
 * @return {[type]}           [description]
 */
export const getCoverFullName = (coverType) => {
  let fullName = '';

  const covers = get(allOptionMap, 'cover');
  if (covers && covers.length && coverType) {
    const cover = covers.find(m => m.id === coverType);
    if (cover) {
      fullName = cover.name;
    }
  }

  return fullName;
};

/**
 * 获取colorscheam列表.
 * @return {[type]} [{id: 'ColorScheme0', value: '#ffffff'}]
 */
export const getColorSchemaList = () => {
  const colorScheme = get(allOptionMap, 'colorScheme');

  if (colorScheme && colorScheme.length) {
    return colorScheme.map((schema) => {
      // 转换成这种结构: #ffffff;
      schema.value = decToHex(hexToDec(schema.value));
      return schema;
    });
  }

  return [];
};
