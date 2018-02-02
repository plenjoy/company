import React, { Component } from 'react';
import Immutable from 'immutable';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { get, merge, isEqual } from 'lodash';
import { TranslatorProvider } from 'react-translate';

import '../../../../common/utils/extension';
import '../../../../common/utils/uploadPool';
import { convertObjIn } from '../../../../common/utils/typeConverter';

import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';

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
import ItemPrice from '../../components/ItemPrice';
import Modals from '../Modals';
import notificationStyles from './notificationStyles';
import Screenshot from '../../canvasComponents/Screenshot';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

import { initGlobalVariables } from '../../utils/global';
import * as layoutHandler from './handle/layout';
// 打入handle
import {
  doPrepare,
  toggleModal,
  doUserThings,
  onSaveProject,
  onCloneProject,
  loadMainProjectImages
} from './handle/main';

import * as computedHandler from './handle/computed';
import * as uploadHandler from './handle/upload';

if (__DEVELOPMENT__) {
  require('react-addons-perf');
}

class App extends Component {
  constructor(props) {
    super(props);
    const { boundUploadImagesActions } = props;
    this.toggleModal = (type, status) =>
      toggleModal(boundUploadImagesActions, type, status);
    this.doPrepare = () => doPrepare(this);
    this.doUserThings = nextProps => doUserThings(this, nextProps);
    this.addStatusCount = (fieldName, count) =>
      uploadHandler.addStatusCount(this, fieldName, count);

    this.updateStatusCount = (fieldName, count) =>
      uploadHandler.updateStatusCount(this, fieldName, count);
    this.resetStatusCount = () => uploadHandler.resetStatus(this);

    this.recomputedPreviewRatios = props =>
      computedHandler.recomputedPreviewRatios(props);
    this.recomputedWorkspaceRatio = props =>
      computedHandler.recomputedWorkspaceRatio(props);

    this.autoFill = (uploadSuccessImages, needSortImage) =>
      layoutHandler.autoFill(this, uploadSuccessImages, needSortImage);

    // window resize时的处理函数.
    this.onresizingHandler = () => {
      computedHandler.resizingHandler(this);
    };

    this.getEffectImage = (props, done) =>
      computedHandler.getEffectImage(this, props, done);
    this.getPreviewEffectImage = (props, done) =>
      computedHandler.getPreviewEffectImage(this, props, done);
    this.getMatteImage = (props, done) =>
      computedHandler.getMatteImage(this, props, done);
    initGlobalVariables();

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

    this.loadMainProjectImages = () => loadMainProjectImages(this);
    // 显示preview
    this.showPreviewModal = props => {
      const { boundPreviewModalActions } = props || this.props;
      boundPreviewModalActions.show();
    };
    this.state = {
      isNewProject: true
    };
  }

  /**
   * 发送ajax请求获取初始化数据.
   */
  componentWillMount() {
    this.doPrepare();
  }

