import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import Immutable, { Map } from 'immutable';
import { get, merge, pick } from 'lodash';
import classNames from 'classnames';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

import './index.scss';

import * as mainHandle from './handle/main';

class ManagePhotos extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      t,
      originalProjects,
      summary,
      volumes,
      originalSpec,
      currentSpec,
      env,
    } = this.props;

    const className = classNames('manage-photos');

    return (
      <div className={className}>
        <h1>manage-photos</h1>
      </div>
    );
  }
}

ManagePhotos.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapAppDispatchToProps)(
  translate('ManagePhotos')(ManagePhotos)
);
