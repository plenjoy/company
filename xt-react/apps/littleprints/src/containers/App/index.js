import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { get, merge } from 'lodash';
import Immutable from 'immutable';
import { TranslatorProvider } from 'react-translate';
import SideBar from '../../components/SideBar';
import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';

import '../../../../common/utils/extension';
import '../../../../common/utils/imagePool';
import '../../../../common/utils/uploadPool';
import { convertObjIn } from '../../../../common/utils/typeConverter';
import { initGlobalVariables } from '../../utils/global';

import 'normalize.css';
import './index.scss';
import ReactTooltip from 'react-tooltip';

import { templateTypes, productTypes } from '../../constants/strings';

// 导入字体
import '../../../../common/fontFamily/font1.css';
import '../../../../common/fontFamily/font2.css';

// 导入组件
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XHeartBeat from '../../../../common/ZNOComponents/XHeartBeat';

import PageHeader from '../../components/PageHeader';
import ViewTabs from '../../components/ViewTabs';
import ItemPrice from '../../components/ItemPrice';
import Modals from '../Modals';
import notificationStyles from './notificationStyles';
import Screenshot from '../../canvasComponents/Screenshot';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

// 打入handle
import * as computedHandler from './handle/computed';
import * as layoutHandler from './handle/layout';

import {
  doPrepare,
  toggleModal,
  doUserThings,
  onSaveProject,
  saveProjectWithOutScreenShot,
  onCloneProject,
  applyDefaultTemplateToPage,
  loadMainProjectImages
} from './handle/main';

if (__DEVELOPMENT__) {
  require('react-addons-perf');
}

class App extends Component {
  constructor(props) {
    const { boundUploadImagesActions } = props;
    super(props);

    this.doPrepare = () => doPrepare(this);
    this.toggleModal = (type, status) => toggleModal(boundUploadImagesActions, type, status);
    this.applyDefaultTemplateToPage = (temGuid, isCover) => applyDefaultTemplateToPage(this, temGuid, isCover);
    this.onSaveProject = (onSaveSuccessed, onSaveFailed, isFirstTime, isShowNotification) =>
      onSaveProject(this, onSaveSuccessed, onSaveFailed, isFirstTime, isShowNotification);
    this.saveProjectWithOutScreenShot = (onSaveSuccessed, onSaveFailed, isFirstTime, isShowNotification) =>
      saveProjectWithOutScreenShot(this, onSaveSuccessed, onSaveFailed, isFirstTime, isShowNotification);

    this.onCloneProject = (newTitle, onCloneSuccessed) =>
      onCloneProject(this, newTitle, onCloneSuccessed);
    // 计算ratio的方法.
    this.recomputedPreviewRatios = props => computedHandler.recomputedPreviewRatios(props);
    this.recomputedWorkspaceRatio = props => computedHandler.recomputedWorkspaceRatio(props);
    this.onresizingHandler = () => computedHandler.resizingHandler(this);

    this.loadMainProjectImages = () => loadMainProjectImages(this);

    this.autoFill = (uploadSuccessImages, needSortImage) =>
      layoutHandler.autoFill(this, uploadSuccessImages, needSortImage);

    // 显示preview
    this.showPreviewModal = (props) => {
      const { boundPreviewModalActions } = props || this.props;
      boundPreviewModalActions.show();
    };

    this.state = {
      isCoverDefaultTemplateUsed: false,
      isInnerDefaultTemplateUsed: false,
      shouldSaveProjectAfterTemplateUsed: false,
      isMyPhotosLoaded: false,
      isMainProjectImageLoaded: false
    };

    // 添加全局命名空间
    initGlobalVariables();
  }

