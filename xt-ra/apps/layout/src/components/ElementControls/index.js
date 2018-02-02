import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { DraggableCore } from 'react-draggable';

import { isEqual, merge } from 'lodash';

import { elementAction, elementTypes } from '../../constants/strings';

import Rotatable from '../Rotatable';
import Resizable from '../Resizable';

import './index.scss';

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

class ElementControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      degree: 0
    };

    this.startRadians = 0;
    this.lastRadians = 0;

    this.elementRadians = {};
    this.startDragPosition = {};
    this.startResizePosition = {};

    this.isDragging = false;
    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragStop = this.onDragStop.bind(this);

    this.moveElementByKeyboard = this.moveElementByKeyboard.bind(this);

    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);

    this.onRotateStart = this.onRotateStart.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.onRotateStop = this.onRotateStop.bind(this);

    this.onDblClick = this.onDblClick.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentWillMount() {
    const [minX, minY, maxX, maxY] = this.getMinMaxPosition(this.props.selectedElementArray);
    this.setState({
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    });
  }

  componentWillReceiveProps(nextProps) {
    const oldSelectedElementArray = this.props.selectedElementArray;
    const newSelectedElementArray = nextProps.selectedElementArray;

    if (
      newSelectedElementArray.length &&
      !isEqual(oldSelectedElementArray, newSelectedElementArray)
    ) {
      const [minX, minY, maxX, maxY] = this.getMinMaxPosition(newSelectedElementArray);

      this.setState({
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      });
    }

    if (oldSelectedElementArray.size !== newSelectedElementArray.size) {
      this.setState({
        degree: 0
      });

      this.startRadians = 0;
      this.lastRadians = 0;
    }
  }

  getMinMaxPosition(elementArray) {
    const { elementRefs, containerOffset } = this.props;
    const firstElement = elementArray[0];

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    if (firstElement) {
      if (firstElement.rot % 360 === 0) {
        minX = firstElement.position.x;
        minY = firstElement.position.y;
      } else {
        const elementRefId = `element-${firstElement.id}`;
        const elementNode = ReactDOM.findDOMNode(elementRefs[elementRefId]);

        const rect = elementNode.getBoundingClientRect();

        minX = rect.left;
        minY = rect.top + window.scrollY;
      }
    }

    elementArray.forEach((element) => {
      const elementDegree = element.rot;

      let x = 0;
      let y = 0;
      let rightX = 0;
      let rightY = 0;

      // 性能优化，只有当元素的角度不为0度角时，才去访问dom的接口
      if (elementDegree % 360 === 0) {
        x = element.position.x;
        y = element.position.y;
        rightX = x + element.width;
        rightY = y + element.height;
      } else {
        const elementRefId = `element-${element.id}`;
        const elementNode = ReactDOM.findDOMNode(elementRefs[elementRefId]);

        const {
          left,
          top,
          right,
          bottom
        } = elementNode.getBoundingClientRect();

        x = left - containerOffset.left;
        y = top + window.scrollY - containerOffset.top;

        rightX = right - containerOffset.left;
        rightY = bottom + window.scrollY - containerOffset.top;
      }

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

    return [
      Math.round(minX),
      Math.round(minY),
      Math.round(maxX),
      Math.round(maxY)
    ];
  }

  moveElementByKeyboard(e) {
    const { keyCode } = e;
    let moveX = 0;
    let moveY = 0;
    switch (keyCode) {
      case 38:
        // press up
        moveX = 0;
        moveY = -1;
        break;
      case 40:
        // press down
        moveX = 0;
        moveY = 1;
        break;
      case 37:
        // press left
        moveX = -1;
        moveY = 0;
        break;
      case 39:
        // press right
        moveX = 1;
        moveY = 0;
        break;
      default:
        return;
    }
    this.moveElement(moveX, moveY, () => {
      this.props.showGuideLineIfNear();
    });
    e.preventDefault();
  }

  moveElement(deltaX, deltaY, callback) {
    const { selectedElementArray, onElementArrayChange } = this.props;

    if (selectedElementArray.length) {
      const newElementArray = selectedElementArray.map((element) => {
        const { position } = element;
        if (element.isSelected && !element.isDisabled) {
          return merge({}, element, {
            position: {
              x: position.x + deltaX,
              y: position.y + deltaY
            }
          });
        }
      });

      onElementArrayChange(newElementArray, callback);
    }
  }

  onDragStart(e) {
    const { selectedElementArray } = this.props;

    const [minX, minY] = this.getMinMaxPosition(selectedElementArray);
    this.isDragging = true;
    this.startDragPosition = {
      x: e.pageX,
      y: e.pageY
    };
    this.baseDelta = {
      x: e.pageX - minX,
      y: e.pageY - minY
    };
  }

  onDrag(e, draggableData) {
    if (!this.isDragging) return;

    const ex = e.pageX;
    const ey = e.pageY;

    const deltaX = ex - this.startDragPosition.x;
    const deltaY = ey - this.startDragPosition.y;

    const { snapToGuideLine, showGuideLineIfNear } = this.props;

    const [newDeltaX, newDeltaY] = snapToGuideLine({
      deltaX,
      deltaY,
      e,
      baseDelta: this.baseDelta,
      eleAction: elementAction.MOVE
    });

    this.startDragPosition = {
      x: ex,
      y: ey
    };

    this.moveElement(newDeltaX, newDeltaY, () => {
      showGuideLineIfNear();
    });
  }

  onDragStop(e, draggableData) {
    this.isDragging = false;

    const {
      selectedElementArray,
      updateElementsPosition,
      hideAllGuideLines
    } = this.props;

    updateElementsPosition(selectedElementArray);

    hideAllGuideLines();
  }

  onResizeStart(e) {
    this.isResizing = true;
    this.startResizePosition = {
      x: e.pageX,
      y: e.pageY
    };
  }

  onResize(dir, e, draggableData) {
    if (!this.isResizing) return;

    const {
      selectedElementArray,
      onElementArrayChange,
      minContainerWidth,
      showGuideLineIfNear
    } = this.props;

    const curX = e.pageX;
    const curY = e.pageY;
    const deltaX = curX - this.startResizePosition.x;
    const deltaY = curY - this.startResizePosition.y;

    this.startResizePosition = {
      x: curX,
      y: curY
    };

    const {
      x, y, width, height
    } = this.state;
    let maxHeight;
    let maxWidth;
    let minWidth = minContainerWidth;
    let minHeight;

    const ratio = height / width;

    let newWidth = width;
    let newHeight = height;
    let newX = x;
    let newY = y;

    const needKeepRatio = /[A-Z]/.test(dir); /* 四个角等比缩放 */

    if (needKeepRatio) {
      if (!maxWidth && maxHeight) {
        maxWidth = maxHeight / ratio;
      }
      if (!minWidth && minHeight) {
        minWidth = minHeight / ratio;
      }
      if (!maxHeight && maxWidth) {
        maxHeight = maxWidth * ratio;
      }
      if (!minHeight && minWidth) {
        minHeight = minWidth * ratio;
      }
    }

    if (/right/i.test(dir)) {
      newWidth = width + deltaX;
      const min =
        minWidth < 0 || typeof minWidth === 'undefined' ? 0 : minWidth;
      const max =
        maxWidth < 0 || typeof maxWidth === 'undefined' ? newWidth : maxWidth;
      newWidth = clamp(newWidth, min, max);
    }

    if (/left/i.test(dir)) {
      newWidth = width - deltaX;
      const min =
        minWidth < 0 || typeof minWidth === 'undefined' ? 0 : minWidth;
      const max =
        maxWidth < 0 || typeof maxWidth === 'undefined' ? newWidth : maxWidth;
      newWidth = clamp(newWidth, min, max);
    }

    if (/bottom/i.test(dir)) {
      newHeight = height + deltaY;
      const min =
        minHeight < 0 || typeof minHeight === 'undefined' ? 0 : minHeight;
      const max =
        maxHeight < 0 || typeof maxHeight === 'undefined'
          ? newHeight
          : maxHeight;
      newHeight = clamp(newHeight, min, max);
    }

    if (/top/i.test(dir)) {
      newHeight = height - deltaY;
      const min =
        minHeight < 0 || typeof minHeight === 'undefined' ? 0 : minHeight;
      const max =
        maxHeight < 0 || typeof maxHeight === 'undefined'
          ? newHeight
          : maxHeight;
      newHeight = clamp(newHeight, min, max);
    }

    if (needKeepRatio) {
      const deltaWidth = Math.abs(newWidth - width);
      const deltaHeight = Math.abs(newHeight - height);

      if (newHeight === minHeight || deltaWidth < deltaHeight) {
        newWidth = newHeight / ratio;
      } else {
        newHeight = newWidth * ratio;
      }
    }

    if (/left/i.test(dir)) {
      newX = x - (newWidth - width);
    }
    if (/top/i.test(dir)) {
      newY = y - (newHeight - height);
    }

    const newElementArray = selectedElementArray.map((element) => {
      const { position } = element;

      const elementX = position.x;
      const elementY = position.y;
      const elementWidth = element.width;
      const elementHeight = element.height;

      const xRatio = (elementX - x) / width;
      const yRatio = (elementY - y) / height;
      const widthRatio = elementWidth / width;
      const heightRatio = elementHeight / height;

      return merge({}, element, {
        position: {
          x: xRatio * newWidth + newX,
          y: yRatio * newHeight + newY
        },
        width: widthRatio * newWidth,
        height: heightRatio * newHeight
      });
    });

    onElementArrayChange(newElementArray, () => {
      showGuideLineIfNear();
    });
  }

  onResizeStop(e) {
    this.isResizing = false;

    const {
      selectedElementArray,
      updateElementsSize,
      hideAllGuideLines
    } = this.props;

    updateElementsSize(selectedElementArray);

    hideAllGuideLines();
  }

  onRotate(e, draggableData) {
    if (!this.isRotating) return;
    const {
      containerOffset,
      selectedElementArray,
      onElementArrayChange,
      showGuideLineIfNear
    } = this.props;
    const {
      x, y, width, height
    } = this.state;

    const p1 = {
      x: x + containerOffset.left + width / 2,
      y: y + containerOffset.top + height / 2
    };

    const deltaX = e.pageX - this.startRotatePosition.x;
    const deltaY = e.pageY - this.startRotatePosition.y;

    const p2 = {
      x: e.pageX,
      y: e.pageY
    };

    this.startRotatePosition = p2;

    const p3 = {
      x: e.pageX - deltaX,
      y: e.pageY - deltaY
    };

    const startRadians = Math.atan2(p3.y - p1.y, p3.x - p1.x);
    const endRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x) - startRadians;

    const deltaDegree = (endRadians * (180 / Math.PI)) % 360;
    this.totalDegree += deltaDegree;

    const formatDeg = (deg) => {
      let formatedDeg = 0;
      if (deg < 0) {
        formatedDeg = deg % 360 + 360;
      } else {
        formatedDeg = deg % 360;
      }
      return formatedDeg;
    };

    this.setState({ degree: Math.round(formatDeg(this.totalDegree)) });

    onElementArrayChange(
      selectedElementArray.map((element) => {
        const elementDeg = element.rot;
        return merge({}, element, {
          rot: formatDeg(deltaDegree + elementDeg)
        });
      }),
      () => {
        showGuideLineIfNear();
      }
    );
  }

  onRotateStart(e) {
    this.isRotating = true;

    this.totalDegree = 0;

    this.startRotatePosition = {
      x: e.pageX,
      y: e.pageY
    };
  }

  onRotateStop(e) {
    this.isRotating = false;

    const {
      selectedElementArray,
      updateElementsDegree,
      hideAllGuideLines
    } = this.props;
    updateElementsDegree(selectedElementArray);

    hideAllGuideLines();
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  onDblClick() {
    const { selectedElementArray, onTextDblClick } = this.props;

    if (selectedElementArray.length && selectedElementArray.length === 1) {
      const firstElement = selectedElementArray[0];
      if (firstElement.type === elementTypes.text) {
        onTextDblClick(firstElement.id);
      }
    }
  }

  onMouseUp(e) {
    if (!this.props.isDragSelecting) {
      this.stopEvent(e);
    }
  }

  render() {
    const {
      x, y, width, height, degree
    } = this.state;

    const elementControlsProps = {
      className: 'element-controls',
      style: {
        left: x,
        top: y,
        width,
        height
      },
      onMouseUp: this.onMouseUp,
      onMouseDown: this.stopEvent,
      onDoubleClick: this.onDblClick
    };
    return (
      <div {...elementControlsProps}>
        <DraggableCore
          axis="both"
          onStart={this.onDragStart}
          onDrag={this.onDrag}
          onStop={this.onDragStop}
        >
          <div>
            <Rotatable
              rot={degree}
              actions={{
                onRotate: this.onRotate,
                onRotateStart: this.onRotateStart,
                onRotateStop: this.onRotateStop
              }}
            />

            <Resizable
              rot={degree}
              actions={{
                onResizeStart: this.onResizeStart,
                onResize: this.onResize,
                onResizeStop: this.onResizeStop
              }}
            />
          </div>
        </DraggableCore>
      </div>
    );
  }
}

ElementControls.propTypes = {
  selectedElementArray: PropTypes.object.isRequired,
  containerOffset: PropTypes.shape({
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  }).isRequired,
  elementRefs: PropTypes.object.isRequired,
  minContainerWidth: PropTypes.number.isRequired,
  isDragSelecting: PropTypes.bool.isRequired,
  snapToGuideLine: PropTypes.func.isRequired,
  hideAllGuideLines: PropTypes.func.isRequired,
  showGuideLineIfNear: PropTypes.func.isRequired,
  onElementArrayChange: PropTypes.func.isRequired,
  updateElementsPosition: PropTypes.func.isRequired,
  updateElementsSize: PropTypes.func.isRequired,
  updateElementsDegree: PropTypes.func.isRequired,
  onTextDblClick: PropTypes.func.isRequired
};

export default ElementControls;
