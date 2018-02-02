import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';

import './index.scss';
import emoji from '../../../../common/utils/emoji';

class TextElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, data } = this.props;
    const { element } = data;

    const computedSize = element.get('computedSize');
    const textParams = computedSize.get('textParams');

    const containerStyle = {
      top: computedSize.get('y'),
      left: computedSize.get('x'),
      width: computedSize.get('width'),
      height: computedSize.get('height'),
    };

    const contentStyle = {
      width: textParams.get('width'),
      transform: `scale(${textParams.get('ratio')}) translateY(-50%)`,
      fontSize: textParams.get('fontSize'),
      textAlign: textParams.get('textAlign'),
      whiteSpace: !computedSize.get('isCaption') ? 'nowrap' : null
    };

    return (
      <div className="text-element" style={containerStyle}>
        <div className="text-element-content" style={contentStyle}>
          {emoji(textParams.get('text'))}
        </div>
      </div>
    );
  }
}

TextElement.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('TextElement')(TextElement);
