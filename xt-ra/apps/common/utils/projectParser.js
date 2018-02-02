import { merge, get, forEach, isEmpty, isArray, intersection } from 'lodash';

import { convertObjIn } from '../utils/typeConverter';

/**
 * 检测setting对象中的属性是否和key对象里面的规则相匹配
 *
 * @param      {object}   setting  [description]
 * @param      {object}   entry    [description]
 * @return     {Boolean}  [description]
 */
function isEntryMatched(setting, entry) {
  let isMatched = true;

  forEach(entry.key, (value, key) => {
    if (value.indexOf(setting[key]) === -1 && value.indexOf('*') === -1) {
      isMatched = false;
      return false;
    }
  });

  return isMatched;
}

function getNewValue(entry, oldValue, optionArray) {
  const defaultValueArray = entry.defaultValue;
  const newValue = get(defaultValueArray, '0') || get(entry, 'value.0');

  if (optionArray) {
    const oldOption = optionArray.find(o => o.id === oldValue);
    if (oldOption) {
      const otherSameNameOptionArray = optionArray.filter((o) => {
        return o.id !== oldOption.id && o.name && o.name === oldOption.name;
      });
      const otherSameNameIdArray = otherSameNameOptionArray.map(o => o.id);
      const result = intersection(otherSameNameIdArray, entry.value);
      if (result.length) {
        return result[0];
      }
    }
  }

  if (entry.value.indexOf(oldValue) === -1) {
    return newValue;
  }

  return null;
}

/**
 * 根据当前的projectSetting对象，从configurableOptionArray中
 * 获取其他的setting属性（取默认值，若当前值在可选项中，则不修改）
 *
 * @param      {object}  setting                  [description]
 * @param      {array}   configurableOptionArray  [description]
 * @param      {object}  allOptionMap             All option map
 * @return     {object}  [description]
 */
function getProjectSetting(setting, configurableOptionArray, allOptionMap) {
  if (isEmpty(setting)) {
    return {};
  }
  if (!isArray(configurableOptionArray) || !configurableOptionArray.length) {
    return setting;
  }
  const outSetting = merge({}, setting);
  const sortableConfigurableOptionArray = configurableOptionArray.map(
    (optionMap) => {
      return {
        ...optionMap,
        count: 0
      };
    }
  );

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
        const oldValue = outSetting[optionMap.id];

        let optionArray = null;
        if (allOptionMap) {
          optionArray = allOptionMap[optionMap.id];
        }

        const newValue = getNewValue(entry, oldValue, optionArray);
        if (newValue) {
          outSetting[optionMap.id] = newValue;
        }
      }
    });
  });

  return outSetting;
}

function getParameters(setting, parameterArray) {
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
}

function getVariables(setting, variableArray) {
  return getParameters(setting, variableArray);
}

/**
 * 根据当前用户选择的产品，从spec中获取对应的project初始属性
 *
 * @param      {object}  projectObj               project的初始属性
 * @param      {array}   configurableOptionArray  spec中解析得到的新数组
 * @return     {object}  完整的projectSetting对象
 */
function getDefaultProjectSetting(
  projectObj,
  configurableOptionArray,
  allOptionMap
) {
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

  const setting = getProjectSetting(
    outObj,
    configurableOptionArray,
    allOptionMap
  );

  return merge({}, outObj, setting);
}

/**
 * 根据当前的setting生成对应的disable选项
 *
 * @param      {object}  setting             The setting
 * @param      {array}   disableOptionArray  The disable option array
 * @return     {object}  The disable option map.
 */
function getDisableOptionMap(setting, disableOptionArray) {
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
}

/**
 * 根据当前的setting生成可用的选项数据
 *
 * @param      {object}  setting                  [description]
 * @param      {array}   configurableOptionArray  [description]
 * @param      {object}  allOptionMap             The option group
 * @param      {object}  disableOptionArray       The disable option array
 * @return     {object}  [返回一个hashMap]
 */
