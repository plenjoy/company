import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import classNames from 'classnames';

import { get } from 'lodash';

import { DraggableCore } from 'react-draggable';

import Rotatable from '../Rotatable';
import Resizable from '../Resizable';
import MultipleActionBar from '../MultipleActionBar';
import PhotoActionBar from '../PhotoActionBar';
import TextActionBar from '../TextActionBar';

import { elementTypes, elementAction, pageTypes } from '../../contants/strings';
import { getCropOptions } from '../../utils/crop';
import { getTransferData } from '../../../../common/utils/drag';


import './index.scss';

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

class ElementControls extends Component {

  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragStop = this.onDragStop.bind(this);

    this.onRotateStart = this.onRotateStart.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.onRotateStop = this.onRotateStop.bind(this);

    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);

    this.moveElement = this.moveElement.bind(this);
    this.keepElementInContainer = this.keepElementInContainer.bind(this);

    this.editElement = this.editElement.bind(this);
    this.dropElement = this.dropElement.bind(this);

    this.state = {
      degree: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldSelectedElementArray = this.props.selectedElementArray;
    const newSelectedElementArray = nextProps.selectedElementArray;

    if (!Immutable.is(oldSelectedElementArray, newSelectedElementArray)) {
      const [minX, minY, maxX, maxY] = this.getMinMaxPosition(
        newSelectedElementArray
      );

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

  onDragStart(e) {
    const { selectedElementArray } = this.props;
    const [minX, minY] = this.getMinMaxPosition(
      selectedElementArray
    );
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


  onDrag(e) {
    if (!this.isDragging) return;

    const { showGuideLineIfNear, snapToGuideLine } = this.props;
    const { x, y, width, height } = this.state;

    const ex = e.pageX;
    const ey = e.pageY;

    const deltaX = ex - this.startDragPosition.x;
    const deltaY = ey - this.startDragPosition.y;

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

  onDragStop(e) {
    this.isDragging = false;

    const { selectedElementArray, submitElementArray, hideAllGuideLines } = this.props;

    submitElementArray(selectedElementArray, 'move');

    hideAllGuideLines();
  }

  getMinMaxPosition(elementArray) {
    const { elementRefs, containerOffset } = this.props;

    const firstElement = elementArray.first();

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    if (firstElement) {
      if (firstElement.get('rot') % 360 === 0) {
        minX = firstElement.getIn(['computed', 'left']);
        minY = firstElement.getIn(['computed', 'top']);
      } else {
        const elementRefId = `element-${firstElement.get('id')}`;
        const elementNode = ReactDOM.findDOMNode(elementRefs[elementRefId]);

        const rect = elementNode.getBoundingClientRect();

        minX = rect.left;
        minY = rect.top;
      }
    }


    elementArray.forEach((element) => {
      const elementDegree = element.get('rot');


      let x = 0;
      let y = 0;
      let rightX = 0;
      let rightY = 0;

      // 性能优化，只有当元素的角度不为0度角时，才去访问dom的接口
      if (elementDegree % 360 === 0) {
        const computed = element.get('computed');
        x = computed.get('left');
        y = computed.get('top');
        rightX = x + computed.get('width');
        rightY = y + computed.get('height');
      } else {
        const elementRefId = `element-${element.get('id')}`;
        const elementNode = ReactDOM.findDOMNode(elementRefs[elementRefId]);

        const { left, top, right, bottom } = elementNode.getBoundingClientRect();

        x = left - containerOffset.left;
        y = top - containerOffset.top;

        rightX = right - containerOffset.left;
        rightY = bottom - containerOffset.top;
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

    return [minX, minY, maxX, maxY];
  }

  keepElementInContainer(deltaX, deltaY) {
    const { sidePad, containerOffset } = this.props;

    let newDeltaX = deltaX;
    let newDeltaY = deltaY;

    const elementX = this.state.x;
    const elementY = this.state.y;


    const elementWidth = this.state.width;
    const elementHeight = this.state.height;

    const {
      width,
      height
    } = containerOffset;

    const MIN_X = sidePad - elementWidth;
    const MIN_Y = sidePad - elementHeight;
    const MAX_X = width - sidePad;
    const MAX_Y = height - sidePad;


    if (elementX + newDeltaX < MIN_X) {
      newDeltaX = MIN_X - elementX;
    } else if (elementX + newDeltaX > MAX_X) {
      newDeltaX = MAX_X - elementX;
    }

    if (elementY + newDeltaY < MIN_Y) {
      newDeltaY = MIN_Y - elementY;
    } else if (elementY + newDeltaY > MAX_Y) {
      newDeltaY = MAX_Y - elementY;
    }

    return [newDeltaX, newDeltaY];
  }

  moveElement(deltaX, deltaY, callback) {
    const { onElementArrayChange, selectedElementArray } = this.props;

    let newElementArray = Immutable.List();

    if (selectedElementArray.size) {
      selectedElementArray.forEach((element) => {
        if (element.get('isSelected')) {
          const computed = element.get('computed');

          const [newDeltaX, newDeltaY] = this.keepElementInContainer(
            deltaX, deltaY, element
          );

          const newElement = element.set(
            'computed',
            computed.merge({
              left: computed.get('left') + newDeltaX,
              top: computed.get('top') + newDeltaY
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

  onRotateStart(e) {
    this.isRotating = true;

    this.totalDegree = 0;

    this.startRotatePosition = {
      x: e.pageX,
      y: e.pageY
    };
  }

  onRotate(e, data) {
    if (!this.isRotating) return;
    const {
      containerOffset,
      selectedElementArray,
      onElementArrayChange,
      showGuideLineIfNear,
    } = this.props;
    const { x, y, width, height } = this.state;

    const p1 = {
      x: x + containerOffset.left + (width / 2),
      y: y + containerOffset.top + (height / 2),
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
        formatedDeg = (deg % 360) + 360;
      } else {
        formatedDeg = deg % 360;
      }
      return formatedDeg;
    };

    this.setState({ degree: Math.round(formatDeg(this.totalDegree)) });

    onElementArrayChange(selectedElementArray.map((element) => {
      const elementDeg = element.get('rot');
      return element.set('rot', formatDeg(deltaDegree + elementDeg));
    }), () => {
      showGuideLineIfNear();
    });
  }

  onRotateStop(e, data) {
    this.isRotating = false;

    const {
      selectedElementArray,
      submitElementArray,
      hideAllGuideLines
    } = this.props;
    submitElementArray(selectedElementArray, 'rotate');

    hideAllGuideLines();
  }

  onResizeStart(e) {
    this.isResizing = true;
    this.startResizePosition = {
      x: e.pageX,
      y: e.pageY
    };
  }

  onResize(dir, e, data) {
    if (!this.isResizing) return;
    const {
      selectedElementArray,
      onElementArrayChange,
      restrictResize,
      showGuideLineIfNear,
      minContainerWidth
    } = this.props;

    const curX = e.pageX;
    const curY = e.pageY;
    const deltaX = curX - this.startResizePosition.x;
    const deltaY = curY - this.startResizePosition.y;

    const [newDeltaX, newDeltaY] = restrictResize({
      deltaX,
      deltaY,
      dir,
      e
    });

    this.startResizePosition = {
      x: curX,
      y: curY
    };

    const { x, y, width, height } = this.state;
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
      newWidth = width + newDeltaX;
      const min = (minWidth < 0 || typeof minWidth === 'undefined') ? 0 : minWidth;
      const max = (maxWidth < 0 || typeof maxWidth === 'undefined') ? newWidth : maxWidth;
      newWidth = clamp(newWidth, min, max);
    }

    if (/left/i.test(dir)) {
      newWidth = width - newDeltaX;
      const min = (minWidth < 0 || typeof minWidth === 'undefined') ? 0 : minWidth;
      const max = (maxWidth < 0 || typeof maxWidth === 'undefined') ? newWidth : maxWidth;
      newWidth = clamp(newWidth, min, max);
    }

    if (/bottom/i.test(dir)) {
      newHeight = height + newDeltaY;
      const min = (minHeight < 0 || typeof minHeight === 'undefined') ? 0 : minHeight;
      const max = (maxHeight < 0 || typeof maxHeight === 'undefined') ? newHeight : maxHeight;
      newHeight = clamp(newHeight, min, max);
    }

    if (/top/i.test(dir)) {
      newHeight = height - newDeltaY;
      const min = (minHeight < 0 || typeof minHeight === 'undefined') ? 0 : minHeight;
      const max = (maxHeight < 0 || typeof maxHeight === 'undefined') ? newHeight : maxHeight;
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
      const computed = element.get('computed');
      const elementX = computed.get('left');
      const elementY = computed.get('top');
      const elementWidth = computed.get('width');
      const elementHeight = computed.get('height');

      const xRatio = (elementX - x) / width;
      const yRatio = (elementY - y) / height;
      const widthRatio = elementWidth / width;
      const heightRatio = elementHeight / height;

      return element.set('computed', computed.merge({
        left: (xRatio * newWidth) + newX,
        top: (yRatio * newHeight) + newY,
        width: widthRatio * newWidth,
        height: heightRatio * newHeight
      }));
    });

    onElementArrayChange(newElementArray, () => {
      showGuideLineIfNear();
    });
  }

  onResizeStop(e) {
    this.isResizing = false;

    const { selectedElementArray, submitElementArray, hideAllGuideLines } = this.props;

    submitElementArray(selectedElementArray, 'resize');

    hideAllGuideLines();
  }

  onMouseDown(e) {

  }

  stopEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  editElement() {
    const { actionbarActions, selectedElementArray } = this.props;
    if (selectedElementArray.size === 1) {
      const firstElement = selectedElementArray.first();
      switch (firstElement.get('type')) {
        case elementTypes.photo: {
          const hasImage = Boolean(firstElement.get('encImgId'));
          if (hasImage) {
            actionbarActions.onEditImage(firstElement);
          } else {
            actionbarActions.onUploadImage(firstElement);
          }
          break;
        }
        case elementTypes.paintedText:
        case elementTypes.text:
          actionbarActions.onEditText(firstElement);
          break;
        default:
      }
    }
  }

  dropElement(e) {
    const { selectedElementArray, submitElementArray } = this.props;

    if (selectedElementArray.size === 1) {
      const firstElement = selectedElementArray.first();
      if (firstElement.get('type') === elementTypes.photo) {
        const transferDataArray = getTransferData(e);
        const transferEncImgId = get(transferDataArray, '0.encImgId');
        const transferWidth = get(transferDataArray, '0.width');
        const transferHeight = get(transferDataArray, '0.height');
        const computed = firstElement.get('computed');

        if (transferEncImgId) {
          submitElementArray(selectedElementArray.map((element) => {
            return element.merge(
              { encImgId: transferEncImgId },
              getCropOptions(
                transferWidth, transferHeight,
                computed.get('width'), computed.get('height'),
                element.get('imgRot')
              )
            );
          }), 'editImage');
        }
      }
    }
  }


  render() {
    const {
      selectedElementArray,
      containerOffset,
      actionbarActions,
      isOnlyExpandFull,
      t,
      page
    } = this.props;
    let isSpine = false;
     // 如果是 spine 则不能移动不能旋转
    if (selectedElementArray.size === 1) {
      if (page.get('type') === pageTypes.spine) {
        isSpine = true;
      }
    }
    // isSpine cursor 改为默认形状
    const { degree, x, y, width, height } = this.state;
    const elementControlsStyle = {
      width,
      height,
      left: x + containerOffset.left,
      top: y + containerOffset.top,
      // cursor: isSpine ? 'pointer' : 'move'
    };

    const isShowActionBar = Boolean(selectedElementArray.size);

    let ActionBar = null;
    const actionBarProps = {
      t,
      actions: actionbarActions,
      isSpine
    };
    if (isShowActionBar) {
      if (selectedElementArray.size === 1) {
        const firstElement = selectedElementArray.first();

        switch (firstElement.get('type')) {
          case elementTypes.photo:
            ActionBar = PhotoActionBar;
            actionBarProps.isOnlyExpandFull = isOnlyExpandFull;
            break;
          case elementTypes.paintedText:
          case elementTypes.text:
            ActionBar = TextActionBar;
            break;
          default:
        }
        actionBarProps.element = firstElement;
      } else {
        ActionBar = MultipleActionBar;
        actionBarProps.selectedElementArray = selectedElementArray;
      }
    }

    const elementControlsClassName = classNames('element-controls', {
      'multiple-element': Boolean(selectedElementArray.size > 1)
    });


    return (
      selectedElementArray.size
      ? (
        <div
          className={elementControlsClassName}
          data-html2canvas-ignore="true"
          style={elementControlsStyle}
          onMouseUp={this.stopEvent}
          onMouseDown={this.stopEvent}
          onDoubleClick={this.editElement}
          onDrop={this.dropElement}
          onDragOver={this.stopEvent}
        >
          {
            isShowActionBar
            ? <ActionBar {...actionBarProps} />
            : null
          }
        </div>
      )
      : null
    );
  }
}

ElementControls.propTypes = {
  selectedElementArray: PropTypes.instanceOf(Immutable.List).isRequired,
  elementRefs: PropTypes.object.isRequired,
  containerOffset: PropTypes.shape({
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  onElementArrayChange: PropTypes.func.isRequired,
  submitElementArray: PropTypes.func.isRequired,
  actionbarActions: PropTypes.object.isRequired,
  isOnlyExpandFull: PropTypes.bool.isRequired,
  showGuideLineIfNear: PropTypes.func,
  snapToGuideLine: PropTypes.func,
  hideAllGuideLines: PropTypes.func,
  t: PropTypes.func.isRequired,
  minContainerWidth: PropTypes.number.isRequired,
  sidePad: PropTypes.number
};

ElementControls.defaultProps = {
  sidePad: 20
};

export default ElementControls;
