/**
 * 这是一个容器组件, 在应用中所有要用到的弹框(包括: modal, popover, notify)统一的在这里初始化.
 */
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get } from 'lodash';

import ConfirmModal from '../../components/ConfirmModal';
import { pageTypes } from '../../constants/strings';
import './index.scss';

class Modals extends Component {
  constructor(props) {
    super(props);

    this.closeConfirmModalByX = this.closeConfirmModalByX.bind(this);
    this.closeUpgradeModal = this.closeUpgradeModal.bind(this);
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

  render() {
    const { data, actions } = this.props;

    const {
      env,

      confirmModal,
      upgradeModal
    } = data;

    const {
      boundNotificationActions,
      boundConfirmModalActions,
      boundEnvActions
    } = actions;

    // 根据当前的 url 判断是否为 分享预览状态。
    const isPreview = /isPreview/.test(window.location.href);

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
