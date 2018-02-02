import React, { Component, PropTypes } from 'react';
import { template, merge } from 'lodash';
import { translate } from 'react-translate';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';

import { filterOptions } from '../../contants/strings';
import PhotoTab from '../PhotoTab';
import OptionsTab from '../OptionsTab';
import './index.scss';

import * as handler from './handler';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabsText: [],
      numTemplate: {},
      templateList: [],
      pageSize: 8,
      page: 1,
      getMoreShow: true,
      currentFilterTag: filterOptions.TOP,
      isLoaded: false,
      html: ''
    };

    // 禁用默认的tabs样式.
    Tabs.setUseDefaultStyles(false);

    // 选项卡选中时的处理函数.
    this.onSelect = selectedIndex => handler.onSelect(this, selectedIndex);
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
      imageUsedCountMap,
      pagination,
      ratio,
      decorationUsedCountMap,
      userInfo
    } = data;

    let num = uploadedImages.length ? ` (${uploadedImages.length})` : '';
    num = (uploadedImages.length > 999) ? ' (999+)' : num;

    const { toggleModal, boundImagesActions, boundProjectActions, boundTrackerActions, login } = actions;
    const tabsText = [t('PHOTOS') + num, ''];

    // photo tabs
    const photoTabActions = { toggleModal, boundImagesActions, boundProjectActions, boundTrackerActions, login };
    const photoTabData = { uploadedImages, baseUrls, imageUsedCountMap,userInfo };

    // options tab
    const optionsTabActions = {};
    const optionsTabData = {};

    const tabs = tabsText.map((text, i) => {
      const classes = classNames('item', { active: i === sidebar.tabIndex });
      const disabled = i === 1;

      return (<Tab key={i} className={classes} disabled={disabled}>{text}</Tab>);
    });

    // 为 handler 中 tab 切换埋点提供 数据。
    this.tabsText = tabsText;
    return (
      <div className="side-bar">
        <Tabs onSelect={this.onSelect} selectedIndex={sidebar.tabIndex} forceRenderTabPanel>
          <TabList className="list">
            {tabs}
          </TabList>

          {/* photos */}
          <TabPanel>
            <PhotoTab actions={photoTabActions} data={photoTabData} />
          </TabPanel>

          {/* Options */}
          <TabPanel>
            {/* <OptionsTab actions={optionsTabActions} data={optionsTabData} /> */}
          </TabPanel>
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
