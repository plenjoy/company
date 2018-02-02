import { merge } from 'lodash';
import projectParser from '../../../../../common/utils/projectParser';

export const proUserOptions = {
  cover: ['MC', 'GM'],
  paper: ['AP'],
  paperThickness: ['Rigid']
};

/**
 * { filterOptionMap } 在取到的 optionMap 中过滤掉 disableOptionMap 的数据。
 *
 * @param      {object}  optionsMap        根据当前 setting 取到的所有可用数据对象
 * @param      {object}  disableOptionMap  根据当前 setting 取到的禁用数据对象
 * @return     {object}  { 返回过滤后的可用数据对象。 }
 */
export const filterOptionMap = (optionsMap, disableOptionMap, setting) => {
  const resMap = merge({}, optionsMap);
  for (const key in resMap) {
    if (key in disableOptionMap) {
      for (let i = 0; i < resMap[key].length; i += 1) {
        for (let j = 0; j < disableOptionMap[key].length; j += 1) {
          if (resMap[key][i].id === disableOptionMap[key][j]) {
            // 如果 disableOptionMap 中该值为 用户当前 setting 中的值，给该值设置 disabled 属性，否则删除该项。
            if (disableOptionMap[key][j] === setting[key]) {
              resMap[key][i].disabled = true;
            } else {
              resMap[key].splice(i, 1);
              i -= 1;
            }
          }
        }
      }
    }
  }
  return resMap;
};

export const filterOptionMapByPro = (filteredOptionMap, proUserOptions) => {
  const resMap = merge({}, filteredOptionMap);
  for (const key in resMap) {
    if (key in proUserOptions) {
      for (let i = 0; i < resMap[key].length; i += 1) {
        if (proUserOptions[key].indexOf(resMap[key][i].id) > -1) {
          resMap[key].splice(i, 1);
          i -= 1;
        }
      }
    }
  }
  return resMap;
};

/**
 * Gets the setting labels.
 *
 * @param      {object}  setting     setting 对象
 * @param      {object}  optionsMap  根据当前 setting 取到的所有可用数据对象
 * @return     {object}  The setting labels.   当前setting 给用户显示的 字段 对象
 */
export const getSettingLabels = (setting, optionsMap) => {
  const resSettingLabels = {};
  for (const key in setting) {
    if (optionsMap && key in optionsMap) {
      for (let i = 0, len = optionsMap[key].length; i < len; i += 1) {
        if (setting[key] === optionsMap[key][i].id) {
          resSettingLabels[key] =
            optionsMap[key][i].name || optionsMap[key][i].title || '';
        }
      }
    }
  }
  return merge({}, resSettingLabels);
};
/**
 * [description]
 * @param  {[type]} sizeMap [description]
 * @return {[type]}         [description]
 */
export const resetSizeMap = (sizeMap) => {
  if (!sizeMap) return [];
  // const sourceMap = sizeMap.toJS();
  const squareSizeMap = [],
    landscapeSizeMap = [],
    portraitSizeMap = [];
  sizeMap.forEach((item) => {
    switch (item.aspectRatioType) {
      case 'Square':
        squareSizeMap.push(item);
        break;
      case 'Landscape':
        landscapeSizeMap.push(item);
        break;
      case 'Portrait':
        portraitSizeMap.push(item);
        break;
      default:
        break;
    }
  });
  const newSizeMap = squareSizeMap
    .concat(landscapeSizeMap)
    .concat(portraitSizeMap);
  const ordedSizeMap = newSizeMap.map((item) => {
    return {
      value: item.id,
      label: `(${item.aspectRatioType}) ${item.name || item.title}`,
      disabled: item.disabled || false
    };
  });
  return ordedSizeMap;
};

/**
 * [description]
 * @param  {[type]} itemMap [description]
 * @return {[type]}         [description]
 */
export const resetOptionMap = (itemMap) => {
  if (!itemMap) return [];
  // const sourceMap = itemMap.toJS();
  const newMap = itemMap.map((item) => {
    return {
      value: item.id,
      label: item.name || item.title,
      disabled: item.disabled || false
    };
  });
  return newMap;
};

/**
 * [description]
 * @param  {[type]} setting [description]
 * @return {[type]}         [description]
 */
