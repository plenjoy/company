/**
 * 这是一个容器组件, 在应用中所有要用到的弹框(包括: modal, popover, notify)统一的在这里初始化.
 */
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get } from 'lodash';

import ConfirmModal from '../../components/ConfirmModal';
import OAuthPage from '../../components/OAuthPage';
import OAuthLoading from '../../components/OAuthLoading';
import FontCalculator from '../../components/FontCalculator';
import OrderModal from '../../components/OrderModal';
import OrderLoading from '../../components/OrderLoading';
import IncompleteModal from '../../components/IncompleteModal';
import PreviewModal from '../../components/PreviewModal';
import { pageTypes } from '../../constants/strings';
import './index.scss';

class Modals extends Component {
  constructor(props) {
    super(props);

    this.closeConfirmModalByX = this.closeConfirmModalByX.bind(this);
    this.closeOrderModalByX = this.closeOrderModalByX.bind(this);
    this.closeUpgradeModal = this.closeUpgradeModal.bind(this);
  }

  closeConfirmModalByX() {
    const { actions, data } = this.props;
    const { boundConfirmModalActions } = actions;
    const { confirmModal,orderModal } = data;

    boundConfirmModalActions.hideConfirm();

    if (
      confirmModal.get('xCloseFun') &&
      typeof confirmModal.get('xCloseFun') === 'function'
    ) {
      confirmModal.get('xCloseFun')();
    }
  }

  closeOrderModalByX() {
    const { actions, data } = this.props;
    const { boundOrderModalActions } = actions;

    boundOrderModalActions.hideOrder();
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
      oAuth,
      photoArray,
      confirmModal,
      orderModal,
      upgradeModal,
      oAuthPage,
      oAuthLoading,
      fontCalculator,
      volumes,
      selectedVolume,
      incompleteModal,
      previewModal,
      projectMap,
      summary,
      materials,
      price,
      pageInfo,
      isPreview
    } = data;

    const {
      boundEnvActions,
      boundOAuthActions,
      boundProjectsActions,
      boundPhotoArrayActions,
      boundOrderModalActions,
      boundNotificationActions,
      boundConfirmModalActions,
      boundOAuthPageActions,
      boundOAuthLoadingActions,
      boundTrackerActions,
      onSaveProject,
      boundIncompleteModalActions
    } = actions;

    const oAuthPageData = {
      ...projectMap,
      oAuth,
      oAuthPage
    };

    const oAuthPageActions = {
      boundEnvActions,
      boundOAuthActions,
      boundTrackerActions,
      boundOAuthPageActions,
      boundOAuthLoadingActions,
      boundConfirmModalActions
    };

    const oAuthLoadingData = {
      ...projectMap,
      oAuth,
      photoArray,
      oAuthLoading,
      fontCalculator,
      volumes
    };

    const oAuthLoadingActions = {
      boundOAuthActions,
      boundProjectsActions,
      boundPhotoArrayActions,
      boundTrackerActions,
      boundOAuthLoadingActions,
      boundConfirmModalActions
    };

    const orderModalData = {
      volumes,
      summary,
      price,
      isShown: orderModal.get('isShown')
    };
    const orderModalActions = {
      boundProjectsActions,
      onSaveProject,
      boundOrderModalActions,
      closeOrderModalByX: this.closeOrderModalByX,
      boundTrackerActions,
    };

    const incompleteModalData = {
      incompleteModal
    };
    const incompleteModalActions = {
      boundIncompleteModalActions
    };

    const previewModalActions = {};
    const previewModalData = {
      isShown: previewModal.get('isShown'),
      total: pageInfo.get('max'),
      sheets: selectedVolume && selectedVolume.get('computedPages').flatten(true),
      materials,
      summary,
      env,
      isPreview
    };

    return (
      <div className="modals">

        {confirmModal.get('isShown')
          ? <ConfirmModal
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
          : null}

        {!isPreview ? (
          <OAuthPage
            actions={oAuthPageActions}
            data={oAuthPageData}
          />
        ) : null}

        {oAuthLoading.get('isShown')
          ? <OAuthLoading
              isShown={oAuthLoading.get('isShown')}
              data={oAuthLoadingData}
              actions={oAuthLoadingActions}
            />
          : null}

        <OrderModal
          data={orderModalData}
          actions={orderModalActions}
        />

        {orderModal.get('isShowLoading')
          ? <OrderLoading />
          : null}

        {incompleteModal.get('isShown')
          ?<IncompleteModal
            data={incompleteModalData}
            actions={incompleteModalActions}
          />
          :null}

        {previewModal.get('isShown') ? (
          <PreviewModal
            data={previewModalData}
            actions={previewModalActions}
          />
        ) : null}

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
