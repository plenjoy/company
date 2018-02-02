import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class XToolTip extends Component {
  static TOP = 'top';
  static RIGHT = 'right';
  static BOTTOM = 'bottom';
  static LEFT = 'left';

  state = {
    container: null,
    isShowToolTip: false,
    positionClass: '',
    style: {
      left: 0,
      top: 0
    }
  };

  constructor() {
    super();

    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
  }

  // 第一次挂载完的时候，设置XToolTip的container
  componentDidMount() {
    const { container } = this.state;
    const { element, children } = this.props;

    if(element) {
      element.addEventListener('mouseenter', this.showToolTip);
      element.addEventListener('mouseleave', this.hideToolTip);
    }

    this.setState({ container });
  }

  componentWillUnmount() {
    const { element, children } = this.props;

    if(element) {
      element.removeEventListener('mouseenter', this.showToolTip);
      element.removeEventListener('mouseleave', this.hideToolTip);
    }
  }

  showToolTip() {
    const { style, positionClass } = this.getTooltipPosition();
    this.setState({ style, positionClass, isShowToolTip: true });
  }

  hideToolTip() {
    this.setState({ isShowToolTip: false });
  }

  calcPosition(dir) {
    const { element: targetElement, extendOffset = 0 } = this.props;
    const arrowWidth = 10;

    let top = 0;
    let left = 0;

    switch(dir) {
      case XToolTip.TOP: {
        left = targetElement.offsetLeft + targetElement.offsetWidth / 2;
        top = targetElement.offsetTop - arrowWidth - extendOffset;
        break;
      }
      case XToolTip.BOTTOM: {
        left = targetElement.offsetLeft + targetElement.offsetWidth / 2;
        top = targetElement.offsetTop + targetElement.offsetHeight + arrowWidth + extendOffset;
        break;
      }
      case XToolTip.LEFT: {
        left = -arrowWidth - extendOffset;
        top = targetElement.offsetTop + targetElement.offsetHeight / 2;
        break;
      }
      default:
      case XToolTip.RIGHT: {
        left = targetElement.offsetLeft + targetElement.offsetWidth + arrowWidth + extendOffset;
        top = targetElement.offsetTop + targetElement.offsetHeight / 2;
        break;
      }
    }

    return { top, left };
  }

  isOverFlow(style) {
    const { element: targetElement, defaultPosition } = this.props;
    const { container } = this.state;
    const targetSize = targetElement.getBoundingClientRect();
    const containerSize = container.getBoundingClientRect();

    switch(defaultPosition) {
      case XToolTip.TOP:
        return 0 > style.top - containerSize.height;
      case XToolTip.BOTTOM:
        return document.body.offsetHeight <= targetSize.top + targetSize.height + style.top + containerSize.height;
      case XToolTip.LEFT:
        return 0 > style.left - containerSize.width;
      default:
      case XToolTip.RIGHT:
        return document.body.offsetWidth <= targetSize.left + targetSize.width + style.left + containerSize.width;
    }
  }

  // 计算tooltip的函数
  getTooltipPosition() {
    const { container } = this.state;
    const {
      element: targetElement,
      defaultPosition,
      children,
      extendOffset = 0
    } = this.props;

    let style = this.calcPosition(defaultPosition);
    let positionClass = defaultPosition;

    if(this.isOverFlow(style)) {
      style = this.calcPosition(XToolTip.OPPOSITE[defaultPosition]);
      positionClass = XToolTip.OPPOSITE[defaultPosition];
    }
    
    return { style, positionClass };
  }

  // 渲染
  render() {
    const { children, defaultPosition } = this.props;
    const { style, isShowToolTip, positionClass } = this.state;
    const toolTipClass = classNames('x-tool-tip', positionClass, {
      hidden: !isShowToolTip
    });

    return (
      <div
        className={toolTipClass}
        style={ style }
        ref={ container => this.state.container = container }
      >
        { children }
        <div className="triangle"></div>
      </div>
    );
  }
}

XToolTip.OPPOSITE = {
  [XToolTip.TOP]: XToolTip.BOTTOM,
  [XToolTip.RIGHT]: XToolTip.LEFT,
  [XToolTip.BOTTOM]: XToolTip.TOP,
  [XToolTip.LEFT]: XToolTip.RIGHT
};

export default XToolTip;