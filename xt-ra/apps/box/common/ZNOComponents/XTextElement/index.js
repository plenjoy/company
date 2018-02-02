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
      cursor: 'move'
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDblClick = this.handleDblClick.bind(this);
    this.onTextLoad = this.onTextLoad.bind(this);
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
      options: get(this.props, 'options'),
      x: get(this.state,'x'),
      y: get(this.state,'y'),
      ratio: get(this.props, 'ratio')
    }, {
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
      // this.draw();
    }
  }

  /**
   * 渲染图片.
   */
  componentDidMount() {
    // this.draw();
  }

  onTextLoad() {
    const { updateElement, options, disableCustomEvents, ratio, pageWidth, pageHeight } = this.props;
    if (!disableCustomEvents) {
      const imgElement = this.refs.textImg;
      const width = imgElement.width / ratio;
      const height = imgElement.height / ratio;
      const pw = width / pageWidth;
      const ph = height / pageHeight;
      const elementId = get(options, 'id');
      updateElement({
        id: elementId,
        width,
        height,
        pw,
        ph
      });
    }
  }

  draw() {
    const { canvasId, options } = this.props;
    // const { textUrl, width, height, computed, ratio } = options;
    const { computed } = options;
    const { imgUrl, width, height } = computed;

    // 加载图片并绘制.
    clear(canvasId, 0, 0, width, height);
    drawImage(canvasId, imgUrl, 0, 0, null, width, height);

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
    const { handleMouseDown, options } = this.props;
    const { x, y } = this.state;
    const disX = event.pageX - x;
    const disY = event.pageY - y;
    this.setState({
      disX: disX,
      disY: disY,
      isMoving: true,
      // cursor: 'move'
    });
    handleMouseDown && handleMouseDown(event);
  }

  handleMouseMove(event) {
    if (this.props.disableCustomEvents) {
      return false;
    }
    const { handleMouseMove } = this.props;
    const { disX, disY } = this.state;
    const x = event.pageX - disX;
    const y = event.pageY - disY;
    let checkIn;
    if (handleMouseMove) {
      checkIn = handleMouseMove({
        x,
        y,
        width: this.refs.textImg.width,
        height: this.refs.textImg.height
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
      // cursor: 'auto'
    });
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
    const { className, children, handleMouseMove, handleMouseDown, canvasId, options } = this.props;
    const x = this.state.x;
    const y = this.state.y;
    const customClass = classNames('x-text-element', className);
    const textUrl = get(options, 'computed.imgUrl');
    // 定位textElement
    const styles = {
      position: 'absolute',
      zIndex: get(options, 'dep') + 101,
      top: `${y}px`,
      left: `${x}px`
    };
    return (
      <div className={customClass} style={styles}>
        <img
          ref="textImg"
          className="text-img"
          src={textUrl}
          onLoad={this.onTextLoad}
        />
        {/*
          <canvas id={canvasId} width={containerWidth} height={containerHeight}></canvas>
        */}
        {children}
        {/* 控制元素, 用于控制渲染出来的图片, 如缩放, 旋转等 */}
        <XHandler
          handleMouseDown={this.handleMouseDown}
          handleMouseUp={this.handleMouseUp}
          handleDblClick={this.handleDblClick}
          handleMouseMove={this.handleMouseMove}
          cursor={this.state.cursor}
          title={'Double Click to Edit'}
        />
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
    textUrl: PropTypes.string,
    lineWidth: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number
  }).isRequired
};
