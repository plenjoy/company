import projectParser from '../../../common/utils/projectParser';
import OptionConfig from '../../contants/OptionConfig';

/**
 * 找到当前项目setting的OptionConfig
 * @param {*} setting 
 */
const findProjectOptionConfig = (setting) => {
  return OptionConfig.find(config => config.product === setting.product).optionIds;
}

/**
 * 判断这个option是否被选中，选中的option设置isSelected为true
 * @param {*} settingValue
 * @param {*} option
 */
const formatSelectedOption = (settingValue, option) => {
  if(option.id === settingValue) {
    option.isSelected = true;
  } else {
    option.isSelected = false;
  }

  return option;
}

/**
 * 判断这个option是否有VariablesAsset与其对应，对应的VariablesAsset值会被合进option里面
 * @param {*} settingType 
 * @param {*} options 
 * @param {*} variableArray 
 */
const formatOptionsAsset = (assetName, setting, settingType, option, variableArray) => {
  // 从variableArray里面把Asset取出
  const variables = projectParser.getVariables(
    {...setting, [settingType]: option.id},
    variableArray
  )[assetName];

  // 把Asset写进option里
  return {...option, ...variables};
}

/**
 * 对option做一些数据预处理
 * @param {*} settingType 
 * @param {*} setting 
 * @param {*} options 
 * @param {*} variableArray 
 */
const formatOptions = (settingType, setting, options, variableArray) => {
  const settingValue = setting[settingType];

  return options.map(option => {
    // 选中的option置为isSelected = true
    option = formatSelectedOption(settingValue, option);

    // 如果是leatherColor，则获取每个leatherColor option的缩略图asset
    if(settingType === 'leatherColor') {
      option = formatOptionsAsset('coverAsset', setting, settingType, option, variableArray);
    }
    return option;
  })
}

/**
 * 测试方法：在开发模式下把product加入可选项，数据为假数据
 */
const addProductOptionArray = (allOptionMap) => {
  return ['product', allOptionMap.product];
}

/**
 * 对项目的Setting做hot reset重置
 * @param {*} setting 
 */
export const resetSettingHandler = (setting) => {
  let newSetting = {...setting};

  return newSetting;
}

/**
 * 从contants设置里面获取可用的options
 * @param {*} setting 
 * @param {*} configurableOptionArray 
 * @param {*} allOptionMap 
 */
export const getProjectAvailableOptions = (setting, configurableOptionArray, allOptionMap, variableArray) => {
  // 获取项目的OptionConfig以及spec的optionMap
  const optionMaps = [];
  const configs = findProjectOptionConfig(setting);
  let optionMapArray = Object.entries(projectParser.getAvailableOptionMap(setting, configurableOptionArray, allOptionMap));

  // 开发模式下注入product选项
  // optionMapArray = [addProductOptionArray(allOptionMap), ...optionMapArray];

  // 遍历optionMapArray，把OptionConfig允许显示的项过滤出来，并且重置title
  for(const config of configs) {
    for(const [optionType, options] of optionMapArray) {
      if(config.type === optionType) {
        optionMaps.push({
          type: config.type,
          title: config.title,
          showHr: config.showHr,
          options: formatOptions(optionType, setting, options, variableArray)
        });
      }
    }
  }

  return optionMaps;
}
