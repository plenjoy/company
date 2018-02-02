import React, { Component, PropTypes } from 'react';
import { merge }  from 'lodash';
import { drawBox, clear } from '../../utils/draw';
import classNames from 'classnames';
import './index.scss';

export default class XBoxes extends Component {
  constructor(props) {
    super(props);

    this.isLocked = false;
  }

  componentDidUpdate() {
    const { boxSize, canvasId, allowDraw } = this.props;

    if (this.isLocked || !allowDraw) {
      return;
    }

    this.isLocked = true;
    const oc = document.getElementById(canvasId);
    if(oc){
      clear(canvasId, 0, 0, oc.width, oc.height);

      if (boxSize) {
        drawBox(canvasId, boxSize.width, boxSize.height, boxSize.color, boxSize.bleedTop, boxSize.bleedBottom, boxSize.bleedLeft, boxSize.bleedRight, boxSize.wrapSize, boxSize.lineWidth);
      }
    }

    this.isLocked = false;
  }

  render() {
    const { className, children, canvasId, width, height } = this.props;
    const customClass = classNames('x-boxes', className);

    return (
      <div className={customClass}>
        <canvas id={canvasId} width={width} height={height}></canvas>
        {children}
      </div>
    );
  }
}

XBoxes.propTypes = {
  // XBoxes的自定义样式
  className: PropTypes.string,

  // 画布的宽和高
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // 是否允许绘制.
  allowDraw: PropTypes.bool,

  // XBox的信息
  boxSize: PropTypes.shape({
    // XBox的结束点坐标
    width: PropTypes.number,
    height: PropTypes.number,
    // XBox的颜色
    color: PropTypes.strings,

    // XBox的bleed
    bleedTop: PropTypes.number,
    bleedBottom: PropTypes.number,
    bleedLeft: PropTypes.number,
    bleedRight: PropTypes.number,
    //包边
    wrapSize: PropTypes.number,
    lineWidth: PropTypes.number
  }).isRequired
};
