import Immutable from 'immutable';
import { elementTypes, pageTypes } from '../../../contants/strings';
import Element from '../../../utils/entries/element';
import { getCropOptions } from '../../../utils/crop';
import { toDownload } from '../canvas/downloadImage';

const convertElement = (that, currentPage, curElement, index, x, y) => {
  const { data, actions } = that.props;
  const {
    ratio,
    elements,
    paginationSpread,
    pagination,
    parameters,
    settings
  } = data;
  const { width, height } = curElement;
  const eWidth = curElement.type === elementTypes.photo ? 960 : curElement.width;
  const eHeight = curElement.type === elementTypes.photo ? 640 : curElement.height;
  const step = 80;
  const viewEleWidth = eWidth * ratio.workspace;
  const viewEleHeight = eHeight * ratio.workspace;
  const viewConWidth = currentPage.get('width') * ratio.workspace;
  const viewConHeight = currentPage.get('height') * ratio.workspace;
  const containerProps = document.querySelector('.inner-sheet')
    ? getOffset(document.querySelector('.inner-sheet'))
    : getOffset(document.querySelector('.cover-sheet'));
  // 计算鼠标放开位置的真实坐标
  let viewX = x - containerProps.left;
  let viewY = y - containerProps.top;
  let xStep = index * step;
  let yStep = index * step;

  const leftPage = paginationSpread.getIn(['pages', 0]);
  const innerPageBleed = parameters.get('innerPageBleed');
  const leftPageWidth = (leftPage.get('width') - innerPageBleed.get('left') - innerPageBleed.get('right')) * ratio.workspace;

  // 如果不在当前选中page区域内，不添加元素
  if (pagination.pageIndex >= 1) {
    // 如果为右页，减去左页的宽度
    viewX -= leftPageWidth;
  }

  // 区域检测
  if (viewX <= 0) {
    viewX = 0;
  }
  if (viewY <= 0) {
    viewY = 0;
  }
  if (viewX >= viewConWidth - viewEleWidth) {
    viewX = viewConWidth - viewEleWidth;
    xStep -= 2 * step;
  }
  if (viewY >= viewConHeight - viewEleHeight) {
    viewY = viewConHeight - viewEleHeight;
    yStep -= 2 * step;
  }

  const ex = viewX / ratio.workspace + xStep;
  const ey = viewY / ratio.workspace + yStep;
  const defaultPosition = { x: ex, y: ey };

  const options = getCropOptions(width, height, eWidth * ratio.workspace, eHeight * ratio.workspace, 0);
  const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
  const maxDepElement = elements.maxBy((item) => {
    return item.get('dep');
  });

  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1;
  let newPhotoElement;
  if (curElement.type === elementTypes.photo) {
    // 应用border.
    const { bookSetting } = settings;
    const border = bookSetting.border;

    newPhotoElement = new Element({
      type: elementTypes.photo,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      encImgId: curElement.encImgId,
      imageid: curElement.imageid,
      dep,
      // 应用border.
      border
    });
  } else if (curElement.type === elementTypes.sticker) {
    newPhotoElement = {
      type: elementTypes.sticker,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      decorationId: curElement.guid,
      rot: 0,
      dep
    };
  }
  return Object.assign({}, newPhotoElement);
};

const getSpineFirstElement = (paginationSpread) => {
  let firstSpineText;

  if (paginationSpread) {
    const pages = paginationSpread.get('pages');

    if (pages && pages.size) {
      const spinePage = pages.find(page => page.get('type') === pageTypes.spine);

      if (spinePage) {
        //如果里面的element的type本来就是spine 就不需要拷贝到full
        const spineElements = spinePage.get('elements');
        if (spineElements && spineElements.size) {
          const newSpineElements = spineElements.first();
          if (newSpineElements.get('type') === elementTypes.text) {
            firstSpineText = newSpineElements.merge({ isSpineText: true, rot: 0 });
          }
        }
      }
    }
  }

  return firstSpineText;
};

function convertElements(that, nextProps, ratio) {
  let outList = Immutable.List();
  const props = nextProps || that.props;
  const { data } = props;
  const { elementArray } = that.state;

  // 在full页面拿到spine页面 里面的spineTextElement 的第一个
  const firstSpineText = getSpineFirstElement(data.paginationSpread);
  let elements = data.page.get('elements');
  if (firstSpineText) {
    elements = data.page.get('elements').push(firstSpineText);
  }

  elements.forEach((element) => {
    const computed = that.computedElementOptions(props, element, ratio);

    const stateElement = elementArray.find((o) => {
      return o.get('id') === element.get('id');
    });

    const extraProps = {
      isDisabled: false,
      isSelected: false
    };

    if (stateElement) {
      extraProps.isDisabled = stateElement.get('isDisabled');
      extraProps.isSelected = stateElement.get('isSelected');
    }

    outList = outList.push(
      element.merge({ computed }, extraProps)
    );
  });

  return outList;
}

export const componentWillMount = (that) => {
  const { page, ratio, paginationSpread, size } = that.props.data;
  const newElementArray = convertElements(that, that.props, ratio.workspace);
  that.setState({
    elementArray: newElementArray
  });
  toDownload(that, newElementArray);
};


export const componentWillReceiveProps = (that, nextProps) => {
  const oldData = that.props.data;
  const newData = nextProps.data;

  const oldPage = oldData.page;
  const page = newData.page;

  const oldPaginationSpread = oldData.paginationSpread;
  const newPaginationSpread = newData.paginationSpread;

  const oldElements = oldPage.get('elements');
  const newElements = page.get('elements');

  const oldRatio = oldData.ratio.workspace;
  const newRatio = newData.ratio.workspace;


  if (!Immutable.is(oldElements, newElements) ||
      oldRatio !== newRatio ||
      !Immutable.is(oldPaginationSpread, newPaginationSpread)) {
    const newElementArray = convertElements(that, nextProps, newRatio);

    that.setState({
      elementArray: newElementArray
    });

    toDownload(that, newElementArray);
  }

  if (oldRatio !== newRatio) {
    // FIXME: 需要知道render材质后的时机
    clearTimeout(that.updateOffsetTimer);
    that.updateOffsetTimer = setTimeout(() => {
      // that.updateOffset();
      that.setState({
        isRatioChanged: true
      });
    }, 1200);
  }
};

