import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { TranslatorProvider, translate } from 'react-translate';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import '../../../../common/utils/extension';
import '../../../../common/utils/imagePool';
import '../../../../common/utils/uploadPool';

import {
  getResizeEventType,
  isMobileDevice
} from '../../../../common/utils/mobile';

import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';

import { checkPaintedTextInCover } from '../../utils/projectGenerator';
import { initGlobalVariables } from '../../utils/global';
import {
  checkIsSupportParentBook,
  checkIsSupportEditParentBook
} from '../../utils/cover';

import 'normalize.css';
import './index.scss';

// 导入字体
import '../../../../common/fontFamily/font1.css';
import '../../../../common/fontFamily/font2.css';

// 导入组件
import PageHeader from '../../components/PageHeader';
import ViewTabs from '../../components/ViewTabs';
import SideBar from '../../components/SideBar';
import ItemPrice from '../../components/ItemPrice';
import ScreenShot from '../../canvasComponents/ScreenShot';
import Modals from '../Modals';

import XHeartBeat from '../../../../common/ZNOComponents/XHeartBeat';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/app';

// 打入handle
import {
  doPrepare,
  toggleModal,
  doUserThings,
  onSaveProject,
  onCloneProject,
  listSpecData,
  checkIsEditPage,
  openLoginPage
} from './handler/app';
import * as computedHandler from './handler/computed';
import * as uploadHandler from './handler/upload';
import * as autoLayoutHandler from './handler/autolayout';

