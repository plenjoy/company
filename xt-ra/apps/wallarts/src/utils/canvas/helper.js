import { sortBy } from 'lodash';
import { backgroundTextElementName, defaultTextColor } from '../../constants/canvas';
import { inPointInBox } from '../point';
import { shapeType, elementTypes } from '../../constants/strings';

/**
 * 根据elements的zindex进行升序排序.
 * @param  {Immutable.List}  elements 待排序的elements集合
 */
export const sortElementsByZIndex = (elements) => {
  return elements.sort((e1, e2) => {
    const zIndex1 = e1.get('dep');
    const zIndex2 = e2.get('dep');

    if (zIndex1 > zIndex2) {
      return 1;
    } else if (zIndex1 < zIndex2) {
      return -1;
    }
    return 0;
  });
};

/**
 * 解析元素渲染时, 要用到的所有参数.
 * @param  {Immutable.Map} element
 */
export const getRenderElementOptions = (element) => {
  const computed = element.get('computed');

  const offset = {
    x: computed ? Math.round(computed.get('width') / 2) : 0,
    y: computed ? Math.round(computed.get('height') / 2) : 0
  };

  const imgUrl = computed ? computed.get('imgUrl') : '';
  const x = computed ? computed.get('left') + offset.x : 0;
  const y = computed ? computed.get('top') + offset.y : 0;
  const width = computed ? Math.floor(computed.get('width')) : 0;
  const height = computed ? Math.floor(computed.get('height')) : 0;
  const zIndex = element ? element.get('dep') : 0;


  const rot = element.get('rot');
  const id = element.get('id');

  return {
    imgUrl,
    offset,
    x,
    y,
    width,
    height,
    zIndex,
    rot,
    id
  };
};

/**
 * 获取绘制页面上提示文本的参数.
 * @param  {[type]} that
 * @param  {[type]} text
 * @param  {String} color  默认值为: #b7b7b7
 * @param  {Number} fontSize 默认值为14
 */
export const getBackgroundElementOptions = (that, text, color = defaultTextColor, fontSize = 13) => {
  const { data } = that.props;
  const { ratio, page } = data;

  const pageWidth = page ? (page.get('width') * ratio.workspace) : 0;
  const pageHeight = page ? (page.get('height') * ratio.workspace) : 0;
  const padding = 20;

  return {
    x: 0,
    y: (pageHeight / 2) - padding,
    fill: color,
    fontFamily: 'Gotham SSm A',

    // 设置一下文本容器的大小. 以至于我们可以设置align做水平居中.
    width: pageWidth,
    align: 'center',
    id: shapeType.backgroundElement,

    // padding,
    text,
    fontSize,


    // konva上的默认名称
    name: backgroundTextElementName
  };
};

/**
 * 取得元素数据
 * @param  {[type]} that [description]
 * @param  {[type]} id   [description]
 * @return {[type]}      [description]
 */
export const findElementData = (that, id) => {
  const { elementArray } = that.state;

  if (elementArray) {
    return elementArray.find(ele => ele.get('id') === id);
  }

  return null;
};


export const getIntersection = (point, elements) => {
  const sortedElements = elements.sort((e1, e2) => {
    return e2.get('dep') - e1.get('dep');
  });

  return sortedElements.find((ele) => {
    const computed = ele.get('computed');

    if (!computed) {
      return false;
    }

    const degree = ele.get('rot') || 0;

    return inPointInBox(point, {
      x: computed.get('left'),
      y: computed.get('top'),
      width: computed.get('width'),
      height: computed.get('height'),
      degree
    });
  });
};
