export function isContentInView({target: container}) {
  // Edge上scrollTop加上clientHeight会比offsetTop小1, 减掉5px做特殊处理
  const edgeOffset = 5;
  return container.scrollTop + container.clientHeight >= this.content.offsetTop - edgeOffset;
}

export function isFirstWayPointNotInitialize() {
  const XWayPoint = this.constructor;

  return XWayPoint.wayPointIndex === 0 && XWayPoint.wayPointArray[0] && !XWayPoint.wayPointArray[0].isInitialized;
}

/**
 * 初始化当前WayPoint位置
 * @param {*} index 
 */
export function initializeWayPoint(index) {
  const XWayPoint = this.constructor;

  // 传入初始化index，则初始化指定index的WayPoint；不传则自动初始化下一个wayPoint
  index = isNaN(Number(index)) ? XWayPoint.wayPointIndex : index ;

  // 获取下一个wayPoint实例
  let nextWayPoint = XWayPoint.wayPointArray[index];
  let wayPointCount = XWayPoint.wayPointArray.length;
  let nextIndex = index;

  // 判断下一个wayPoint有没有被初始化
  if(nextWayPoint && !nextWayPoint.isInitialized && index < wayPointCount) {
    nextWayPoint.onContainerScroll({target: nextWayPoint.props.container});
    nextWayPoint.isInitialized = true;
    nextIndex++;
  }

  // 将被初始化完成的idx设置到XWayPoint
  XWayPoint.wayPointIndex = nextIndex;
}

export function clearWayPoint(index) {
  const XWayPoint = this.constructor;

  XWayPoint.wayPointArray = [];
  XWayPoint.wayPointIndex = 0;
}