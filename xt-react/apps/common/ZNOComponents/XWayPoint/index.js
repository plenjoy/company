import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import * as main from './handler/main';
import * as helper from './handler/helper';

class XWayPoint extends Component {
  // 声明静态变量
  static wayPointIndex = 0;
  static wayPointArray = [];

  // 声明属性
  index = null;
  content = null;
  isInitialized = false;
  isAlreadyInView = false;

  // 声明state
  state = {
    isDisplay: false,
    isInitialized: false
  };

  // 构造器
  constructor(props) {
    super(props);

    this.onEnter = main.onEnter.bind(this);
    this.onInView = main.onInView.bind(this);
    this.onContainerScroll = main.onContainerScroll.bind(this);
    this.clearWayPoint = helper.clearWayPoint.bind(this);
    this.initializeWayPoint = helper.initializeWayPoint.bind(this);
    this.isFirstWayPointNotInitialize = helper.isFirstWayPointNotInitialize.bind(this);
    this.calculateCurrentPosition = this.calculateCurrentPosition.bind(this);

    this.index = XWayPoint.wayPointArray.push(this) - 1;
  }

  // 挂载WayPoint滚动事件
  componentDidMount() {
    // setTimeout 防止路由切换造成子组件先生成，缺少container
    setTimeout(() => {
      const {container = window} = this.props;
      container.addEventListener('scroll', this.onContainerScroll);
      window.addEventListener('resize', this.calculateCurrentPosition);
    });
  }

   // 清理WayPoint组件
  componentWillUnmount() {
    const {container = window} = this.props;

    container.removeEventListener('scroll', this.onContainerScroll);
    window.removeEventListener('resize', this.calculateCurrentPosition);
    this.clearWayPoint(this.index);
  }

  // 是否初始化显示WayPoint
  componentDidUpdate() {
    // setTimeout 防止下一级wayPoint组件未加载container
    setTimeout(() => {
      if(this.isFirstWayPointNotInitialize()) {
        this.initializeWayPoint(0);
      }

      this.initializeWayPoint();
    });
  }

  calculateCurrentPosition() {
    const {container = window} = this.props;
    this.onContainerScroll({target: container});
  }

  render() {
    const { children, container, className, style, isAlwaysShow } = this.props;
    const { isDisplay } = this.state;

    return (
      <div className={className} style={style} ref={content => this.content = content}>
        {isDisplay || isAlwaysShow ? children : null}
      </div>
    )
  }
}

XWayPoint.propTypes = {
  className: PropTypes.string,
  onEnter: PropTypes.func,
  onInView: PropTypes.func,
  container: PropTypes.any, // waypoint所在滚动的视窗容器
  style: PropTypes.any,
  isAlwaysShow: PropTypes.bool // 强制waypoint中的组件显示
};

export default XWayPoint;
