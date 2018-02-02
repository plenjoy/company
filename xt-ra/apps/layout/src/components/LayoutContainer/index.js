import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import { findIndex, set, merge, isEqual, mapValues, template } from 'lodash';
import * as guidelineHandler from './handler/guideLines';

import BleedContainer from '../BleedContainer';
import PhotoElement from '../PhotoElement';
import TextElement from '../TextElement';
import Selection from '../Selection';
import MultipleActionPanel from '../MultipleActionPanel';
import OptionsControl from '../OptionsControl';
import ActionControl from '../ActionControl';

import ElementControls from '../ElementControls';

import { elementTypes, elementAction } from '../../constants/strings';

import { TEXT_SRC } from '../../constants/apiUrl';

import { hexString2Number } from '../../../../common/utils/colorConverter';
import { toEncode } from '../../../../common/utils/encode';

import './index.scss';

function renderElement(element) {
  const elementId = element.id;
  const elementRefId = `element-${elementId}`;
  switch (element.type) {
    case elementTypes.photo:
      return <PhotoElement ref={elementRefId} key={elementId} {...element} />;
    case elementTypes.text:
      return <TextElement ref={elementRefId} key={elementId} {...element} />;
    default:
      return null;
  }
}

export const getOffset = (el) => {
  let _x = 0;
  let _y = 0;
  const _width = el.offsetWidth;
  const _height = el.offsetHeight;

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft;
    _y += el.offsetTop;
    el = el.offsetParent;
  }

  return {
    top: _y,
    left: _x,
    width: _width,
    height: _height
  };
};

function convertElement(element, spreadOptions, isShowOriginalParams) {
  const { ratio, originalHeight, originalWidth } = spreadOptions;
  const fixFunc = (x) => {
    if (!isShowOriginalParams) {
      return Math.round(x * ratio);
    }
    return x * ratio;
  };

  const convertedElement = merge({}, element, {
    position: {
      x: fixFunc(element.px * originalWidth),
      y: fixFunc(element.py * originalHeight)
    },
    width: fixFunc(element.pw * originalWidth),
    height: fixFunc(element.ph * originalHeight),
    rot: Math.round(element.rot),
    isDisabled: element.isLock,
    isSelected: false
  });
  delete convertedElement.x;
  delete convertedElement.y;

  return convertedElement;
}

class LayoutContainer extends Component {
  constructor(props) {
    super(props);

    this.startRadians = 0;
    this.lastRadians = 0;

    this.elementRadians = {};

    this.startDragPosition = {};
    this.startResizePosition = {};

    this.state = {
      elementArray: [],
      dynamicGuideLines: [],
      staticGuideLines: [],
      containerOffset: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      isFocusSideBar: false,
      focusSideBarTimer: null,
      isShowOriginalParams: false,
      isDragSelecting: false
    };

    this.unselectElements = this.unselectElements.bind(this);
    this.selectSingleElement = this.selectSingleElement.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.selectElements = this.selectElements.bind(this);

    this.onSelectStart = this.onSelectStart.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectStop = this.onSelectStop.bind(this);
    this.onTextDblClick = this.onTextDblClick.bind(this);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.updateElementsPosition = this.updateElementsPosition.bind(this);
    this.updateElementsSize = this.updateElementsSize.bind(this);
    this.updateElementsDegree = this.updateElementsDegree.bind(this);
    this.onElementArrayChange = this.onElementArrayChange.bind(this);

    this.renderGuideLines = () => guidelineHandler.renderGuideLines(this);
    this.snapToGuideLine = params =>
      guidelineHandler.snapToGuideLine(this, params);
    this.showGuideLineIfNear = () => guidelineHandler.showGuideLineIfNear(this);
    this.hideAllGuideLines = () => guidelineHandler.hideAllGuideLines(this);

    this.updateOffset = this.updateOffset.bind(this);
    this.focusSideBar = this.focusSideBar.bind(this);
    this.toggleParamsMode = this.toggleParamsMode.bind(this);

    this.initData = this.initData.bind(this);
  }

  componentWillMount() {
    const { spreadOptions } = this.props;
    const staticGuideLines = guidelineHandler.covertStaticGuideLines(
      this,
      spreadOptions
    );

    this.setState({
      staticGuideLines
    });

    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const oldElements = this.props.elements;
    const newElements = nextProps.elements;

    if (!isEqual(oldElements, newElements)) {
      this.initData(nextProps);
    }
  }

