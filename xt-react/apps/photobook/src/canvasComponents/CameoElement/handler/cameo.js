import { cameoShapeTypes } from '../../../contants/strings';

/**
 * 获取天窗背景图的路径
 * @param  {string} cameoShape 天窗的形状.
 */
export const getCameoBackgroundImage = (that, cameoShape) => {
  const { materials } = that.props;
  let image = '';
  if (cameoShape === cameoShapeTypes.rect) {
    image = materials.getIn(['originalMaterials', 'cameo', 'rect']);
  } else {
    image = materials.getIn(['originalMaterials', 'cameo', 'round']);
  }

  return image;
};

export const Ellipse = (context, x, y, a, b) => {
  const step = (a > b) ? 1 / a : 1 / b;
  context.beginPath();
  context.moveTo(x + a, y);
  for (let i = 0; i < 2 * Math.PI; i += step) {
    context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
  }
  context.closePath();
};
