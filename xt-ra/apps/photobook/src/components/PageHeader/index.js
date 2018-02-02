import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { template, merge } from 'lodash';
import { translate } from 'react-translate';

import XHeader from '../../../../common/ZNOComponents/XHeader';
import XTitleEditor from '../../../../common/ZNOComponents/XTitleEditor';
import {
  onClone,
  onHelp,
  onPreview,
  onSave,
  onClickLogo,
  onShare,
  onOrder,
  directToFAQ,
  showIntroModal,
  onSubmitCheckFailProject,
  showQuickStartModal,
  showHowThisWorksModal,
  showContactUsModal
} from './handler';

import { productTypes, productNames } from '../../contants/strings';
import { DOWNLOAD_BOOKSPEC_URL } from '../../contants/apiUrl';

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
    this.onHelp = () => onHelp(this);
    this.onPreview = () => onPreview(this);
    this.onSave = (onSaveSuccessed, onSaveFailed) =>
      onSave(this, onSaveSuccessed, onSaveFailed);
    this.onShare = () => onShare(this);
    this.onOrder = () => onOrder(this);
    this.onSubmitCheckFailProject = () => onSubmitCheckFailProject(this);
    this.directToFAQ = () => directToFAQ(this);
    this.showIntroModal = () => showIntroModal(this);

    this.onClickLogo = goToHome => onClickLogo(this, goToHome);

    const { setting, spec, env } = this.props.data;
    this.state = {
      downloadUrl: this.getDownloadUrl(setting, spec, env.urls.get('baseUrl'))
    };
    this.downSpec = this.downSpec.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldData = this.props.data;
    const newData = nextProps.data;

    if (!Immutable.is(oldData.setting, newData.setting)) {
      const { setting, spec, env } = newData;

      this.setState({
        downloadUrl: this.getDownloadUrl(setting, spec, env.urls.get('baseUrl'))
      });
    }
  }

  getDownloadUrl(setting, spec, baseUrl) {
    const { allOptionMap } = spec;
    const product = setting.get('product');
    const cover = setting.get('cover');

    let prefix = '';

    switch (product) {
      case productTypes.LF:
        prefix = 'Layflat';
        break;
      case productTypes.PS:
        prefix = 'PressBook';
        break;
      default:
    }

    const coverOptionArray = allOptionMap.cover;
    const theCoverOption = coverOptionArray.find((o) => {
      return o.id === cover;
    });

    if (theCoverOption) {
      const coverName = theCoverOption.name.replace(/\s/g, '');

      const downloadCoverName = `${prefix}${coverName}`;
      const downloadProductName = productNames[product];

      const downloadUrl = template(DOWNLOAD_BOOKSPEC_URL)({
        baseUrl,
        bookName: encodeURIComponent(downloadProductName),
        cover: encodeURIComponent(downloadCoverName),
        size: setting.get('size')
      });

      return downloadUrl;
    }

    return '';
  }

  downSpec() {
    const { boundUseSpecActions } = this.props.actions;
    const { downloadUrl } = this.state;
    boundUseSpecActions.showUseSpecModal({url:downloadUrl});
  }

  render() {
    const { actions, data, t } = this.props;
    const {
      boundProjectActions,
      boundConfirmModalActions,
      boundTrackerActions,
      boundQuickStartActions,
      boundHowThisWorksActions,
      boundContactUsActions,
      boundNotificationActions,
      boundGuideLineActions,
      openLoginPage
    } = actions;
    const { project, env, isEditParentBook, capability, setting, spec } = data;
    const property = project.property;
    const title = property.get('title');
    const projectId = property.get('projectId');
    const orderInfo = project.orderInfo;
    const userId = env.userInfo.get('id');
    const baseUrls = env.urls && env.urls.toJS();
    const TitleEditorData = {
      title,
      projectId,
      userId,
      orderInfo,
      disable: isEditParentBook,
      capability
    };
    const TitleEditorActions = {
      boundProjectActions,
      boundTrackerActions,
      boundNotificationActions,
      openLoginPage
    };

    // 是不是打回的订单.
    const checkFailed = orderInfo.get('isCheckFailed');

    const { downloadUrl } = this.state;

    return (
      // todo.
      <XHeader
        boundSystemActions={boundConfirmModalActions}
        isProjectEdited={false}
        onSaveProject={this.onClickLogo}
        baseUrls={baseUrls}
      >
        <XTitleEditor actions={TitleEditorActions} data={TitleEditorData} />
        {isEditParentBook ? (
          <div className="head-nav">
            <span
              id="saveProject"
              className="nav-item"
              onClick={this.onSave.bind(this, null, null)}
            >
              {t('SAVE')}
            </span>
            {capability.get('canShowPageHeaderOrder') ? (
              <span className="nav-item" onClick={this.onOrder}>
                <span id="orderProject">{t('ORDER')}</span>
              </span>
            ) : null}
            {checkFailed ? (
              <span
                className="nav-item"
                onClick={this.onSubmitCheckFailProject}
              >
                {t('SUBMIT')}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="head-nav">
            <span
              className="nav-item"
              onClick={boundContactUsActions.showContactUsModal}
            >
              {t('FEEDBACK')}
            </span>
            {capability.get('canShowPageHeaderHelp') ? (
              <span className="nav-item" onClick={this.onHelp}>
                {t('HELP')}
                <div className="sub-panel">
                  <span>◆</span>
                  <a className="sub-item" onClick={this.showIntroModal}>
                    {t('QUICK_START')}
                  </a>
                  <a
                    className="sub-item"
                    onClick={boundHowThisWorksActions.showHowThisWorksModal}
                  >
                    {t('HOW_THIS_WORKS')}
                  </a>
                  <a
                    className="sub-item"
                    onClick={boundGuideLineActions.showGuideLineModal}
                  >
                    {t('GUIDE_lINE')}
                  </a>
                  <a className="sub-item" onClick={this.directToFAQ}>
                    {t('FAQ')}
                  </a>
                  <a className="sub-item" onClick={this.downSpec} >
                    Download Spec
                  </a>
                </div>
              </span>
            ) : null}
            {capability.get('canShowPageHeaderClone') ? (
              <span className="nav-item" onClick={this.onClone}>
                {t('CLONE')}
              </span>
            ) : null}
            {capability.get('canShowPageHeaderShare') ? (
              <span className="nav-item" onClick={this.onShare}>
                {t('SHARE')}
              </span>
            ) : null}

            <span className="nav-item" onClick={this.onPreview}>
              {t('PREVIEW')}
            </span>
            <span
              id="saveProject"
              className="nav-item"
              onClick={this.onSave.bind(this, null, null)}
            >
              {t('SAVE')}
            </span>

            {capability.get('canShowPageHeaderOrder') ? (
              <span className="nav-item" onClick={this.onOrder}>
                <span id="orderProject">{t('ORDER')}</span>
              </span>
            ) : null}

            {checkFailed ? (
              <span
                className="nav-item"
                onClick={this.onSubmitCheckFailProject}
              >
                {t('SUBMIT')}
              </span>
            ) : null}
          </div>
        )}
      </XHeader>
    );
  }
}

PageHeader.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('PageHeader')(PageHeader);
