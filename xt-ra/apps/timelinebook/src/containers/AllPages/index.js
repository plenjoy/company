import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import Immutable, { Map } from 'immutable';
import { get, merge, pick } from 'lodash';
import classNames from 'classnames';

import SideBar from '../../components/SideBar';
import EmptyPage from '../../components/EmptyPage';
import BookSpreads from '../../components/BookSpreads';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

import './index.scss';

import * as mainHandle from './handle/main';

class AllPages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      t,
      originalProjects,
      summary,
      volumes,
      selectedVolume,
      originalSpec,
      currentSpec,
      env,
      sidebar,
      materials,
      pageInfo,
      isViewRending,

      boundProjectsActions,
      boundSidebarActions,
      boundTrackerActions,
      boundOAuthPageActions,
      boundPhotoArrayActions,
      boundViewPropertiesActions,
      boundIncompleteModalActions
    } = this.props;
    const className = classNames('AllPages');

    // sidebar
    const sideBarActions = {
      boundProjectsActions,
      boundSidebarActions,
      boundTrackerActions,
      boundViewPropertiesActions,
      boundIncompleteModalActions
    };
    const sideBarData = {
      summary,
      sidebar,
      volumes,
      materials,
      pageInfo
    };

    // Spreads
    const spreadActions = {
      boundTrackerActions,
      boundProjectsActions,
      boundPhotoArrayActions,
      boundViewPropertiesActions,
    };
    const spreadData = {
      env,
      summary,
      volumes,
      selectedVolume,
      materials,
      isViewRending
    };

    const emptyPageData = {
    };

    const emptyPageActions = {
      boundOAuthPageActions,
      boundPhotoArrayActions
    };

    // if(selectedVolume){
    //   log('selectedVolume', selectedVolume.toJS());
    // }

    return (
      <div className={className}>
        {/* 左侧的导航组件 */}
        <SideBar data={sideBarData} actions={sideBarActions} />

        <BookSpreads data={spreadData} actions={spreadActions} />

        {volumes.size === 0
          ? <EmptyPage data={emptyPageData} actions={emptyPageActions} />
          : null}
      </div>
    );
  }
}

AllPages.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapAppDispatchToProps)(
  translate('AllPages')(AllPages)
);
