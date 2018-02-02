import { merge, get, forEach, isEmpty, isArray } from 'lodash';

import { convertObjIn } from '../utils/typeConverter';

/**
 * 检测setting对象中的属性是否和key对象里面的规则相匹配
 *
 * @param      {object}   setting  [description]
 * @param      {object}   entry    [description]
 * @return     {Boolean}  [description]
 */
const isEntryMatched = (setting, entry) => {
  let isMatched = true;

  forEach(entry.key, (value, key) => {
    if (value.indexOf(setting[key]) === -1 && value.indexOf('*') === -1) {
      isMatched = false;
      return false;
    }
  });

  return isMatched;
};

/**
 * 根据当前的projectSetting对象，从configurableOptionArray中
 * 获取其他的setting属性（取默认值，若当前值在可选项中，则不修改）
 *
 * @param      {object}  setting                  [description]
 * @param      {array}   configurableOptionArray  [description]
 * @return     {object}  [description]
 */
const getProjectSetting = (setting, configurableOptionArray) => {
  if (isEmpty(setting)) {
    return {};
  }
  if (!isArray(configurableOptionArray) || !configurableOptionArray.length) {
    return setting;
  }
  const outSetting = merge({}, setting);
  const sortableConfigurableOptionArray =
  configurableOptionArray.map((optionMap) => {
    return {
      ...optionMap,
      count: 0
    };
  });

  sortableConfigurableOptionArray.forEach((optionMap) => {
    optionMap.keyPattern.forEach((key) => {
      const theOption = sortableConfigurableOptionArray.find((option) => {
        return option.id === key;
      });
      if (theOption) {
        theOption.count += 1;
      }
    });
  });

  const sortedConfigurableOptionArray = sortableConfigurableOptionArray.sort((a, b) => {
    return b.count - a.count;
  });

  sortedConfigurableOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      const isMatched = isEntryMatched(outSetting, entry);

      if (isMatched) {
        const defaultValue = entry.defaultValue;
        const oldValue = outSetting[optionMap.id];
        if (entry.value.indexOf(oldValue) === -1) {
          outSetting[optionMap.id] = get(defaultValue, '0') ||
            get(entry, 'value.0');
        }
      }
    });
  });

  return outSetting;
};

const getParameters = (setting, parameterArray) => {
  if (isEmpty(setting) || !parameterArray) {
    return {};
  }
  const outParameters = {};

  const sortedParameterArray = parameterArray.sort((a, b) => {
    return a.keyPattern.length - b.keyPattern.length;
  });

  sortedParameterArray.forEach((parameter) => {
    parameter.entry.forEach((entry) => {
      const isMatched = isEntryMatched(setting, entry);

      if (isMatched) {
        const outObj = {};
        forEach(entry, (v, k) => {
          if (k !== 'key') {
            if (isArray(v) && v.length === 1) {
              outObj[k] = v[0];
            } else {
              outObj[k] = v;
            }
          }
        });
        const convertedOutObj = convertObjIn(outObj);
        const keys = Object.keys(convertedOutObj);
        if (keys.length > 1) {
          outParameters[parameter.id] = convertedOutObj;
        } else {
          outParameters[parameter.id] = convertedOutObj[keys[0]];
        }
      }
    });
  });

  return outParameters;
};

const getVariables = (setting, variableArray) => {
  return getParameters(setting, variableArray);
};


/**
 * 根据当前用户选择的产品，从spec中获取对应的project初始属性
 *
 * @param      {object}  projectObj               project的初始属性
 * @param      {array}   configurableOptionArray  spec中解析得到的新数组
 * @return     {object}  完整的projectSetting对象
 */
