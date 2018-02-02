import React, { Component, PropTypes } from 'react';
import { merge, isEqual } from 'lodash';
import { drawImage, clear } from '../../utils/draw';
import classNames from 'classnames';
import XHandler from '../XHandler';
import './index.scss';

export default class XPhotoElement extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * 性能提升, 只要宽高和图片的属性发生变化时才重新渲染.
   * @param nextProps
   * @param nextState
   */
  shouldComponentUpdate(nextProps, nextState) {
    const isUpdated = !isEqual({
      containerWidth: this.props.containerWidth,
      containerHeight: this.props.containerHeight,
      options: this.props.options
    }, {
      containerWidth: nextProps.containerWidth,
      containerHeight: nextProps.containerHeight,
      options: nextProps.options
    });

    return isUpdated;
  }

  /**
   * 在render后, 渲染图片.
   */
  componentDidMount() {
    this.draw();
  }

  /**
   * 需要重新更新时, 重绘一下图片
   */
  componentDidUpdate() {
    this.draw();
  }

  /**
   * 渲染图片.
   */
  draw() {
    const { canvasId, containerWidth, containerHeight, options, onDrawCompleted, onDrawStart } = this.props;
    const { imageUrl, px = 0, py = 0, pw = 1, ph = 1 } = options;

    onDrawStart && onDrawStart();
    const x = containerWidth * px;
    const y = containerHeight * py;
    const imageWidth = containerWidth * pw;
    const imageHeight = containerHeight * ph;

    // 加载图片并绘制.
    if (!imageUrl) {
      return;
    }
    clear(canvasId, x, y, imageWidth, imageHeight);
    drawImage(canvasId, imageUrl, x, y, ()=> {
      onDrawCompleted && onDrawCompleted();
      // alert('done');
    }, imageWidth, imageHeight);
  }

  render() {
    const { className, children, canvasId, containerWidth, containerHeight, options, ratio, onClicked } = this.props;
    const { pw = 1, ph = 1 } = options;
    const customClass = classNames('x-photo-element', className);

    const imageWidth = containerWidth * pw;
    const imageHeight = containerHeight * ph;

    return (
      <div className={customClass}>
        <canvas id={canvasId} width={imageWidth} height={imageHeight}></canvas>
        {children}
        {/* 控制元素, 用于控制渲染出来的图片, 如缩放, 旋转等 */}
        <XHandler handleClick={onClicked}/>
      </div>
    );
  }
}

XPhotoElement.propTypes = {
  className: PropTypes.string,

  // 画布的宽和高
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,

  onDrawCompleted: PropTypes.func,
  onDrawStart: PropTypes.func,

  // 线的位置信息
  options: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    lineWidth: PropTypes.number,

    // 出血线的位置
    bleedTop: PropTypes.number,
    bleedBottom: PropTypes.number,
    bleedLeft: PropTypes.number,
    bleedRight: PropTypes.number,

    // 书脊的厚度
    spineThicknessWidth: PropTypes.number,

    // 包边
    wrapSize: PropTypes.number
  }).isRequired
};
