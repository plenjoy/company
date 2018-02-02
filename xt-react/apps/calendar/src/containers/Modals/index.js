/**
 * 这是一个容器组件, 在应用中所有要用到的弹框(包括: modal, popover, notify)统一的在这里初始化.
 */
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get } from 'lodash';

import ConfirmModal from '../../components/ConfirmModal';
import UploadModal from '../../components/UploadModal';
import UpgradeModal from '../../components/UpgradeModal';
import { pageTypes } from '../../constants/strings';
import ContactUsModal from '../../components/ContactUsModal';
import AlertModal from '../../components/AlertModal';
import PreviewModal from '../../components/PreviewModal';
import TextEditModal from '../../components/TextEditModal';
import XImageEditModal from '../../../../common/ZNOComponents/XImageEditModal';
import XCloneModal from '../../../../common/ZNOComponents/XCloneModal';
import './index.scss';

class Modals extends Component {
  constructor(props) {
    super(props);

    this.closeImageEditModal = this.closeImageEditModal.bind(this);
    this.closeConfirmModalByX = this.closeConfirmModalByX.bind(this);
    this.closePreviewModal = this.closePreviewModal.bind(this);
    this.closeTextEditModal = this.closeTextEditModal.bind(this);
    this.closeUpgradeModal = this.closeUpgradeModal.bind(this);
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

  closePreviewModal() {
    const { actions } = this.props;
    const { boundPreviewModalActions } = actions;
    boundPreviewModalActions.hide();
  }

  closeTextEditModal() {
    const { actions } = this.props;
    const { boundTextEditModalActions } = actions;
    boundTextEditModalActions.hideTextEditModal();
  }

  closeUpgradeModal() {
    const { actions } = this.props;
    const { boundUpgradeModalActions } = actions;
    boundUpgradeModalActions.hideUpgrade();
  }

  render() {
    const { data, actions } = this.props;

    const {
      env,
      confirmModal,
      uploadingImages,
      contactUsModal,
      upload,
      project,
      ratio,
      capabilities,
      cloneModal,
      imageEditModal,
      alertModal,
      baseUrls,
      previewRatios,
      previewSize,
      upgradeSize,
      variables,
      settings,
      allSheets,
      fontList,
      textEditModal,
      pagination,
      parameters,
      elementArray,
      previewModal,
      currentPage,
      autoAddPhotoToCanvas,
      upgradeModal,
      urls,
      size,
      ratios,
      template,
      paginationSpread,
      specData,
      allImages,
      capability,
      price
    } = data;

    const {
      boundNotificationActions,
      boundConfirmModalActions,
      boundEnvActions,
      boundContactUsActions,
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      onSaveProject,
      onCloneProject,
      boundAlertModalActions,
      boundCloneModalActions,
      autoFill,
      saveProjectWithOutScreenShot
    } = actions;

    const previewModalData = {
      isInPreviewModel: get(env, 'qs').get('isPreview'),
      isShown: previewModal.get('isShown'),
      urls: baseUrls.toJS(),
      ratios: previewRatios,
      size: previewSize,
      variables,
      settings,
      project,
      // 总是显示在封面.
      pagination,
      parameters,
      allSheets,
      capability: capabilities.get('previewPages'),
      userInfo: env.userInfo
    };
    const previewModalActions = {
      closePreviewModal: this.closePreviewModal
    };

    // 根据当前的 url 判断是否为 分享预览状态。
    const isPreview = /isPreview/.test(window.location.href);
    const userId = env.userInfo.get('id');

    const imageEditModalObj = imageEditModal.toJS();

    // 在分享预览模式下只 render 预览模态窗，只有在正常模式下才render 所有窗口。
    if (userId === -1 || isPreview) {
      return (
        <div className="modals">
          <PreviewModal actions={previewModalActions} data={previewModalData} />
        </div>
      );
    }
    const upgradeModalData = {
      urls,
      size: upgradeSize,
      ratios,
      variables,
      template,
      pagination: pagination.toJS(),
      paginationSpread,
      settings,
      parameters,
      isPreview,
      specData,
      project,
      allImages,
      userId,
      capability,
      allSheets,
      price
    };
    return (
      <div className="modals">
        <UploadModal
          opened={upload.get('isShown')}
          uploadingImages={uploadingImages}
          boundUploadedImagesActions={boundImagesActions}
          boundProjectActions={boundProjectActions}
          boundContactUsActions={boundContactUsActions}
          toggleModal={toggleModal}
          env={env}
          project={project}
          autoAddPhotoToCanvas={autoAddPhotoToCanvas}
          addTracker={boundTrackerActions.addTracker}
          saveProject={onSaveProject}
          autoFill={autoFill}
          boundConfirmModalActions = {boundConfirmModalActions}
        />

        {upgradeModal.get('isShown') ? (
          <UpgradeModal
            isShown
            close={this.closeUpgradeModal}
            data={upgradeModalData}
            oldSaveProject={upgradeModal.get('saveFun')}
            saveProjectWithOutScreenShot={saveProjectWithOutScreenShot}
            boundProjectActions={boundProjectActions}
            addTracker={boundTrackerActions.addTracker}
            userInfo={env.userInfo}
          />
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

        <XImageEditModal
          {...imageEditModalObj}
          onCancelClick={this.closeImageEditModal}
        />

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

        {fontList.length ? (
          <TextEditModal
            fontList={fontList}
            baseUrl={baseUrls.get('baseUrl')}
            isShown={textEditModal.get('isShown')}
            element={textEditModal.get('element')}
            variables={variables}
            currentPage={currentPage}
            elementArray={elementArray}
            closeTextEditModal={this.closeTextEditModal}
            updateElement={boundProjectActions.updateElement}
            ratio={ratio}
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
        <PreviewModal actions={previewModalActions} data={previewModalData} />
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
