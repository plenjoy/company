import React, { Component, PropTypes } from 'react';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { get, merge } from 'lodash';
import { TranslatorProvider } from 'react-translate';

import '../../../../common/utils/extension';
import '../../../../common/utils/imagePool';
import '../../../../common/utils/promisePool';

import 'normalize.css';
import './index.scss';

// 导入字体
import '../../../../common/fontFamily/font1.css';
import '../../../../common/fontFamily/font2.css';

// 导入组件
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XHeartBeat from '../../../../common/ZNOComponents/XHeartBeat';

import PageHeader from '../../components/PageHeader';
import TabViews from '../../components/TabViews';
import ItemPrice from '../../components/ItemPrice';
import Modals from '../Modals';
import notificationStyles from './notificationStyles';
import ScreenShot from '../../canvasComponents/ScreenShot';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

// 打入handle
import * as mainHandle from './handle/main';
import * as ratioHandle from './handle/ratio';

if (__DEVELOPMENT__) {
  require('react-addons-perf');
}

class App extends Component {
  constructor(props) {
    super(props);

    this.doPrepare = () => mainHandle.doPrepare(this);
    this.onResize = nextProps => ratioHandle.onResize(this, nextProps);
    this.onResizeHandle = ev => this.onResize(this.props);
    this.onSaveProject = nextProps => mainHandle.onSaveProject(this, nextProps);

    this.perpareSystem = nextProps => mainHandle.perpareSystem.bind(this)(nextProps);
    this.specChangeHandler = nextProps => mainHandle.onSpecChange.bind(this)(nextProps);
  }

  /**
   * 发送ajax请求获取初始化数据.
   */
  componentWillMount() {
    this.doPrepare();
  }

  componentWillReceiveProps(nextProps) {
    this.specChangeHandler(nextProps);
    this.perpareSystem(nextProps);
  }

  componentDidMount() {
    // TODO
    const {
      boundNotificationActions,
      boundTrackerActions
    } = this.props;

    const isSupportSaveProject = true;

    if (!/isPreview/.test(window.location.href)) {
      window.onbeforeunload = () =>
        'Unsaved changes(If any) will be discarded. Are you sure to exit?';
    }

    if (!isSupportSaveProject) {
      window.onbeforeunload = null;
    }

    boundNotificationActions.initNotificationSystem(
      this.refs.notificationSystem
    );

    boundTrackerActions.addTracker(`TapLTBEntrance`);

    this.onResize();
    window.addEventListener('resize', this.onResizeHandle);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeHandle);
  }
  render() {
    const {
      // system variable
      translations,
      env,
      oAuth,
      photoArray,
      materials,
      isPreview,

      // system modals data
      sidebar,
      confirmModal,
      orderModal,
      oAuthPage,
      oAuthLoading,
      fontCalculator,
      incompleteModal,
      previewModal,

      // projects
      originalProjects,
      summary,
      volumes,
      selectedVolume,
      originalSpec,
      currentSpec,
      price,
      pageInfo,
      isViewRending,

      // system actions
      boundEnvActions,
      boundOAuthActions,
      boundProjectsActions,
      boundPhotoArrayActions,

      // system modals actions
      boundSidebarActions,
      boundConfirmModalActions,
      boundOAuthPageActions,
      boundOAuthLoadingActions,
      boundTrackerActions,
      boundOrderModalActions,
      boundViewPropertiesActions,
      boundIncompleteModalActions,
      boundPreviewModalActions
    } = this.props;

    const isProjectLoadCompleted = true;
    const hasCoverRender = true;
    const userId = env.userInfo.get('id');

    // page header
    const pageHeaderActions = {
      boundConfirmModalActions,
      onSaveProject: this.onSaveProject,
      boundOrderModalActions,
      boundIncompleteModalActions,
      boundTrackerActions
    };
    const pageHeaderData = {
      env,
      volumes,
      selectedVolume
    };

    // view tabs
    const tabViewsActions = {
      boundPhotoArrayActions,
      boundProjectsActions,
      boundSidebarActions,
      boundTrackerActions,
      boundOAuthPageActions,
      boundViewPropertiesActions,
      boundIncompleteModalActions
    };
    const tabViewsData = {
      env,
      sidebar,
      pageInfo,
      materials,
      photoArray,
      selectedVolume,
      isViewRending
    };

    // modal
    const modalsActions = {
      boundEnvActions,
      boundOAuthActions,
      boundProjectsActions,
      boundPhotoArrayActions,
      boundOrderModalActions,
      boundOAuthPageActions,
      boundOAuthLoadingActions,
      onSaveProject: this.onSaveProject,
      boundOrderModalActions,
      boundIncompleteModalActions,
      boundPreviewModalActions,
      boundTrackerActions,
      boundConfirmModalActions
    };
    const modalsData = {
      env,
      oAuth,
      photoArray,
      confirmModal,
      oAuthPage,
      oAuthLoading,
      fontCalculator,
      orderModal,
      volumes,
      selectedVolume,
      summary,
      price,
      pageInfo,
      incompleteModal,
      previewModal,
      materials,
      isPreview,
      projectMap: {
        env,
        summary
      },
    };

    const itemPriceData = {
      price,
      count: volumes.filter(volume => volume.get('isComplete')).size
    };

    const itemPriceActions = {
    };

    const screenshotData = {
      env,
      volumes,
      materials
    };

    return (
      <TranslatorProvider translations={translations}>
        <div className="app">
          <div className="main-modules">

            {/* 页面顶部导航组件 */}
            {!isPreview ? (
              <PageHeader
                data={pageHeaderData}
                actions={pageHeaderActions}
              />
            ) : null}

            {/* 产品价格显示 */}
            {!isPreview && volumes.size !== 0 ? (
              <ItemPrice
                data={itemPriceData}
                actions={itemPriceActions}
              />
            ) : null}

            {/* 主操作页面 */}
            {!isPreview ? (
              <TabViews
                actions={tabViewsActions}
                data={tabViewsData}
              />
            ) : null }
          </div>

          {!isPreview
            ? <XHeartBeat
              userId={userId}
              keepAlive={boundEnvActions.keepAlive}
            />
            : null}

          {/* 这是一个容器, 放置所有的弹框组件, 包括(modal, popover, notify等) */}
          <Modals
            data={modalsData}
            actions={modalsActions}
          />

          {/* notification */}
          <NotificationSystem
            ref="notificationSystem"
            style={notificationStyles}
          />

          {!isPreview ? (
            <ScreenShot data={screenshotData} />
          ) : null }

          <XLoading loadingText="Loading..." isShown={!hasCoverRender} />
        </div>
      </TranslatorProvider>
    );
  }
}

export default connect(mapStateToProps, mapAppDispatchToProps)(App);
