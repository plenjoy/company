import React, { Component, PropTypes } from 'react';
import { get, merge, isEqual } from 'lodash';
import { drawImage, clear, drawDashedLine } from '../../../common/utils/draw';
import classNames from 'classnames';
import XLoading from '../../../common/ZNOComponents/XLoading';
import XHandler from '../../../common/ZNOComponents/XHandler';
import XWarnTip from '../../../common/ZNOComponents/XWarnTip';
import './index.scss';
import { elementActionType, resizeDirs, elementTypes } from '../../contants/strings';
import fetchTextBlobAndInfo from '../../utils/fetchTextBlobAndInfo';

const MIN_TEXT_HEIGHT = 50;
const MIN_TEXT_WIDTH = 100;

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
      width: props.options.width * ratio,
      height: props.options.height * ratio,
      isMoving: false,
      cursor: 'move',
      actionType: '',
      p1: {x: 0, y: 0},
      p2: {x: 0, y: 0},
      resizeDir: '',
      isImgLoading: false,
      isShowTextNotFit: false,
      imageBlobSrc: null
    };

    this.resizablePoints = [];
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDblClick = this.handleDblClick.bind(this);
    this.onTextLoad = this.onTextLoad.bind(this);
    this.handleTextRemove = this.handleTextRemove.bind(this);
    this.handleTextEdit = this.handleTextEdit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldImgUrl = this.props.options.computed.imgUrl;
    const newImgUrl = nextProps.options.computed.imgUrl;

    if (!isEqual({
      options: this.props.options,
      ratio: this.props.ratio
    },{
      options: nextProps.options,
      ratio: nextProps.ratio
    })) {
      this.setState({
        x: nextProps.options.x * nextProps.ratio,
        y: nextProps.options.y * nextProps.ratio,
        width: nextProps.options.width * nextProps.ratio,
        height: nextProps.options.height * nextProps.ratio,
      });
      if (oldImgUrl !== newImgUrl) {
        this.getPreviewTextBlobAndTextInfo(newImgUrl, nextProps.options.width, nextProps.options.height);
      }
    }
  }

  componentWillMount() {
    const { options } = this.props;
    const imgUrl = options.computed.imgUrl;

    if (options.text) {
      this.getPreviewTextBlobAndTextInfo(imgUrl, options.width, options.height);
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
      width: get(this.state,'width'),
      height: get(this.state,'height'),
      ratio: get(this.props, 'ratio'),
      imageBlobSrc: get(this.state, 'imageBlobSrc')
    }, {
      options: get(nextProps, 'options'),
      x: get(nextState,'x'),
      y: get(nextState,'y'),
      width: get(nextState,'width'),
      height: get(nextState,'height'),
      ratio: get(nextProps, 'ratio'),
      imageBlobSrc: get(nextState, 'imageBlobSrc')
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

    this.resizablePoints.push({dir: resizeDirs.topLeft, el: this.refs.topLeft});
    this.resizablePoints.push({dir: resizeDirs.topRight, el: this.refs.topRight});
    this.resizablePoints.push({dir: resizeDirs.bottomLeft, el: this.refs.bottomLeft});
    this.resizablePoints.push({dir: resizeDirs.bottomRight, el: this.refs.bottomRight});
    this.resizablePoints.push({dir: resizeDirs.top, el: this.refs.top});
    this.resizablePoints.push({dir: resizeDirs.bottom, el: this.refs.bottom});
    this.resizablePoints.push({dir: resizeDirs.left, el: this.refs.left});
    this.resizablePoints.push({dir: resizeDirs.right, el: this.refs.right});
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
    const { id, x, y } = this.state;
    const textResize = this.resizablePoints.find(point => point.el === event.target);

    // 如果点的是文字缩放
    if(textResize) {
      // 点击时点的初始值
      const p1 = {
        x: event.pageX,
        y: event.pageY
      };

      // 保存，设置action为缩放并且设置缩放方向
      this.setState({
        p1,
        isMoving: false,
        actionType: elementActionType.textResize,
        resizeDir: textResize.dir
      });
    } else {
      const disX = event.pageX - x;
      const disY = event.pageY - y;
      this.setState({
        disX: disX,
        disY: disY,
        isMoving: true,
        // cursor: 'move'
        actionType: elementActionType.textMove
      });
    }

    handleMouseDown && handleMouseDown(id, event);
  }

  handleTextMove(event) {
    const { handleTextMove } = this.props;
    const { disX, disY } = this.state;
    const x = event.pageX - disX;
    const y = event.pageY - disY;
    let checkIn;
    if (handleTextMove) {
      checkIn = handleTextMove({
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

  handleTextResize(event) {
    const { handleTextResize, options, ratio } = this.props;
    const { width, height, x, y } = options;
    const { id, p1, resizeDir } = this.state;
    const p2 = {
      x: event.pageX,
      y: event.pageY
    };

    let newWidth = width * ratio;
    let newHeight = height * ratio;
    let newX = x * ratio;
    let newY = y * ratio;

    const offsetX = p2.x - p1.x;
    const offsetY = p2.y - p1.y;

    switch(resizeDir) {
      case resizeDirs.topLeft: {
        newX = x * ratio + offsetX;
        newY = y * ratio + offsetY;
        newWidth = width * ratio - offsetX;
        newHeight = height * ratio - offsetY;
        break;
      }
      case resizeDirs.topRight: {
        newX = x * ratio;
        newY = y * ratio + offsetY;
        newWidth = width * ratio + offsetX;
        newHeight = height * ratio - offsetY;
        break;
      }
      case resizeDirs.bottomLeft: {
        newX = x * ratio + offsetX;
        newY = y * ratio;
        newWidth = width * ratio - offsetX;
        newHeight = height * ratio + offsetY;
        break;
      }
      case resizeDirs.bottomRight: {
        newWidth = width * ratio + offsetX;
        newHeight = height * ratio + offsetY;
        break;
      }
      case resizeDirs.top: {
        newY = y * ratio + offsetY;
        newHeight = height * ratio - offsetY;
        break;
      }
      case resizeDirs.bottom: {
        newHeight = height * ratio + offsetY;
        break;
      }
      case resizeDirs.left: {
        newX = x * ratio + offsetX;
        newWidth = width * ratio - offsetX;
        break;
      }
      case resizeDirs.right: {
        newWidth = width * ratio + offsetX;
        break;
      }
    }

    if(newWidth < MIN_TEXT_WIDTH)
      newWidth = MIN_TEXT_WIDTH;

    if(newHeight < MIN_TEXT_HEIGHT)
      newHeight = MIN_TEXT_HEIGHT;

    if(newY > (y + height) * ratio - MIN_TEXT_HEIGHT)
      newY = (y + height) * ratio - MIN_TEXT_HEIGHT;

    if(newX > (x + width) * ratio - MIN_TEXT_WIDTH)
      newX = (x + width) * ratio - MIN_TEXT_WIDTH;

    this.setState({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });

    handleTextResize && handleTextResize(id, newX, newY, newWidth, newHeight);
  }

  handleMouseMove(event) {
    if (this.props.disableCustomEvents) {
      return false;
    }

    switch(this.state.actionType) {
      case elementActionType.textMove: {
        this.handleTextMove(event);
        break;
      }
      case elementActionType.textResize: {
        this.handleTextResize(event);
        break;
      }
    }
  }

  handleMouseUp(event) {
    if (this.props.disableCustomEvents) {
      return false;
    }
    const { handleMouseUp, options, checkPrintedTextPosition } = this.props;
    const { id, x, y, width, height } = this.state;
    let checkedPosition;
    // if (get(options, 'type') === elementTypes.paintedText) {
    //   checkedPosition =  checkPrintedTextPosition({
    //     x,
    //     y,
    //     width: this.refs.textImg.width,
    //     height: this.refs.textImg.height
    //   });
    // }
    const checkedX = checkedPosition ? checkedPosition.x : x;
    const checkedY = checkedPosition ? checkedPosition.y : y;
    this.setState({
      isMoving: false,
      x: checkedX,
      y: checkedY,
      // cursor: 'auto',
      actionType: ''
    });
    handleMouseUp(id, checkedX, checkedY, width, height);
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

  handleTextRemove() {
    const { handleTextRemove } = this.props;
    const { id } = this.state;

    handleTextRemove && handleTextRemove(id);
  }

  getPreviewTextBlobAndTextInfo(previewTextImageSrc, elementWidth, elementHeight) {
    this.setState({
      isImgLoading: true
    });

    fetchTextBlobAndInfo(previewTextImageSrc, elementWidth, elementHeight)
      .then(({ isShowTextNotFit, blobUrl }) => {
        this.setState({
          isShowTextNotFit,
          imageBlobSrc: blobUrl,
          isImgLoading: false
        });
      }).catch((error) => {
        this.setState({
          isImgLoading: false
        });
      });
  }

  handleTextEdit() {
    if (this.props.disableCustomEvents) {
      return false;
    }
    const { handleTextEdit, options } = this.props;
    this.setState({
      isMoving: false
    });
    handleTextEdit(options);
  }

  render() {
    const { className, children, handleMouseMove, handleMouseDown, canvasId, options, handleTextRemove, disableCustomEvents } = this.props;
    const { x, y, width, height, isShowTextNotFit, imageBlobSrc, isImgLoading } = this.state;

    const customClass = classNames({
      'x-text-element': true,
      [className]: true,
      selected: options.isSelect,
      'no-text': !options.text
    });

    const textUrl = get(options, 'computed.imgUrl');
    // 定位textElement
    const styles = {
      position: 'absolute',
      zIndex: get(options, 'dep') + 101,
      top: `${y}px`,
      left: `${x}px`,
      width: `${width}px`,
      height: `${height}px`,
    };

    const imageStyle = {
      position: 'absolute',
      overflow: 'hidden',
      width: `${width}px`,
      height: `${height}px`,
    };

    const warnTipProps = {
      isShown: isShowTextNotFit && !disableCustomEvents,
      title: 'Text does not fit'
    };

    return (
      <div className={customClass} style={styles}>
        <XLoading isShown={isImgLoading} />
        <div style={imageStyle}>
          <img
            ref="textImg"
            className="text-img"
            src={imageBlobSrc} />
        </div>
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
          title={'Double click to edit text'}
        >

          <div className='XHandler__border' data-html2canvas-ignore="true"></div>

          <div className='XHandler__border-noText' data-html2canvas-ignore="true"></div>

          <div className='Resizable' data-html2canvas-ignore="true">
            <div className='topLeft' ref='topLeft'></div>
            <div className='topRight' ref='topRight'></div>
            <div className='bottomLeft' ref='bottomLeft'></div>
            <div className='bottomRight' ref='bottomRight'></div>
            <div className='left' ref='left'></div>
            <div className='right' ref='right'></div>
            <div className='top' ref='top'></div>
            <div className='bottom' ref='bottom'></div>
          </div>
        </XHandler>
        <div className='ActionBar' data-html2canvas-ignore="true">
          <div className='ActionBar__edit' onClick={this.handleTextEdit}>
            <a title='Edit Text'></a>
          </div>
          <div className='ActionBar__clear' onClick={this.handleTextRemove}>
            <a title='Remove Text Frame'></a>
          </div>
        </div>

        <XWarnTip {...warnTipProps} />
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
