import React, { Component, PropTypes } from 'react';
import { get, merge, isEqual } from 'lodash';
import { drawImage, clear, drawDashedLine } from '../../utils/draw';
import classNames from 'classnames';
import XHandler from '../XHandler';
import './index.scss';

export default class XTextElement extends Component {
  constructor(props) {
    super(props);
    const { ratio } = props;
    this.state = {
      disX: 0,
      disY: 0,
      id: props.options.id,
      x: props.options.x * ratio,
      y: props.options.y * ratio,
      isMoving: false,
      cursor: 'auto'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual({
      options: this.props.options,
      ratio: this.props.ratio
    },{
      options: nextProps.options,
      ratio: nextProps.ratio
    })) {
      this.setState({
        x: nextProps.options.x * nextProps.ratio,
        y: nextProps.options.y * nextProps.ratio
      });
    }
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
      options: get(this.props, 'options'),
      x: get(this.state,'x'),
      y: get(this.state,'y'),
      ratio: get(this.props, 'ratio')
    }, {
      containerWidth: nextProps.containerWidth,
      containerHeight: nextProps.containerHeight,
      options: get(nextProps, 'options'),
      x: get(nextState,'x'),
      y: get(nextState,'y'),
      ratio: get(nextProps, 'ratio')
    });
    this.setState({
      id: get(nextProps,'options.id')
    })
    return isUpdated;
  }

  /**
   * 渲染图片.
   */
  componentDidUpdate() {
    if (!this.state.isMoving) {
      this.draw();
    }
  }

  /**
   * 渲染图片.
   */
  componentDidMount() {
    this.draw();
  }

  draw() {
    const { canvasId, options } = this.props;
    const { textUrl, width, height } = options;

    // 加载图片并绘制.
    clear(canvasId, 0, 0, width, height);
    drawImage(canvasId, textUrl, 0, 0, null, width, height);

    //绘制虚线框
    // this.drawDashedRect();
  }

  drawDashedRect() {
    const { canvasId, width, height, options } = this.props;
    const color = '#f7f7f7';
    //top
    drawDashedLine(canvasId, color, -1, 0, width, 0, 1, 3);
    //left
    drawDashedLine(canvasId, color, 0, 0, 0, height, 1, 3);
    //right
    drawDashedLine(canvasId, color, width, 0, width, height, 1, 3);
    //bottom
    drawDashedLine(canvasId, color, 0, height, width, height, 1, 3);
  }

  handleMouseDown(event) {
    if (this.props.disableCustomEvents) {
      return false;
    }
    const { handleMouseDown, options, containerWidth, containerHeight } = this.props;
    const { x, y } = this.state;
    const disX = event.pageX - x;
    const disY = event.pageY - y;
    this.setState({
      disX: disX,
      disY: disY,
      isMoving: true,
      cursor: 'move'
    });
    handleMouseDown && handleMouseDown(event);
  }

  handleMouseMove(event) {
    if (this.props.disableCustomEvents) {
      return false;
    }
    const { handleMouseMove, options, ratio } = this.props;
    const { disX, disY } = this.state;
    const { id } = options;
    const x = event.pageX - disX;
    const y = event.pageY - disY;
    const width = options.width;
    const height = options.height;
    let checkIn;
    if (handleMouseMove) {
      checkIn = handleMouseMove({
        x,
        y,
        width,
        height
      });
    }
    const mx = checkIn ? checkIn.x : x;
    const my = checkIn ? checkIn.y : y;
    this.setState({
      x: mx,
      y: my
    });
  }

  handleMouseUp(event) {
    if (this.props.disableCustomEvents) {
      return false;
    }
    const { handleMouseUp, options } = this.props;
    const { id, x, y } = this.state;
    this.setState({
      isMoving: false,
      cursor: 'auto'
    })
    handleMouseUp(id, x, y);
  }

  handleDblClick() {
    if (this.props.disableCustomEvents) {
      return false;
    }
    const { handleDblClick, options } = this.props;
    this.setState({
      isMoving: false
    });
    handleDblClick(options);
  }

  render() {
    const { className, children, handleMouseMove, handleMouseDown, canvasId, options, ratio } = this.props;
    const { width, height } = options;
    const x = this.state.x;
    const y = this.state.y;
    const customClass = classNames('x-text-element', className);
    // 定位textElement
    const styles = {
      top: `${y}px`,
      left: `${x}px`
    };
    return (
      <div className={customClass} style={styles}>
        <canvas id={canvasId} width={width} height={height}></canvas>
        {children}
        {/* 控制元素, 用于控制渲染出来的图片, 如缩放, 旋转等 */}
        <XHandler handleMouseDown={this.handleMouseDown.bind(this)}
                  handleMouseUp={this.handleMouseUp.bind(this)}
                  handleDblClick={this.handleDblClick.bind(this)}
                  handleMouseMove={this.handleMouseMove.bind(this)}
                  cursor={this.state.cursor}/>
      </div>
    );
  }
}

XTextElement.propTypes = {
  className: PropTypes.string,

  // 画布的宽和高
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,

  // 是否要禁用textelement上的所有事件, 默认为false
  disableCustomEvents: PropTypes.bool,

  // 线的位置信息
  options: PropTypes.shape({
    textUrl: PropTypes.string.isRequired,
    lineWidth: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number
  }).isRequired
};