  /**
   * 发送ajax请求获取初始化数据.
   */
  componentWillMount() {
    this.doPrepare();
  }
  componentDidUpdate(prevProps) {
    const {
      env,
      project,
      boundPriceActions,
      boundTemplateActions
    } = this.props;
    const qs = get(env, 'qs');
    const userInfo = get(env, 'userInfo');
    const customerId = userInfo ? userInfo.get('id') : -1;
    const isPreview = qs ? qs.get('isPreview') : false;

    const oldProject = prevProps.project;
    const newProject = project;

    const oldSetting = oldProject.setting;
    const newSetting = newProject.setting;

    const oldSize = oldSetting.get('size');
    const newSize = newSetting.get('size');

    const produtType = newSetting.get('product');

    if (oldSize !== newSize) {
      boundPriceActions.getProductPrice(newSetting.toJS());
    }

    // if (
    //   oldSize !== newSize &&
    //   customerId !== -1
    // ) {
    //   boundTemplateActions.getTemplateList(
    //     customerId,
    //     newSize,
    //     templateTypes[produtType]
    //   );
    // }

    const projectId = newProject.property.get('projectId');
    const oldIsProjectLoadCompleted = oldProject.property.get(
      'isProjectLoadCompleted'
    );
    const newIsProjectLoadCompleted = newProject.property.get(
      'isProjectLoadCompleted'
    );
    if (newIsProjectLoadCompleted && newIsProjectLoadCompleted !== oldIsProjectLoadCompleted) {
      document.getElementsByClassName('page-loading')[0].style.display = 'none';
    }
    if (projectId === -1 && !isPreview && oldIsProjectLoadCompleted !== newIsProjectLoadCompleted) {
      // 项目加载完成后，保存项目，不弹出成功提示
      this.onSaveProject(() => {}, null, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    doUserThings(this, nextProps);
    const { boundProjectActions, env } = nextProps;
    const newUserInfo = env.userInfo;
    const urlQs = env.qs;
    const newUserId = newUserInfo.get('id');
    const oldSize = get(this.props, 'settings.spec.size');
    const newSize = get(nextProps, 'settings.spec.size');

    // 初始化ratio,
    const oldWidth = get(this.props, 'size.baseWidth');
    const newWidth = get(nextProps, 'size.baseWidth');

    if ((newWidth && oldWidth !== newWidth) ||
        (oldSize && oldSize !== newSize)) {
      this.recomputedWorkspaceRatio(nextProps);
      this.recomputedPreviewRatios(nextProps);
    }

    // 判断是否为预览模式, 如果是就打开预览modal.
    const oldQs = get(this.props, 'env.qs');
    const newQs = get(nextProps, 'env.qs');
    if (oldQs.get('isPreview') !== newQs.get('isPreview') && newQs.get('isPreview')) {
      this.showPreviewModal(nextProps);
    }

    // 如果是新项目，需要在封面和内页上应用默认模板。
    const isNewProject = nextProps.project.property.get('isNewProject');
    const isCrossProject = nextProps.project.property.get('crossSell');
    if (isNewProject) {
      // 处理应用默认模板后的自动保存逻辑
      const newProject = get(nextProps, 'project');
      const projectId = newProject.property.get('projectId');
      const isProjectLoadCompleted = newProject.property.get(
        'isProjectLoadCompleted'
      );
      // 处理 cross-sell 的图片应用问题
      if (isProjectLoadCompleted && isCrossProject && !this.state.isMainProjectImageLoaded) {
        this.setState({
          isMainProjectImageLoaded: true
        });
        this.loadMainProjectImages();
      }
       // 加载myphoto的图片
      if (isProjectLoadCompleted && !this.state.isMyPhotosLoaded && urlQs.get('isFromMyPhoto')) {
        this.setState({
          isMyPhotosLoaded: true
        });
        boundProjectActions.getMyPhotosInfo(newUserId).then((res) => {
          const fromMyImages = convertObjIn(JSON.parse(res.data));
          this.autoFill(fromMyImages).then(() => {
            boundProjectActions.changeProjectProperty({
              shouldSaveProjectAfterMyPhotos: true
            });
          });
        });
      }

      // cross-sell 过后需要保存一次项目。
      const newShouldSaveProjectAfterCrossSell = newProject.property.get('shouldSaveProjectAfterCrossSell');
      if (projectId && projectId !== -1 && newShouldSaveProjectAfterCrossSell) {
        this.onSaveProject(() => {}, null, true);
        boundProjectActions.changeProjectProperty({
          shouldSaveProjectAfterCrossSell: false
        });
      }

      // MyPhotos 过后需要保存一次项目。
      const newShouldSaveProjectAfterMyPhotos = newProject.property.get('shouldSaveProjectAfterMyPhotos');
      if (projectId && projectId !== -1 && newShouldSaveProjectAfterMyPhotos) {
        this.onSaveProject(() => {}, null, true);
        boundProjectActions.changeProjectProperty({
          shouldSaveProjectAfterMyPhotos: false
        });
      }
    }
  }

  componentDidMount() {
    const isSupportSaveProject = true;

    addEventListener(window, 'resize', this.onresizingHandler);

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

  componentWillUnmount() {
    // 移除resizing的处理函数.
    removeEventListener(window, 'resize', this.onresizingHandler);
  }

  render() {
    const {
     translations,
     env,
     confirmModal,
     summary,
     upload,
     project,
     sidebar,
     paginationSpread,
     uploadedImages,
     settings,
     imageUsedMap,
     imageEditModal,
     alertModal,
     cloneModal,
     pagination,
     price,
     parameters,
     allSheets,
     allImages,
     fontList,
     textEditModal,
     previewModal,
     upgradeSize,
     // preview
     previewRatios,
     previewSize,
     capabilities,

     urls,
     size,
     ratios,
     variables,
     template,
     specData,
     spec,
     capability,
     upgradeModal,


     autoAddPhotoToCanvas,
     boundEnvActions,
     boundTrackerActions,
     boundImagesActions,
     boundProjectActions,
     boundSidebarActions,
     boundUploadImagesActions,
     boundContactUsActions,
     uploadingImages,
     contactUsModal,
     boundImageEditModalActions,
     boundNotificationActions,
     boundConfirmModalActions,
     boundAlertModalActions,
     boundTemplateActions,
     boundPaginationActions,
     boundTextEditModalActions,
     boundPropertyModalActions,
     boundCloneModalActions,
     boundPriceActions,
     boundPreviewModalActions,
     boundUpgradeModalActions
    } = this.props;

    const baseUrls = env.urls;
    const toggleModal = this.toggleModal;
    const isPreview = false;
    const hasCoverRender = true;
    const userId = env.userInfo.get('id');
    // page header
    const pageHeaderActions = {
      boundProjectActions,
      boundTrackerActions,
      boundCloneModalActions,
      boundNotificationActions,
      boundConfirmModalActions,
      boundAlertModalActions,
      boundPreviewModalActions,
      onSaveProject: this.onSaveProject,
      onCloneProject: this.onCloneProject,
      boundUpgradeModalActions
    };
    const pageHeaderData = {
      env,
      project
    };

    // view tabs
    const viewTabsActions = {
      boundTrackerActions,
      boundImageEditModalActions
    };
    const viewTabsData = { settings, allSheets };

    const pages = paginationSpread.get('pages');
    const selectedPageId = pagination.pageId;
    const currentPage = pages.find((p) => { return p.get('id') === selectedPageId; });

    // modal
    const modalsActions = {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      boundContactUsActions,
      boundImageEditModalActions,
      boundConfirmModalActions,
      boundAlertModalActions,
      boundCloneModalActions,
      boundEnvActions,
      boundPreviewModalActions,
      boundTextEditModalActions,
      boundUpgradeModalActions,
      boundNotificationActions,
      onSaveProject: this.onSaveProject,
      onCloneProject: this.onCloneProject,
      autoFill: this.autoFill,
      saveProjectWithOutScreenShot:this.saveProjectWithOutScreenShot
    };
    const modalsData = {
      alertModal,
      confirmModal,
      cloneModal,
      env,
      upload,
      project,
      settings,
      parameters,
      allSheets,
      allImages,
      baseUrls,
      fontList,
      textEditModal,
      pagination: Immutable.fromJS(pagination),
      autoAddPhotoToCanvas,
      uploadingImages,
      contactUsModal,
      imageEditModal,
      previewModal,
      upgradeSize,
      // preview
      previewRatios,
      previewSize,
      capabilities,
      currentPage,
      variables,
      ratio: ratios.workspace,
      ratios,
      elementArray: project.elementArray,
      upgradeModal,
      urls,
      size,
      template,
      paginationSpread,
      isPreview,
      specData: spec,
      userId,
      capability,
      price
    };

     // 左侧导航方法与数据
    const sideBarActions = {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      boundSidebarActions,
      boundPriceActions
    };
    const sideBarData = {
      sidebar,
      uploadedImages,
      baseUrls,
      imageUsedMap,
      project,
      isShowSideBar: true,
      settings,
      allImages
    };

    const itemPriceActions = { boundTrackerActions };
    const itemPriceData = {
      price,
      parameters,
      settings
    };

    const bookCoverActions = {
    };

    const bookCoverData = {
      urls,
      size,
      ratios,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      parameters,
      isPreview,
      specData: spec,
      project,
      allImages,
      userId,
      capability,
      allSheets
    };

    const isProjectLoadCompleted = project.property.get(
      'isProjectLoadCompleted'
    );

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
            <ItemPrice actions={itemPriceActions} data={itemPriceData} />
            <SideBar actions={sideBarActions} data={sideBarData} />
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
          {
            isProjectLoadCompleted && bookCoverData ?
              <Screenshot
                actions={bookCoverActions}
                data={bookCoverData}
              />
            : null
          }

          <ReactTooltip />
        </div>
      </TranslatorProvider>

    );
  }
}

export default connect(mapStateToProps, mapAppDispatchToProps)(App);
