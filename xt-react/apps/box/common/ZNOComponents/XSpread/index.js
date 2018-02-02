import React, { Component, PropTypes } from 'react';
import { merge } from  'lodash';
import { drawDashedLine, drawRect, setSize, drawLine, drawTextInCenter } from '../../utils/draw';
import classNames from 'classnames';
import './index.scss';

export default class XSpread extends Component {
  constructor(props) {
    super(props);
  }

  draw(options, ref) {
    const oc = this.refs[ref];
    const og = oc.getContext('2d');

    setSize(ref, {
      width: options.width,
      height: options.height
    });

    drawRect(ref, options.bgColor, 0, 0, options.width, options.height, false, 0);

    const xys = this.getLinesXY(options);
    // 出血线
    xys.bleedLines.forEach(v => {
      drawLine(ref, 'red', v.x1, v.y1, v.x2, v.y2, 1);
    });

    // 包边线
    xys.wrapLines.forEach(v => {
      drawDashedLine(ref, '#bcbcbc', v.x1, v.y1, v.x2, v.y2, 1, 10);
    });

    // 书脊线
    xys.spineThicknessLines.forEach(v => {
      drawDashedLine(ref, '#bcbcbc', v.x1, v.y1, v.x2, v.y2, 1, 10);
    });

    // 中间的文字
    drawTextInCenter(ref, options.textInCenter, '#acacac', 20, 'Gotham SSm A');
  }

  getLinesXY(options) {
    const xys = {
      bleedLines: [],
      wrapLines: [],
      spineThicknessLines: []
    };

    xys.bleedLines.push({
      x1: options.bleedLeft,
      y1: options.bleedTop,
      x2: options.width - options.bleedRight,
      y2: options.bleedTop
    });

    xys.bleedLines.push({
      x1: options.bleedLeft,
      y1: options.bleedTop,
      x2: options.bleedLeft,
      y2: options.height - options.bleedBottom
    });

    xys.bleedLines.push({
      x1: options.bleedLeft,
      y1: options.height - options.bleedBottom,
      x2: options.width - options.bleedRight,
      y2: options.height - options.bleedBottom
    });

    xys.bleedLines.push({
      x1: options.width - options.bleedRight,
      y1: options.bleedTop,
      x2: options.width - options.bleedRight,
      y2: options.height - options.bleedBottom
    });

    // 包边的线
    xys.wrapLines.push({
      x1: options.wrapSize,
      y1: options.wrapSize,
      x2: options.width - options.wrapSize,
      y2: options.wrapSize
    });

    xys.wrapLines.push({
      x1: options.wrapSize,
      y1: options.wrapSize,
      x2: options.wrapSize,
      y2: options.height - options.wrapSize
    });

    xys.wrapLines.push({
      x1: options.wrapSize,
      y1: options.height - options.wrapSize,
      x2: options.width - options.wrapSize,
      y2: options.height - options.wrapSize
    });

    xys.wrapLines.push({
      x1: options.width - options.wrapSize,
      y1: options.wrapSize,
      x2: options.width - options.wrapSize,
      y2: options.height - options.wrapSize
    });

    // 书脊线
    xys.spineThicknessLines.push({
      x1: (options.width - options.spineThicknessWidth) / 2,
      y1: options.bleedTop,
      x2: (options.width - options.spineThicknessWidth) / 2,
      y2: options.height - options.bleedBottom
    });

    xys.spineThicknessLines.push({
      x1: ((options.width - options.spineThicknessWidth) / 2) + options.spineThicknessWidth,
      y1: options.bleedTop,
      x2: ((options.width - options.spineThicknessWidth) / 2) + options.spineThicknessWidth,
      y2: options.height - options.bleedBottom
    });

    return xys;
  }

  componentDidUpdate() {
    const { options, canvasId } = this.props;
    this.draw(options, canvasId);
  }

  render() {
    const { className, onClicked, canvasId } = this.props;
    const customClass = classNames('x-spread', className);

    return (
      <canvas id={canvasId}
              ref={canvasId}
              className={customClass}
              onClick={onClicked}>
      </canvas>
    );
  }
}

XSpread.propTypes = {
  canvasId: PropTypes.string.isRequired,
  options: PropTypes.shape({
    textInCenter: PropTypes.string,
    bgColor: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    bleedTop: PropTypes.number,
    bleedBottom: PropTypes.number,
    bleedLeft: PropTypes.number,
    bleedRight: PropTypes.number,
    spineThicknessWidth: PropTypes.number,
    wrapSize: PropTypes.number,
  }).isRequired,
  onClicked: PropTypes.func,
  className: PropTypes.string
};
