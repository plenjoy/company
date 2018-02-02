export const transform = (options, angle) => {
  const { x, y, width, height } = options;
  const r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
  const a = Math.round(Math.atan(height / width) * 180 / Math.PI);
  const tlbra = 180 - angle - a;
  const trbla = a - angle;
  const topLeft = {
    x: x + width / 2 + r * Math.cos(tlbra * Math.PI / 180),
    y: y + height / 2 - r * Math.sin(tlbra * Math.PI / 180)
  };
  const topRight = {
    x: x + width / 2 + r * Math.cos(trbla * Math.PI / 180),
    y: y + height / 2 - r * Math.sin(trbla * Math.PI / 180)
  };
  const bottomRight = {
    x: x + width / 2 - r * Math.cos(tlbra * Math.PI / 180),
    y: y + height / 2 + r * Math.sin(tlbra * Math.PI / 180)
  };
  const bottomLeft = {
    x: x + width / 2 - r * Math.cos(trbla * Math.PI / 180),
    y: y + height / 2 + r * Math.sin(trbla * Math.PI / 180)
  };
  const minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
  const maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
  const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
  const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
  return {
    point: {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    },
    width: maxX - minX,
    height: maxY - minY,
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY
  }
}
