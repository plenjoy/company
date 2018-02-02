import React, { Component } from 'react';
import { isIE, isEdge } from '../../utils/browser';
import './index.scss';

class XInput extends Component {
  render() {
    const { onChange } = this.props;
    const props = this.props;
    const attributeName = isIE || isEdge ? 'onInput' : 'onChange';

    const newProps = new Array();
    newProps[attributeName] = onChange;
    for (let k in props) {
      newProps[k] = props[k];
    }

    return <input {...newProps}/>;
  }
}

export default XInput;
