import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { template, merge } from 'lodash';
import { translate } from 'react-translate';

import { redirectToOrder } from '../../utils/order';
import XHeader from '../../../../common/ZNOComponents/XHeader';
import XTitleEditor from '../../../../common/ZNOComponents/XTitleEditor';
import {
  onClone,
  onPreview,
  onSave,
  onClickLogo,
  onShare,
  onOrder,
  directToFAQ,
  onSubmitCheckFailProject,
  showQuickStartModal,
  showHowThisWorksModal,
  showContactUsModal
} from './handler';
import './index.scss';

class PageHeader extends Component {
  constructor(props) {
    super(props);

    // 是否正在加入购物车.
    this.isOrdering = false;

    // 是否正在提交打回的订单.
    this.isSubmitingCheckFail = false;

    // 按钮的处理函数.
    this.onClone = () => onClone(this);
    this.onPreview = () => onPreview(this);
    this.onSave = (onSaveSuccessed, onSaveFailed) =>
      onSave(this, onSaveSuccessed, onSaveFailed);
    this.onShare = () => onShare(this);
    this.onOrder = () => onOrder(this);
    this.onSubmitCheckFailProject = () => onSubmitCheckFailProject(this);

    this.onClickLogo = goToHome => onClickLogo(this, goToHome);

    this.state = {
      isUpgrade: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { isUpgrade } = this.state;
    if (isUpgrade && isUpgrade !== prevState.isUpgrade) {
      const { data, actions } = this.props;
      const projectId = data.project.get('projectId');
      actions.onSaveProject(() => {}, null, true).then(() => {
        // boundUpgradeModalActions.hideUpgrade();

        // 加入购物车.
        redirectToOrder(projectId);
      });

      this.setState({
        isUpgrade: false
      });
    }
  }

  render() {
    const { actions, data, t } = this.props;
    const {
      boundProjectActions,
      boundConfirmModalActions,
      boundTrackerActions,
      boundContactUsActions
    } = actions;
    const { project, env } = data;
    const title = project.get('title');
    const projectId = project.get('projectId');
    const userId = env.userInfo.get('id');
    const baseUrls = env.urls && env.urls.toJS();
    const TitleEditorData = {
      title,
      projectId,
      userId,
      orderInfo: Immutable.Map({
        isOrdered: project.getIn(['orderStatus', 'ordered']),
        isCheckFailed: project.getIn(['orderStatus', 'checkFailed'])
      })
    };
    const TitleEditorActions = { boundProjectActions, boundTrackerActions };

    // 是不是打回的订单.
    const checkFailed = project.getIn(['orderStatus', 'checkFailed']);

    return (
      // todo.
      <XHeader
        boundSystemActions={boundConfirmModalActions}
        isProjectEdited={false}
        onSaveProject={this.onClickLogo}
        baseUrls={baseUrls}
      >
        <XTitleEditor actions={TitleEditorActions} data={TitleEditorData} />
        <div className="head-nav">
          <span
            className="nav-item"
            onClick={boundContactUsActions.showContactUsModal}
          >
            {t('FEEDBACK')}
          </span>
          <span className="nav-item" onClick={this.onClone}>
            {t('CLONE')}
          </span>
          <span className="nav-item" onClick={this.onShare}>
            {t('SHARE')}
          </span>
          <span className="nav-item" onClick={this.onPreview}>
            {t('PREVIEW')}
          </span>
          <span
            className="nav-item"
            onClick={this.onSave.bind(this, null, null)}
          >
            {t('SAVE')}
          </span>
          <span className="nav-item" onClick={this.onOrder}>
            {t('ORDER')}
          </span>

          {checkFailed ? (
            <span className="nav-item" onClick={this.onSubmitCheckFailProject}>
              {t('SUBMIT')}
            </span>
          ) : null}
        </div>
      </XHeader>
    );
  }
}

PageHeader.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('PageHeader')(PageHeader);
