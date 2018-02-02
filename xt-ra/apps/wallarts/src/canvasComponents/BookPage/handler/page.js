import Immutable from 'immutable';
import { merge, get, isEqual } from 'lodash';
import { elementTypes, pageTypes, dragTypes } from '../../../constants/strings';
import {
  createPhotoElement,
  createCoverPagePhotoElement,
  updateElementByTemplate
} from '../../../utils/elementHelper';
import { getTransferData } from '../../../../../common/utils/drag';
import { toDownload } from '../canvas/downloadImage';
import { getTemplateIdOnCreate } from '../../../utils/customeTemplate';

export const stopEvent = event => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

export const getOffset = el => {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};

const getViewX = x => {
  const containerProps = document.querySelector('.edit-page-core .inner-sheet')
    ? getOffset(document.querySelector('.edit-page-core .inner-sheet'))
    : getOffset(document.querySelector('.edit-page-core .cover-sheet'));

  // 计算鼠标放开位置的真实坐标
  const viewX = x - containerProps.left;

  return viewX;
};

const convertDragElement = (that, currentPage, curElement, index, x, y) => {
  const { data } = that.props;
  const { ratio, userId } = data;

  const eWidth = currentPage.get('width') / 2;

  const viewX = getViewX(x);

  // 判断鼠标释放点是在左侧还是右侧.
  const isDropInLeft =
    viewX < eWidth * ratio.workspace || viewX === eWidth * ratio.workspace;

  // 判断要添加在左侧还是右侧.
  let isLeft = true;
  if (isDropInLeft) {
    isLeft = !index;
  } else {
    isLeft = !!index;
  }

  let newPhotoElement;
  if (curElement.type === elementTypes.photo) {
    newPhotoElement = createPhotoElement(
      currentPage,
      curElement,
      userId,
      isLeft
    );
  }

  return newPhotoElement;
};

const addCoverPhotoElement = (that, imageInfo) => {
  const { data, actions } = that.props;
  const { paginationSpread, project, page, userId } = data;
  const { boundProjectActions } = actions;

  const pages = paginationSpread.get('pages');
  const spinePage = pages.find(page => page.get('type') === pageTypes.spine);

  const expandingOverFrontcover = project.getIn([
    'parameterMap',
    'spineExpanding',
    'expandingOverFrontcover'
  ]);
  const coverThickness = project.getIn(['parameterMap', 'coverThickness']);
  const coverType = project.getIn(['setting', 'cover']);
  const element = createCoverPagePhotoElement(
    page,
    spinePage,
    coverThickness,
    expandingOverFrontcover,
    coverType
  );

  const templateId = getTemplateIdOnCreate(userId, imageInfo);

  let newElement = merge({}, element);

  const isCover = true;

  const options = {
    page,
    element: Immutable.fromJS(newElement),
    imageInfo,
    templateId,
    isCover,
    spinePage,
    expandingOverFrontcover,
    coverThickness,
    coverType
  };

  newElement = merge({}, element, updateElementByTemplate(options), {
    encImgId: imageInfo.id
  });

  return newElement;
};

const addElements = (that, elements, x, y) => {
  const { data, actions } = that.props;
  const { settings, pagination, paginationSpread } = data;
  const { boundProjectActions } = actions;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });
  const newElements = [];
  elements.map((curElement, index) => {
    if (index <= 1) {
      newElements.push(
        convertDragElement(that, currentPage, curElement, index, x, y)
      );
    }
  });

  return newElements;
};

// drag and add elements
const addElement = (that, curElement, index, x, y) => {
  const { data, actions } = that.props;
  const { settings, pagination, paginationSpread } = data;
  const { boundProjectActions } = actions;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });
  const newPhotoElement = convertDragElement(
    that,
    currentPage,
    curElement,
    0,
    x,
    y
  );

  return boundProjectActions.createElement(currentPageId, newPhotoElement);
};

/**
 * 切换当前的page为工作目录.
 * @param  {object} that BookPage的this指向
 */
export const switchPage = (that, e, callback) => {
  const { actions, data } = that.props;
  const { boundPaginationActions } = actions;
  const { page, index, pagination, elements } = data;
  const event = e || window.event;
  // event.stopPropagation();

  if (
    page &&
    pagination.pageId !== page.get('id') &&
    page.get('type') !== pageTypes.spine &&
    boundPaginationActions
  ) {
    boundPaginationActions.switchPage(index, page.get('id')).then(() => {
      callback && callback();
    });
  }
};

export const activePage = that => {
  const { actions, data } = that.props;
  const { page } = data;

  actions.activePage(page.get('id'));
};

