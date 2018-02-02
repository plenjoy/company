import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import logoSrc from './assets/logo.png';

import './index.scss';

class LogoElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { t, data, actions } = this.props;
    const {
      element
    } = data;

    const computedSize = element.get('computedSize');

    const elementStyle = {
      top: computedSize.get('y'),
      left: computedSize.get('x'),
      width: computedSize.get('width'),
      height: computedSize.get('height')
    };

    return (
      <img className="logo-element" style={elementStyle} src={logoSrc} />
    );
  }
}

LogoElement.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('LogoElement')(LogoElement);
