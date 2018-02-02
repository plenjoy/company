import React, { Component, PropTypes } from 'react';
import WarnTip from '../WarnTip';

class TextWarnTip extends Component {
  render() {
    const { isShowTextNotFit, isShowTextOverflow, parentHeight } = this.props;
    const ERROR_TEXT_NOT_FIT = 'Text does not fit';
    const ERROR_TEXT_OVERFLOW = 'Text is too close to edge and may not print well';
    const warnTipTextArray = [];
      if (isShowTextNotFit) {
        warnTipTextArray.push(ERROR_TEXT_NOT_FIT);
      }
      if (isShowTextOverflow) {
        warnTipTextArray.push(ERROR_TEXT_OVERFLOW);
      }
    const warnTipProps = { parentHeight: parentHeight, title: warnTipTextArray.join('\n') };
    return (
      <WarnTip {...warnTipProps} />
    );
  }
}


export default TextWarnTip;
