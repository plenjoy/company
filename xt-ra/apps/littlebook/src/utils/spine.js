export const getSpineRect = (spineWidth, spineHeight) => {
  const widthBufferRatio = 0.82;
  const heightBuffer = 300;
  const width = spineWidth * 0.82;
  const height = spineHeight - 300;
  const x = spineWidth * (1 - widthBufferRatio) / 2;
  const y = heightBuffer / 2;
  return {
    width,
    height,
    x,
    y
  };
}
