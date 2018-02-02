import React, { Component, PropTypes } from 'react';
import { translate } from "react-translate";
import classNames from 'classnames';
import './index.scss';

class OutInSide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, sheetIndex,  onLeftClicked, onRightClicked, t } = this.props;
    const customClass = classNames('out-in-side', className);

    const leftButtonClassName = classNames('left-icon icon', { 'disabled': sheetIndex === 0 });
    const rightButtonClassName = classNames('right-icon icon', { 'disabled': sheetIndex === 1 });

    return (
      <div className={customClass}>
        <div className="left-button x-btn" onClick={onLeftClicked}>
          <i className={leftButtonClassName} />
          {/* <span className="text">{t('OUTSIDE')}</span> */}
        </div>
        <span className="text">{sheetIndex === 0 ? t('OUTSIDE') : t('INSIDE')}</span>
        <div className="right-button x-btn" onClick={onRightClicked}>
          <i className={rightButtonClassName} />
          {/* <span className="text">{t('INSIDE')}</span> */}
        </div>
      </div>
    );
  }
}

OutInSide.propTypes = {
  sheetIndex: PropTypes.number,
  onLeftClicked: PropTypes.func,
  onRightClicked: PropTypes.func,
  className: PropTypes.string
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('OutInSide')(OutInSide);
