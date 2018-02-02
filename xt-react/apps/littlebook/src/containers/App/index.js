import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { get, merge } from 'lodash';
import { TranslatorProvider } from 'react-translate';

import '../../../../common/utils/extension';
import '../../../../common/utils/imagePool';
import '../../../../common/utils/uploadPool';

// import '../../../../common/utils/setDragImage';
import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';
import { allOptionMap } from '../../reducers/project/projectReducer';
import { getCoverFullName } from '../../utils/projectOptions';

import 'normalize.css';
import './index.scss';

// 导入字体
import '../../../../common/fontFamily/font1.css';
import '../../../../common/fontFamily/font2.css';

// 导入组件
import XLoading from '../../../../common/ZNOComponents/XLoading';
import PageHeader from '../../components/PageHeader';
import ViewTabs from '../../components/ViewTabs';
import SideBar from '../../components/SideBar';
import Modals from '../Modals';
import ScreenShot from '../../canvasComponents/ScreenShot';

import XHeartBeat from '../../../../common/ZNOComponents/XHeartBeat';
import XSimplePrice from '../../../../common/ZNOComponents/XSimplePrice';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/app';
import { templateCoverTypes } from '../../contants/strings';

// 打入handle
import {
  doPrepare,
  toggleModal,
  doUserThings,
  onSaveProject,
  onCloneProject,
  checkIsEditPage
} from './handler/app';
import * as computedHandler from './handler/computed';
import * as layoutHandler from './handler/layout';
import login from './handler/login';

import notificationStyles from './notificationStyles';

if (__DEVELOPMENT__) {
  require('react-addons-perf');
}

class App extends Component {
  constructor(props) {
    const { boundUploadImagesActions } = props;
    super(props);

    // 初始化工作.
    this.doPrepare = () => doPrepare(this);
    this.toggleModal = (type, status) =>
      toggleModal(boundUploadImagesActions, type, status);
    this.onSaveProject = (
      onSaveSuccessed,
      onSaveFailed,
      isFirstTime = false,
      isUploadCoverImg = true,
      nextProps = null
    ) => {
      return onSaveProject(
        this,
        onSaveSuccessed,
        onSaveFailed,
        isFirstTime,
        isUploadCoverImg,
        nextProps
      );
    };

    this.onCloneProject = (newTitle, onCloneSuccessed) =>
      onCloneProject(this, newTitle, onCloneSuccessed);

    // window resize时的处理函数.
    this.onresizingHandler = () => computedHandler.resizingHandler(this);

    this.getCoverImage = (props, done) =>
      computedHandler.getCoverImage(this, props, done);
    this.getInnerImage = (props, done) =>
      computedHandler.getInnerImage(this, props, done);

    // 计算ratio的方法.
    this.recomputedScreenRatios = props =>
      computedHandler.recomputedScreenRatios(props);
    this.recomputedPreviewRatios = props =>
      computedHandler.recomputedPreviewRatios(props);
    this.recomputedOrderRatios = props =>
      computedHandler.recomputedOrderRatios(props);
    this.recomputedWorkspaceRatio = props =>
      computedHandler.recomputedWorkspaceRatio(props);
    this.recomputedRenderRatios = props =>
      computedHandler.recomputedRenderRatios(props);

    this.autoFill = uploadSuccessImages =>
      layoutHandler.autoFill(this, uploadSuccessImages);
    this.applyTemplate = guid => layoutHandler.applyTemplate(this, guid);

    // 切换页面.
    this.switchPageTo = (props, pageIndex) =>
      switchPageTo(this, props, pageIndex);

    // 显示preview
    this.showPreviewModal = props => {
      const { boundPreviewModalActions } = props || this.props;
      boundPreviewModalActions.show();
    };

    this.state = {
      needScreenShot: true
    };

    const app = window.__app || {};
    window.__app = app;

    this.openInNewTab = this.openInNewTab.bind(this);

    this.login = type => login(this, type);
  }

  /**
   * 发送ajax请求获取初始化数据.
   */
  componentWillMount() {
    this.doPrepare();
  }