  componentDidMount() {
    this.updateOffset();

    window.addEventListener('resize', this.updateOffset);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateOffset);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  initData(props) {
    const { elementArray, isShowOriginalParams } = this.state;
    const { spreadOptions, baseUrls } = props;
    const newElements = props.elements;
    const newElementArray = [];
    newElements.forEach((element) => {
      const newElement = convertElement(
        element,
        spreadOptions,
        isShowOriginalParams
      );
      const stateElement = this.getElement(element.id);
      if (elementArray.length && stateElement) {
        newElement.isSelected = stateElement.isSelected;
      }

      const mergedElement = merge({}, newElement, {
        actions: {
          onMouseUp: this.selectElements
        }
      });

      if (mergedElement.type === elementTypes.text) {
        const {
          text,
          fontFamily,
          fontColor,
          textAlign,
          textVAlign,
          lineSpacing
        } = mergedElement;
        const fontSizePercent = element.fontSize;
        const originalFontSize = fontSizePercent * spreadOptions.originalHeight;

        mergedElement.imgUrl = template(TEXT_SRC)({
          text: toEncode(text),
          fontSize: originalFontSize * spreadOptions.ratio,
          fontColor: hexString2Number(fontColor),
          fontFamily,
          width: element.width * spreadOptions.ratio,
          height: element.height * spreadOptions.ratio,
          originalWidth: element.width,
          originalHeight: element.height,
          originalFontSize,
          baseUrl: baseUrls.baseUrl,
          textAlign,
          verticalTextAlign: textVAlign,
          ratio: 1,
          lineSpacing
        });
      }

      newElementArray.push(mergedElement);
    });

    const dynamicGuideLines = guidelineHandler.convertElementsGuideLines(
      this,
      props.spreadOptions,
      newElementArray
    );

    this.setState({
      elementArray: newElementArray,
      dynamicGuideLines
    });
  }

  updateOffset() {
    const { layoutContainer } = this.refs;

    this.setState({
      containerOffset: getOffset(layoutContainer)
    });
  }

  getElementIndex(elementId) {
    const { elementArray } = this.state;
    const elementIndex = findIndex(elementArray, (element) => {
      return element.id === elementId;
    });
    return elementIndex;
  }

  getElement(elementId) {
    const { elementArray } = this.state;
    const elementIndex = this.getElementIndex(elementId);
    return elementArray[elementIndex];
  }

