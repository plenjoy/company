import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';
import PanelOptions from '../PanelOptions';
import PanelAlbums from '../PanelAlbums';

import './index.scss';

import * as handler from './handler';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabsText: [],
      numTemplate: {},
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
      summary,
      sidebar,
      volumes,
      pageInfo
    } = data;
    const {
      boundProjectsActions,
      boundViewPropertiesActions,
      boundIncompleteModalActions,
      boundTrackerActions
    } = actions;

    const tabsText = [t('OPTIONS'), t('VOLUMES')];

    const tabs = tabsText.map((text, i) => {
      const classes = classNames('item', { active: i === sidebar.tabIndex });
      const disabled = i === 1;

      return (<Tab key={i} className={classes} disabled={disabled} onClick={() => this.onSelect(i)}>{text}</Tab>);
    });

    const panelAlbumsData = {
      volumes,
      pageInfo,
      summary
    };
    const panelAlbumsActions = {
      boundProjectsActions,
      boundIncompleteModalActions,
      boundTrackerActions
    };

    const panelOptionsData = {
      summary
    };
    const panelOptionsActions = {
      boundProjectsActions,
      boundViewPropertiesActions,
      boundTrackerActions
    };

    // 为 handler 中 tab 切换埋点提供 数据。
    this.tabsText = tabsText;
    return (
      <div className="Sidebar">
        <Tabs  selectedIndex={sidebar.tabIndex} forceRenderTabPanel>
          <TabList className="list">
            {tabs}
          </TabList>

          {/* Options */}
          <TabPanel>
            <PanelOptions
              data={panelOptionsData}
              actions={panelOptionsActions}
            />
          </TabPanel>

          {/* Albums */}
          <TabPanel>
            <PanelAlbums
              data={panelAlbumsData}
              actions={panelAlbumsActions}
            />
          </TabPanel>
        </Tabs>

        <div className="sidebar-border"></div>
      </div>
    );
  }


}

SideBar.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('SideBar')(SideBar);