const getDefaultProjectSetting = (projectObj, configurableOptionArray) => {
  const outObj = merge({}, projectObj);
  const singleKeyPatternOptionArray = configurableOptionArray.filter((obj) => {
    return obj.keyPattern.length === 1;
  });

  singleKeyPatternOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      entry.value.forEach((v) => {
        if (v === projectObj[optionMap.id]) {
          const onlyKeyPattern = optionMap.keyPattern[0];
          if (!outObj[onlyKeyPattern]) {
            outObj[onlyKeyPattern] = entry.key[onlyKeyPattern][0];
          }
        }
      });
    });
  });

  const setting = getProjectSetting(outObj, configurableOptionArray);

  return merge({}, outObj, setting);
};

/**
 * 根据当前的setting生成对应的project参数选项
 *
 * @param      {object}  setting                  [description]
 * @param      {array}   configurableOptionArray  [description]
 * @param      {object}  allOptionMap             The option group
 * @return     {object}  [返回一个hashMap]
 */
const getAvailableOptionMap = (setting,
                               configurableOptionArray,
                               allOptionMap) => {
  const outMap = {};
  configurableOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      const isMatched = isEntryMatched(setting, entry);

      if (isMatched) {
        const theOptionArray = allOptionMap[optionMap.id];

        // 对结果按spec中写定的顺序进行排序
        const outArray = [];
        entry.value.forEach((id) => {
          const outValue = theOptionArray.find((theOption) => {
            return theOption.id === id;
          });
          outArray.push(outValue);
        });

        outMap[optionMap.id] = outArray;
      }
    });
  });

  return outMap;
};

/**
 * 根据当前的setting生成对应的disable选项
 *
 * @param      {object}  setting             The setting
 * @param      {array}   disableOptionArray  The disable option array
 * @return     {object}  The disable option map.
 */
const getDisableOptionMap = (setting, disableOptionArray) => {
  const outMap = {};
  disableOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      const isMatched = isEntryMatched(setting, entry);

      if (isMatched) {
        outMap[optionMap.id] = entry.value;
      }
    });
  });

  return outMap;
};


/**
 * 根据当前的optionMap对象递归找到所有受影响的optionMap
 *
 * @param      {object}  optionMap                当前受影响的optionMap
 * @param      {array}   configurableOptionArray  从spec解析出来的optionArray
 * @param      {array}   resultArray              存放受影响的optionMap的结果集
 * @return     {array}   [description]
 */
const getAffectedConfigurableOptionArray = (optionMap,
                                            configurableOptionArray,
                                            resultArray) => {
  configurableOptionArray.forEach((o) => {
    if (o.keyPattern.indexOf(optionMap.id) !== -1) {
      const existsOptionMap = resultArray.find((result) => {
        return result.id === o.id;
      });
      if (!existsOptionMap) {
        resultArray.push(o);
      }
      getAffectedConfigurableOptionArray(o, configurableOptionArray, resultArray);
    }
  });

  return resultArray;
};

const getNewProjectSetting = (
  oldSetting, newSetting, configurableOptionArray
) => {
  const shadowAffectedSettingKeys = Object.keys(newSetting);
  const shadowAffectedConfigurableOptionArray = [];

  configurableOptionArray.forEach((optionMap) => {
    forEach(shadowAffectedSettingKeys, (settingKey) => {
      if (optionMap.keyPattern.indexOf(settingKey) !== -1) {
        shadowAffectedConfigurableOptionArray.push(optionMap);
      }
    });
  });

  const deepAffectedConfigurableOptionArray =
    shadowAffectedConfigurableOptionArray.concat([]);
  shadowAffectedConfigurableOptionArray.forEach((optionMap) => {
    getAffectedConfigurableOptionArray(
      optionMap,
      configurableOptionArray,
      deepAffectedConfigurableOptionArray
    );
  });

  const mergedSetting = merge({}, oldSetting, newSetting);

  const allNewSetting = getProjectSetting(
    mergedSetting, deepAffectedConfigurableOptionArray
  );

  return merge({}, mergedSetting, allNewSetting);
};


export default {
  isEntryMatched,
  getParameters,
  getVariables,
  getProjectSetting,
  getDefaultProjectSetting,
  getNewProjectSetting,
  getAvailableOptionMap,
  getDisableOptionMap
};
