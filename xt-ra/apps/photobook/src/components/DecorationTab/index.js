import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { get, merge } from 'lodash';

import * as handler from './handler.js';
import StickerList from '../StickerList';
import ThemePages from '../ThemePages';
import DecorationFilter from '../DecorationFilter';
import BackgroundList from '../BackgroundList';
import './index.scss';

class DecorationTab extends Component {
  constructor(props) {
    super(props);
    // 禁用默认的tabs样式.
    Tabs.setUseDefaultStyles(false);
    this.onSelect = this.onSelect.bind(this);
    this.fetchThemeList = this.fetchThemeList.bind(this);
    this.setThemeType = this.setThemeType.bind(this);

    this.state = {
      tabIndex: 0,
      tabsText: this.props.data.applyBookThemeId
        ? [
            this.props.t('PAGES'),
            this.props.t('STICKERS'),
            this.props.t('BACKGROUND')
          ]
        : [this.props.t('STICKERS')]
    };
  }

  /**
   * tab切换时, 触发. 设置选中样式.
   * @param that 组件的this指向.
   * @param event
   */
  onSelect(selectedIndex) {
    this.setState({
      tabIndex: selectedIndex
    });
  }

  fetchThemeList(themeType) {
    const { data, actions } = this.props;
    const { settings } = data;
    const { boundThemeActions } = actions;

    const product = get(settings, 'spec.product');
    const size = get(settings, 'spec.size');

    boundThemeActions.getThemes({
      themeType,
      product,
      size,
      pageNumber: 1,
      pageSize: 10000
    });
  }

  setThemeType(themeType) {
    const { actions } = this.props;
    const { boundThemeActions } = actions;
    boundThemeActions.setThemeType(themeType);
  }

  componentWillReceiveProps(nextProps) {
    const oldApplyBookThemeId = get(this.props, 'data.applyBookThemeId');
    const newApplyBookThemeId = get(nextProps, 'data.applyBookThemeId');
    if (oldApplyBookThemeId !== newApplyBookThemeId) {
      let tabsText = this.state.tabsText;
      let tabIndex = this.state.tabIndex || 0;

      if (newApplyBookThemeId) {
        tabsText = [
          nextProps.t('PAGES'),
          nextProps.t('STICKERS'),
          nextProps.t('BACKGROUND')
        ];
      } else {
        tabsText = [nextProps.t('STICKERS')];
        tabIndex = 0;
      }

      this.setState({ tabsText, tabIndex });
    }
  }

  render() {
    const { t, data, actions } = this.props;

    const {
      boundStickerActions,
      boundThemeStickerActions,
      applyThemePage,
      boundProjectActions,
      boundTrackerActions
    } = actions;
    const {
      backgrounds,
      stickerList,
      baseUrls,
      setting,
      stickerUsedMap,
      ratio,
      themestickerList,
      themesCategories,
      currentTheme,
      currentThemeType,
      isCover,
      settings,
      pagination,
      applyBookThemeId
    } = data;

    const stickerListData = {
      stickerList,
      baseUrls,
      setting,
      stickerUsedMap,
      ratio,
      themestickerList,
      currentThemeType
    };
    const stickerListActions = { stickerList, boundStickerActions };

    const backgroundsListData = {
      backgrounds,
      baseUrls,
      setting,
      stickerUsedMap
    };
    const backgroundsListActions = { boundProjectActions, boundTrackerActions };

    const DecorationFilterDate = {
      themesCategories,
      currentThemeType,
      themestickerList
    };
    const DecorationFilterAction = {
      boundThemeStickerActions,
      setThemeType: this.setThemeType,
      fetchThemeList: this.fetchThemeList
    };

    const themePagesData = { currentTheme, isCover, settings, pagination };
    const themePagesActions = { applyThemePage };

    // 生成tab的html
    const tabs = this.state.tabsText.map((text, i) => {
      const classes = classNames('item', { active: i === this.state.tabIndex });
      return (
        <Tab key={i} className={classes}>
          <span>{text}</span>
        </Tab>
      );
    });
    return (
      <div className="decoration-tab" draggable="false">
        {/**
          <DecorationFilter data={DecorationFilterDate} actions={DecorationFilterAction} />
        * */}

        <Tabs
          onSelect={this.onSelect}
          selectedIndex={this.state.tabIndex}
          forceRenderTabPanel
        >
          <TabList className="list">{tabs}</TabList>

          {/* pages */}
          {applyBookThemeId ? (
            <TabPanel>
              <ThemePages data={themePagesData} actions={themePagesActions} />
            </TabPanel>
          ) : null}

          {/* stickers */}
          <TabPanel>
            <StickerList data={stickerListData} actions={stickerListActions} />
          </TabPanel>

          {applyBookThemeId ? (
            <TabPanel>
              <BackgroundList
                data={backgroundsListData}
                actions={backgroundsListActions}
              />
            </TabPanel>
          ) : null}

          {/*
            <TabPanel>
              borders
            </TabPanel>
          */}
        </Tabs>
      </div>
    );
  }
}

DecorationTab.proptype = {};

export default translate('DecorationTab')(DecorationTab);
