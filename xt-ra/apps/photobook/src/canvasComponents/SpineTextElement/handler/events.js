import { loadImg } from '../../../utils/image';

export const drawImage = (that, props) => {
  const { element } = props || that.props;

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
          const imgAttrs = {
              draggable: false,
              height: canvasHeight,
              width: canvasWidth,
              id: element.get('id'),
              offset:{
                x:canvasWidth / 2,
                y:canvasHeight / 2
              },
              x: `${(containerWidth - canvasWidth) / 2 + canvasWidth / 2}`,
              y: `${(containerHeight - canvasHeight) / 2 + canvasHeight / 2}`,
              rotation :90,
              image: img
          };
         that.setState({
          imgAttrs
         });
      }
    }, () => {});
  }
};
