import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Group, Rect } from 'react-konva';
import { transform } from '../../utils/transform';
import { getScaledRect } from '../../utils/scale';

import Resizable from '../Resizable';
// import Rotatable from '../Rotatable';

// import ExchangeImage from '../ExchangeImage';

import {
  elementAction,
  shapeType,
  elementTypes,
  downloadStatus,
  RESIZE_LIMIT
} from '../../constants/strings';

import { findKonvaObjectById } from '../../utils/canvas/konvaSelector';
import TextWarnTip from '../TextWarnTip';
import PhotoWarnTip from '../PhotoWarnTip';
// x, y方向都需缩放的点
const BOTH_RESIZE_POINT = [0, 2, 4, 6];

// x方向上需要缩放的点
const HORIZONTAL_RESIZE_POINT = [3, 7];

// y方向需要缩放的点
const VERTICAL_REZIE_POINT = [1, 5];

function getAngle(cX, cY, mX, mY) {
  const angle = Math.atan2(mY - cY, mX - cX);
  return angle;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function formatDeg(deg) {
  let formatedDeg = 0;
  if (deg < 0) {
    formatedDeg = deg % 360 + 360;
  } else {
    formatedDeg = deg % 360;
  }
  return formatedDeg;
}

class ElementControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      degree: 0,
      offset: {
        x: 0,
        y: 0
      },
      needRedraw: false,
      clickElementId: null
    };

    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragStop = this.onDragStop.bind(this);

    this.onRotateStart = this.onRotateStart.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.onRotateStop = this.onRotateStop.bind(this);

    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
    this.getPointAndOpposite = this.getPointAndOpposite.bind(this);
    this.clampElementArray = this.clampElementArray.bind(this);
    this.getNewControlBoxAndElementArray = this.getNewControlBoxAndElementArray.bind(
      this
    );

    this.moveElement = this.moveElement.bind(this);

    this.redrawElementControlsRect = this.redrawElementControlsRect.bind(this);
    this.needRedrawElementControlsRect = this.needRedrawElementControlsRect.bind(
      this
    );

    this.setCursor = this.setCursor.bind(this);

    this.clicks = 0;
  }

  componentWillMount() {
    this.redrawElementControlsRect(this.props.selectedElementArray);
  }

  componentWillReceiveProps(nextProps) {
    const oldSelectedElementArray = this.props.selectedElementArray;
    const newSelectedElementArray = nextProps.selectedElementArray;

    const isChangeSelectElement =
      oldSelectedElementArray.size === newSelectedElementArray.size &&
      newSelectedElementArray.size === 1 &&
      oldSelectedElementArray.first().get('id') !==
        newSelectedElementArray.first().get('id');

    if (
      (oldSelectedElementArray.size !== newSelectedElementArray.size ||
        isChangeSelectElement) &&
      newSelectedElementArray.size
    ) {
      this.redrawElementControlsRect(newSelectedElementArray);
    }

    const { needRedraw } = this.state;
    if (needRedraw) {
      this.redrawElementControlsRect(newSelectedElementArray);

      this.setState({
        needRedraw: false
      });
    }
  }

  getMinMaxPosition(selectedElementArray) {
    const { selectedElements } = this.props;
    const firstElement = selectedElementArray.first();
    const firstElementNode = findKonvaObjectById(
      selectedElements,
      firstElement.get('id')
    );
    const firstElementGroup = firstElementNode.getParent();
    const firstElementRect = firstElementGroup.getClientRect();

    let minX = firstElementRect.x;
    let minY = firstElementRect.y;
    let maxX = 0;
    let maxY = 0;

    selectedElementArray.forEach((element) => {
      const elementNode = findKonvaObjectById(
        selectedElements,
        element.get('id')
      );
      const groupNode = elementNode.getParent();

      const { x, y, width, height } = groupNode.getClientRect();

      const rightX = x + width;
      const rightY = y + height;

      if (x < minX) {
        minX = x;
      }

      if (rightX > maxX) {
        maxX = rightX;
      }

      if (y < minY) {
        minY = y;
      }

      if (rightY > maxY) {
        maxY = rightY;
      }
    });

    return [minX, minY, maxX, maxY];
  }

  redrawElementControlsRect(selectedElementArray) {
    const elementArray =
      selectedElementArray || this.props.selectedElementArray;
    const { selectedElements, syncControlDegree } = this.props;
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;
    let degree = 0;
    if (elementArray.size > 1) {
      const [minX, minY, maxX, maxY] = this.getMinMaxPosition(elementArray);

      x = minX;
      y = minY;
      width = maxX - minX;
      height = maxY - minY;
    } else if (elementArray.size === 1) {
      const firstElement = elementArray.first();
      const firstElementNode = findKonvaObjectById(
        selectedElements,
        firstElement.get('id')
      );
      const groupNode = firstElementNode.getParent();

      const offset = groupNode.getOffset();

      x = groupNode.getX() - offset.x;
      y = groupNode.getY() - offset.y;
      width = groupNode.getWidth();
      height = groupNode.getHeight();
      degree = firstElement.get('rot');
    }

    this.lastAngle = toRadians(degree);
    syncControlDegree(degree);
    this.setState({ x, y, width, height, degree });
  }

  needRedrawElementControlsRect() {
    this.setState({
      needRedraw: true
    });
  }

  moveElement(deltaX, deltaY, callback) {
    const { onElementArrayChange, selectedElementArray } = this.props;

    let newElementArray = Immutable.List();

    if (selectedElementArray.size) {
      selectedElementArray.forEach((element) => {
        if (element.get('isSelected')) {
          const computed = element.get('computed');

          const newElement = element.set(
            'computed',
            computed.merge({
              left: computed.get('left') + deltaX,
              top: computed.get('top') + deltaY
            })
          );

          newElementArray = newElementArray.push(newElement);
        }
      });

      onElementArrayChange(newElementArray, () => {
        callback && callback();
      });
    }
  }

  onDragStart(e) {
    this.isDragging = true;
    const { selectedElementArray } = this.props;
    const [minX, minY] = this.getMinMaxPosition(selectedElementArray);
    const { evt } = e;
    this.startDragPosition = {
      x: evt.pageX,
      y: evt.pageY
    };

    this.baseDragPosition = Object.assign({}, this.startDragPosition);

    this.baseDelta = {
      x: evt.pageX - minX,
      y: evt.pageY - minY
    };
  }

  onDrag(e) {
    if (!this.isDragging) return;
    const { evt } = e;
    if (evt.movementX !== 0 || evt.movementY !== 0) {
      __app.isMoved = true;

      const deltaX = evt.pageX - this.startDragPosition.x;
      const deltaY = evt.pageY - this.startDragPosition.y;

      this.startDragPosition = {
        x: evt.pageX,
        y: evt.pageY
      };

      this.moveElement(deltaX, deltaY);

      let { x, y } = this.state;

      this.setState({
        x: x + deltaX,
        y: y + deltaY
      });
      return;

      const { snapToGuideLine, showGuideLineIfNear } = this.props;
      const [newDeltaX, newDeltaY] = snapToGuideLine({
        deltaX,
        deltaY,
        e: evt,
        baseDelta: this.baseDelta,
        eleAction: elementAction.MOVE
      });

      this.moveElement(newDeltaX, newDeltaY, () => {
        showGuideLineIfNear();
      });

      // const { x, y } = this.state;

      this.setState({
        x: x + newDeltaX,
        y: y + newDeltaY
      });
    }
  }

  onDragStop(e) {
    this.isDragging = false;
    __app.isMoved = false;

    const {
      selectedElementArray,
      submitElementArray,
      hideAllGuideLines
    } = this.props;

    submitElementArray(selectedElementArray, 'move');

    // hideAllGuideLines();

    e.evt.cancelBubble = true;
  }

  onRotateStart(e) {
    this.isRotating = true;
    const { evt } = e;
    this.startRotatePosition = {
      x: evt.pageX,
      y: evt.pageY
    };

    const { containerRect, selectedElements } = this.props;

    const { x, y, width, height, degree } = this.state;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const cX = x + containerRect.left + halfWidth;
    const cY = y + containerRect.top + halfHeight;

    this.startDegree = degree;
    this.startAngle =
      getAngle(cX, cY, evt.clientX, evt.clientY) - this.lastAngle;

    const offset = {
      x: Math.round(x + halfWidth),
      y: Math.round(y + halfHeight)
    };

    selectedElements
      .setOffset(offset)
      .setX(offset.x)
      .setY(offset.y)
      .setRotation(0);
  }

  onRotate(e) {
    if (!this.isRotating) return;
    const {
      containerRect,
      selectedElementArray,
      syncControlDegree
    } = this.props;

    const { x, y, width, height } = this.state;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const cX = x + containerRect.left + halfWidth;
    const cY = y + containerRect.top + halfHeight;

    this.lastAngle = getAngle(cX, cY, e.clientX, e.clientY) - this.startAngle;

    const degree = formatDeg(Math.round(toDegrees(this.lastAngle)));

    const { selectedElements } = this.props;

    if (selectedElementArray.size === 1) {
      const firstElement = selectedElementArray.first();
      selectedElements.setRotation(degree - firstElement.get('rot'));
    } else {
      selectedElements.setRotation(degree - this.startDegree);
    }

    syncControlDegree(degree);

    this.setState({
      degree
    });
  }

  onRotateStop(e) {
    if (!this.isRotating) return;
    this.isRotating = false;
    const {
      submitElementArray,
      selectedElementArray,
      selectedElements
    } = this.props;
    const { degree } = this.state;

    if (degree !== this.startDegree) {
      let newElementArray = selectedElementArray;
      if (selectedElementArray.size === 1) {
        newElementArray = newElementArray.setIn([String(0), 'rot'], degree);
      } else {
        newElementArray = selectedElementArray.map((element) => {
          const elementNode = findKonvaObjectById(
            selectedElements,
            element.get('id')
          );
          const groupNode = elementNode.getParent();

          const absolutePosition = groupNode.getAbsolutePosition();

          const offset = groupNode.getOffset();

          const computed = element.get('computed');

          return element.merge({
            rot: formatDeg(degree - this.startDegree + groupNode.getRotation()),
            computed: computed.merge({
              left: absolutePosition.x - offset.x,
              top: absolutePosition.y - offset.y
            })
          });
        });
      }

      submitElementArray(newElementArray, 'rotate');
    }

    selectedElements.setOffset({ x: 0, y: 0 }).setX(0).setY(0).setRotation(0);

    e.stopPropagation();
  }

  /**
   * 获取当前拖拽点和其对角线点的信息
   * @param  {[type]} point 元素8个点坐标
   * @param  {[type]} ex
   * @param  {[type]} ey
   */
  getPointAndOpposite(point, ex, ey) {
    let oppositePoint = {};
    let currentPoint = {};
    let minDelta = 1000;
    let currentIndex = 0;
    let oppositeIndex = 0;
    point.forEach((p, index) => {
      const delta = Math.sqrt(Math.pow(p.x - ex, 2) + Math.pow(p.y - ey, 2));
      if (delta < minDelta) {
        currentPoint = p;
        currentIndex = index;
        minDelta = delta;
        // 对角线点index相差4
        const offset = 4;
        let oIndex = index - offset;
        if (oIndex < 0) {
          oIndex = index + offset;
        }
        // 取对角线点坐标
        oppositePoint = point.slice(oIndex, oIndex + 1)[0];
        oppositeIndex = oIndex;
      }
    });
    return {
      current: {
        index: currentIndex,
        point: currentPoint
      },
      opposite: {
        index: oppositeIndex,
        point: oppositePoint
      }
    };
  }

  /**
   * 获取缩放后的elementcontrol位置和新的elementArray
   * @param  {[type]} scale [description]
   * @return {[type]}       [description]
   */
  getNewControlBoxAndElementArray(scale) {
    const { degree } = this.state;
    const { selectedElementArray, submitElementArray } = this.props;

    const baseIndex = this.baseIndex;

    const oppositeX = this.oppositePoint.x;
    const oppositeY = this.oppositePoint.y;

    const originalElementArray = this.originalElementArray;

    const originOffsetWidth = this.originalOffset.width;
    const originOffsetHeight = this.originalOffset.height;

    const originalRectX = this.originalRect.x;
    const originalRectY = this.originalRect.y;
    const originalRectWidth = this.originalRect.width;
    const originalRectHeight = this.originalRect.height;

    const originalTransformedControlRect = this.originalTransformedControlRect;

    // 计算element control初始状态以中线点缩放的位置和宽高
    const scaledRect = getScaledRect({
      x: originalRectX,
      y: originalRectY,
      width: originalRectWidth,
      height: originalRectHeight,
      scale: this.scale
    });
    // 计算以中心点缩放旋转后的element control的位置信息
    const transformedRect = transform(scaledRect, degree);

    // 计算到固定点位置的偏移量
    const translatedX =
      originalTransformedControlRect.point[baseIndex].x -
      transformedRect.point[baseIndex].x +
      transformedRect.left;
    const translatedY =
      originalTransformedControlRect.point[baseIndex].y -
      transformedRect.point[baseIndex].y +
      transformedRect.top;

    // 计算移动到固定点后元素左上角的坐标
    const newX = translatedX + transformedRect.width / 2 - scaledRect.width / 2;
    const newY =
      translatedY + transformedRect.height / 2 - scaledRect.height / 2;

    // 缩放后元素的高宽
    const newWidth = scaledRect.width;
    const newHeight = scaledRect.height;

    const newElementArray = selectedElementArray.map((ele, index) => {
      const computed = originalElementArray.getIn([index, 'computed']);

      // 计算元素初始x,y,w,h相对于element control的比例
      const xRatio = (computed.get('left') - originalRectX) / originalRectWidth;
      const yRatio = (computed.get('top') - originalRectY) / originalRectHeight;
      const widthRatio = computed.get('width') / originalRectWidth;
      const heightRatio = computed.get('height') / originalRectHeight;

      // 根据上面得到的比例计算缩放后元素的新位置和宽高
      const newElementX = newX + xRatio * newWidth || 0;
      const newElementY = newY + yRatio * newHeight || 0;
      const newElementWidth = newWidth * widthRatio || 0;
      const newElementHeight = newHeight * heightRatio || 0;

      return ele.merge({
        computed: computed.merge({
          left: newElementX,
          top: newElementY,
          width: newElementWidth,
          height: newElementHeight
        })
      });
    });

    return {
      controlBox: {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      },
      elementArray: newElementArray
    };
  }

  clampElementArray(elementArray) {
    const { ratio } = this.props;

    const MIN_FRAME_WIDTH = Math.round(150 * ratio.workspace);
    const MIN_FRAME_HEIGHT = Math.round(150 * ratio.workspace);

    return elementArray.map((element) => {
      let newElement = element.merge({});

      const oriWidth = element.get('width');
      const oriHeight = element.get('height');

      const oriRatio = oriWidth / oriHeight;

      let width = element.getIn(['computed', 'width']);
      let height = element.getIn(['computed', 'height']);

      const curRatio = width / height;

      if (Math.abs(oriRatio - curRatio) <= 0.002) {
        if (width > height) {
          if (width <= MIN_FRAME_WIDTH) {
            width = MIN_FRAME_WIDTH;
            height = width / curRatio;
          }
        } else if (width < height) {
          if (height <= MIN_FRAME_HEIGHT) {
            height = MIN_FRAME_HEIGHT;
            width = height * curRatio;
          }
        } else if (width <= MIN_FRAME_WIDTH || height <= MIN_FRAME_HEIGHT) {
          width = height = MIN_FRAME_HEIGHT;
        }
      } else {
        if (width <= MIN_FRAME_WIDTH) {
          width = MIN_FRAME_WIDTH;
        }
        if (height <= MIN_FRAME_HEIGHT) {
          height = MIN_FRAME_HEIGHT;
        }
      }

      newElement = newElement.setIn(
        ['computed', 'width'],
        width
      );
      newElement = newElement.setIn(
        ['computed', 'height'],
        height
      );

      return newElement;
    });
  }

  onResizeStart(e) {
    __app.isResizing = true;
    const { evt } = e;

    this.startResizePosition = {
      x: evt.pageX,
      y: evt.pageY
    };

    const { x, y, width, height, degree } = this.state;
    const { containerRect, selectedElementArray } = this.props;
    const { left, top } = containerRect;
    // 获取鼠标相对于当前工作区的位置
    const ex = evt.pageX - left;
    const ey = evt.pageY - top;

    // 获取element control初始状态旋转后的状态
    const transformedRect = transform({ x, y, width, height }, degree);
    // 从旋转后的状态取出8点位置
    const { point } = transformedRect;
    // 获取当前点和对角线点
    const pointAndOpposite = this.getPointAndOpposite(point, ex, ey);

    const { opposite } = pointAndOpposite;

    // 记录对角线点及其索引
    this.baseIndex = opposite.index;
    this.oppositePoint = opposite.point;
    // 记录开始拖拽时鼠标与对角线点之间的差值
    this.originalOffset = {
      width: Math.abs(ex - opposite.point.x),
      height: Math.abs(ey - opposite.point.y)
    };
    // 记录element control初始状态信息
    this.originalRect = {
      x,
      y,
      width,
      height
    };
    // 记录elementArray初始状态信息
    this.originalElementArray = selectedElementArray;
    // 记录element control初始状态旋转后的状态
    this.originalTransformedControlRect = transformedRect;
  }

  onResize(e) {
    if (!__app.isResizing) return;

    const { evt } = e;

    const { onElementArrayChange, containerRect } = this.props;

    const { left, top } = containerRect;

    const ex = evt.pageX - left;
    const ey = evt.pageY - top;

    const scale = {
      x: 1,
      y: 1
    };

    const baseIndex = this.baseIndex;

    const oppositeX = this.oppositePoint.x;
    const oppositeY = this.oppositePoint.y;

    const originOffsetWidth = this.originalOffset.width;
    const originOffsetHeight = this.originalOffset.height;

    let realScale = 1;

    // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
    if (originOffsetWidth > originOffsetHeight) {
      realScale = Math.abs(ex - oppositeX) / originOffsetWidth;
    } else {
      realScale = Math.abs(ey - oppositeY) / originOffsetHeight;
    }

    // 确定缩放的方向
    if (BOTH_RESIZE_POINT.indexOf(baseIndex) >= 0) {
      // x,y方向都需要缩放
      scale.x = scale.y = realScale;
    } else if (HORIZONTAL_RESIZE_POINT.indexOf(baseIndex) >= 0) {
      // x方向需要缩放
      scale.x = realScale;
    } else if (VERTICAL_REZIE_POINT.indexOf(baseIndex) >= 0) {
      // y方向需要缩放
      scale.y = realScale;
    }

    this.scale = scale;

    const newControlBoxAndElementArray = this.getNewControlBoxAndElementArray(
      scale
    );

    let { elementArray, controlBox } = newControlBoxAndElementArray;

    elementArray = this.clampElementArray(elementArray);

    onElementArrayChange(elementArray);

    this.setState(controlBox);
  }

  onResizeStop(e) {
    __app.isResizing = false;
    const { submitElementArray } = this.props;

    const newControlBoxAndElementArray = this.getNewControlBoxAndElementArray(
      this.scale
    );

    let { elementArray } = newControlBoxAndElementArray;

    elementArray = this.clampElementArray(elementArray);

    submitElementArray(elementArray, 'resize');


    e.evt.stopPropagation();
  }

  setCursor(cursorStyle) {
    if (this.elementControlsNode) {
      this.elementControlsNode.getStage().content.style.cursor = cursorStyle;
    }
  }

  render() {
    const {
      selectedElementArray,
      actionbarActions,
      onExchangeDragStart,
      onExchangeDragMove,
      onExchangeDragEnd,
      toDownload,
      isShowTextNotFit,
      isShowTextOverflow,
      clicksObj
    } = this.props;
    const { x, y, width, height, degree } = this.state;
    const isShown = Boolean(selectedElementArray.size);

    const offset = {
      x: Math.round(width / 2),
      y: Math.round(height / 2)
    };

    let exchangeImageProps = {};
    let isSelectSinglePhotoElement = false;
    const isSelectSingleElement = Boolean(selectedElementArray.size === 1);
    const isHasImageTextElement = Boolean(
      selectedElementArray.getIn([0, 'type']) === elementTypes.text &&
        !!selectedElementArray.getIn([0, 'computed', 'imgUrl'])
    );

    if (isSelectSingleElement && selectedElementArray.getIn([0, 'encImgId'])) {
      isSelectSinglePhotoElement = true;
      exchangeImageProps = {
        actions: {
          onDragStart: (e) => {
            onExchangeDragStart(e);
          },
          onDragMove: (e) => {
            onExchangeDragMove(e);
          },
          onDragEnd: (e) => {
            onExchangeDragEnd(e);
          }
        }
      };
    }

    const elementControlsGroupProps = {
      ref: node => (this.elementControlsNode = node),
      rotation: degree,
      offset,
      x: x + offset.x,
      y: y + offset.y,
      width,
      height,
      onMouseOver: (e) => {
        this.setCursor('move');
      },
      onMouseOut: (e) => {
        this.setCursor('default');
      },
      onMouseDown: (e) => {
        e.evt.stopPropagation();
      },
      onClick: () => {
        if (
          isSelectSingleElement &&
          this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL
        ) {
          const forceToDownload = true;
          toDownload(selectedElementArray, forceToDownload);
        }
      }
    };

    const childrenProps = {
      x: 0,
      y: 0,
      width,
      height,
      degree
    };

    const elementControlsRectProps = {
      ...childrenProps,
      stroke: '#4CC1FC',
      strokeWidth: 1,
      id: shapeType.controlElement,
      draggable: true,
      onDragStart: this.onDragStart,
      onDragMove: this.onDrag,
      onDragEnd: this.onDragStop
    };

    const resizableProps = {
      ...childrenProps,
      actions: {
        onResizeStart: this.onResizeStart,
        onResize: this.onResize,
        onResizeStop: this.onResizeStop
      }
    };

    const rotatableProps = {
      ...childrenProps,
      actions: {
        onRotateStart: this.onRotateStart,
        onRotate: this.onRotate,
        onRotateStop: this.onRotateStop
      }
    };
    // 选择图片
    let isShowTextWarnTip = false;
    let isPhoteShowWarnTip = false;
    if (isSelectSinglePhotoElement) {
      const scale = selectedElementArray.getIn(['0', 'computed', 'scale']);
      isPhoteShowWarnTip = scale > RESIZE_LIMIT;
    }

    if (isSelectSingleElement && isHasImageTextElement) {
      isShowTextWarnTip = isShowTextNotFit || isShowTextOverflow;
    }

    const TextwarnTipProps = {
      parentHeight: height,
      isShowTextNotFit,
      isShowTextOverflow
    };
    const PhotoWarnTipProps = { parentHeight: height };

    return isShown
      ? <Group {...elementControlsGroupProps}>
        <Rect {...elementControlsRectProps} />

        <Resizable {...resizableProps} />

        {/* <Rotatable {...rotatableProps} /> */}

        {/* isSelectSinglePhotoElement
            ? <ExchangeImage {...exchangeImageProps} />
            : null */}
        {isShowTextWarnTip ? <TextWarnTip {...TextwarnTipProps} /> : null}
        {isPhoteShowWarnTip ? <PhotoWarnTip {...PhotoWarnTipProps} /> : null}
      </Group>
      : <Group />;
  }
}

ElementControls.propTypes = {
  selectedElementArray: PropTypes.instanceOf(Immutable.List),
  submitElementArray: PropTypes.func.isRequired,
  onElementArrayChange: PropTypes.func.isRequired,
  containerRect: PropTypes.object,
  selectedElements: PropTypes.object,
  showGuideLineIfNear: PropTypes.func,
  hideAllGuideLines: PropTypes.func,
  snapToGuideLine: PropTypes.func,
  actionbarActions: PropTypes.object,
  downloadStatus: PropTypes.number,
  clicksObj: PropTypes.object
};

export default ElementControls;
