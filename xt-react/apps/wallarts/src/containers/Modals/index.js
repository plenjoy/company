/**
 * 这是一个容器组件, 在应用中所有要用到的弹框(包括: modal, popover, notify)统一的在这里初始化.
 */
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get, merge } from 'lodash';
import { pageTypes } from '../../constants/strings';

import XImageEditModal from '../../../../common/ZNOComponents/XImageEditModal';
import XCloneModal from '../../../../common/ZNOComponents/XCloneModal';

import ConfirmModal from '../../components/ConfirmModal';
import UploadModal from '../../components/UploadModal';
import AlertModal from '../../components/AlertModal';
import PreviewModal from '../../components/PreviewModal';
import ContactUsModal from '../../components/ContactUsModal';

import './index.scss';

class Modals extends Component {
  constructor(props) {
    super(props);

    this.closeConfirmModalByX = this.closeConfirmModalByX.bind(this);
    this.closeUpgradeModal = this.closeUpgradeModal.bind(this);
    this.closeImageEditModal = this.closeImageEditModal.bind(this);
    this.closePreviewModal = this.closePreviewModal.bind(this);
  }

  closeImageEditModal() {
    const { actions } = this.props;
    const { boundImageEditModalActions } = actions;
    boundImageEditModalActions.hideImageEditModal();
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

  closeUpgradeModal() {
    const { actions } = this.props;
    const { boundUpgradeModalActions } = actions;
    boundUpgradeModalActions.hideUpgrade();
  }

  closePreviewModal() {
    const { actions } = this.props;
    const { boundPreviewModalActions } = actions;
    boundPreviewModalActions.hide();
  }

  render() {
    const { data, actions } = this.props;

    const {
      env,
      imageEditModal,
      confirmModal,
      cloneModal,
      alertModal,
      upload,
      useNewUpload,
      project,
      autoAddPhotoToCanvas,
      uploadingImages,
      previewModal,
      contactUsModal,
      baseUrls,
      previewRatios,
      previewSize,
      variables,
      materials,
      snipping,
      settings,
      pagination,
      parameters,
      allSheets,
      capabilities,
      isSplit
    } = data;

    const {
      boundNotificationActions,
      boundConfirmModalActions,
      boundEnvActions,
      boundAlertModalActions,
      boundImagesActions,
      boundProjectActions,
      boundContactUsActions,
      boundTrackerActions,
      toggleModal,
      addStatusCount,
      updateStatusCount,
      resetStatusCount,
      onSaveProject,
      boundCloneModalActions,
      onCloneProject,
      autoFill,
      boundSnippingActions
    } = actions;
    const userId = env.userInfo.get('id');
    const imageEditModalObj = imageEditModal.toJS();
    // PreviewModal
    const previewModalData = {
      isInPreviewModel: get(env, 'qs').get('isPreview'),
      isShown: previewModal.get('isShown'),
      urls: baseUrls.toJS(),
      ratios: previewRatios,
      size: previewSize,
      materials,
      snipping,
      variables,
      settings,
      project,

      // 总是显示在封面.
      pagination: merge(pagination, { sheetIndex: 0 }),
      parameters,
      allSheets,
      capability: capabilities.get('previewPages'),
      isSplit
    };
    const previewModalActions = {
      boundSnippingActions,
      closePreviewModal: this.closePreviewModal
    };
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
          autoFill={autoFill}
          boundConfirmModalActions={boundConfirmModalActions}
        />

        <XImageEditModal
          {...imageEditModalObj}
          onCancelClick={this.closeImageEditModal}
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
            hideOnOk={confirmModal.get('hideOnOk')}
            activeButton={confirmModal.get('activeButton')}
            cancelInFirst={confirmModal.get('cancelInFirst')}
            closeConfirmModal={boundConfirmModalActions.hideConfirm}
            closeConfirmModalByX={this.closeConfirmModalByX}
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

        {contactUsModal.get('isShown') ? (
          <ContactUsModal
            env={env}
            project={project}
            isShown
            boundContactUsActions={boundContactUsActions}
            addNotification={boundNotificationActions.addNotification}
          />
        ) : null}

        {previewRatios.get('workspace') ? (
          <PreviewModal actions={previewModalActions} data={previewModalData} />
        ) : (
          0
        )}
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
