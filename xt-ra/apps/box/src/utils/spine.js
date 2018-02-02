import { get } from 'lodash';

export const getSpineRect = (spineWidth, spineHeight, wrapSize) => {
  const widthBufferRatio = 0.82;
  const heightBuffer = 300;
  const width = spineWidth * 0.82;
  const height = spineHeight - get(wrapSize, 'top') - get(wrapSize, 'bottom') - 300;
  const x = spineWidth * (1 - widthBufferRatio) / 2;
  const y = heightBuffer / 2 + get(wrapSize, 'top');
  return {
    width,
    height,
    x,
    y
  };
};