  componentDidUpdate(prevProps) {
    const {
      project,
      env,
      boundPriceActions,
      boundProjectActions,
      boundTemplateActions,
      isSupportSaveProject
    } = this.props;

    const qs = get(env, 'qs');
    const userInfo = get(env, 'userInfo');

    const customerId = userInfo ? userInfo.get('id') : -1;
    const isPreview = qs ? qs.get('isPreview') : false;

    const oldProject = prevProps.project;
    const newProject = project;

    const oldSetting = oldProject.get('setting');
    const newSetting = newProject.get('setting');

    const oldPaper = oldSetting.get('paper');
    const newPaper = newSetting.get('paper');

    const oldSize = oldSetting.get('size');
    const newSize = newSetting.get('size');

    const oldCover = oldSetting.get('cover');
    const newCover = newSetting.get('cover');

    const oldProduct = oldSetting.get('product');
    const newProduct = newSetting.get('product');

    const oldPaperThickness = oldSetting.get('paperThickness');
    const newPaperThickness = newSetting.get('paperThickness');

    if (
      (oldPaper !== newPaper ||
        oldPaperThickness !== newPaperThickness ||
        oldCover !== newCover ||
        oldProduct !== newProduct ||
        oldSize !== newSize) &&
      !isPreview
    ) {
      boundPriceActions.getProductPrice(newSetting.toJS());
    }

    const oldProjectId = oldProject.get('projectId');
    const newProjectId = newProject.get('projectId');
    const oldIsProjectLoadCompleted = oldProject.get('isProjectLoadCompleted');
    const newIsProjectLoadCompleted = newProject.get('isProjectLoadCompleted');

    const oldIsAutoSaveProject = oldProject.get('isAutoSaveProject');
    const newIsAutoSaveProject = newProject.get('isAutoSaveProject');
    if (oldProjectId !== newProjectId && newProjectId !== -1) {
      if (newIsAutoSaveProject && newIsProjectLoadCompleted) {
        // this.onSaveProject(() => {}, null, false, false);

        // 重置autosave的状态.
        boundProjectActions.autoSaveProject(false);
      }
    }

    if (!isSupportSaveProject) {
      window.onbeforeunload = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    doUserThings(this, nextProps);

    const { boundGlobalLoadingActions, boundProjectActions } = nextProps;

    const oldSize = get(this.props, 'settings.spec.size');
    const newSize = get(nextProps, 'settings.spec.size');

    const oldMaterials = get(this.props, 'materials');
    const newMaterials = get(nextProps, 'materials');
    const isDownloadOriginalMaterialsCompleted = newMaterials.get(
      'isDownloadCompleted'
    );

    // cover类型更改.
    const oldCoverType = get(this.props, 'settings.spec.cover');
    const newCoverType = get(nextProps, 'settings.spec.cover');

    if (oldCoverType !== newCoverType && isDownloadOriginalMaterialsCompleted) {
      this.getCoverImage(nextProps);
      this.getInnerImage(nextProps);
    }

    // 初始化ratio,
    const oldWidth = get(this.props, 'size.coverSpreadSize.width');
    const newWidth = get(nextProps, 'size.coverSpreadSize.width');
    const oldProductSize = get(this.props, 'settings.spec.size');
    const newProductSize = get(nextProps, 'settings.spec.size');
    if (
      (newWidth && oldWidth !== newWidth) ||
      (oldProductSize && oldProductSize !== newProductSize)
    ) {
      this.recomputedScreenRatios(nextProps);
      this.recomputedPreviewRatios(nextProps);
      this.recomputedOrderRatios(nextProps);
      this.recomputedWorkspaceRatio(nextProps);
    }

    // workspace size changed.
    const oldCoverWidth = get(this.props, 'size.renderCoverSize.width');
    const newCoverWidth = get(nextProps, 'size.renderCoverSize.width');
    const oldSpainWidth = get(this.props, 'size.renderSpainWidth');
    const newSpainWidth = get(nextProps, 'size.renderSpainWidth');
    if (
      ((newCoverWidth && oldCoverWidth !== newCoverWidth) ||
        (newSpainWidth && oldSpainWidth !== newSpainWidth)) &&
      isDownloadOriginalMaterialsCompleted
    ) {
      this.getCoverImage(nextProps);
      this.getInnerImage(nextProps);
    }

    // 如果渲染的效果图的素材发生变化, 就重新计算渲染效果图的缩放比例.
    const oldCoverRenderWidth = this.props.materials.getIn([
      'cover',
      'size',
      'width'
    ]);
    const newCoverRenderWidth = nextProps.materials.getIn([
      'cover',
      'size',
      'width'
    ]);
    const oldInnerRenderWidth = this.props.materials.getIn([
      'inner',
      'size',
      'width'
    ]);
    const newInnerRenderWidth = nextProps.materials.getIn([
      'inner',
      'size',
      'width'
    ]);
    if (
      oldCoverRenderWidth !== newCoverRenderWidth ||
      oldInnerRenderWidth !== newInnerRenderWidth
    ) {
      this.recomputedRenderRatios(nextProps);
    }

    // 计算渲染效果图白边的缩放比
    // 计算渲染效果图sheet非内容区(sheet的原始大小减去出血)
    const oldRenderCoverWidth = get(this.props, 'size.renderCoverSize.width');
    const newRenderCoverWidth = get(nextProps, 'size.renderCoverSize.width');
    if (
      !oldRenderCoverWidth &&
      newRenderCoverWidth &&
      oldRenderCoverWidth !== newRenderCoverWidth
    ) {
      this.recomputedRenderRatios(nextProps);
    }

    // 判断是否为预览模式, 如果是就打开预览modal.
    const oldQs = get(this.props, 'env.qs');
    const newQs = get(nextProps, 'env.qs');
    if (
      oldQs.get('isPreview') !== newQs.get('isPreview') &&
      newQs.get('isPreview')
    ) {
      this.showPreviewModal(nextProps);
    }
    // 判断是否是匿名分享的连接，是的话就 更改页面的 title；格式： size cover Preview
    const oldIsProjectLoadCompleted = this.props.project.get(
      'isProjectLoadCompleted'
    );
    const newIsProjectLoadCompleted = nextProps.project.get(
      'isProjectLoadCompleted'
    );
    if (
      /share.asovx.com/.test(window.location.href) &&
      (oldIsProjectLoadCompleted !== newIsProjectLoadCompleted ||
        oldCoverType !== newCoverType ||
        oldSize !== newSize) &&
      newCoverType &&
      newSize &&
      newIsProjectLoadCompleted
    ) {
      const coverMap = allOptionMap && allOptionMap.cover;
      const coverLabel =
        coverMap instanceof Array &&
        coverMap.find(item => item.id === newCoverType).name;
      // document.querySelector(
      //   'title'
      // ).innerHTML = `${newSize} ${coverLabel} Preview`;
    }

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const newCoverEffectImg = newMaterials
      ? newMaterials.getIn(['cover', 'img'])
      : null;
    const oldCoverEffectImg = oldMaterials
      ? oldMaterials.getIn(['cover', 'img'])
      : null;

    if (newCoverEffectImg && oldCoverEffectImg != newCoverEffectImg) {
      boundGlobalLoadingActions.hide();
    }

    const newIsAutoSaveProject = nextProps.project.get('isAutoSaveProject');
    const newProjectId = nextProps.project.get('projectId');
    if (
      newProjectId &&
      newProjectId !== -1 &&
      newIsAutoSaveProject &&
      newIsProjectLoadCompleted
    ) {
      this.onSaveProject(() => {}, null, false, false, nextProps);

      // 重置autosave的状态.
      boundProjectActions.autoSaveProject(false);
  }
  }

  componentDidMount() {
    const { isSupportSaveProject } = this.props;

    // 添加resizing处理函数, 用于改变workspace的ratio
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

  openInNewTab() {
    window.open(window.location.href);
  }

  render() {
    const {
      translations,
      sidebar,
      uploadingImages,
      uploadedImages,
      upload,
      price,
      template,
      allTemplate,
      stickerList,
      env,
      autoAddPhotoToCanvas,
      project,
      bookSettingsModal,
      paintedTextModal,
      imageEditModal,
      textEditModal,
      propertyModal,
      confirmModal,
      upgradeModal,
      howThisWorksModal,
      quickStartModal,
      contactUsModal,
      shareProjectModal,
      saveTemplateModal,
      cloneModal,
      alertModal,
      previewModal,
      pageLoadingModal,
      changeBgColorModal,
      approvalPage,
      fontList,
      ratio,
      size,
      pagination,
      paginationSpread,
      paginationSpreadForCover,
      spec,
      materials,
      variables,
      settings,
      parameters,
      snipping,
      allImages,
      allSheets,
      allElements,
      isSupportSaveProject,
      capabilities,
      globalLoading,
      autoUpload,
      selectModal,
      oAuth,

      // preview
      previewRatios,
      previewSize,
      previewPosition,

      position,
      isImageCover,

      // order page
      orderRatios,
      orderSize,
      orderPosition,

      // used count
      imageUsedCountMap,
      decorationUsedCountMap,

      // actions
      boundSidebarActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundBookSettingsModalActions,
      boundPaintedTextModalActions,
      boundImageEditModalActions,
      boundTextEditModalActions,
      boundProjectActions,

      boundEnvActions,
      boundConfirmModalActions,
      boundUpgradeModalActions,
      boundHowThisWorksActions,
      boundQuickStartActions,
      boundContactUsActions,
      boundShareProjectActions,
      boundCloneModalActions,
      boundNotificationActions,
      boundAlertModalActions,
      boundPreviewModalActions,
      boundPageLoadingModalActions,
      boundChangeBgColorModalActions,
      boundApprovalPageActions,
      boundPaginationActions,
      boundTrackerActions,
      boundSnippingActions,
      boundTemplateActions,
      boundGlobalLoadingActions,
      boundOAuthActions,
      boundAutoUploadActions,
      boundSelectModalActions
    } = this.props;

    const { needScreenShot } = this.state;

    const toggleModal = this.toggleModal;
    const baseUrls = env.urls;
    const userInfo = env.userInfo;
    const qs = env.qs;
    const setting = project.get('setting');

    // 封装actions方法到一个对象, 以减少组件属性的传递.
    // 顶部导航方法与数据
    const pageHeaderActions = {
      boundProjectActions,
      boundHowThisWorksActions,
      boundQuickStartActions,
      boundContactUsActions,
      boundShareProjectActions,
      boundCloneModalActions,
      boundConfirmModalActions,
      boundUpgradeModalActions,
      boundNotificationActions,
      boundAlertModalActions,
      boundPreviewModalActions,
      boundPaginationActions,
      boundTemplateActions,
      boundNotificationActions,
      boundTrackerActions,
      boundApprovalPageActions,
      boundGlobalLoadingActions,
      onSaveProject: this.onSaveProject,
      onCloneProject: this.onCloneProject,
      onApplyTemplate: this.applyTemplate
    };

    // Item Price 方法与数据
    const coverName = getCoverFullName(get(settings, 'spec.cover'));
    const productSize = get(settings, 'spec.size');
    const priceValue = price.getIn(['main', 'oriPrice']);
    const productPrice = priceValue || 0.0;

    const pageHeaderData = {
      env,
      project,
      spec,
      settings,
      allTemplate,
      productPrice
    };

    // 左侧导航方法与数据
    const sideBarActions = {
      boundSidebarActions,
      boundImagesActions,
      boundProjectActions,
      toggleModal,
      boundTrackerActions,
      login: this.login
    };
    const sideBarData = {
      sidebar,
      paginationSpread,
      uploadedImages,
      baseUrls,
      template,
      stickerList,
      setting,
      bookSetting: settings.bookSetting,
      imageUsedCountMap,
      pagination,
      ratio,
      decorationUsedCountMap,
      userInfo
    };

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
    const newPreviewRatios = merge({}, previewRatios);
    const newOrderRatios = merge({}, orderRatios);

    if (
      previewSize.coverSpreadSize.width &&
      newPreviewRatios.coverWorkspace &&
      previewSize.coverSpreadSize.width * newPreviewRatios.coverWorkspace !==
        previewSize.coverWorkspaceSize.width
    ) {
      // 重新计算preview的coverWorkspace.
      newPreviewRatios.coverWorkspace =
        previewSize.coverWorkspaceSize.width /
        previewSize.coverSpreadSize.width;

      // 重新计算order page的coverWorkspace.
      newOrderRatios.coverWorkspace =
        orderSize.coverWorkspaceSize.width / orderSize.coverSpreadSize.width;

      if (pagination.get('sheetIndex') === 0) {
        newPreviewRatios.workspace = newPreviewRatios.coverWorkspace;
        newOrderRatios.workspace = newOrderRatios.coverWorkspace;
      }
    }

    const coverRatio = merge({}, ratio);

    if (
      size.coverSpreadSize.width &&
      coverRatio.coverWorkspace &&
      size.coverSpreadSize.width * coverRatio.coverWorkspace !==
        size.coverWorkspaceSize.width
    ) {
      coverRatio.coverWorkspace =
        size.coverWorkspaceSize.width / size.coverSpreadSize.width;
    }

    // 各种弹窗方法与数据
    const modalsActions = {
      boundImagesActions,
      boundBookSettingsModalActions,
      boundPaintedTextModalActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundTextEditModalActions,
      boundConfirmModalActions,
      boundUpgradeModalActions,
      boundHowThisWorksActions,
      boundQuickStartActions,
      boundContactUsActions,
      boundShareProjectActions,
      boundCloneModalActions,
      toggleModal,
      boundNotificationActions,
      boundAlertModalActions,
      boundPreviewModalActions,
      boundPageLoadingModalActions,
      boundChangeBgColorModalActions,
      boundApprovalPageActions,
      boundTemplateActions,
      onSaveProject: this.onSaveProject,
      onCloneProject: this.onCloneProject,
      boundEnvActions,
      boundTrackerActions,
      boundSnippingActions,
      autoFill: this.autoFill,
      boundAutoUploadActions,
      boundOAuthActions,
      login: this.login,
      boundSelectModalActions
    };

    const currentPage = paginationSpread.get('page');

    const modalsData = {
      spec,
      env,
      autoAddPhotoToCanvas,
      project,
      upload,
      uploadingImages,
      bookSettingsModal,
      paintedTextModal,
      imageEditModal,
      textEditModal,
      propertyModal,
      confirmModal,
      upgradeModal,
      howThisWorksModal,
      quickStartModal,
      contactUsModal,
      shareProjectModal,
      saveTemplateModal,
      alertModal,
      cloneModal,
      previewModal,
      pageLoadingModal,
      changeBgColorModal,
      approvalPage,
      fontList,
      baseUrls,
      currentPage,
      pagination,
      paginationSpread,
      ratio: ratio.workspace,
      bookSetting: project.get('bookSetting'),
      elementArray: project.get('elementArray'),
      isSupportSaveProject,

      materials,
      variables,
      settings,
      parameters,
      snipping,
      allSheets,
      allImages,

      // preview
      previewRatios: newPreviewRatios,
      previewSize,
      previewPosition,

      // order page
      orderRatios: newOrderRatios,
      orderSize,
      orderPosition,
      isImageCover,
      capabilities,
      autoUpload,
      oAuth,
      selectModal
    };

    const viewTabsActions = {
      boundTrackerActions,
      applyTemplate: this.applyTemplate
    };
    const projectId = project.get('projectId');
    const viewTabsData = { projectId };

    const userId = env.userInfo.get('id');

    // 根据当前的 url 判断是否为 分享预览状态。
    const isPreview = /isPreview/.test(window.location.href);

    const isProjectLoadCompleted = project.get('isProjectLoadCompleted');

    const screenshotData = {
      variables,
      materials,
      size,
      isPreview,
      settings,
      template,
      parameters,
      position,
      isImageCover,
      ratio: coverRatio,
      elementArray: allElements,
      paginationSpread: paginationSpreadForCover,
      urls: baseUrls,
      env
    };

    const isFromFactory = qs.get('source') === 'factory';

    return (
      <TranslatorProvider translations={translations}>
        <div className="app">
          {isPreview && isFromFactory ? (
            <button className="full-screen-btn" onClick={this.openInNewTab}>
              Full Screen
            </button>
          ) : null}

          {userId === -1 || isPreview ? null : isProjectLoadCompleted ? (
            <div className="main-modules">
              {/* 页面顶部导航组件 */}
              <PageHeader actions={pageHeaderActions} data={pageHeaderData} />

              {/* 产品价格显示 */}
              <XSimplePrice
                productSize={productSize}
                coverName={coverName}
                price={productPrice}
              />

              {/* 左侧的导航组件 */}
              <ViewTabs actions={viewTabsActions} data={viewTabsData} />

              {/* 左侧的导航组件 */}
              <SideBar actions={sideBarActions} data={sideBarData} />
            </div>
          ) : null}

          {!isPreview ? (
            <XHeartBeat userId={userId} keepAlive={boundEnvActions.keepAlive} />
          ) : null}

          {/* 这是一个容器, 放置所有的弹框组件, 包括(modal, popover, notify等) */}
          <Modals actions={modalsActions} data={modalsData} />

          {/* notification */}
          <NotificationSystem
            ref="notificationSystem"
            style={notificationStyles}
          />

          {needScreenShot ? <ScreenShot {...screenshotData} /> : null}

          {globalLoading.get('isShown') ? <XLoading hasText isShown /> : null}
        </div>
      </TranslatorProvider>
    );
  }
}

export default connect(mapStateToProps, mapAppDispatchToProps)(App);