function convertElements(that, nextProps, ratio) {
  let outList = Immutable.List();
  const props = nextProps || that.props;
  const { data } = props;
  const { elementArray } = that.state;

  const { elements } = data;

  elements.forEach(element => {
    const computed = that.computedElementOptions(props, element, ratio);

    const stateElement = elementArray.find(o => {
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

    outList = outList.push(element.merge({ computed }, extraProps));
  });

  return outList;
}

export const componentWillMount = that => {
  const { ratio } = that.props.data;

  const newElementArray = convertElements(that, that.props, ratio);
  that.setState({
    elementArray: newElementArray
  });

  toDownload(that, newElementArray);
};

export const componentWillReceiveProps = (that, nextProps) => {
  const oldData = that.props.data;
  const newData = nextProps.data;

  const oldElements = oldData.elements;
  const newElements = newData.elements;

  const oldRatio = oldData.ratio;
  const newRatio = newData.ratio;

  const oldPageId = oldData.pagination.pageId;
  const newPageId = newData.pagination.pageId;

  const oldActivePageId = that.props.data.activePageId;
  const newActivePageId = nextProps.data.activePageId;

  const oldStage = that.props.data.stage;
  const newStage = nextProps.data.stage;

  const oldSize = get(that.props.data, 'size');
  const newSize = get(nextProps.data, 'size');

  if (oldStage !== newStage) {
    that.stage = newStage;
    that.addEventsToLayerOfElements();
    that.updateOffset(newSize);
  }

  if (!isEqual(oldSize, newSize)) {
    that.updateOffset(newSize);
  }

  if (!Immutable.is(oldElements, newElements) || oldRatio !== newRatio) {
    const newElementArray = convertElements(that, nextProps, newRatio);

    that.setState({
      elementArray: newElementArray
    });

    toDownload(that, newElementArray);
  }

  // if (oldElements.size !== newElements.size && that.elementControlsNode) {
  //   that.elementControlsNode.needRedrawElementControlsRect();
  // }

  // 切换page时，取消其他page所有已选择的状态
  if (oldPageId !== newPageId || oldActivePageId !== newActivePageId) {
    const newElementArray = convertElements(that, nextProps, newRatio);

    that.setState(
      {
        elementArray: newElementArray.map(element => {
          return element.set('isSelected', false);
        })
      },
      () => {
        toDownload(that);
      }
    );
  }
};

export const onPageDragOver = (that, e) => {
  that.setState({
    isDragOver: true
  });
  stopEvent(e);
};

export const onPageDragMove = (that, e) => {
  that.setState({
    isDragOver: true
  });
  stopEvent(e);
};

export const onPageDragLeave = (that, e) => {
  that.setState({
    isDragOver: false
  });
  // stopEvent(e);
};

export const onPageDroped = (that, e) => {
  const event = e || window.event;
  const { data, actions } = that.props;
  const {
    ratio,
    paginationSpread,
    pagination,
    parameters,
    page,
    summary,
    size,
    project
  } = data;

  const { doAutoLayout, applyTemplate } = actions;

  const halfRenderSpainWidth = size.renderSpainWidth / 2;
  const isCover = summary.get('isCover');

  const pageWidth = page.get('width');
  const pageBleedLeft = page.getIn(['bleed', 'left']);
  const pageBleedRight = page.getIn(['bleed', 'right']);
  let eWidth = pageWidth / 2;
  const elements = paginationSpread.get('elements');

  const x = event.pageX;
  const y = event.pageY;

  const viewX = getViewX(x);

  // 判断鼠标释放点是在左侧还是右侧.
  let isDropInLeft = viewX <= eWidth * ratio.workspace;
  if (isCover) {
    const expandingOverFrontcover = project.getIn([
      'parameterMap',
      'spineExpanding',
      'expandingOverFrontcover'
    ]);
    eWidth =
      (pageWidth - pageBleedLeft - pageBleedRight - expandingOverFrontcover) /
      2;
    isDropInLeft = viewX <= eWidth * ratio.workspace - halfRenderSpainWidth;
  }

  const elementsProps = getTransferData(event);

  if (elementsProps.type !== dragTypes.template) {
    // 如果鼠标释放点在左侧区域
    if (isDropInLeft) {
      // 如果左侧区域已经存在元素
      if (checkIfHasElementInLimit(elements, [0, eWidth])) {
        return false;
      }
    } else {
      // 如果鼠标释放点在右侧区域
      // 如果右侧区域已经存在元素
      if (checkIfHasElementInLimit(elements, [eWidth, pageWidth])) {
        return false;
      }
    }
  }

  const index = pagination.pageIndex === 1 ? 0 : 1;

  if (elementsProps.length && !isCover) {
    // 判断鼠标释放时所在的page是否是当前活动的page
    // 如果不是, 就先切换到鼠标释放时所在的page.
    if (page && pagination.pageId !== page.get('id')) {
      // spine上不支持接受拖拽事件.
      if (page.get('type') !== pageTypes.spine) {
        switchPage(that, e, () => {
          const addedElements = addElements(that, elementsProps, x, y);
          doAutoLayout(addedElements);
        });
      }
    } else {
      const addedElements = addElements(that, elementsProps, x, y);
      doAutoLayout(addedElements);
    }
  } else if (elementsProps.length && isCover) {
    if (!isDropInLeft) {
      const image = elementsProps[0];
      const imageInfo = {
        id: image.encImgId,
        width: image.width,
        height: image.height
      };
      const addedElement = addCoverPhotoElement(that, imageInfo);
      doAutoLayout([addedElement]);
    }
  } else if (elementsProps.type === dragTypes.template) {
    if (page && pagination.pageId !== page.get('id')) {
      if (page.get('type') !== pageTypes.spine) {
        switchPage(that, e, () => {
          const { guid } = elementsProps;
          applyTemplate(guid);
        });
      }
    } else {
      const { guid } = elementsProps;
      applyTemplate(guid);
    }
  }

  that.setState({
    isDragOver: false
  });
  stopEvent(event);
};

export const changeCurrentElement = (that, currentPointPhotoElementId) => {
  that.setState({
    currentPointPhotoElementId
  });
};

export const checkIfHasElementInLimit = (elements, limit) => {
  return (
    !!elements.find(ele => {
      return (
        ele.get('x') + ele.get('width') / 2 >= limit[0] &&
        ele.get('x') + ele.get('width') / 2 < limit[1]
      );
    }) || false
  );
};
