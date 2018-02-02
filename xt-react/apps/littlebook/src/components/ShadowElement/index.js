import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';

import './index.scss';

// 导入组件
import Element from '../Element';

// 导入处理函数
import * as handler from './handler';

class ShadowElement extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElment = this.props.data.element;
    const newElment = nextProps.data.element;

    const oldRatio = this.props.data.ratio.workspace;
    const newRatio = nextProps.data.ratio.workspace;

    return !(Immutable.is(oldElment, newElment) && oldRatio === newRatio);
  }

  render() {
    const { t, actions, data } = this.props;
    const { element, ratio } = data;

    // element 容器的样式.
    const containerStyle = {
      position: 'absolute',
      width: element.get('width') * ratio.workspace + 'px',
      height: element.get('height') * ratio.workspace + 'px',
      left: element.get('left') * ratio.workspace + 'px',
      top: element.get('top') * ratio.workspace + 'px'
    };
    const handlerStyle = {
      display: 'none'
    };

    // element
    const elementActions = {};
    const elementData = merge({}, {
      element,
      className: 'shadow-element',
      style: containerStyle,
      handlerStyle
    });

    // 左侧的图片
    const leftImage = element.get('leftImage');
    const leftImageStyle = {
      width: leftImage.get('width') * ratio.workspace + 'px',
      height: leftImage.get('height') * ratio.workspace + 'px',
      top: leftImage.get('top') * ratio.workspace + 'px',
      left: leftImage.get('left') * ratio.workspace + 'px'
    };

    // 中间的图片
    const middleImage = element.get('middleImage');
    const middleImageStyle = {
      width: middleImage.get('width') * ratio.workspace + 'px',
      height: middleImage.get('height') * ratio.workspace + 'px',
      top: middleImage.get('top') * ratio.workspace + 'px',
      left: middleImage.get('left') * ratio.workspace + 'px'
    };

    // 右侧的图片
    const rightImage = element.get('rightImage');
    const rightImageStyle = {
      width: rightImage.get('width') * ratio.workspace + 'px',
      height: rightImage.get('height') * ratio.workspace + 'px',
      top: rightImage.get('top') * ratio.workspace + 'px',
      left: rightImage.get('left') * ratio.workspace + 'px'
    };

    return (
      <Element actions={elementActions} data={elementData}>
        <img src={leftImage.get('imgUrl')} style={leftImageStyle}/>
        <img src={middleImage.get('imgUrl')} style={middleImageStyle}/>
        <img src={rightImage.get('imgUrl')} style={rightImageStyle}/>
      </Element>
    );
  }
}

ShadowElement.propTypes = {
  data: PropTypes.shape({
    element: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      top: PropTypes.number,
      left: PropTypes.number,

      leftImage: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        imgUrl: PropTypes.string,
        top: PropTypes.number,
        left: PropTypes.number,
      }),
      middleImage: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        imgUrl: PropTypes.string,
        top: PropTypes.number,
        left: PropTypes.number
      }),
      rightImage: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        imgUrl: PropTypes.string,
        top: PropTypes.number,
        left: PropTypes.number
      })
    })
  })
};

export default translate('ShadowElement')(ShadowElement);
