import React, { Component, PropTypes } from 'react';
import { template, merge } from 'lodash';
import { connect } from 'react-redux';
import { translate } from "react-translate";

// 导入selector
import { mapPhotoGroupingDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/photoGrouping';

import './index.scss';

class PhotoGrouping extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="photo-grouping">
        this is photo-grouping!
      </div>
    );
  }
}

PhotoGrouping.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapPhotoGroupingDispatchToProps)(translate('PhotoGrouping')(PhotoGrouping));
