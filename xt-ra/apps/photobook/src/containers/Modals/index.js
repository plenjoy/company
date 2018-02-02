/**
 * 这是一个容器组件, 在应用中所有要用到的弹框(包括: modal, popover, notify)统一的在这里初始化.
 */
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get, merge } from 'lodash';

import XCloneModal from '../../../../common/ZNOComponents/XCloneModal';
import XImageEditModal from '../../../../common/ZNOComponents/XImageEditModal';

import ConfirmModal from '../../components/ConfirmModal';
import UploadModal from '../../components/UploadModal';
import BookSettingsModal from '../../components/BookSettingsModal';
import PaintedTextModal from '../../components/PaintedTextModal';
import TextEditModal from '../../components/TextEditModal';
import HowThisWorksModal from '../../components/HowThisWorksModal';
import HelpGuideline from '../../components/HelpGuideLine';
import QuickStartModal from '../../components/QuickStartModal/';
import ContactUsModal from '../../components/ContactUsModal';
import ShareModal from '../../components/ShareModal';
import SaveTemplateModal from '../../components/SaveTemplateModal';
import XIntro from '../../../../common/ZNOComponents/XIntro';
import PropertyModal from '../../components/PropertyModal';
import AlertModal from '../../components/AlertModal';
import PreviewModal from '../../components/PreviewModal';
import PageLoadingModal from '../../components/PageLoadingModal';
import PageBackgroundModal from '../../components/PageBackgroundModal';
import ApprovalPage from '../../components/ApprovalPage';
import PreviewScreenshot from '../../components/PreviewScreenshot';
import ThemeOverlayModal from '../../components/ThemeOverlayModal';
import UseSpecModal from '../../components/useSpecModal';

import './index.scss';

class Modals extends Component {
  constructor(props) {
    super(props);

    this.closeBookSettingsModal = this.closeBookSettingsModal.bind(this);
    this.closePaintedTextModal = this.closePaintedTextModal.bind(this);
    this.closeImageEditModal = this.closeImageEditModal.bind(this);
    this.closeTextEditModal = this.closeTextEditModal.bind(this);
    this.closeConfirmModalByX = this.closeConfirmModalByX.bind(this);
    this.closePropertyModal = this.closePropertyModal.bind(this);
    this.closePreviewModal = this.closePreviewModal.bind(this);
    this.closePreviewScreenshotModal = this.closePreviewScreenshotModal.bind(
      this
    );
  }

  closeBookSettingsModal() {
    const { actions } = this.props;
    const { boundBookSettingsModalActions } = actions;
    boundBookSettingsModalActions.hideBookSettingsModal();
  }

  closePaintedTextModal() {
    const { actions } = this.props;
    const { boundPaintedTextModalActions } = actions;
    boundPaintedTextModalActions.hidePaintedTextModal();
  }

  closeImageEditModal() {
    const { actions } = this.props;
    const { boundImageEditModalActions } = actions;
    boundImageEditModalActions.hideImageEditModal();
  }

  closeTextEditModal() {
    const { actions } = this.props;
    const { boundTextEditModalActions } = actions;
    boundTextEditModalActions.hideTextEditModal();
  }

  closeConfirmModalByX() {
    const { actions, data } = this.props;
    const { boundConfirmModalActions } = actions;
    const { confirmModal } = data;

    boundConfirmModalActions.hideConfirm();

    if (
      confirmModal.get('xCloseFun') &&
      typeof confirmModal.get('xCloseFun') === 'function'
    ) {
      confirmModal.get('xCloseFun')();
    }
  }

  closePropertyModal() {
    const { actions } = this.props;
    const { boundPropertyModalActions } = actions;
    boundPropertyModalActions.hidePropertyModal();
  }

  closePreviewModal() {
    const { actions } = this.props;
    const { boundPreviewModalActions } = actions;
    boundPreviewModalActions.hide();
  }

  closePreviewScreenshotModal() {
    const { actions } = this.props;
    const { boundPreviewScreenshotActions } = actions;
    boundPreviewScreenshotActions.hide();
  }

