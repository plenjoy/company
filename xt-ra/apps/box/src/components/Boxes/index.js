import React, { Component, PropTypes } from 'react';
import { merge }  from 'lodash';
import classNames from 'classnames';
import './index.scss';

export default class Boxes extends Component {
  render() {
    const { className, children, width, height, boxSize } = this.props;
    const { wrapSize, bleedTop, bleedRight, bleedBottom, bleedLeft, color, marginLeft = 0, marginTop = 0} = boxSize;
    const customClass = classNames('x-boxes', className);
    const style = {
      width: `${width}px`,
      height: `${height}px`,
      borderTop: `${wrapSize + bleedTop}px solid ${color}`,
      borderRight: `${wrapSize + bleedRight}px solid ${color}`,
      borderBottom: `${wrapSize + bleedBottom}px solid ${color}`,
      borderLeft: `${wrapSize + bleedLeft}px solid ${color}`,
      marginLeft:`${marginLeft}px`,
      marginTop:`${marginTop}px`,
      boxSizing: 'border-box'
    };

    return (
      <div className={customClass} style={style}>
        {children}
      </div>
    );
  }
}

Boxes.propTypes = {
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
