import React, {
  Component,
  PropTypes
} from 'react';
import {
  template,
  merge
} from 'lodash';
import {
  translate
} from 'react-translate';

import XTitleEditor from '../../../../common/ZNOComponents/XTitleEditor';
import XHeader from '../../../../common/ZNOComponents/XHeader';

import {
  onClickLogo,
  onOrder,
  onPreview,
  onSave,
  onSubmitCheckFailProject
} from './handle/main';
import './index.scss';

class PageHeader extends Component {
  constructor(props) {
    super(props);

    // 是否正在加入购物车.
    this.isOrdering = false;

    // 是否正在提交打回的订单.
    this.isSubmitingCheckFail = false;

    this.onSave = (onSaveSuccessed, onSaveFailed) =>
          onSave(this, onSaveSuccessed, onSaveFailed);
    this.onOrder = () => onOrder(this);
    this.onPreview = () => onPreview(this);
    this.onClickLogo = goToHome => onClickLogo(this, goToHome);
    this.onSubmitCheckFailProject = () => onSubmitCheckFailProject(this);

    this.state = {
      isUpgrade: false
    };
  }

  render() {
    const {
      actions,
      data,
      t
    } = this.props;
    const {
      boundProjectActions,
      boundConfirmModalActions,
      boundTrackerActions
    } = actions;
    const {
      project,
      env,
      capability
    } = data;

    const property = project.property;
    const title = property.get('title');
    const projectId = property.get('projectId');
    const userId = env.userInfo && env.userInfo.get('id');
    const baseUrls = env.urls && env.urls.toJS();
    // 是不是打回的订单.
    const orderInfo = project.orderInfo;
    const checkFailed = orderInfo.get('isCheckFailed');

    const TitleEditorData = {
      title,
      projectId,
      userId,
      orderInfo,
      capability
    };
    const TitleEditorActions = { boundProjectActions, boundTrackerActions };

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
          <span className="nav-item" onClick={this.onPreview}>
            {t('PREVIEW')}
          </span>
          <span className="nav-item" onClick={this.onSave}>
            {t('SAVE')}
          </span>

          {
            checkFailed
              ? <span className="nav-item" onClick={this.onSubmitCheckFailProject}>
                {t('SUBMIT')}
              </span>
              : <span className="nav-item" onClick={this.onOrder}>
                {t('ORDER')}
              </span>
          }
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