export const settingConstructor = (that, setting, oldSetting) => {
  const { env, spec, capabilities } = that.props;
  const capability = capabilities.get('bookOptionPages');
  const isProCustomer =
    (env.userInfo && env.userInfo.get('isProCustomer')) ||
    (capability && capability.get('isShowMetalCover'));

  const { configurableOptionArray, allOptionMap, disableOptionArray } = spec;

  const newOptionsMap = projectParser.getAvailableOptionMap(
    setting,
    configurableOptionArray,
    allOptionMap,
    disableOptionArray
  );

  let filteredOptionMap = newOptionsMap;
  // 如果不是专业用户的话 需要过滤掉 专业用户的可选项
  if (!isProCustomer) {
    filteredOptionMap = filterOptionMapByPro(filteredOptionMap, proUserOptions);
  }
  const settingLabels = getSettingLabels(setting, newOptionsMap);
  return {
    setting,
    selectMap: {
      productMap: filteredOptionMap
        ? resetOptionMap(filteredOptionMap.product)
        : [],
      coverMap: filteredOptionMap
        ? resetOptionMap(filteredOptionMap.cover)
        : [],
      colorMap: filteredOptionMap
        ? resetOptionMap(filteredOptionMap.leatherColor)
        : [],
      sizeMap: filteredOptionMap ? resetSizeMap(filteredOptionMap.size) : [],
      paperMap: filteredOptionMap
        ? resetOptionMap(filteredOptionMap.paper)
        : [],
      paperThicknessMap: filteredOptionMap
        ? resetOptionMap(filteredOptionMap.paperThickness)
        : [],
      gildingMap: filteredOptionMap
        ? resetOptionMap(filteredOptionMap.gilding)
        : [],
      metalSurfaceMap: filterOptionMap
        ? resetOptionMap(filteredOptionMap.metalSurface)
        : []
    },
    settingLabels: {
      productLabel: settingLabels.product,
      coverLabel: settingLabels.cover,
      colorLabel: settingLabels.leatherColor,
      sizeLabel: settingLabels.size,
      paperLabel: settingLabels.paper,
      paperThicknessLabel: settingLabels.paperThickness,
      gildingLabel: settingLabels.gilding,
      metalSurfaceLabel: settingLabels.metalSurface
    }
  };
};

/**
 * [description]
 * @param  {[type]} that  [description]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
export const changeSetting = (that, param, done) => {
  const { spec } = that.props;
  const { configurableOptionArray } = spec;

  const newSettingObj = projectParser.getNewProjectSetting(
    that.state.setting,
    param,
    configurableOptionArray
  );
  const newSettingsState = that.settingConstructor(
    newSettingObj,
    that.props.bookOptionsData.getIn(['settings', 'spec']).toJS()
  );

  that.setState(newSettingsState);
  done && done(newSettingObj, newSettingsState);
};

/**
 * [description]
 * @param  {[type]} that [description]
 * @return {[type]}      [description]
 */
export const cancelSetting = (that, done) => {
  const { project } = that.props;

  const settingObj = project.setting.toJS();
  const newSettingsState = that.settingConstructor(settingObj);

  // that.setState(newSettingsState);
  done && done(newSettingsState);
};

export const beforeSaveSetting = (that) => {
  that.setState({
    isSaving: true
  });
};

export const saveSetting = (that, diffSetting) => {
  const { boundPaginationActions, boundSnippingActions } = that.props;

  that.setState({
    isSaving: false
  });

  // 只有当产品,或封面类型或封面颜色改变时, 才需要重新生成内包边图.
  const { product, cover, leatherColor } = diffSetting;
  if (product || cover || leatherColor) {
    // 重置封面的截图.
    boundSnippingActions.updateSnippingThumbnail({
      type: 'cover',
      base64: ''
    });
  }

  // 重置到封面当book options发生改变时.
  boundPaginationActions.switchSheet(0);

  // 更改setting后, 在某些情况下(比如product, size的变化)需要重新初始化project数据, 但是在这里
  // 很难知道数据什么时候初始化完成. 所以我们做一个workround的方法. 先切换到一个无效的页面,
  // 在editpage中会监听这个数据是否有效. 无效的话会自动切换到有效的页面.
  boundPaginationActions.switchPage(-1, '');
};
