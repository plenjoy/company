import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { get, merge } from 'lodash';
import { TranslatorProvider } from 'react-translate';

import '../../../../common/utils/extension';

import 'normalize.css';
import './index.scss';

// 导入字体
import '../../../../common/fontFamily/font1.css';
import '../../../../common/fontFamily/font2.css';

// 导入组件
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XHeartBeat from '../../../../common/ZNOComponents/XHeartBeat';

import PageHeader from '../../components/PageHeader';
import ViewTabs from '../../components/ViewTabs';
import Modals from '../Modals';
import notificationStyles from './notificationStyles';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

// 打入handle
import * as mainHandle from './handle/main';

if (__DEVELOPMENT__) {
  require('react-addons-perf');
}

class App extends Component{
  constructor(props) {
    super(props);

    this.doPrepare = () => mainHandle.doPrepare(this);
  }

  /**
   * 发送ajax请求获取初始化数据.
   */
  componentWillMount() {
    this.doPrepare();
  }

  componentWillReceiveProps(nextProps) {
    // doUserThings(this, nextProps);
  }

  componentDidMount() {
    // TODO
    const isSupportSaveProject = true;

    if (!/isPreview/.test(window.location.href)) {
      window.onbeforeunload = () =>
        'Unsaved changes(If any) will be discarded. Are you sure to exit?';
    }

    if (!isSupportSaveProject) {
      window.onbeforeunload = null;
    }

    const { boundNotificationActions } = this.props;
    boundNotificationActions.initNotificationSystem(
      this.refs.notificationSystem
    );
  }

  render() {
    const {
     translations,
     env,
     confirmModal,

     originalProjects,
     summary,
     volumes,
     originalSpec,
     currentSpec,

     boundEnvActions,
     boundTrackerActions
    } = this.props;

    const isProjectLoadCompleted = true;
    const isPreview = false;
    const hasCoverRender = true;
    const userId = env.userInfo.get('id');

    // page header
    const pageHeaderActions = {};
    const pageHeaderData = {
      env
    };

    // view tabs
    const viewTabsActions = {
      boundTrackerActions
    };
    const viewTabsData = {};

    // modal
    const modalsActions = {};
    const modalsData = {
      confirmModal
    };

    return (
      <TranslatorProvider translations={translations}>
        <div className="app">
          <div className="main-modules">
            {/* 页面顶部导航组件 */}
            <PageHeader
              actions={pageHeaderActions}
              data={pageHeaderData}
            />

            {/* 产品价格显示 */}

            {/* 左侧的导航组件 */}
            <ViewTabs actions={viewTabsActions} data={viewTabsData} />
          </div>

          {!isPreview
            ? <XHeartBeat
              userId={userId}
              keepAlive={boundEnvActions.keepAlive}
            />
            : null}

          {/* 这是一个容器, 放置所有的弹框组件, 包括(modal, popover, notify等) */}
          <Modals actions={modalsActions} data={modalsData} />

          {/* notification */}
          <NotificationSystem
            ref="notificationSystem"
            style={notificationStyles}
          />

          <XLoading loadingText="Loading..." isShown={!hasCoverRender} />
        </div>
      </TranslatorProvider>
    );
  }
}

export default connect(mapStateToProps, mapAppDispatchToProps)(App);
