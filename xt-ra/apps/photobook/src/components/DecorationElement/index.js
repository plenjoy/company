import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import classNames from 'classnames';

// 导入组件
import XLoading from '../../../../common/ZNOComponents/XLoading';
import Element from '../Element';

import { loadImgWithBase64 } from '../../utils/image';

// 导入处理函数
import * as events from './handler/events';
import * as handler from './handler';

import './index.scss';

class DecorationElement extends Component {
  constructor(props) {
    super(props);

    // 处理函数
    this.handleDragOver = event => handler.handleDragOver(this, event);
    this.onDrop = event => handler.onDrop(this, event);
    this.toggleActionBar = (data, event) => handler.toggleActionBar(this, data, event);

    // 内部state
    this.state = {
      isImgLoading: false,
      img: null,
      isShowActionBar: true
    };

    this.hideLoading = () => {
      this.setState({
        isImgLoading: false
      });
    };
  }

  componentWillMount() {
    const { data } = this.props;
    const { element } = data;
    const computed = element.get('computed');
    const imgUrl = element.getIn(['computed', 'imgUrl']);

    this.setState({
      isImgLoading: !!imgUrl
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (Immutable.is(this.props.data.element, nextProps.data.element) &&
      this.state.isImgLoading === nextState.isImgLoading &&
      this.state.img === nextState.img
    ) {
      return false;
    }
    return true;
  }

  componentWillReceiveProps(nextProps) {
    events.componentWillReceiveProps(this, nextProps);
  }

  render() {
    const { t, actions, data } = this.props;
    const { element } = data;
    const computed = element.get('computed');
    const imgUrl = element.getIn(['computed', 'imgUrl']);

    // element 容器的样式.
    const containerStyle = {
      zIndex: element.get('dep') + 2000,
      width: computed.get('width'),
      height: computed.get('height'),
      left: computed.get('left'),
      top: computed.get('top'),
      transform: `rotate(${element.get('rot')}deg)`
    };
    const handlerStyle = {
      position: 'absolute',
      width: `${computed.get('width')}px`,
      height: `${computed.get('height')}px`,
      top: 0,
      left: 0
    };
    const imgStyle = handlerStyle;

    // element
    const elementActions = merge({}, actions, {
      handleClick: this.toggleActionBar
    });

    const elementData = merge({}, data, {
      className: classNames('decoration-element', {
        'has-image': !!imgUrl,
        selected: element.get('isSelected')
      }),
      style: containerStyle,
      handlerStyle
    });

    const { isImgLoading } = this.state;

    return (
      <Element actions={elementActions} data={elementData}>
        <div className="layer-image">
          <XLoading isShown={isImgLoading} />
          <img
            className="decoration-img"
            src={imgUrl}
            style={imgStyle}
            onLoad={this.hideLoading}
            onError={this.hideLoading}
          />
        </div>
      </Element>
    );
  }
}

DecorationElement.propTypes = {
};

export default translate('DecorationElement')(DecorationElement);
