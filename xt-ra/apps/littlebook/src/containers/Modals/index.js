/**
 * 这是一个容器组件, 在应用中所有要用到的弹框(包括: modal, popover, notify)统一的在这里初始化.
 */
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get } from 'lodash';

import XCloneModal from '../../../../common/ZNOComponents/XCloneModal';
import XImageEditModal from '../../../../common/ZNOComponents/XImageEditModal';

import ConfirmModal from '../../components/ConfirmModal';
import UpgradeModal from '../../components/UpgradeModal';
import UploadModal from '../../components/UploadModal';
import TextEditModal from '../../components/TextEditModal';
import ShareModal from '../../components/ShareModal';
import AlertModal from '../../components/AlertModal';
import ContactUsModal from '../../components/ContactUsModal';
import PreviewModal from '../../components/PreviewModal';
import PageLoadingModal from '../../components/PageLoadingModal';
import PageBackgroundModal from '../../components/PageBackgroundModal';
import { pageTypes } from '../../contants/strings';
import AutoUploadModal from '../../components/AutoUploadModal';
import SelectModal from '../../components/SelectModal';
import './index.scss';

class Modals extends Component {
  constructor(props) {
    super(props);

    this.closeImageEditModal = this.closeImageEditModal.bind(this);
    this.closeTextEditModal = this.closeTextEditModal.bind(this);
    this.closeConfirmModalByX = this.closeConfirmModalByX.bind(this);
    this.closePreviewModal = this.closePreviewModal.bind(this);
    this.closeUpgradeModal = this.closeUpgradeModal.bind(this);
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

  closePreviewModal() {
    const { actions } = this.props;
    const { boundPreviewModalActions } = actions;
    boundPreviewModalActions.hide();
  }

  closeUpgradeModal() {
    const { actions } = this.props;
    const { boundUpgradeModalActions } = actions;
    boundUpgradeModalActions.hideUpgrade();
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
      imageEditModal,
      textEditModal,
      confirmModal,
      upgradeModal,
      shareProjectModal,
      alertModal,
      contactUsModal,
      previewModal,
      pageLoadingModal,
      changeBgColorModal,
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
      allSheets,
      isSupportSaveProject,
      allImages,

      // preview
      previewRatios,
      previewSize,
      previewPosition,
      isImageCover,

      capabilities,
      cloneModal,
      autoUpload,
      oAuth,
      selectModal
    } = data;

    const {
      boundImagesActions,
      toggleModal,
      boundProjectActions,
      boundShareProjectActions,
      boundNotificationActions,
      boundAlertModalActions,
      boundChangeBgColorModalActions,
      boundConfirmModalActions,
      boundSnippingActions,
      boundTrackerActions,
      onSaveProject,
      onCloneProject,
      boundContactUsActions,
      boundCloneModalActions,
      boundEnvActions,
      boundTemplateActions,
      autoFill,
      boundAutoUploadActions,
      boundOAuthActions,
      login,
      boundSelectModalActions
    } = actions;

    const AutoUploadModalAction = { boundOAuthActions, login };
    const imageEditModalObj = imageEditModal.toJS();

    const oAuthData = {
      oAuth,
      allImages,
      uploadingImages
    };

    const coverContainers = project && project.getIn(['cover', 'containers']);
    const spinePage =
      coverContainers &&
      coverContainers.find(page => page.get('type') === pageTypes.spine);

    const fullPage =
      coverContainers &&
      coverContainers.find(page => page.get('type') === pageTypes.full);

    let templateId;
    if (fullPage) {
      templateId = fullPage.getIn(['template', 'tplGuid']);
    }

    // PreviewModal
    const previewModalData = {
      isInPreviewModel:
        previewModal.get('hideCloseIcon') || get(env, 'qs').get('isPreview'),
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
      capability: capabilities.get('previewPages')
    };
    const previewModalActions = {
      boundSnippingActions,
      boundTrackerActions,
      closePreviewModal: this.closePreviewModal
    };

    const baseUrl = env.urls && env.urls.get('baseUrl');
    const productType = project.getIn(['setting', 'product']);
    const userId = env.userInfo.get('id');

    // 根据当前的 url 判断是否为 分享预览状态。
    const isPreview = /isPreview/.test(window.location.href);

    // 获取封面的原始宽高.
    const coverOriginalSize = {
      width: project.getIn(['cover', 'width']),
      height: project.getIn(['cover', 'height'])
    };

    // 产品尺寸.
    const productSize = get(settings, 'spec.size');

    // 在分享预览模式下只 render 预览模态窗，只有在正常模式下才render 所有窗口。
    if (userId === -1 || isPreview) {
      return (
        <div className="modals">
          <PreviewModal actions={previewModalActions} data={previewModalData} />
        </div>
      );
    }

    const selectModalData = { selectModal };

    const selectModalActions = {
      login,
      boundSelectModalActions,
      boundImagesActions,
      toggleModal
    };

    return (
      <div className="modals">
        <UploadModal
          boundConfirmModalActions={boundConfirmModalActions}
          opened={upload.get('isShown')}
          uploadingImages={uploadingImages}
          boundUploadedImagesActions={boundImagesActions}
          boundProjectActions={boundProjectActions}
          toggleModal={toggleModal}
          env={env}
          project={project}
          autoAddPhotoToCanvas={autoAddPhotoToCanvas}
          boundContactUsActions={boundContactUsActions}
          addTracker={boundTrackerActions.addTracker}
          saveProject={onSaveProject}
          autoFill={autoFill}
        />

        {fontList.length ? (
          <div>
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
              updateElement={textEditModal.get('updateElements')}
              ratio={ratio}
            />
          </div>
        ) : null}

        {confirmModal.get('isShown') ? (
          <ConfirmModal
            isShown
            onOkClick={confirmModal.get('onOkClick')}
            confirmTitle={confirmModal.get('confirmTitle')}
            confirmMessage={confirmModal.get('confirmMessage')}
            okButtonText={confirmModal.get('okButtonText')}
            cancelButtonText={confirmModal.get('cancelButtonText')}
            onCancelClick={confirmModal.get('onCancelClick')}
            hideOnOk={confirmModal.get('hideOnOk')}
            activeButton={confirmModal.get('activeButton')}
            cancelInFirst={confirmModal.get('cancelInFirst')}
            closeConfirmModal={boundConfirmModalActions.hideConfirm}
            closeConfirmModalByX={this.closeConfirmModalByX}
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

        {upgradeModal.get('isShown') ? (
          <UpgradeModal
            isShown
            close={this.closeUpgradeModal}
            onOkClick={upgradeModal.get('onOkClick')}
            onCancelClick={upgradeModal.get('onCancelClick')}
            from={upgradeModal.get('from')}
            to={upgradeModal.get('to')}
            hideOnOk
            basePrice={upgradeModal.get('basePrice')}
            upgradeCheckedItems={upgradeModal.get('upgradeCheckedItems')}
            baseUrl={baseUrl}
            bgColor={variables.get('coverBackgroundColor')}
            boundProjectActions={boundProjectActions}
            boundTrackerActions={boundTrackerActions}
            spinePage={spinePage}
            isImageCover={isImageCover}
            productSize={productSize}
            allImages={allImages}
            boundTemplateActions={boundTemplateActions}
            templateId={templateId}
            env={env}
          />
        ) : null}

        <XImageEditModal
          {...imageEditModalObj}
          onCancelClick={this.closeImageEditModal}
        />

        {shareProjectModal.get('isShown') ? (
          <ShareModal
            isShown
            znoUrl={shareProjectModal.get('znoUrl')}
            anonymousUrl={shareProjectModal.get('anonymousUrl')}
            closeShareModal={boundShareProjectActions.hideShareProjectModal}
            getShareUrls={boundShareProjectActions.getShareUrls}
            projectId={project.get('projectId')}
            baseUrl={baseUrl}
            productType={productType}
          />
        ) : null}

        {cloneModal.get('isShown') ? (
          <XCloneModal
            env={env}
            userId={userId}
            isShown
            title={project.get('title')}
            onCloneProject={onCloneProject}
            addAlbum={boundEnvActions.addAlbum}
            checkProjectTitle={boundProjectActions.checkProjectTitle}
            closeCloneModal={boundCloneModalActions.hideCloneModal}
            addTracker={boundTrackerActions.addTracker}
            uploadCoverImage={boundProjectActions.uploadCoverImage}
            saveProject={onSaveProject}
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
          />
        ) : null}
        {autoUpload.get('isShow') ? (
          <AutoUploadModal
            addTracker={boundTrackerActions.addTracker}
            isShown={autoUpload.get('isShow')}
            closeModal={boundAutoUploadActions.hideAutoUploadModal}
            data={oAuthData}
            actions={AutoUploadModalAction}
          />
        ) : null}
        <PreviewModal actions={previewModalActions} data={previewModalData} />

        <SelectModal data={selectModalData} actions={selectModalActions} />
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
