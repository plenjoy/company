/**
 * 检测是不是移动设备.
 * @return {Boolean} 移动设备返回true, 否则为false.
 */
export const isMobileDevice = () => {
  return (typeof window.orientation !== 'undefined') ||
         (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export const getResizeEventType = () => {
  return 'onorientationchange' in window ? 'orientationchange' : 'resize';
};