  componentWillReceiveProps(nextProps) {
    this.doUserThings(nextProps);
    const { boundProjectActions, boundLoadingModalAction, env } = nextProps;
    const urlQs = env.qs;
    const newUserInfo = env.userInfo;
    const newUserId = newUserInfo.get('id');
    // 初始化ratio,
    const oldRenderSize = get(this.props, 'size');
    const newRenderSize = get(nextProps, 'size');
    const oldSheetIndex = get(this.props, 'pagination');
    const newSheetIndex = get(nextProps, 'pagination');

    const oldWidth = get(this.props, 'size.baseSize.width');
    const newWidth = get(nextProps, 'size.baseSize.height');

    const oldBgWidth = get(this.props, 'size.bgParams.width');
    const newBgWidth = get(nextProps, 'size.bgParams.height');

    const oldProduct = get(this.props, 'settings').get('product');
    const newProduct = get(nextProps, 'settings').get('product');
    const oldFrameStyle = get(this.props, 'settings').get('frameStyle');
    const newFrameStyle = get(nextProps, 'settings').get('frameStyle');
    const oldColor = get(this.props, 'settings').get('color');
    const newColor = get(nextProps, 'settings').get('color');
    const oldCanvasBorderSize = get(this.props, 'settings').get(
      'canvasBorderSize'
    );
    const newCanvasBorderSize = get(nextProps, 'settings').get(
      'canvasBorderSize'
    );
    const oldFinish = get(this.props, 'settings').get('finish');
    const newFinish = get(nextProps, 'settings').get('finish');
    const oldSize = get(this.props, 'settings').get('size');
    const newSize = get(nextProps, 'settings').get('size');
    const oldOrientation = get(this.props, 'settings').get('orientation');
    const newOrientation = get(nextProps, 'settings').get('orientation');
    const oldMatteStyle = get(this.props, 'settings').get('matteStyle');
    const newMatteStyle = get(nextProps, 'settings').get('matteStyle');
    const oldMatte = get(this.props, 'settings').get('matte');
    const newMatte = get(nextProps, 'settings').get('matte');

    const oldShape = get(this.props, 'settings').get('shape');
    const newShape = get(nextProps, 'settings').get('shape');

    if (
      (newWidth && oldWidth !== newWidth) ||
      (newSize && oldSize !== newSize) ||
      (newBgWidth && oldBgWidth !== newBgWidth)
    ) {
      this.recomputedWorkspaceRatio(nextProps);
      this.recomputedPreviewRatios(nextProps);
    }
    const isRenderSizeChanged = !isEqual(oldRenderSize, newRenderSize);

    if (
      !isEqual(oldProduct, newProduct) ||
      !isEqual(oldShape, newShape) ||
      !isEqual(oldSize, newSize) ||
      !isEqual(oldFrameStyle, newFrameStyle) ||
      !isEqual(oldColor, newColor) ||
      !isEqual(oldCanvasBorderSize, newCanvasBorderSize) ||
      !isEqual(oldFinish, newFinish) ||
      !isEqual(oldOrientation, newOrientation) ||
      oldSheetIndex.pageId !== newSheetIndex.pageId
    ) {
      boundLoadingModalAction.show();
      this.getEffectImage(nextProps);
      this.getPreviewEffectImage(nextProps);
    }
    if (
      isRenderSizeChanged &&
      isEqual(oldShape, newShape) &&
      isEqual(oldSize, newSize) &&
      isEqual(oldFrameStyle, newFrameStyle) &&
      isEqual(oldColor, newColor) &&
      isEqual(oldCanvasBorderSize, newCanvasBorderSize) &&
      isEqual(oldFinish, newFinish) &&
      isEqual(oldOrientation, newOrientation)
    ) {
      this.getEffectImage(nextProps);
      this.getPreviewEffectImage(nextProps);
    }
    if (
      !isEqual(oldMatteStyle, newMatteStyle) ||
      !isEqual(oldSize, newSize) ||
      !isEqual(oldMatte, newMatte) ||
      !isEqual(oldOrientation, newOrientation) ||
      oldSheetIndex.pageId !== newSheetIndex.pageId
    ) {
      boundLoadingModalAction.show();
      this.getMatteImage(nextProps);
    }
    if (
      isRenderSizeChanged &&
      isEqual(oldMatteStyle, newMatteStyle) &&
      isEqual(oldSize, newSize) &&
      isEqual(oldMatte, newMatte) &&
      isEqual(oldOrientation, newOrientation)
    ) {
      this.getMatteImage(nextProps);
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

    const isNewProject = nextProps.project.property.get('isNewProject');
    const isCrossProject = nextProps.project.property.get('crossSell');
    if (isNewProject && this.state.isNewProject && newUserId !== -1) {
      this.setState({ isNewProject: false });
      // 处理 cross-sell 的图片应用问题

      if (isCrossProject) {
        this.loadMainProjectImages();
      }
      // 加载myphoto的图片
      if (urlQs.get('isFromMyPhoto')) {
        boundProjectActions.getMyPhotosInfo(newUserId).then(res => {
          const fromMyImages = convertObjIn(JSON.parse(res.data));
          this.autoFill(fromMyImages);
        });
      }

      // cross-sell 过后需要保存一次项目。
      /*const newShouldSaveProjectAfterCrossSell = newProject.property.get('shouldSaveProjectAfterCrossSell');
      if (projectId && projectId !== -1 && newShouldSaveProjectAfterCrossSell) {
        this.onSaveProject(() => {}, null, true);
        boundProjectActions.changeProjectProperty({
          shouldSaveProjectAfterCrossSell: false
        });
      }*/

      // MyPhotos 过后需要保存一次项目。
      /*const newShouldSaveProjectAfterMyPhotos = newProject.property.get('shouldSaveProjectAfterMyPhotos');
      if (projectId && projectId !== -1 && newShouldSaveProjectAfterMyPhotos) {
        this.onSaveProject(() => {}, null, true);
        boundProjectActions.changeProjectProperty({
          shouldSaveProjectAfterMyPhotos: false
        });
      }*/
    }

    // 判断是否是匿名分享的连接，是的话就 更改页面的 title；格式： size cover Preview
    const oldIsProjectLoadCompleted = this.props.project.property.get(
      'isProjectLoadCompleted'
    );
    const newIsProjectLoadCompleted = nextProps.project.property.get(
      'isProjectLoadCompleted'
    );
    if (
      oldIsProjectLoadCompleted !== newIsProjectLoadCompleted &&
      newIsProjectLoadCompleted
    ) {
      const newCategory = get(nextProps, 'settings').get('category');
      if (newCategory === 'categoryTableTop') {
        document.querySelector('title').innerHTML = 'Zno - Table Tops';
      } else {
        document.querySelector('title').innerHTML = 'Zno - Wall Art';
      }

      document.getElementsByClassName('page-loading')[0].style.display = 'none';
    }
  }
  componentDidUpdate(prevProps) {
    const {
      env,
      project,
      boundPriceActions,
      boundTemplateActions
    } = this.props;

    const oldProject = prevProps.project;
    const newProject = project;

    const oldSetting = oldProject.setting;
    const newSetting = newProject.setting;

    const oldProduct = oldSetting.get('product');
    const newProduct = newSetting.get('product');

    const oldSize = oldSetting.get('size');
    const newSize = newSetting.get('size');

    const oldColor = oldSetting.get('color');
    const newColor = newSetting.get('color');

    const oldFrameStyle = oldSetting.get('frameStyle');
    const newFrameStyle = newSetting.get('frameStyle');

    const oldGlassStyle = oldSetting.get('glassStyle');
    const newGlassStyle = newSetting.get('glassStyle');

    const oldMatteStyle = oldSetting.get('matteStyle');
    const newMatteStyle = newSetting.get('matteStyle');

    const oldFinish = oldSetting.get('finish');
    const newFinish = newSetting.get('finish');

    const oldMatte = oldSetting.get('matte');
    const newMatte = newSetting.get('matte');

    const oldMetalType = oldSetting.get('metalType');
    const newMetalType = newSetting.get('metalType');

    const oldPaper = oldSetting.get('paper');
    const newPaper = newSetting.get('paper');

    const oldCanvasBorderSize = oldSetting.get('canvasBorderSize');
    const newCanvasBorderSize = newSetting.get('canvasBorderSize');

    const oldPhotoQuantity = oldSetting.get('photoQuantity');
    const newPhotoQuantity = newSetting.get('photoQuantity');

    if (
      oldProduct !== newProduct ||
      oldColor !== newColor ||
      oldFrameStyle !== newFrameStyle ||
      oldMatteStyle !== newMatteStyle ||
      oldFinish !== newFinish ||
      oldMatte !== newMatte ||
      oldMetalType !== newMetalType ||
      oldPaper !== newPaper ||
      oldGlassStyle !== newGlassStyle ||
      oldSize !== newSize ||
      oldCanvasBorderSize !== newCanvasBorderSize ||
      oldPhotoQuantity !== newPhotoQuantity
    ) {
      boundPriceActions.getProductPrice(newSetting.toJS());
    }
  }
  componentDidMount() {
    // 添加resizing处理函数, 用于改变workspace的ratio
    addEventListener(window, 'resize', this.onresizingHandler);
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

  componentWillUnmount() {
    // 移除resizing的处理函数.
    removeEventListener(window, 'resize', this.onresizingHandler);
  }

  render() {
    const {
      spec,
      env,
      urls,
      parameters,
      price,
      fontList,
      translations,
      capabilities,
      uploadedImages,
      imageUsedMap,
      autoAddPhotoToCanvas,
      confirmModal,
      alertModal,
      cloneModal,
      imageEditModal,
      boundEnvActions,
      boundTrackerActions,
      boundImagesActions,
      boundProjectActions,
      settings,
      upload,
      project,
      materials,
      variables,
      snipping,
      allSheets,
      allImages,
      size,
      screenShotSize,
      ratios,
      pagination,
      paginationSpread,
      previewRatios,
      previewModal,
      contactUsModal,
      previewSize,
      uploadingImages,
      boundContactUsActions,
      boundImageEditModalActions,
      boundConfirmModalActions,
      boundAlertModalActions,
      boundNotificationActions,
      boundCloneModalActions,
      boundPreviewModalActions,
      boundSnippingActions,
      isSplit
    } = this.props;

    const toggleModal = this.toggleModal;
    const baseUrls = env.urls;
    const useNewUpload = false;
    const isPreview = false;
    const hasCoverRender = true;
    const userId = env.userInfo.get('id');
    // page header
    const pageHeaderActions = {
      boundConfirmModalActions,
      boundProjectActions,
      boundNotificationActions,
      onSaveProject: this.onSaveProject,
      boundCloneModalActions,
      boundTrackerActions,
      boundPreviewModalActions
    };
    const pageHeaderData = {
      env,
      spec,
      project
    };

    // view tabs
    const viewTabsActions = {
      boundTrackerActions
    };
    const viewTabsData = {};

    // modal
    const modalsActions = {
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      boundAlertModalActions,
      boundImageEditModalActions,
      toggleModal,
      boundContactUsActions,
      boundNotificationActions,
      addStatusCount: this.addStatusCount,
      updateStatusCount: this.updateStatusCount,
      resetStatusCount: this.resetStatusCount,
      onSaveProject: this.onSaveProject,
      boundCloneModalActions,
      onCloneProject: this.onCloneProject,
      boundEnvActions,
      autoFill: this.autoFill,
      boundPreviewModalActions,
      boundConfirmModalActions,
      boundSnippingActions,
      onSaveProject: this.onSaveProject
    };

    const modalsData = {
      env,
      baseUrls,
      previewModal,

      confirmModal,
      cloneModal,
      alertModal,
      imageEditModal,
      contactUsModal,
      upload,
      project,
      useNewUpload,
      autoAddPhotoToCanvas,
      uploadingImages,
      pagination,
      capabilities,
      // preview
      previewRatios,
      previewSize,

      materials,
      variables,
      settings,
      parameters,
      snipping,
      allSheets,
      allImages,
      size,
      isSplit
    };
    const itemPriceActions = { boundTrackerActions };
    const itemPriceData = {
      price,
      parameters,
      settings
    };

    const screenShotActions = {
      boundSnippingActions
    };
    const screenShotData = {
      urls,
      size: screenShotSize,
      ratios,
      variables,
      pagination,
      materials,
      paginationSpread,
      settings,
      project,
      parameters,
      allImages,
      snipping,
      isScreenShot: true,
      isPreview: false,
      specData: spec,
      userId,
      capability: capabilities.get('previewPages'),
      isSplit
    };

    return (
      <TranslatorProvider translations={translations}>
        <div className="app">
          <div className="main-modules">
            {/* 页面顶部导航组件 */}
            <PageHeader actions={pageHeaderActions} data={pageHeaderData} />

            {/* 产品价格显示 */}
            {price ? (
              <ItemPrice actions={itemPriceActions} data={itemPriceData} />
            ) : null}

            {/* 左侧的导航组件 */}
            <ViewTabs actions={viewTabsActions} data={viewTabsData} />
          </div>

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

          {get(size, 'renderBgSize.width') && ratios.get('workspace') ? (
            <Screenshot actions={screenShotActions} data={screenShotData} />
          ) : null}

          <XLoading loadingText="Loading..." isShown={!hasCoverRender} />
        </div>
      </TranslatorProvider>
    );
  }
}

export default connect(mapStateToProps, mapAppDispatchToProps)(App);
