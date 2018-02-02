import { template, merge, isEqual, get } from 'lodash';
import { productTypes, productNames } from '../../contants/strings';
import { is, fromJS } from 'immutable';
import { DOWNLOAD_BOOKSPEC_URL } from '../../contants/apiUrl.js';

export const getItemLabel = (value, map) => {
  for (let i = 0; i < map.length; i++) {
    if (map[i].value === value) {
      return map[i].label;
      break;
    }
  }
  return '';
};

export const getSettingLabel = (setting, selectMap) => {
  return {
    productLabel: getItemLabel(setting.product, selectMap.productMap),
    coverLabel: getItemLabel(setting.cover, selectMap.coverMap),
    colorLabel: getItemLabel(setting.leatherColor, selectMap.colorMap),
    sizeLabel: getItemLabel(setting.size, selectMap.sizeMap),
    paperLabel: getItemLabel(setting.paper, selectMap.paperMap),
    paperThicknessLabel: getItemLabel(
      setting.paperThickness,
      selectMap.paperThicknessMap
    )
  };
};

export const getCoverName = (that) => {
  const currentProduct = that.props.data.setting.product;
  const currentCoverId = that.props.data.setting.cover;
  const currentCoverLabel = that.state.textShowInPage.coverLabel;
  let coverName;

  if (currentCoverId === 'LBB' || currentCoverId === 'LBPC') {
    coverName = 'LittleBlackBook';
  } else if (currentProduct === 'LF') {
    coverName = `Layflat${currentCoverLabel.replace(/\s/g, '')}`;
  } else if (currentProduct === 'PS') {
    coverName = `PressBook${currentCoverLabel.replace(/\s/g, '')}`;
  } else {
    coverName = currentCoverLabel.replace(/\s/g, '');
  }
  return coverName;
};

export const getNewSettingData = (that) => {
  const setting = that.props.data.setting;
  const newSetting = {};
  for (const key in setting) {
    if (setting[key] !== that.state.oldSetting[key]) {
      newSetting[key] = setting[key];
    }
  }
  return newSetting;
};

export const getWarnType = (that, diffSetting) => {
  if ('product' in diffSetting) {
    if (
      diffSetting.product === productTypes.PS ||
      that.state.oldSetting.product === productTypes.PS
    ) {
      return 'RESTART';
    }
    return 'REMAKEBOOKLAYOUT';
  }
  if ('size' in diffSetting) {
    return 'REMAKE';
  }
  if ('cover' in diffSetting || 'leatherColor' in diffSetting) {
    return 'RESETCOVER';
  }
  return false;
};

export const downLoadSpec = (that) => {
  const { actions, t } = that.props;
  const {
    boundProjectActions,
    boundConfirmModalActions,
    cancelSetting
  } = actions;
  let downLoadSpecUrl = '';
  if (
    that.state.isInEdit &&
    !isEqual(that.state.oldSetting, that.props.data.setting)
  ) {
    boundConfirmModalActions.showConfirm({
      confirmTitle: t('TITLE'),
      okButtonText: t('SAVE'),
      cancelButtonText: t('CANCEL'),
      confirmMessage: t('CONFIRM_MESSAGE_2'),
      onOkClick: () => {
        boundProjectActions.changeProjectSetting(getNewSettingData(that));
      },
      onCancelClick: cancelSetting,
      xCloseFun: cancelSetting
    });
    that.setState({ isInEdit: false });
  } else {
    const { data } = that.props;
    const { baseUrl, setting } = data;
    const { product, size } = setting;
    const coverName = that.getCoverName();
    downLoadSpecUrl = template(DOWNLOAD_BOOKSPEC_URL)({
      baseUrl,
      bookName: productNames[product],
      cover: coverName,
      size
    });
    // window.open('http://www.zno.com.dd/userid/download?photoBookName=wqeqeq2w&cover=Leatherette&size=11X14', '_parent');
    window.onbeforeunload = null;
    window.open(downLoadSpecUrl, '_parent');
    setTimeout(() => {
      window.onbeforeunload = function () {
        return 'Unsaved changes(If any) will be discarded. Are you sure to exit?';
      };
    }, 500);
  }
};

