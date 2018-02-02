import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';

import './index.scss';

// 导入组件
import Element from '../Element';

// 导入处理函数
import * as handler from './handler';

class BackgroundElement extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    const oldElement = get(this.props, 'data.element');
    const newElement = get(nextProps, 'data.element');

    const oldBackground = get(this.props, 'data.style.background');
    const newBackground = get(nextProps, 'data.style.background');

    return !Immutable.is(oldElement, newElement) || oldBackground !== newBackground;
  }

  render() {
    const { t, actions, data } = this.props;
    const { element, text, style, ratio, page } = data;

    const pageWidth = page.get('width') * ratio.workspace;
    const pageHeight = page.get('height') * ratio.workspace;

    // 提示语.
    const tip = text || t('DRAG_AND_DROP_TIP');
    const computed = element.get('computed');

    // element 容器的样式.
    const containerStyle = merge({}, style, {
      position: 'absolute',
      width: computed.get('width'),
      height: computed.get('height'),
      left: computed.get('left'),
      top: computed.get('top')
    });
    const handlerStyle = {
      position: 'absolute',
      width: computed.get('width') + 'px',
      height: computed.get('height') + 'px',
      top: 0,
      left: 0
    };

    // element
    const elementActions = merge({}, actions);
    const elementData = merge({}, data, {
      className: 'backgorund-element',
      style: containerStyle,
      handlerStyle,
      pageWidth,
      pageHeight
    });

    return (
      <Element actions={elementActions} data={elementData}>
        {/* <div className="vertical-middle-line"/> */}
        <div className="tip" data-html2canvas-ignore="true">{tip}</div>
      </Element>
    );
  }
}

BackgroundElement.propTypes = {
};

export default translate('BackgroundElement')(BackgroundElement);
