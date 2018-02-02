import React, { Component, PropTypes } from 'react';
import { merge }  from 'lodash';
import { drawDashedLine, drawLine, clear } from '../../utils/draw';
import classNames from 'classnames';
import './index.scss';

export default class XLines extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { lines, canvasId } = this.props;

    // 清楚画布
    const oc = document.getElementById(canvasId);
    clear(canvasId, 0, 0, oc.width, oc.height);

    if (lines && lines.length) {
      lines.forEach((v) => {
        // 判断是否画虚线
        if (v.dashed) {
          drawDashedLine(canvasId, v.color || '#bcbcbc', v.x1, v.y1, v.x2, v.y2, v.lineWidth || 1, v.dashedGap || 10);
        } else {
          // 实线
          drawLine(canvasId, v.color || '#bcbcbc', v.x1, v.y1, v.x2, v.y2, v.lineWidth || 1);
        }
      });
    }
  }

  render() {
    const { className, children, canvasId, width, height } = this.props;
    const customClass = classNames('x-lines', className);

    return (
      <div className={customClass}>
        <canvas id={canvasId} width={width} height={height}></canvas>
        {children}
      </div>
    );
  }
}

XLines.propTypes = {
  // XLines的自定义样式
  className: PropTypes.string,

  // 画布的宽和高
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // 线的信息
  lines: PropTypes.arrayOf(PropTypes.shape({
    // 线的颜色
    color: PropTypes.strings,

    // 线的起始点坐标
    x1: PropTypes.number,
    y1: PropTypes.number,

    // 线的结束点坐标
    x2: PropTypes.number,
    y2: PropTypes.number,

    // 线的粗细, 默认为1px
    lineWidth: PropTypes.number,

    // 是否画虚线
    dashed: PropTypes.bool,

    // 虚线的间隙, 默认为10px
    dashedGap: PropTypes.number
  })).isRequired
};
