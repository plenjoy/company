import { isMobileDevice } from '../../../../../common/utils/mobile';

export const getAppStyle = () => {
  // 检测是否为移动设备.
  const isMobile = isMobileDevice();

  // 如果是PC设备, 不需要特殊处理.
  if (!isMobile) {
    return {};
  }

  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  if (width > height) {
    return {
      width: `${width}px`,
      height: `${height}px`,
      top: 0,
      left: 0,
      transform: 'none'
    };
  }

  return {
    width: `${height}px`,
    height: `${width}px`,
    top: `${Math.floor((height - width) / 2)}px`,
    left: `${Math.floor(0 - (height - width) / 2)}px`,
    transform: 'rotate(90deg)'
  };
};
