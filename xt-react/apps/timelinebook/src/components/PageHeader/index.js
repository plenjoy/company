import React, { Component, PropTypes } from 'react';
import { template, merge } from 'lodash';
import { translate } from 'react-translate';

import { redirectToOrder } from '../../utils/order';
import XHeader from '../XHeader';

import {
  onClickLogo,
  onOrder
} from './handle/main';
import './index.scss';

class PageHeader extends Component {
  constructor(props) {
    super(props);

    // 是否正在加入购物车.
    this.isOrdering = false;

    // 是否正在提交打回的订单.
    this.isSubmitingCheckFail = false;

    this.onClickLogo = goToHome => onClickLogo(this, goToHome);
    this.onOrder = () => onOrder(this);

    this.state = {
      isUpgrade: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // const { isUpgrade } = this.state;
    // if (isUpgrade && isUpgrade !== prevState.isUpgrade) {
    //   const { data, actions } = this.props;
    //   const projectId = data.project.get('projectId');
    //   actions.onSaveProject(() => {}, null, true).then(() => {
    //     // boundUpgradeModalActions.hideUpgrade();

    //     // 加入购物车.
    //     redirectToOrder(projectId);
    //   });

    //   this.setState({
    //     isUpgrade: false
    //   });
    // }
  }

  render() {
    const { actions, data, t } = this.props;
    const {
      boundProjectActions,
      boundConfirmModalActions,
      boundTrackerActions,
      onSaveProject,
      boundOrderModalActions
    } = actions;
    const { project, env, volumes } = data;

    const userId = env.userInfo && env.userInfo.get('id');
    const baseUrls = env.urls && env.urls.toJS();

    return (
      // todo.
      <XHeader
        boundSystemActions={boundConfirmModalActions}
        isProjectEdited={false}
        onSaveProject={this.onClickLogo}
        baseUrls={baseUrls}
      >
        <div className="head-nav">
          {volumes.size ? (
            <span className="nav-item" onClick={()=>onOrder(this)}>
              {t('ORDER')}
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
