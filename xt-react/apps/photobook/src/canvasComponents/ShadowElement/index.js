import React, { Component, PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import { translate } from 'react-translate';
import { Group, Image } from 'react-konva';
import { get } from 'lodash';

import './index.scss';

// 导入处理函数
import * as handler from './handler';

class ShadowElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftImageObj: null,
      middleImageObj: null,
      rightImageObj: null,
    };

    this.loadShadowImages = this.loadShadowImages.bind(this);
  }

  loadShadowImages(element) {
    // left image
    const leftImage = element.get('leftImage');
    if (leftImage) {
      const leftImageObj = new window.Image();
      leftImageObj.src = leftImage.get('imgUrl');
      leftImageObj.onload = () => {
        this.setState({
          leftImageObj
        });
      };
    }

    // middle image
    const middleImage = element.get('middleImage');
    if (middleImage) {
      const middleImageObj = new window.Image();
      middleImageObj.src = middleImage.get('imgUrl');
      middleImageObj.onload = () => {
        this.setState({
          middleImageObj
        });
      };
    }

    // right image
    const rightImage = element.get('rightImage');
    if (rightImage) {
      const rightImageObj = new window.Image();
      rightImageObj.src = rightImage.get('imgUrl');
      rightImageObj.onload = () => {
        this.setState({
          rightImageObj
        });
      };
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const oldElment = get(this.props, 'data.element');
  //   const newElment = get(nextProps, 'data.element');

  //   if (!Immutable.is(oldElment, newElment)) {
  //     this.loadShadowImages(newElment);
  //   }
  // }

  componentWillMount() {
    const element = get(this.props, 'data.element');
    this.loadShadowImages(element);
  }

  render() {
    const { t, actions, data } = this.props;
    const { element, ratio } = data;

    const { leftImageObj, middleImageObj, rightImageObj } = this.state;

    // element 容器的样式.
    const shadowGroupProps = {
      width: element.get('width') * ratio.workspace,
      height: element.get('height') * ratio.workspace,
      x: element.get('left') * ratio.workspace,
      y: element.get('top') * ratio.workspace
    };

    // 左侧的图片
    const leftImage = element.get('leftImage');
    const leftImageProps = {
      width: leftImage.get('width') * ratio.workspace,
      height: leftImage.get('height') * ratio.workspace,
      y: leftImage.get('top') * ratio.workspace,
      x: leftImage.get('left') * ratio.workspace,
      image: leftImageObj
    };

    // 中间的图片
    const middleImage = element.get('middleImage');
    const middleImageProps = {
      width: Math.ceil(middleImage.get('width') * ratio.workspace),
      height: middleImage.get('height') * ratio.workspace,
      y: middleImage.get('top') * ratio.workspace,
      x: middleImage.get('left') * ratio.workspace,
      image: middleImageObj
    };

    // 右侧的图片
    const rightImage = element.get('rightImage');
    const rightImageProps = {
      width: rightImage.get('width') * ratio.workspace,
      height: rightImage.get('height') * ratio.workspace,
      y: rightImage.get('top') * ratio.workspace,
      x: rightImage.get('left') * ratio.workspace,
      image: rightImageObj
    };

    return (
      <Group {...shadowGroupProps}>
        <Image {...leftImageProps} />
        <Image {...middleImageProps} />
        <Image {...rightImageProps} />
      </Group>
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
