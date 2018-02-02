import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { intersection, upperFirst, forIn, get } from 'lodash';

import XSelect from '../../../../common/ZNOComponents/XSelect';
import projectParser from '../../../../common/utils/projectParser';
import { productTypes } from '../../contants/strings';

import './index.scss';

function sortSizeOptionArray(optionArray) {
  const squareOptionArray = [];
  const landscapeOptionArray = [];
  const portraitOptionArray = [];
  optionArray.forEach(item => {
    switch (item.aspectRatioType) {
      case 'Square':
        squareOptionArray.push(item);
        break;
      case 'Landscape':
        landscapeOptionArray.push(item);
        break;
      case 'Portrait':
        portraitOptionArray.push(item);
        break;
      default:
        break;
    }
  });

  return squareOptionArray
    .concat(landscapeOptionArray)
    .concat(portraitOptionArray);
}

function getFilteredOptionMap(availableOptionMap, proUserOptionMap) {
  const outObj = {};
  forIn(availableOptionMap, (value, key) => {
    const availableOptionArray = availableOptionMap[key];

    const proUserOptionArray = proUserOptionMap[key] || [];
    outObj[key] = availableOptionArray.filter(option => {
      return proUserOptionArray.indexOf(option.id) === -1;
    });
  });

  return outObj;
}

class OptionsTab extends Component {
  constructor(props) {
    super(props);

    this.applyRelatedThemeAfterSettingChange = this.applyRelatedThemeAfterSettingChange.bind(
      this
    );

    this.countDeletePages = this.countDeletePages.bind(this);
  }