// 新手指引.
import * as introHandle from './handler/intro';
import * as mobileHandle from './handler/mobile';
// import { initWorker } from './handler/worker';

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
      isFirstTime,
      isShowNotification
    ) =>
      onSaveProject(
        this,
        onSaveSuccessed,
        onSaveFailed,
        isFirstTime,
        isShowNotification
      );
    this.onCloneProject = (newTitle, onCloneSuccessed) =>
      onCloneProject(this, newTitle, onCloneSuccessed);

    this.listSpecData = () => listSpecData(this);
    this.openLoginPage = () => openLoginPage(this);

    // window resize时的处理函数.
    this.onresizingHandler = () => {
      computedHandler.resizingHandler(this);

      // 设置app节点的样式, 以方便在PC和移动设备上显示.
      const appStyle = this.getAppStyle();
      this.setState({ appStyle });
    };

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

    // 切换页面.
    this.switchPageTo = (props, pageIndex) =>
      switchPageTo(this, props, pageIndex);

    // 显示preview
    this.showPreviewModal = props => {
      const { boundPreviewModalActions } = props || this.props;
      boundPreviewModalActions.show();
    };

    this.getCoverFullName = (coverType, coverOptions) => {
      const option = coverOptions.find(item => item.id === coverType);
      return option ? option.name : '';
    };

    this.toggleSideBar = value => {
      this.setState({ isShowSideBar: value });
    };

    this.addStatusCount = (fieldName, count) =>
      uploadHandler.addStatusCount(this, fieldName, count);
    this.updateStatusCount = (fieldName, count) =>
      uploadHandler.updateStatusCount(this, fieldName, count);
    this.resetStatusCount = () => uploadHandler.resetStatus(this);

    this.doAutoLayout = addElements =>
      autoLayoutHandler.doAutoLayout(this, addElements);

    this.state = {
      needScreenShot: true,
      isShowSideBar: true,
      defaultThemeType: '',
      uploadStatus: {
        total: 0,
        uploaded: 0,
        errored: 0
      },

      // 定义在移动设备和pc上的不同style.
      appStyle: {}
    };

    // 添加全局命名空间
    initGlobalVariables();
    // initWorker();

    this.openInNewTab = this.openInNewTab.bind(this);

    // 新手指引
    this.onSkip = () => introHandle.onSkip(this);
    this.onDone = () => introHandle.onDone(this);
    this.onOrderStep = () => introHandle.onOrderStep(this);
    this.onNext = () => introHandle.onNext(this);
    this.onPrevious = () => introHandle.onPrevious(this);
    this.onGoto = stepIndex => introHandle.goto(this, stepIndex);
    this.showIntroModal = () => introHandle.showIntroModal(this);

    // 设置在移动端或PC显示时的样式.
    this.getAppStyle = () => mobileHandle.getAppStyle(this);
    this.stopEvent = event => {
      event.stopPropagation();
      event.preventDefault();

      return false;
    };
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
      boundTemplateActions,
      boundPriceActions,
      boundProjectActions
    } = this.props;

    const qs = get(env, 'qs');
    const userInfo = get(env, 'userInfo');

    const customerId = userInfo ? userInfo.get('id') : -1;
    const isPreview = qs ? qs.get('isPreview') : false;

    const oldProject = prevProps.project;
    const newProject = project;

    const oldSetting = oldProject.setting;
    const newSetting = newProject.setting;

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
      boundPriceActions.getProductPrice(newSetting.toJS()).then(res => {
        if (res && res.data && res.data.main && res.data.main.couponId) {
          boundPriceActions.getCouponDetail(res.data.main.couponId);
        }
      });
    }

    if (
      (oldSize !== newSize ||
        oldCover !== newCover ||
        oldProduct !== newProduct) &&
      customerId !== -1
    ) {
      // 取封面模板
      boundTemplateActions
        .getTemplateList(customerId, newSize, newCover, newProduct)
        .then(() => {
          // 取内页模板
          boundTemplateActions.getTemplateList(
            customerId,
            newSize,
            newCover,
            newProduct,
            false
          );
        });
    }

    const projectId = newProject.property.get('projectId');
    const bookThemeId = newProject.property.get('bookThemeId');
    const oldIsProjectLoadCompleted = oldProject.property.get(
      'isProjectLoadCompleted'
    );
    const newIsProjectLoadCompleted = newProject.property.get(
      'isProjectLoadCompleted'
    );
    if (
      projectId === -1 &&
      !isPreview &&
      oldIsProjectLoadCompleted !== newIsProjectLoadCompleted
    ) {
      // 选取10%的用户（尾号10-19）默认打开Professional View的开关
      const remainder = parseInt(customerId % 100);
      if (remainder <= 19 && remainder >= 10) {
        boundProjectActions
          .changeBookSetting({
            professionalView: true
          })
          .then(() => {
            // 项目加载完成后，保存项目，不弹出成功提示
            // this.onSaveProject(() => {}, null, true);
          });
      } else {
        // 项目加载完成后，保存项目，不弹出成功提示
        // this.onSaveProject(() => {}, null, true);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    doUserThings(this, nextProps);

    const {
      boundGlobalLoadingActions,
      boundThemeActions,
      boundThemeStickerActions,
      boundProjectActions
    } = nextProps;

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

    if (
      oldCoverType !== newCoverType &&
      newCoverType &&
      isDownloadOriginalMaterialsCompleted
    ) {
      this.getCoverImage(nextProps);
      this.getInnerImage(nextProps);
    }

    // 初始化ratio,
    const oldWidth = get(this.props, 'size.coverSpreadSize.width');
    const newWidth = get(nextProps, 'size.coverSpreadSize.width');
    const oldInnerWidth = get(this.props, 'size.innerSpreadSize.width');
    const newInnerWidth = get(nextProps, 'size.innerSpreadSize.width');

    // 高级模式
    const oldIsAdvancedMode = this.props.capabilities.getIn([
      'base',
      'isAdvancedMode'
    ]);
    const newIsAdvancedMode = nextProps.capabilities.getIn([
      'base',
      'isAdvancedMode'
    ]);

    const oldProductSize = get(this.props, 'settings.spec.size');
    const newProductSize = get(nextProps, 'settings.spec.size');
    if (
      (newWidth && oldWidth !== newWidth) ||
      (newInnerWidth && oldInnerWidth !== newInnerWidth) ||
      (oldProductSize && oldProductSize !== newProductSize) ||
      oldIsAdvancedMode !== newIsAdvancedMode
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
    const oldIsProjectLoadCompleted = this.props.project.property.get(
      'isProjectLoadCompleted'
    );
    const newIsProjectLoadCompleted = nextProps.project.property.get(
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
      const coverOptions = get(nextProps, 'spec.allOptionMap.cover');
      const coverFullName = this.getCoverFullName(newCoverType, coverOptions);
      // document.querySelector(
      //   'title'
      // ).innerHTML = `${newSize} ${coverFullName} Preview`;
    }

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    // const newCoverEffectImg = newMaterials
    //   ? newMaterials.getIn(['cover', 'img'])
    //   : null;
    // const oldCoverEffectImg = oldMaterials
    //   ? oldMaterials.getIn(['cover', 'img'])
    //   : null;

    // if (newCoverEffectImg && oldCoverEffectImg != newCoverEffectImg) {
    //   boundGlobalLoadingActions.hideGlobalLoading();
    // }

    if (
      oldIsProjectLoadCompleted !== newIsProjectLoadCompleted &&
      newIsProjectLoadCompleted
    ) {
      boundGlobalLoadingActions.hideGlobalLoading();
    }

    const newSstickerLists = get(nextProps, 'themestickerList.list');

    const oldThemeSummary = get(this.props, 'themeSummary');
    const newThemeSummary = get(nextProps, 'themeSummary');

    const oldSpec = fromJS(get(this.props, 'settings.spec'));
    const newSpec = fromJS(get(nextProps, 'settings.spec'));

    const product = newSpec.get('product');
    const size = newSpec.get('size');

    const oldApplyBookThemeId = get(this.props, 'project.property').get(
      'applyBookThemeId'
    );
    const newApplyBookThemeId = get(nextProps, 'project.property').get(
      'applyBookThemeId'
    );

    const oldBookThemeId = get(this.props, 'project.property').get(
      'applyBookThemeId'
    );
    const newBookThemeId = get(nextProps, 'project.property').get(
      'applyBookThemeId'
    );

    if (
      !is(oldThemeSummary, newThemeSummary) ||
      !is(oldSpec, newSpec) ||
      oldApplyBookThemeId !== newApplyBookThemeId
    ) {
      const themeType = newThemeSummary.get('currentThemeType');
      if (themeType && product && size) {
        // pageSize设置一个很大的值, 模拟取全部. currentThemeType
        boundThemeActions.getThemes({
          themeType,
          product,
          size,
          pageNumber: 1,
          pageSize: 10000
        });
        if (newBookThemeId) {
          boundThemeActions.getBackgrounds({
            themeGuid: newBookThemeId,
            pageNumber: 0,
            pageSize: 10000
          });
        }
        if (newApplyBookThemeId) {
          boundThemeStickerActions.getThemeStickerList(
            themeType,
            newApplyBookThemeId
          );
        }
      }
    }

    if (oldBookThemeId !== newBookThemeId && newBookThemeId) {
      boundThemeStickerActions.getThemeStickerList('', newBookThemeId);
    }
  }

  componentDidMount() {
    // 添加resizing处理函数, 用于改变workspace的ratio
    const resizeEventType = getResizeEventType();
    addEventListener(window, resizeEventType, this.onresizingHandler);

    if (isMobileDevice()) {
      addEventListener(window, 'touchmove', this.stopEvent);
    }

    if (!/isPreview/.test(window.location.href)) {
      window.onbeforeunload = () =>
        'Unsaved changes(If any) will be discarded. Are you sure to exit?';
    }

    const { boundNotificationActions } = this.props;
    boundNotificationActions.initNotificationSystem(
      this.refs.notificationSystem
    );

    // window.setTimeout(this.listSpecData, 7000);
  }

  componentWillUnmount() {
    const resizeEventType = getResizeEventType();

    // 移除resizing的处理函数.
    removeEventListener(window, resizeEventType, this.onresizingHandler);

    if (isMobileDevice()) {
      removeEventListener(window, 'touchmove', this.stopEvent);
    }
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
      coupon,
      template,
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
      howThisWorksModal,
      quickStartModal,
      guideLineModal,
      contactUsModal,
      shareProjectModal,
      themeOverlayModal,
      saveTemplateModal,
      cloneModal,
      previewScreenshot,
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
      coverSpreadForInnerWrap,
      paginationSpreadForCover,
      allContainers,
      spec,
      materials,
      variables,
      settings,
      parameters,
      snipping,
      allImages,
      allSheets,
      capabilities,
      themesCategories,
      themestickerList,
      backgrounds,
      globalLoading,
      isUseUnblockUpload,
      xtroModal,
      useSpecModal,

      // preview
      previewRatios,
      previewSize,
      previewPosition,

      position,

      // order page
      orderRatios,
      orderSize,
      orderPosition,

      // used count
      imageUsedMap,
      stickerUsedMap,

      // parent book
      parentBook,

      themes,
      currentTheme,
      themeSummary,
      isBookthemeOpen,
      isUsePhotoGroup,

      // actions
      boundSidebarActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundBookSettingsModalActions,
      boundPaintedTextModalActions,
      boundImageEditModalActions,
      boundTextEditModalActions,
      boundProjectActions,
      boundTemplateActions,
      boundEnvActions,
      boundStickerActions,
      boundConfirmModalActions,
      boundHowThisWorksActions,
      boundQuickStartActions,
      boundContactUsActions,
      boundShareProjectActions,
      boundSaveTemplateActions,
      boundCloneModalActions,
      boundPropertyModalActions,
      boundNotificationActions,
      boundAlertModalActions,
      boundPreviewModalActions,
      boundGuideLineActions,
      boundPageLoadingModalActions,
      boundChangeBgColorModalActions,
      boundApprovalPageActions,
      boundPreviewScreenshotActions,
      boundPaginationActions,
      boundTrackerActions,
      boundSnippingActions,
      boundThemeStickerActions,
      boundThemeOverlayModalActions,
      boundThemeActions,
      boundGlobalLoadingActions,
      boundRenderActions,
      boundUseSpecActions
    } = this.props;

    const { uploadStatus } = this.state;
    const currentThemeType = themeSummary.get('currentThemeType');
    const toggleModal = this.toggleModal;
    const baseUrls = env.urls;
    const userInfo = env.userInfo;
    const userId = env.userInfo.get('id');
    const qs = env.qs;
    const setting = project.setting;
    const useNewUpload = isUseUnblockUpload; // userId ? userId % 10 === 1 : false;
    const property = get(project, 'property');

    // parent book
    const isEditParentBook = parentBook.isEditParentBook;

    // 根据当前的 url 判断是否为 分享预览状态。
    const isPreview = /isPreview/.test(window.location.href);

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
      boundNotificationActions,
      boundAlertModalActions,
      boundPreviewModalActions,
      boundPaginationActions,
      boundTrackerActions,
      boundApprovalPageActions,
      boundGuideLineActions,
      boundSidebarActions,
      boundUseSpecActions,
      onSaveProject: this.onSaveProject,
      onCloneProject: this.onCloneProject,
      showIntroModal: this.showIntroModal,
      openLoginPage: this.openLoginPage
    };
    const pageHeaderData = {
      env,
      project,
      spec,
      isEditParentBook,
      setting,
      spec,
      useSpecModal,
      capability: capabilities.get('base')
    };

    // 左侧导航方法与数据
    const sideBarActions = {
      boundSidebarActions,
      boundImagesActions,
      boundProjectActions,
      boundTemplateActions,
      boundStickerActions,
      toggleModal,
      boundTrackerActions,
      boundThemeStickerActions,
      boundThemeActions,
      boundGlobalLoadingActions,
      boundConfirmModalActions,
      boundRenderActions,
      doAutoLayout: this.doAutoLayout
    };
    const sideBarData = {
      sidebar,
      pagination,
      paginationSpread,
      uploadedImages,
      baseUrls,
      template,
      stickerList,
      setting,
      settings,
      bookSetting: settings.bookSetting,
      imageUsedMap,
      pagination,
      backgrounds,
      ratio,
      stickerUsedMap,
      userInfo,
      isEditParentBook,
      fontList,
      isShowSideBar: this.state.isShowSideBar,
      themestickerList,
      themesCategories,
      currentTheme,
      currentThemeType,
      isBookthemeOpen,
      applyBookThemeId:
        property.get('applyBookThemeId') || property.get('bookThemeId'),
      uploadStatus,
      useNewUpload,
      spec,
      allImages,
      pageArray: project.pageArray.present,
      isUsePhotoGroup
    };

    const newPreviewRatios = merge({}, previewRatios);
    const newOrderRatios = merge({}, orderRatios);

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
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

    coverRatio.workspace = coverRatio.coverWorkspace;

    // 各种弹窗方法与数据
    const modalsActions = {
      boundImagesActions,
      boundBookSettingsModalActions,
      boundPaintedTextModalActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundTextEditModalActions,
      boundConfirmModalActions,
      boundHowThisWorksActions,
      boundQuickStartActions,
      boundContactUsActions,
      boundShareProjectActions,
      boundSaveTemplateActions,
      boundCloneModalActions,
      boundTemplateActions,
      boundGuideLineActions,
      toggleModal,
      boundPropertyModalActions,
      boundNotificationActions,
      boundAlertModalActions,
      boundPreviewModalActions,
      boundPageLoadingModalActions,
      boundChangeBgColorModalActions,
      boundApprovalPageActions,
      boundPreviewScreenshotActions,
      onSaveProject: this.onSaveProject,
      onCloneProject: this.onCloneProject,
      boundEnvActions,
      boundTrackerActions,
      boundSnippingActions,
      boundThemeOverlayModalActions,
      addStatusCount: this.addStatusCount,
      updateStatusCount: this.updateStatusCount,
      resetStatusCount: this.resetStatusCount,
      boundUseSpecActions
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
      howThisWorksModal,
      quickStartModal,
      contactUsModal,
      shareProjectModal,
      guideLineModal,
      useSpecModal,
      themeOverlayModal,
      saveTemplateModal,
      alertModal,
      cloneModal,
      previewScreenshot,
      previewModal,
      pageLoadingModal,
      changeBgColorModal,
      xtroModal,
      approvalPage,
      fontList,
      baseUrls,
      currentPage,
      pagination,
      paginationSpread,
      allContainers,
      ratio: ratio.workspace,
      bookSetting: project.bookSetting,
      elementArray: project.elementArray,

      materials,
      variables,
      coverSpreadForInnerWrap,
      settings,
      parameters,
      snipping,
      allSheets,
      allImages,
      size,

      // preview
      previewRatios: newPreviewRatios,
      previewSize,
      previewPosition,

      // order page
      orderRatios: newOrderRatios,
      orderSize,
      orderPosition,

      // parent book
      parentBook,
      capabilities,
      useNewUpload
    };

    const { needScreenShot } = this.state;

    const viewTabsActions = {
      boundTrackerActions,
      toggleSideBar: this.toggleSideBar
    };
    const viewTabsData = { isEditParentBook, isBookthemeOpen };

    const cover = project.cover.present;
    const containers = cover.get('containers');

    const paintedTextStatus = checkPaintedTextInCover(cover);

    // Item Price 方法与数据
    const itemPriceActions = { boundTrackerActions };

    const itemPriceData = {
      price,
      coupon,
      parameters,
      allSheets,
      containers,
      settings,
      paintedTextStatus
    };

    const screenshotData = {
      variables,
      materials,
      size,
      isPreview,
      settings,
      template,
      parameters,
      position,
      paginationSpreadForCover,
      ratio: coverRatio,
      paginationSpread: paginationSpreadForCover,
      urls: baseUrls,
      env
    };

    const isFromFactory = qs.get('source') === 'factory';
    const canShowPrice = capabilities.getIn(['base', 'canShowPrice']);
    return (
      <TranslatorProvider translations={translations}>
        <div className="app" style={this.state.appStyle}>
          {isPreview && isFromFactory ? (
            <button className="full-screen-btn" onClick={this.openInNewTab}>
              Full Screen
            </button>
          ) : null}

          {userId === -1 || isPreview ? null : (
            <div className="main-modules">
              {/* 页面顶部导航组件 */}
              <PageHeader actions={pageHeaderActions} data={pageHeaderData} />

              {/* 产品价格显示 */}
              {!isEditParentBook && canShowPrice ? (
                <ItemPrice actions={itemPriceActions} data={itemPriceData} />
              ) : null}

              {/* 左侧的导航组件 */}
              <ViewTabs actions={viewTabsActions} data={viewTabsData} />

              {/* 左侧的导航组件 */}
              <SideBar actions={sideBarActions} data={sideBarData} />
            </div>
          )}

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

          {/* 新手指引中, 点击 Now add photos to your book 按钮弹出上传图片的对话框 */}
          <XFileUpload
            ref={node => (this.fileUploadNode = node)}
            className="white global-file-upload"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={toggleModal}
            multiple="multiple"
          />

          {needScreenShot ? <ScreenShot {...screenshotData} /> : null}

          {globalLoading.get('isShown') ? <XLoading hasText isShown /> : null}
        </div>
      </TranslatorProvider>
    );
  }
}

export default connect(mapStateToProps, mapAppDispatchToProps)(App);
