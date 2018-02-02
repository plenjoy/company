import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import logo from './assets/logo.png';
import { getTextBlobSrc } from '../../utils/textHelper';

import './index.scss';
import { is } from 'immutable';
import emoji from '../../../../common/utils/emoji';

class SpineTextElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, data, actions } = this.props;
    const { element } = data;

    const computedSize = element.get('computedSize');

    const elementStyle = {
      top: computedSize.get('x'),
      left: computedSize.get('y'),
      width: computedSize.get('width'),
      height: computedSize.get('height')
    };

    const spineLogoStyle = {
      width: computedSize.get('spineLogoSize'),
      height: computedSize.get('spineLogoSize'),
      marginRight: computedSize.get('spineLogoTextDistance'),
      transform: 'translateY(-50%)',
    };

    const spineUserNameStyle = {
      width: computedSize.getIn(['spineUsername', 'width']),
      height: computedSize.getIn(['spineUsername', 'height']),
      fontSize: computedSize.getIn(['spineUsername', 'fontSize']),
      lineHeight: `${computedSize.getIn(['spineUsername', 'height'])}px`,
      transform: `scale(${computedSize.getIn(['spineUsername', 'ratio'])}) translateY(-50%)`,
      transformOrigin: 'left top',
      marginLeft: computedSize.get('spineLogoSize') + computedSize.get('spineLogoTextDistance')
    };

    const spineDateStyle = {
      width: computedSize.getIn(['spineDate', 'width']),
      height: computedSize.getIn(['spineDate', 'height']),
      fontSize: computedSize.getIn(['spineDate', 'fontSize']),
      lineHeight: `${computedSize.getIn(['spineDate', 'height'])}px`,
      transform: `scale(${computedSize.getIn(['spineDate', 'ratio'])}) translateY(-50%)`,
      transformOrigin: 'left top',
      textAlign: 'right'
    };

    return (
      <div className="spine-text-element" style={elementStyle}>
        <img className="spine-text-logo" src={logo} style={spineLogoStyle} />
        <span className="spine-text-username" style={spineUserNameStyle}>
          {emoji(computedSize.getIn(['spineUsername', 'text']))}
        </span>
        <span className="spine-text-date" style={spineDateStyle}>
          {computedSize.getIn(['spineDate', 'text'])}
        </span>
      </div>
    );
  }
}

SpineTextElement.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('SpineTextElement')(SpineTextElement);