  componentWillMount() {
    const { setting, spec, isProUser, proUserOptionMap } = this.props;
    this.initState(setting, spec, isProUser, proUserOptionMap);
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.setting, nextProps.setting)) {
      const { setting, spec, isProUser, proUserOptionMap } = nextProps;
      this.initState(setting, spec, isProUser, proUserOptionMap);
    }
  }

  onNeedConfirmSettingChange(settingKey, optionObj) {
    const { actions, setting } = this.props;
    const {
      boundConfirmModalActions,
      boundProjectActions,
      boundGlobalLoadingActions
    } = actions;

    const currentValue = setting.get(settingKey);
    const newValue = optionObj.value;

    if (currentValue === newValue) return;

    const stateKey = `selected${upperFirst(settingKey)}`;

    const onCancel = () => {
      this.setState({
        [stateKey]: setting.get(settingKey)
      });
    };

    const MSG_CONTINUE = ' would you like to continue?';
    const MSG_RESET_COVER = `This operation will reset your cover design,${MSG_CONTINUE}`;
    const MSG_REMAKE_LAYOUT = `This operation will remake your layout design,${MSG_CONTINUE}`;
    const MSG_INIT_LAYOUT = `This operation will initialize your book layout,${MSG_CONTINUE}`;

    let confirmMessage = '';
    switch (settingKey) {
      case 'cover':
        confirmMessage = MSG_RESET_COVER;
        break;
      case 'product': {
        const noNeedResetLayoutSettingArr = [productTypes.LF, productTypes.FM];
        const arr = [currentValue, newValue];
        const isSwitchBetweenLFAndFMA =
          intersection(noNeedResetLayoutSettingArr, arr).length === 2;

        if (isSwitchBetweenLFAndFMA) {
          confirmMessage = MSG_REMAKE_LAYOUT;
        } else {
          confirmMessage = MSG_INIT_LAYOUT;
        }
        break;
      }
      default:
    }

    const newSetting = {
      [settingKey]: optionObj.value
    };

    const deletePageNumber = this.countDeletePages(newSetting);
    if (deletePageNumber) {
      confirmMessage = `This operation will remove your last ${deletePageNumber} page(s) and remake your layout design,${MSG_CONTINUE}`;
    }

    boundConfirmModalActions.showConfirm({
      confirmTitle: 'WARNING',
      okButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      confirmMessage,
      onOkClick: () => {
        boundGlobalLoadingActions.showGlobalLoading();

        // 情况store上的合成的效果图, 避免渲染中间状态给用户界面.
        // boundRenderActions.updateCoverMaterial({
        //   img: null
        // });

        boundProjectActions.changeProjectSetting(newSetting).then(() => {
          this.applyRelatedThemeAfterSettingChange(settingKey);
        });
      },
      onCancelClick: onCancel,
      xCloseFun: onCancel
    });
  }

  onOtherChange(settingKey, optionObj) {
    const { actions, setting } = this.props;
    if (setting.get(settingKey) === optionObj.value) return;

    if (settingKey && optionObj.value) {
      actions.boundProjectActions
        .changeProjectSetting({
          [settingKey]: optionObj.value
        })
        .then(() => {
          this.applyRelatedThemeAfterSettingChange(settingKey);
        });
    }
  }

  initState(setting, spec, isProUser, proUserOptionMap) {
    const availableOptionMap = projectParser.getAvailableOptionMap(
      setting.toJS(),
      spec.configurableOptionArray,
      spec.allOptionMap,
      spec.disableOptionArray
    );

    this.setState({
      availableOptionMap: isProUser
        ? availableOptionMap
        : getFilteredOptionMap(availableOptionMap, proUserOptionMap),
      selectedProduct: setting.get('product'),
      selectedCover: setting.get('cover'),
      selectedSize: setting.get('size'),
      selectedPaperThickness: setting.get('paperThickness')
    });
  }

  applyRelatedThemeAfterSettingChange(settingKey) {
    const { actions } = this.props;
    const {
      boundProjectActions,
      boundThemeActions,
      boundGlobalLoadingActions
    } = actions;

    const delayHideLoading = () => {
      setTimeout(() => {
        boundGlobalLoadingActions.hideGlobalLoading();
      }, 2000);
    };

    if (settingKey === 'size' || settingKey === 'product') {
      boundThemeActions
        .getRelatedBooktheme()
        .then(res => {
          if (res.success) {
            boundProjectActions
              .applyTheme(Immutable.fromJS(get(res, 'data.bookTheme')))
              .then(() => {
                delayHideLoading();
              });
          } else {
            boundProjectActions.clearApplyThemeId();
            delayHideLoading();
          }
        })
        .catch(() => {
          boundProjectActions.clearApplyThemeId();
          delayHideLoading();
        });
    } else {
      delayHideLoading();
    }
  }

  countDeletePages(newSetting) {
    const { setting, spec, pageArray } = this.props;

    const computedSetting = projectParser.getNewProjectSetting(
      setting.toJS(),
      newSetting,
      spec.configurableOptionArray,
      spec.allOptionMap
    );

    const parameterMap = projectParser.getParameters(
      computedSetting,
      spec.parameterArray
    );

    const maxSheetNumber = get(parameterMap, 'sheetNumberRange.max');

    const maxPageNumber = maxSheetNumber * 2;
    const currentPageNumber = pageArray.size;

    if (currentPageNumber > maxPageNumber) {
      return currentPageNumber - maxPageNumber;
    }

    return 0;
  }

  render() {
    const {
      setting,
      spec,
      actions,
      requiredOptions,
      needConfirmOptions,
      labelNameMap,
      isProUser
    } = this.props;

    const { availableOptionMap } = this.state;

    if (!availableOptionMap) return null;
    const availableOptionKeys = Object.keys(availableOptionMap);
    if (!intersection(requiredOptions, availableOptionKeys).length) return null;

    return (
      <div className="options-tab">
        <div className="options-box">
          {requiredOptions.map((optionKey, index) => {
            const availableOptionArray = availableOptionMap[optionKey];

            if (
              availableOptionArray &&
              ((setting.get('product') === productTypes.FM &&
                optionKey === 'paperThickness') ||
                (availableOptionArray.length > 1 &&
                  (optionKey !== 'gilding' || isProUser)))
            ) {
              let sortedOptionArray = availableOptionArray;

              if (optionKey === 'size') {
                sortedOptionArray = sortSizeOptionArray(availableOptionArray);
              }

              const selectOptions = sortedOptionArray.map(item => {
                let labelString = (item.name || item.title || '').trim();
                if (optionKey === 'size') {
                  labelString = `(${item.aspectRatioType}) ${labelString}`;
                }

                return {
                  value: item.id,
                  label: labelString,
                  disabled: item.disabled || false
                };
              });

              const needConfirm = needConfirmOptions.indexOf(optionKey) !== -1;

              const stateKey = `selected${upperFirst(optionKey)}`;

              return (
                <div className="options-control" key={index}>
                  <label className="options-name">
                    {labelNameMap[optionKey]}:
                  </label>

                  <div className="options-select">
                    <XSelect
                      options={selectOptions}
                      searchable={false}
                      value={
                        needConfirm
                          ? this.state[stateKey]
                          : setting.get(optionKey)
                      }
                      onChanged={
                        needConfirm
                          ? this.onNeedConfirmSettingChange.bind(
                              this,
                              optionKey
                            )
                          : this.onOtherChange.bind(this, optionKey)
                      }
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

OptionsTab.defaultProps = {
  requiredOptions: [
    'product',
    'cover',
    'size',
    'paper',
    'paperThickness',
    'gilding',
    'metalSurface'
  ],
  needConfirmOptions: ['product', 'cover'],
  proUserOptionMap: {
    cover: ['MC', 'GM'],
    paper: ['AP'],
    paperThickness: ['Rigid']
  },
  labelNameMap: {
    product: 'Product',
    cover: 'Cover',
    size: 'Size',
    paper: 'Paper',
    paperThickness: 'Thickness',
    gilding: 'Gilding',
    metalSurface: 'Metal Surface'
  }
};

OptionsTab.propTypes = {
  setting: PropTypes.instanceOf(Immutable.Map).isRequired,
  spec: PropTypes.object.isRequired,
  isProUser: PropTypes.bool.isRequired,
  pageArray: PropTypes.instanceOf(Immutable.Array).isRequired,
  actions: PropTypes.shape({
    boundProjectActions: PropTypes.object.isRequired,
    boundConfirmModalActions: PropTypes.object.isRequired,
    boundThemeActions: PropTypes.object.isRequired,
    boundGlobalLoadingActions: PropTypes.object.isRequired
  }).isRequired
};

export default OptionsTab;