function getAvailableOptionMap(
  setting,
  configurableOptionArray,
  allOptionMap,
  disableOptionArray
) {
  const outMap = {};
  const disableOptionMap = getDisableOptionMap(setting, disableOptionArray);

  configurableOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      const isMatched = isEntryMatched(setting, entry);

      if (isMatched) {
        const settingKey = optionMap.id;
        const theOptionArray = allOptionMap[settingKey];
        const disableList = disableOptionMap[settingKey] || [];

        const outArray = [];
        entry.value.forEach((id) => {
          let outValue = theOptionArray.find((theOption) => {
            return theOption.id === id;
          });

          outValue = merge({}, outValue, {
            disabled: disableList.indexOf(id) !== -1
          });

          // 若用户当前setting包含disable选项，则生成到数据中，若不包含，则过滤掉。
          if (disableList.indexOf(id) !== -1) {
            if (setting[settingKey] === id) {
              outArray.push(outValue);
            }
          } else {
            outArray.push(outValue);
          }
        });

        outMap[optionMap.id] = outArray;
      }
    });
  });

  return outMap;
}

/**
 * 根据当前的optionMap对象递归找到所有受影响的optionMap
 *
 * @param      {object}  optionMap                当前受影响的optionMap
 * @param      {array}   configurableOptionArray  从spec解析出来的optionArray
 * @param      {array}   resultArray              存放受影响的optionMap的结果集
 * @return     {array}   [description]
 */
function getAffectedConfigurableOptionArray(
  optionMap,
  configurableOptionArray,
  resultArray
) {
  configurableOptionArray.forEach((o) => {
    if (o.keyPattern.indexOf(optionMap.id) !== -1) {
      const existsOptionMap = resultArray.find((result) => {
        return result.id === o.id;
      });
      if (!existsOptionMap) {
        resultArray.push(o);
      }
      getAffectedConfigurableOptionArray(
        o,
        configurableOptionArray,
        resultArray
      );
    }
  });

  return resultArray;
}

function getNewProjectSetting(
  oldSetting,
  newSetting,
  configurableOptionArray,
  allOptionMap
) {
  const shadowAffectedSettingKeys = Object.keys(newSetting);
  const shadowAffectedConfigurableOptionArray = [];

  configurableOptionArray.forEach((optionMap) => {
    forEach(shadowAffectedSettingKeys, (settingKey) => {
      if (optionMap.keyPattern.indexOf(settingKey) !== -1) {
        const isExists = shadowAffectedConfigurableOptionArray.find((o) => {
          return o.id === optionMap.id;
        });
        if (!isExists) {
          shadowAffectedConfigurableOptionArray.push(optionMap);
        }
      }
    });
  });

  const deepAffectedConfigurableOptionArray = shadowAffectedConfigurableOptionArray.concat(
    []
  );
  shadowAffectedConfigurableOptionArray.forEach((optionMap) => {
    getAffectedConfigurableOptionArray(
      optionMap,
      configurableOptionArray,
      deepAffectedConfigurableOptionArray
    );
  });

  const mergedSetting = merge({}, oldSetting, newSetting);

  const allNewSetting = getProjectSetting(
    mergedSetting,
    deepAffectedConfigurableOptionArray,
    allOptionMap
  );

  return merge({}, mergedSetting, allNewSetting);
}

function getKeyPatternsByValue(optionId, value, keyPatternName, configurableOptionArray) {
  let outArrar = [];
  configurableOptionArray.some(item => {
    if (item.id === optionId) {
      const entrys = item.entry;
      entrys.forEach(entryItem => {
        if (entryItem.value.indexOf(value) !== -1) {
          outArrar = outArrar.concat(entryItem.key[keyPatternName]);
        }
      });
    }
  });
  return outArrar;
}

export default {
  isEntryMatched,
  getParameters,
  getVariables,
  getProjectSetting,
  getDefaultProjectSetting,
  getNewProjectSetting,
  getAvailableOptionMap,
  getDisableOptionMap,
  getKeyPatternsByValue
};
