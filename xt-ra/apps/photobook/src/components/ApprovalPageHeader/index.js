import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import XHeader from '../../../../common/ZNOComponents/XHeader';

import * as handler from './handler';

import './index.scss';

class ApprovalPageHeader extends Component {
  constructor(props) {
    super(props);

    // 标识是否正在加入购物车.
    this.isOrdering = false;

    this.onSave = (onSaveSuccessed, onSaveFailed) => handler.onSave(this, onSaveSuccessed, onSaveFailed);
    this.onCancelClick = () => handler.onCancelClick(this);
    this.onApproveClick = () => handler.onApproveClick(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { actions, data, t } = this.props;
    const {
      boundConfirmModalActions
    } = actions;
    const { env } = data;
    const baseUrls = env.urls && env.urls.toJS();

    return (
      <XHeader
        boundSystemActions={boundConfirmModalActions}
        isProjectEdited={false}
        onSaveProject={this.onSave}
        baseUrls={baseUrls}
      >
        <button
          className="approval-header-cancel"
          onClick={this.onCancelClick}
        >{ t('CANCEL') }</button>
        <button
          className="approval-header-approve"
          onClick={this.onApproveClick}
        >{ t('APPROVE') }</button>
      </XHeader>
    );
  }
}

ApprovalPageHeader.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default translate('ApprovalPageHeader')(ApprovalPageHeader);
