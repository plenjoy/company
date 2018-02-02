import React, { Component, PropTypes } from 'react';
import { template, merge } from 'lodash';
import { translate } from 'react-translate';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';
import { Map } from 'immutable';

import { filterOptions } from '../../contants/strings';
import PhotoTab from '../PhotoTab';
import DecorationTab from '../DecorationTab';
import OptionsTab from '../OptionsTab';
import * as layoutHandler from './handler/layout';
import * as themeHandler from './handler/theme';
import './index.scss';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabsText: [],
      numTemplate: {},
      pageSize: 8,
      page: 1,
      getMoreShow: true,
      html: ''
    };

    // 禁用默认的tabs样式.
    Tabs.setUseDefaultStyles(false);

    // 选项卡选中时的处理函数.
    this.onSelect = selectedIndex =>
      layoutHandler.onSelect(this, selectedIndex);
    this.applyThemePage = (themeId, pageIndex) =>
      themeHandler.applyThemePage(this, themeId, pageIndex);
  }

  render() {
    const { t, data, actions } = this.props;
    const {
      sidebar,
      paginationSpread,
      uploadedImages,
      baseUrls,
      stickerList,
      setting,
      imageUsedMap,
      pagination,
      ratio,
      stickerUsedMap,
      userInfo,
      isEditParentBook,
      fontList,
      isShowSideBar,
      themestickerList,
      themesCategories,
      currentTheme,
      currentThemeType,
      uploadStatus,

      settings,
      backgrounds,
      isBookthemeOpen,
      applyBookThemeId,
      useNewUpload,

      spec,
      pageArray,
      allImages,
      isUsePhotoGroup,
      bookSetting
    } = data;
    const {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTemplateActions,
      boundStickerActions,
      boundTrackerActions,
      boundThemeStickerActions,
      boundThemeActions,
      boundConfirmModalActions,
      boundGlobalLoadingActions,
      addStatusCount,
      boundRenderActions,
      doAutoLayout
    } = actions;

    let num = uploadedImages.length ? ` (${uploadedImages.length})` : '';
    num = (uploadedImages.length > 999) ? ' (999+)' : num;

    // TODO： 由于功能还未完善, 美国建议先隐藏
    // const tabsText = [t('PHOTOS'), t('LAYOUTS'), t('DECORATINOS')];
    const tabsText = [t('PHOTOS') + num];

    if (isBookthemeOpen) {
      tabsText.push(t('DECORATINOS'));
    }

    const pageId = pagination.get('pageId');

    const page = pageArray.find((p) => {
      return p.get('id') === pageId;
    });

    tabsText.unshift(t('OPTIONS'));

    const isCover = pagination.get('sheetIndex') === 0;

    const photoTabActions = {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      addStatusCount,
      doAutoLayout
    };
    const photoTabData = {
      uploadedImages,
      baseUrls,
      imageUsedMap,
      uploadStatus,
      useNewUpload,
      allImages,
      page: paginationSpread ? paginationSpread.get('page') : Map({}),
      summary: paginationSpread ? paginationSpread.get('summary') : Map({}),
      isUsePhotoGroup,
      bookSetting,
      userInfo
    };

    const getMore = this.getMore;

    const decorationTabActions = {
      boundStickerActions,
      boundThemeStickerActions,
      boundThemeActions,
      applyThemePage: this.applyThemePage,
      boundProjectActions,
      boundTrackerActions
    };
    const decorationTabData = {
      stickerList,
      backgrounds,
      baseUrls,
      setting,
      stickerUsedMap,
      ratio,
      themestickerList,
      themesCategories,
      currentTheme,
      currentThemeType,
      settings,
      isCover,
      pagination,
      applyBookThemeId
    };
    const tabs = tabsText.map((text, i) => {
      const classes = classNames('item', { active: i === sidebar.tabIndex });

      let disabled = false;
      if (!text) {
        disabled = true;
      }
      return (
        <Tab key={i} className={classes} disabled={disabled}>
          {text}
        </Tab>
      );
    });

    let sideBarStyle = {
      borderTop: isEditParentBook ? '1px solid #d6d6d6' : 'none'
    };
    sideBarStyle = merge({}, sideBarStyle, {
      display: isShowSideBar ? 'block' : 'none'
    });

    // 为 handler 中 tab 切换埋点提供 数据。
    this.tabsText = tabsText;

    const optionsTabProps = {
      setting,
      spec,
      pageArray,
      isProUser: userInfo.get('isProCustomer'),
      actions: {
        boundProjectActions,
        boundConfirmModalActions,
        boundThemeActions,
        boundGlobalLoadingActions,
        boundRenderActions
      }
    };

    return (
      <div className="side-bar" draggable="false" style={sideBarStyle}>
        <Tabs
          onSelect={this.onSelect}
          selectedIndex={sidebar.tabIndex}
          forceRenderTabPanel
        >
          <TabList className="list">{tabs}</TabList>

          <TabPanel>
            <OptionsTab {...optionsTabProps} />
          </TabPanel>

          {/* photos */}
          <TabPanel>
            <PhotoTab actions={photoTabActions} data={photoTabData} />
          </TabPanel>

          {/* decoration */}
          {isBookthemeOpen ? (
            <TabPanel>
              <DecorationTab
                actions={decorationTabActions}
                data={decorationTabData}
              />
            </TabPanel>
          ) : null}
        </Tabs>
      </div>
    );
  }
}

SideBar.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('SideBar')(SideBar);
