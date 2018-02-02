import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';

import XPopover from '../../../common/ZNOComponents/XPopover';
import './index.scss';

class OperationPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, t, onCropImage, onRotateImage, onRemoveImage } = this.props;
    const customClass = classNames('operation-panel', className);

    return (
      <XPopover className={customClass} {...this.props}>
        <ul>
          <li className="item" onClick={onCropImage}>{t('CROPIMAGE')}</li>
          <li className="item" onClick={onRotateImage}>{t('ROTATEIMAGE')}</li>
          <li className="item" onClick={onRemoveImage}>{t('REMOVEIMAGE')}</li>
        </ul>
      </XPopover>
    );
  }
}

OperationPanel.propTypes = {
  className: PropTypes.string,

  // Popover是否显示, true为显示
  shown: PropTypes.bool,

  // 触发Popover显示的事件, 默认为click
  event: PropTypes.string,

  // Popover显示时所在的位置.
  offset: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  }),

  // 裁剪图片的处理函数
  onCropImage: PropTypes.func.isRequired,

  // 旋转图片的处理函数
  onRotateImage: PropTypes.func.isRequired,

  // 删除图片的处理函数
  onRemoveImage: PropTypes.func.isRequired
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('OperationPanel')(OperationPanel);
