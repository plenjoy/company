import React, {
  Component
} from 'react';
import {
  merge
} from 'lodash';
import {
  translate
} from 'react-translate';
import {
  Tabs,
  Tab,
  TabList,
  TabPanel
} from 'react-tabs';
import classNames from 'classnames';

import PhotoTab from '../PhotoTab';
import OptionTab from '../OptionTab';
import * as layoutHandler from './handler/layout';
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
    this.onSelect = selectedIndex => layoutHandler.onSelect(this, selectedIndex);
  }


  render() {
    const {
      t,
      data,
      actions
    } = this.props;
    const {
      sidebar,
      uploadedImages,
      baseUrls,
      imageUsedMap,
      isShowSideBar,
      project,
      settings,
      allImages,
      userInfo
    } = data;
    const {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      boundPriceActions,
      onApplyTemplate,
      applyRelativeTemplate
    } = actions;

    // TODO： 由于功能还未完善, 美国建议先隐藏
    // const tabsText = [t('PHOTOS'), t('LAYOUTS'), t('DECORATINOS')];
    const product = settings.spec.product;

    let tabsText = (product && product === "LC")? [t('PHOTOS'), ''] : [t('OPTIONS'), t('PHOTOS')];

    const photoTabActions = {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions
    };
    const photoTabData = {
      uploadedImages,
      baseUrls,
      imageUsedMap,
      allImages,
      userInfo
    };

    const optionTabActions = {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      boundPriceActions,
      onApplyTemplate,
      applyRelativeTemplate
    };
    const optionTabData = {
      project,
      settings
    };

    const tabs = tabsText.map((text, i) => {
      const classes = classNames('item', {
        active: i === sidebar.tabIndex
      });

      //const disabled = i === 0;
      return (<Tab key={i} className={classes}>{text}</Tab>);
    });

    let sideBarStyle = {
      borderTop: 'none'
    };
    sideBarStyle = merge({},
      sideBarStyle, {
        display: isShowSideBar ? 'block' : 'none'
      }
    );

    // 为 handler 中 tab 切换埋点提供 数据。
    this.tabsText = tabsText;
    return (

      <div className="side-bar" style={sideBarStyle}>
          {
            product ?
            (
              (product === "LC") ?
              (
                <Tabs onSelect={this.onSelect} selectedIndex={0} forceRenderTabPanel>
                  <TabList className="list">
                  <Tab key={0} className={classNames("item", {active:true})}>{t("PHOTOS")}</Tab>
                  <Tab key={1} className={classNames("item", {active:false})} disabled={true}>{""}</Tab>
                  </TabList>
                  <TabPanel>
                    <PhotoTab actions={photoTabActions} data={photoTabData} />
                  </TabPanel>
                  <TabPanel/>
                </Tabs>
              )
              :
              (
                <Tabs onSelect={this.onSelect} selectedIndex={sidebar.tabIndex} forceRenderTabPanel>
                 <TabList className="list">
                   {tabs}
                 </TabList>
                 <TabPanel>
                  <OptionTab actions={optionTabActions} data={optionTabData} />
                 </TabPanel>
                 <TabPanel>
                   <PhotoTab actions={photoTabActions} data={photoTabData} />
                 </TabPanel>
                </Tabs>
              )
            )
            :null
          }


      </div>
    );
  }
}

SideBar.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('SideBar')(SideBar);