  render() {
    const { data, actions } = this.props;

    const {
      spec,
      env,
      autoAddPhotoToCanvas,
      project,
      uploadingImages,
      upload,
      fontList,
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
      useSpecModal,
      themeOverlayModal,
      saveTemplateModal,
      cloneModal,
      previewScreenshot,
      alertModal,
      previewModal,
      pageLoadingModal,
      changeBgColorModal,
      approvalPage,
      bookSetting,
      baseUrls,
      ratio,
      pagination,
      currentPage,
      elementArray,
      materials,
      variables,
      settings,
      snipping,
      parameters,
      paginationSpread,
      coverSpreadForInnerWrap,
      allContainers,
      allImages,
      allSheets,
      xtroModal,

      // preview
      previewRatios,
      previewSize,
      previewPosition,

      // order page
      orderRatios,
      orderSize,
      orderPosition,

      // parent book
      parentBook,
      capabilities,
      useNewUpload
    } = data;

    const {
      boundImagesActions,
      toggleModal,
      boundProjectActions,
      boundHowThisWorksActions,
      boundQuickStartActions,
      boundContactUsActions,
      boundShareProjectActions,
      boundSaveTemplateActions,
      boundCloneModalActions,
      boundTemplateActions,
      boundNotificationActions,
      boundAlertModalActions,
      boundPageLoadingModalActions,
      boundGuideLineActions,
      boundChangeBgColorModalActions,
      boundApprovalPageActions,
      boundConfirmModalActions,
      boundSnippingActions,
      onSaveProject,
      onCloneProject,
      boundEnvActions,
      boundTrackerActions,
      boundThemeOverlayModalActions,
      addStatusCount,
      updateStatusCount,
      resetStatusCount,
      boundUseSpecActions
    } = actions;

    const imageEditModalObj = imageEditModal.toJS();

    // PreviewModal
    const previewModalData = {
      isInPreviewModel: get(env, 'qs').get('isPreview'),
      isShown: previewModal.get('isShown'),
      urls: baseUrls.toJS(),
      ratios: previewRatios,
      size: previewSize,
      position: previewPosition,
      materials,
      snipping,
      variables,
      settings,
      project,

      // 总是显示在封面.
      pagination: pagination.merge({ sheetIndex: 0 }),
      parameters,
      allSheets,
      coverSpreadForInnerWrap,

      // parent book
      parentBook,
      capability: capabilities.get('previewPages'),
      env
    };
    const previewModalActions = {
      boundSnippingActions,
      closePreviewModal: this.closePreviewModal
    };

    // approval page
    const approvalPageActions = {
      onSaveProject,
      boundTrackerActions,
      boundCloneModalActions,
      boundNotificationActions,
      boundConfirmModalActions,
      previewModalActions,
      closeApprovalPage: boundApprovalPageActions.hideApprovalPage,
      deleteElement: boundProjectActions.deleteElement
    };
    const approvalPageModelData = merge({}, previewModalData, {
      ratios: orderRatios,
      size: orderSize,
      position: orderPosition
    });
    const approvalPageData = {
      env,
      spec,
      project,
      previewModalData: approvalPageModelData,
      isShown: approvalPage.get('isShown'),
      reviewResult: approvalPage.get('reviewResult'),
      parentBook
    };

    const previewScreenshotActions = {
      closePreviewScreenshotModal: this.closePreviewScreenshotModal,
      onClickUpload: previewScreenshot.get('onClickUpload')
    };

    const previewScreenshotData = {
      isShown: previewScreenshot.get('isShown'),
      screenshot: previewScreenshot.get('screenshot')
    };

    const baseUrl = env.urls && env.urls.get('baseUrl');
    const productType = project.setting.get('product');
    const userId = env.userInfo.get('id');
    // 根据当前的 url 判断是否为 分享预览状态。
    const isPreview = /isPreview/.test(window.location.href);

    // 在分享预览模式下只 render 预览模态窗，只有在正常模式下才render 所有窗口。
    if (userId === -1 || isPreview) {
      return (
        <div className="modals">
          <PreviewModal actions={previewModalActions} data={previewModalData} />
        </div>
      );
    }

    return (
      <div className="modals">
        <UploadModal
          opened={upload.get('isShown')}
          useNewUpload={useNewUpload}
          uploadingImages={uploadingImages}
          boundUploadedImagesActions={boundImagesActions}
          boundProjectActions={boundProjectActions}
          boundContactUsActions={boundContactUsActions}
          toggleModal={toggleModal}
          env={env}
          project={project}
          autoAddPhotoToCanvas={autoAddPhotoToCanvas}
          addTracker={boundTrackerActions.addTracker}
          addStatusCount={addStatusCount}
          updateStatusCount={updateStatusCount}
          resetStatusCount={resetStatusCount}
          saveProject={onSaveProject}
          boundConfirmModalActions={boundConfirmModalActions}
        />
        {fontList.length ? (
          <div>
            <BookSettingsModal
              baseUrl={baseUrls.get('baseUrl')}
              bookSetting={bookSetting}
              fontList={fontList}
              isShown={bookSettingsModal.get('isShown')}
              closeBookSettingsModal={this.closeBookSettingsModal}
              changeBookSetting={boundProjectActions.changeBookSetting}
              addNotification={boundNotificationActions.addNotification}
            />

            <PaintedTextModal
              fontList={fontList}
              baseUrl={baseUrls.get('baseUrl')}
              element={paintedTextModal.get('element')}
              bookSetting={bookSetting}
              variables={variables}
              currentPage={currentPage}
              elementArray={elementArray}
              isShown={paintedTextModal.get('isShown')}
              closePaintedTextModal={this.closePaintedTextModal}
              updateElement={boundProjectActions.updateElement}
              allContainers={allContainers}
              setting={settings.spec}
            />

            <TextEditModal
              fontList={fontList}
              baseUrl={baseUrls.get('baseUrl')}
              isShown={textEditModal.get('isShown')}
              element={textEditModal.get('element')}
              bookSetting={bookSetting}
              variables={variables}
              currentPage={currentPage}
              elementArray={elementArray}
              closeTextEditModal={this.closeTextEditModal}
              updateElement={boundProjectActions.updateElement}
              ratio={ratio}
              setting={settings.spec}
            />
          </div>
        ) : null}
        <PropertyModal
          propertyModal={propertyModal.toJS()}
          closePropertyModal={this.closePropertyModal}
          boundProjectActions={boundProjectActions}
          allImages={allImages}
          page={currentPage}
        />
        {confirmModal.get('isShown') ? (
          <ConfirmModal
            isShown
            onOkClick={confirmModal.get('onOkClick')}
            confirmTitle={confirmModal.get('confirmTitle')}
            confirmMessage={confirmModal.get('confirmMessage')}
            okButtonText={confirmModal.get('okButtonText')}
            cancelButtonText={confirmModal.get('cancelButtonText')}
            onCancelClick={confirmModal.get('onCancelClick')}
            activeButton={confirmModal.get('activeButton')}
            hideOnOk={confirmModal.get('hideOnOk')}
            closeConfirmModal={boundConfirmModalActions.hideConfirm}
            closeConfirmModalByX={this.closeConfirmModalByX}
          />
        ) : null}
        <XImageEditModal
          {...imageEditModalObj}
          onCancelClick={this.closeImageEditModal}
        />
        {xtroModal.get('opened') ? <XIntro {...xtroModal.toJS()} /> : null}
        {howThisWorksModal.get('isShown') ? (
          <HowThisWorksModal
            isShown
            closeHowThisWorksModal={
              boundHowThisWorksActions.hideHowThisWorksModal
            }
          />
        ) : null}
        {quickStartModal.get('isShown') ? (
          <QuickStartModal
            isShown
            closeQuickStartModal={boundQuickStartActions.hideQuickStartModal}
          />
        ) : null}
        {guideLineModal.get('isShown') ? (
          <HelpGuideline
            isShown
            closeHelpGuideline={boundGuideLineActions.hideGuideLineModal}
          />
        ) : null}{' '}
        useSpecModal
        {useSpecModal.get('isShown') ? (
          <UseSpecModal
            isShown
            closeUseSpecModal={boundUseSpecActions.hideUseSpecModal}
            useSpecModal={useSpecModal}
          />
        ) : null}
        {contactUsModal.get('isShown') ? (
          <ContactUsModal
            env={env}
            project={project}
            isShown
            boundContactUsActions={boundContactUsActions}
            addNotification={boundNotificationActions.addNotification}
          />
        ) : null}
        {shareProjectModal.get('isShown') ? (
          <ShareModal
            isShown
            znoUrl={shareProjectModal.get('znoUrl')}
            anonymousUrl={shareProjectModal.get('anonymousUrl')}
            closeShareModal={boundShareProjectActions.hideShareProjectModal}
            getShareUrls={boundShareProjectActions.getShareUrls}
            projectId={project.property.get('projectId')}
            baseUrl={baseUrl}
            productType={productType}
          />
        ) : null}
        {themeOverlayModal.get('isShown') ? (
          <ThemeOverlayModal
            isShown={themeOverlayModal.get('isShown')}
            themeOverlayModal={themeOverlayModal}
            closeModal={boundThemeOverlayModalActions.hideThemeOverlayModal}
          />
        ) : null}
        {cloneModal.get('isShown') ? (
          <XCloneModal
            env={env}
            userId={userId}
            isShown
            title={project.property && project.property.get('title')}
            onCloneProject={onCloneProject}
            addAlbum={boundEnvActions.addAlbum}
            checkProjectTitle={boundProjectActions.checkProjectTitle}
            closeCloneModal={boundCloneModalActions.hideCloneModal}
            addTracker={boundTrackerActions.addTracker}
            uploadCoverImage={boundProjectActions.uploadCoverImage}
          />
        ) : null}
        {alertModal.get('isShown') ? (
          <AlertModal
            isShown
            title={alertModal.get('title')}
            onButtonClick={alertModal.get('onButtonClick')}
            message={alertModal.get('message')}
            escapeClose={alertModal.get('escapeClose')}
            isHideIcon={alertModal.get('isHideIcon')}
            closeAlertModal={boundAlertModalActions.hideAlertModal}
          />
        ) : null}
        {pageLoadingModal.get('isShown') ? (
          <PageLoadingModal isShown text={pageLoadingModal.get('text')} />
        ) : null}
        {changeBgColorModal.get('isShown') ? (
          <PageBackgroundModal
            isShown
            bgColor={changeBgColorModal.get('bgColor')}
            selectedPageId={changeBgColorModal.get('selectedPageId')}
            updatePageInfo={boundProjectActions.changePageBgColor}
            closeModal={boundChangeBgColorModalActions.hideChangeBgColorModal}
            boundTrackerActions={boundTrackerActions}
          />
        ) : null}
        {approvalPageData.isShown ? (
          <ApprovalPage actions={approvalPageActions} data={approvalPageData} />
        ) : null}
        <PreviewModal actions={previewModalActions} data={previewModalData} />
        <PreviewScreenshot
          actions={previewScreenshotActions}
          data={previewScreenshotData}
        />
      </div>
    );
  }
}

Modals.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('Modals')(Modals);