  onKeyDown(e) {
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
      case 46:
      case 8:
        // press delete
        // press backspace
        const { elementArray } = this.state;
        const selectedElementArray = elementArray.filter(o => o.isSelected);
        this.props.actions.deleteElements(selectedElementArray.map(o => o.id));
      default:
        return;
    }
    if (moveX || moveY) {
      this.moveElement(moveX, moveY, () => {
        this.showGuideLineIfNear();
        this.updateElementsPosition(
          this.state.elementArray.filter(o => o.isSelected)
        );
      });
    }
    e.preventDefault();
  }

  moveElement(deltaX, deltaY, callback) {
    const { elementArray } = this.state;
    const selectedElementArray = elementArray.filter(o => o.isSelected);

    if (selectedElementArray.length) {
      const newElementArray = elementArray.map((element) => {
        const { position } = element;
        if (element.isSelected && !element.isDisabled) {
          return merge({}, element, {
            position: {
              x: position.x + deltaX,
              y: position.y + deltaY
            }
          });
        }
        return element;
      });

      this.setState(
        {
          elementArray: newElementArray
        },
        () => {
          callback && callback();
        }
      );
    }
  }

  getEdgePositionIfOutBleed(element) {
    const { spreadOptions } = this.props;
    const { containerOffset } = this.state;
    const { viewWidth, viewHeight, bleed, ratio } = spreadOptions;
    const scaledBleed = mapValues(bleed, o => Math.round(o * ratio));

    const elementRefId = `element-${element.id}`;
    const elementNode = ReactDOM.findDOMNode(this.refs[elementRefId]);

    const rect = elementNode.getBoundingClientRect();
    const relativeX = Math.round(rect.left - containerOffset.left);
    const relativeY = Math.round(
      rect.top + window.scrollY - containerOffset.top
    );
    const centerX = relativeX + Math.floor(rect.width / 2);
    const centerY = relativeY + Math.floor(rect.height / 2);
    const rectX = centerX - element.width / 2;
    const rectY = centerY - element.height / 2;

    const endPosition = {
      x: Math.round(relativeX + rect.width),
      y: Math.round(relativeY + rect.height)
    };

    const newPosition = {
      x: Math.round(rectX),
      y: Math.round(rectY)
    };

    if (relativeX < scaledBleed.left) {
      newPosition.x = rect.width / 2 - element.width / 2;
    }

    if (relativeY < scaledBleed.top) {
      newPosition.y = rect.height / 2 - element.height / 2;
    }

    if (endPosition.x > viewWidth - scaledBleed.right) {
      newPosition.x = viewWidth - rect.width / 2 - element.width / 2;
    }

    if (endPosition.y > viewHeight - scaledBleed.bottom) {
      newPosition.y = viewHeight - rect.height / 2 - element.height / 2;
    }

    return newPosition;
  }

  updateElementsPosition(selectedElementArray) {
    if (selectedElementArray.length) {
      const { actions, spreadOptions } = this.props;
      const updateObjects = selectedElementArray.map((element) => {
        if (element && !element.isDisabled) {
          const { position } = element;
          return {
            id: element.id,
            x: position.x / spreadOptions.ratio,
            y: position.y / spreadOptions.ratio
          };
        }
        return null;
      });

      actions.updateMultiElement(updateObjects);
    }
  }

  updateElementsSize(selectedElementArray) {
    if (selectedElementArray.length) {
      const { actions, spreadOptions } = this.props;
      const updateObjects = selectedElementArray.map((element) => {
        if (!element.isDisabled) {
          return {
            id: element.id,
            x: Math.round(element.position.x) / spreadOptions.ratio,
            y: Math.round(element.position.y) / spreadOptions.ratio,
            width: Math.round(element.width) / spreadOptions.ratio,
            height: Math.round(element.height) / spreadOptions.ratio
          };
        }
      });

      actions.updateMultiElement(updateObjects);
    }
  }

  updateElementsDegree(selectedElementArray) {
    if (selectedElementArray.length) {
      const { actions } = this.props;
      const updateObjects = selectedElementArray.map((element) => {
        if (!element.isDisabled) {
          return {
            id: element.id,
            rot: element.rot
          };
        }
      });

      actions.updateMultiElement(updateObjects);
    }
  }

  selectSingleElement(id, ex, ey) {
    const { elementArray } = this.state;
    this.setState({
      elementArray: elementArray.map((element) => {
        if (element.id === id) {
          return merge({}, element, { isSelected: true });
        }
        return merge({}, element, { isSelected: false });
      })
    });
  }

  onMouseUp() {
    const { isFocusSideBar } = this.state;
    if (!isFocusSideBar) {
      this.unselectElements();
    }
  }

  selectElements(id, e) {
    const ex = e.pageX;
    const ey = e.pageY;
    if (!e.ctrlKey && !e.metaKey) {
      const element = this.getElement(id);
      if (!element.isSelected) {
        this.selectSingleElement(id, ex, ey);
      }
    } else {
      const { elementArray } = this.state;

      const newElementArray = elementArray.map((o) => {
        if (o.id === id) {
          return merge({}, o, { isSelected: !o.isSelected });
        }
        return o;
      });

      this.setState({
        elementArray: newElementArray
      });
    }

    e.stopPropagation();
  }

  unselectElements() {
    const { elementArray } = this.state;
    this.setState({
      elementArray: elementArray.map((element) => {
        return merge({}, element, {
          isSelected: false
        });
      })
    });
  }

  dragSelectElements(p1, p2, callback) {
    const { elementArray } = this.state;
    const tempP1 = {
      x: p1.x < p2.x ? p1.x : p2.x,
      y: p1.y < p2.y ? p1.y : p2.y
    };

    const tempP2 = {
      x: p2.x > p1.x ? p2.x : p1.x,
      y: p2.y > p1.y ? p2.y : p1.y
    };

    const selectedElementArray = elementArray.filter((element) => {
      const { position } = element;
      const position2 = {
        x: position.x + element.width,
        y: position.y + element.height
      };

      return (
        tempP1.y < position2.y &&
        tempP2.y > position.y &&
        tempP1.x < position2.x &&
        tempP2.x > position.x
      );
    });

    const oldSelectedElementArray = elementArray.filter((o) => {
      return o.isSelected;
    });

    if (selectedElementArray.length !== oldSelectedElementArray.length) {
      const selectedElementIdArray = selectedElementArray.map(e => e.id);
      const newElementArray = elementArray.map((element) => {
        if (selectedElementIdArray.indexOf(element.id) !== -1) {
          return merge({}, element, { isSelected: true });
        }
        return merge({}, element, { isSelected: false });
      });

      this.setState(
        {
          elementArray: newElementArray
        },
        callback
      );
    }
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  onSelectStart() {
    this.setState({
      isDragSelecting: true
    });
  }

  onSelect(selectionBox) {
    if (selectionBox.p1 && selectionBox.p2) {
      this.dragSelectElements(selectionBox.p1, selectionBox.p2);
    }
  }

  onSelectStop(selectionBox) {
    if (selectionBox.p1 && selectionBox.p2) {
      this.dragSelectElements(selectionBox.p1, selectionBox.p2);
    }
    this.setState({
      isDragSelecting: false
    });
  }

  onTextDblClick(id) {
    const { actions } = this.props;
    const { onEditText } = actions;
    const currentElement = this.getElement(id);
    onEditText(Immutable.fromJS({ element: currentElement }));
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  focusSideBar(e) {
    window.clearTimeout(this.state.focusSideBarTimer);

    const focusSideBarTimer = window.setTimeout(() => {
      this.setState({
        isFocusSideBar: false
      });
    }, 700);

    this.setState({
      isFocusSideBar: true,
      focusSideBarTimer
    });

    this.stopEvent(e);
  }

  toggleParamsMode() {
    this.setState({
      isShowOriginalParams: !this.state.isShowOriginalParams
    });
  }

  onElementArrayChange(selectedElementArray, callback) {
    const { elementArray } = this.state;
    this.setState(
      {
        elementArray: elementArray.map((element) => {
          const elementId = element.id;
          const selectedElement = selectedElementArray.find((o) => {
            return o.id === elementId;
          });

          if (selectedElement) {
            return selectedElement;
          }

          return element;
        })
      },
      () => {
        callback && callback();
      }
    );
  }

  submitElementArray(selectedElementArray, doingType) {}

  render() {
    const { spreadOptions, bgUrl, baseUrls, actions } = this.props;
    const { bleed, viewWidth, viewHeight, ratio } = spreadOptions;

    const {
      elementArray,
      containerOffset,
      isShowOriginalParams,
      isDragSelecting
    } = this.state;
    const selectedElementArray = elementArray.filter(o => o.isSelected);

    const layoutContainerStyle = {
      width: viewWidth,
      height: viewHeight,
      background: bgUrl ? `url(${bgUrl}) no-repeat` : ''
    };

    const bleedContainerStyle = mapValues(bleed, v => Math.round(v * ratio));

    const sideBarLeft = containerOffset.left + containerOffset.width + 35;

    const multipleActionPanelProps = {
      selectedElementArray,
      sideBarLeft,
      actions: {
        updateElementsPosition: this.updateElementsPosition,
        updateElementsSize: this.updateElementsSize
      }
    };

    const singleActionPanelProps = {
      selectedElementArray,
      sideBarLeft,
      spreadOptions,
      isShowOriginalParams,
      actions: {
        updateElement: actions.updateElement,
        elementToFront: actions.elementToFront,
        elementToBack: actions.elementToBack,
        toggleParamsMode: this.toggleParamsMode
      }
    };

    const selectionProps = {
      containerOffsetTop: containerOffset.top,
      containerOffsetLeft: containerOffset.left,
      actions: {
        onSelectStart: this.onSelectStart,
        onSelect: this.onSelect,
        onSelectStop: this.onSelectStop
      }
    };

    const sideBarStyle = {
      left: sideBarLeft,
      width: selectedElementArray.length > 1 ? 160 : 120
    };

    const elementControlsProps = {
      containerOffset,
      selectedElementArray,
      isDragSelecting,
      elementRefs: this.refs,
      minContainerWidth: Math.round(20 * ratio),
      showGuideLineIfNear: this.showGuideLineIfNear,
      snapToGuideLine: this.snapToGuideLine,
      hideAllGuideLines: this.hideAllGuideLines,
      onElementArrayChange: this.onElementArrayChange,
      updateElementsPosition: this.updateElementsPosition,
      updateElementsSize: this.updateElementsSize,
      updateElementsDegree: this.updateElementsDegree,
      onTextDblClick: this.onTextDblClick
    };

    return (
      <div
        ref="layoutContainer"
        className="layout-container"
        tabIndex="0"
        style={layoutContainerStyle}
        onKeyDown={this.onKeyDown}
      >
        <div className="elements" onMouseDown={this.stopEvent}>
          {elementArray
            ? elementArray.map((element) => {
              return renderElement(element);
            })
            : null}
        </div>

        {selectionProps ? <Selection {...selectionProps} /> : null}
        {this.renderGuideLines()}

        {selectedElementArray.length ? (
          <ElementControls {...elementControlsProps} />
        ) : null}

        <BleedContainer style={bleedContainerStyle} />

        <div
          className="side-bar"
          style={sideBarStyle}
          onMouseDown={this.focusSideBar}
          onMouseUp={this.stopEvent}
          onKeyUp={this.stopEvent}
          onKeyDown={this.stopEvent}
        >
          <MultipleActionPanel {...multipleActionPanelProps} />
          <OptionsControl {...singleActionPanelProps} />
          <ActionControl {...singleActionPanelProps} />
        </div>
      </div>
    );
  }
}

LayoutContainer.defaultProps = {
  nearOffset: 10
};

LayoutContainer.propTypes = {
  elements: PropTypes.array,
  bgUrl: PropTypes.string,
  spreadOptions: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    updateElement: PropTypes.func.isRequired,
    deleteElements: PropTypes.func.isRequired,
    updateMultiElement: PropTypes.func.isRequired,
    elementToFront: PropTypes.func.isRequired
  }).isRequired,
  nearOffset: PropTypes.number
};

export default LayoutContainer;