export const routerClickHandle = (that, event) => {
  const target = event.target;
  if (target.parentNode.className === 'item') {
    const { actions, t } = that.props;
    const {
      boundProjectActions,
      boundConfirmModalActions,
      cancelSetting,
      saveSetting
    } = actions;
    that.removeRouterClickListener();
    if (!isEqual(that.state.oldSetting, that.props.data.setting)) {
      event.preventDefault();
      boundConfirmModalActions.showConfirm({
        confirmTitle: t('TITLE'),
        okButtonText: t('SAVE'),
        cancelButtonText: t('CANCEL'),
        confirmMessage: t('CONFIRM_MESSAGE_2'),
        onOkClick: () => {
          const diffSetting = getNewSettingData(that);
          boundProjectActions.changeProjectSetting(diffSetting).then(() => {
            saveSetting && saveSetting(diffSetting);
          });

          that.setState({
            isInEdit: false
          });
        },
        onCancelClick: () => {
          cancelSetting();
          that.setState({
            isInEdit: false
          });
        },
        xCloseFun: () => {
          cancelSetting();
          that.setState({
            isInEdit: false
          });
        }
      });
    }
  }
};

export const addRouterClickListener = (that) => {
  document.body.addEventListener('click', that.routerClickHandle, false);
};

export const removeRouterClickListener = (that) => {
  document.body.removeEventListener('click', that.routerClickHandle, false);
};

export const handleChange = (that) => {
  const { actions, t, data } = that.props;
  const {
    boundProjectActions,
    boundConfirmModalActions,
    cancelSetting,
    beforeSaveSetting,
    saveSetting,
    boundThemeActions
  } = actions;

  if (that.state.isInEdit) {
    that.removeRouterClickListener();
    const oldSetting = get(that.state, 'oldSetting');
    const newSetting = get(that.props, 'data.setting');
    if (!is(fromJS(oldSetting), fromJS(newSetting))) {
      // 如果size变化了并且之前应用过theme则寻找关联的theme
      if (
        oldSetting.size !== newSetting.size ||
        oldSetting.product !== newSetting.product
      ) {

      }
    const applyOrClearTheme = () => {
      const { property } = data;
      const applyBookThemeId = property
        ? property.get('applyBookThemeId')
        : '';
      if (applyBookThemeId) {
        boundThemeActions
          .getRelatedBooktheme(applyBookThemeId, newSetting.size, newSetting.product)
          .then((res) => {
            // 如果找到对应的theme则应用否则清除掉applybookthemeid
            if (res.success) {
              boundProjectActions.applyTheme(
                fromJS(get(res, 'data.bookTheme'))
              );
            } else {
              boundProjectActions.clearApplyThemeId();
            }
          });
      }
    }
      const diffSetting = getNewSettingData(that);
      const warnType = getWarnType(that, diffSetting);
      if (warnType) {
        boundConfirmModalActions.showConfirm({
          confirmTitle: t('TITLE'),
          okButtonText: t('CONTINUE'),
          cancelButtonText: t('CANCEL'),
          confirmMessage: t(`CONFIRM_MESSAGE_${warnType}`),
          onOkClick: () => {
            beforeSaveSetting && beforeSaveSetting();

            boundProjectActions.changeProjectSetting(diffSetting).then(() => {
              saveSetting && saveSetting(diffSetting);
            });

            applyOrClearTheme();
          },
          onCancelClick: cancelSetting,
          xCloseFun: cancelSetting
        });
      } else {
        beforeSaveSetting && beforeSaveSetting();

        boundProjectActions.changeProjectSetting(diffSetting).then(() => {
          saveSetting && saveSetting(diffSetting);
        });

        applyOrClearTheme();
      }
    }
  } else {
    that.addRouterClickListener();
    const oldSetting = merge({}, that.props.data.setting);
    that.setState({ oldSetting });
  }
  that.setState({
    isInEdit: !that.state.isInEdit
  });
};

export const handleProductChange = (that, event) => {
  const param = { product: event.value };
  that.handleOptionChange(param);
};

export const handleCoverChange = (that, event) => {
  const param = { cover: event.value };
  that.handleOptionChange(param);
};

export const handleColorChange = (that, event) => {
  const param = { leatherColor: event.value };
  that.handleOptionChange(param);
};

export const handleSizeChange = (that, event) => {
  const param = { size: event.value };
  that.handleOptionChange(param);
};

export const handlePaperChange = (that, event) => {
  const param = { paper: event.value };
  that.handleOptionChange(param);
};

export const handlePaperThicknessChange = (that, event) => {
  const param = { paperThickness: event.value };
  that.handleOptionChange(param);
};

export const handleGildingChange = (that, event) => {
  const param = { gilding: event.value };
  that.handleOptionChange(param);
};

export const handleMetalSurfaceChange = (that, event) => {
  const param = { metalSurface: event.value };
  that.handleOptionChange(param);
};

export const handleOptionChange = (that, param) => {
  const { actions } = that.props;
  const { changeSetting } = actions;

  changeSetting(param);
};
