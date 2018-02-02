import { loadImg } from '../../../utils/image';

export const drawImage = (that, props) => {
  const { data } = props || that.props;
  const { element} = data;
  const imgUrl = element.getIn(['computed', 'imgUrl']);
  if (imgUrl) {
    const elementId = that.state.canvasId;
    const computed = element.get('computed');
    const containerWidth = computed.get('width');
    const containerHeight = computed.get('height');

    loadImg(imgUrl).then((result) => {
      const img = result.img;

      if (img) {
        // 进行宽高对换.
        const canvasWidth = img.width;
        const canvasHeight = img.height;

        const canvas = document.getElementById(elementId);
        if (canvas) {
          // 设置canvas样式.
          canvas.width = canvasHeight;
          canvas.height = canvasWidth;

          canvas.style.left = `${(containerWidth - canvas.width) / 2 }px`;
          canvas.style.top = `${(containerHeight - canvas.height) / 2}px`;

          const ctx = canvas.getContext('2d');
          ctx.save();
          ctx.rotate(90 * Math.PI / 180);
          ctx.drawImage(result.img, 0, -canvasHeight);
          ctx.restore();
        }
      }
    }, () => {});
  }
};
