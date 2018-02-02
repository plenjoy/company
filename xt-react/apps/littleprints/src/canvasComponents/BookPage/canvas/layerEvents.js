import { get, max, merge } from 'lodash';
import { backgroundTextElementName } from '../../../constants/canvas';
import {
  getIntersection,
  findElementData,
  setSpineMaxDep
} from '../../../utils/canvas/helper';
import * as elementEvents from './elementEvents';
import * as pageHandler from '../handler/page';
import {
  onEditText,
  onEditImage,
  onUploadImage
} from '../handler/actionbarEvents';
import {
  elementTypes,
  pageTypes,
  shapeType,
  dragTypes,
  productTypes,
  defaultBorder
} from '../../../constants/strings';
import { getTransferDataByNode } from '../../../../../common/utils/drag';
import Element from '../../../utils/entries/element';

function getCanvasRelativePosition(containerRect, eventX, eventY) {
  const x = eventX - containerRect.left;
  const y = eventY - containerRect.top;

  return [x, y];
}

function getElementFromPoint(container, elementArray, x, y, isSpinePage) {
  let newElementArray = elementArray;
  newElementArray = setSpineMaxDep(elementArray);
  // painted text的rot store里面角度为90 页面显示是0
  if (isSpinePage) {
    newElementArray = newElementArray.setIn([0, 'rot'], 0);
  }

  const element = getIntersection({ x, y }, newElementArray);

  return element;
}

export function createNewPhotoFrame(that) {
  if (that.isDraggingCreatePhotoFrame) {
    that.isDraggingCreatePhotoFrame = false;

    const { draggingCreatePhotoFrame } = that.state;
    const { startPosition, endPosition } = draggingCreatePhotoFrame;

    if (startPosition && endPosition) {
      const frameWidth = Math.abs(endPosition.x - startPosition.x);
      const frameHeight = Math.abs(endPosition.y - startPosition.y);
      const frameX =
        endPosition.x > startPosition.x ? startPosition.x : endPosition.x;
      const frameY =
        endPosition.y > startPosition.y ? startPosition.y : endPosition.y;
      that.forceUpdate();

      if (frameWidth && frameHeight) {
        const { actions, data } = that.props;
        const { page, ratio, settings } = data;
        const { boundProjectActions } = actions;

        const MIN_FRAME_WIDTH = Math.round(150 * ratio.workspace);
        const MIN_FRAME_HEIGHT = Math.round(150 * ratio.workspace);

        if (frameWidth < MIN_FRAME_WIDTH || frameHeight < MIN_FRAME_HEIGHT) {
          return;
        }

        const maxDepElement = page.get('elements').maxBy((element) => {
          return element.get('dep');
        });

        const elementX = frameX / ratio.workspace;
        const elementY = frameY / ratio.workspace;
        const elementWidth = frameWidth / ratio.workspace;
        const elementHeight = frameHeight / ratio.workspace;

        const newElement = new Element({
          type: elementTypes.photo,
          x: elementX,
          y: elementY,
          width: elementWidth,
          height: elementHeight,
          px: elementX / page.get('width'),
          py: elementY / page.get('height'),
          pw: elementWidth / page.get('width'),
          ph: elementHeight / page.get('height'),
          dep: maxDepElement ? maxDepElement.get('dep') + 1 : 0,

          border: merge({}, defaultBorder)
        });

        // boundProjectActions.createElement(Object.assign({}, newElement));
      }
    }
  }
}

export function setEndPosition(that, ev) {
  if (that.isDraggingCreatePhotoFrame) {
    const { containerRect } = that.state;
    const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY);
    that.setState({
      draggingCreatePhotoFrame: Object.assign(
        {},
        that.state.draggingCreatePhotoFrame,
        {
          endPosition: { x, y }
        }
      )
    });
  }
}

/**
 * 给元素的layer添加事件.
 */
export const addEventsToLayerOfElements = (that) => {
  const { data } = that.props;
  const { capability, page, paginationSpread, settings, variables } = data;

  const productType = get(settings, 'spec.product');

  const isCover = paginationSpread.getIn(['summary', 'isCover']);

  // && (ele.get('type') == elementTypes.paintedText);

  const layerNode = that.layerNodeOfElements;

  if (that.stage) {
    // 得到真实的stage对象
    const stageElement = that.stage.getStage();
    const container = stageElement.getContainer();
    let hoverBoxStyle = {};

    container.addEventListener('dragover', (ev) => {
      if (capability.get('canDropImageInPage')) {
        handleDragOver(ev);
      }
    });

    container.addEventListener('dragend', (ev) => {
      delete __app.dragType;
    });

    container.addEventListener('dragleave', (ev) => {
      pageHandler.onPageDragLeave(that, ev);
    });

    container.addEventListener('mouseup', (ev) => {
      // 1. resize时, 如果鼠标释放的位置不在当前元素上时,
      // onResizeStop不会被触发, 导致isResizing标识状态不会被更新.
      if (__app.isResizing) {
        __app.isResizing = false;
        that.isResizeMouseUp = true;
        return;
      }

      // 2. 和resizing同理.
      if (__app.isMoved) {
        __app.isMoved = false;
        return;
      }

      if (__app.isExchangeImage) {
        handleDrop(ev);
      } else if (
        !that.isDraggingCreatePhotoFrame &&
        capability.get('canSelectElement')
      ) {
        const { elementArray, containerRect } = that.state;
        const [x, y] = getCanvasRelativePosition(
          containerRect,
          ev.pageX,
          ev.pageY
        );
        const element = getElementFromPoint(
          container,
          elementArray,
          x,
          y
        );

        if (that.elementControlsNode) {
          const {
            isDragging,
            isRotating
          } = that.elementControlsNode;

          if (
            element &&
            !isRotating
          ) {
            elementEvents.selectElements(that, element, ev);
            ev.stopPropagation();
          }
        } else if (element && !ev.dragEndNode) {
          elementEvents.selectElements(that, element, ev);
          ev.stopPropagation();
        }
      }
    });

    container.addEventListener('mousedown', (ev) => {
      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(
        containerRect,
        ev.pageX,
        ev.pageY
      );

      const element = getElementFromPoint(
        container,
        elementArray,
        x,
        y
      );

      if (element) {
        ev.stopPropagation();
      } else if (page.get('enabled') && capability.get('canCreateElement')) {
        that.isDraggingCreatePhotoFrame = true;
        that.setState({
          draggingCreatePhotoFrame: {
            startPosition: { x, y }
          }
        });
      }
    });

    container.addEventListener('click', (ev) => {
      if (that.isResizeMouseUp) {
        that.isResizeMouseUp = false;
        return;
      }

      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(
        containerRect,
        ev.pageX,
        ev.pageY
      );
      const element = getElementFromPoint(
        container,
        elementArray,
        x,
        y
      );

      if (element) {
        that.clicksObj.num += 1;

        const elementId = element.get('id');

        if (that.clicksObj.num === 1) {
          window.setTimeout(() => {
            if (that.clicksObj.num === 1) {
              // single click
              that.clicksObj.clickElementId = elementId;
            } else {
              // double click
              if (elementId === that.clicksObj.clickElementId) {
                switch (element.get('type')) {
                  case elementTypes.photo: {
                    const hasImage = Boolean(element.get('encImgId'));
                    if (hasImage) {
                      onEditImage(that, element, ev);
                    } else {
                      // 和产品确认, 在空的图片框中, 不需要支持上传图片的功能
                      // onUploadImage(that, element, ev);
                    }
                    break;
                  }
                  case elementTypes.paintedText:
                  case elementTypes.text: {
                    onEditText(that, element, ev);
                    break;
                  }
                  default:
                }
              }
            }
            that.clicksObj.num = 0;
          }, 300);
        }
      }
    });

    const setEndPosition = (ev) => {};

    const createNewPhotoFrame = (ev) => {};

    window.addEventListener('mousemove', setEndPosition);
    window.addEventListener('mouseup', createNewPhotoFrame);

    container.addEventListener('mousemove', (ev) => {
      if (__app.isExchangeImage && capability.get('canDropImageInPage')) {
        handleDragOver(ev);
      }
    });

    container.addEventListener('drop', (ev) => {
      if (capability.get('canDropImageInPage')) {
        handleDrop(ev);
      }
    });

    const handleDragOver = (ev) => {
      // 实时获取ratio
      const ratio = get(that.props.data, 'ratio');

      ev.preventDefault();

      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(
        containerRect,
        ev.pageX,
        ev.pageY
      );
      const element = getElementFromPoint(
        container,
        elementArray,
        x,
        y
      );

      if (element && __app.dragType !== dragTypes.template) {
        const dragData = getTransferDataByNode(ev, false);
        if (element) {
          if (
            element.get('type') === elementTypes.text ||
            dragData.elementId === element.get('id')
          ) {
            that.setState({
              isDragOver: false
            });
            return;
          }

          const computed = element.get('computed');
          hoverBoxStyle = {
            left: `${computed.get('left')}px`,
            top: `${computed.get('top')}px`,
            width: `${computed.get('width')}px`,
            height: `${computed.get('height')}px`,
            transform: `rotate(${element.get('rot')}deg)`
          };

          that.setState({
            isDragOver: true,
            hoverBoxStyle
          });
        }
      } else if (__app.isExchangeImage) {
        that.setState({
          isDragOver: false
        });
      } else {
        hoverBoxStyle = {
          left: 0,
          top: 0,
          width: `${page.get('width') * ratio.workspace}px`,
          height: `${page.get('height') * ratio.workspace}px`
        };
        that.setState({
          isDragOver: true,
          hoverBoxStyle
        });
      }
    };

    const handleDrop = (ev) => {
      ev.preventDefault();

      const { data, actions } = that.props;

      const { page } = data;
      const { boundProjectActions } = actions;

      const pageId = page.get('id');

      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(
        containerRect,
        ev.pageX,
        ev.pageY
      );
      const element = getElementFromPoint(
        container,
        elementArray,
        x,
        y
      );

      // 如果当前为交换图片模式
      if (__app.isExchangeImage) {
        if (__app.dragType !== dragTypes.template) {
          // 只在当前元素为photoelement
          if (element && element.get('type') === elementTypes.photo) {
            const elementId = element.get('id');
            const dragData = getTransferDataByNode();
            if (dragData.elementId && dragData.elementId !== elementId) {
              // 交换图片
              boundProjectActions
                .swapPhotoElement(
                  dragData.pageId,
                  dragData.elementId,
                  pageId,
                  elementId
                )
                .then(() => {
                  // 设置目标元素未选中状态
                  that.reSelectElement(elementId);
                });
            }
            // 重置状态
            that.setState({
              isDragOver: false,
              isExchangeImage: false
            });
            delete __app.isExchangeImage;
          }
        }
      } else if (__app.dragType === dragTypes.template) {
        // 如果当前拖拽的模板
        pageHandler.onPageDroped(that, ev);
        delete __app.dragType;
      } else if (element) {
        if (
          element.get('type') === elementTypes.photo ||
          element.get('type') === elementTypes.cameo
        ) {
          elementEvents.onDrop(that, element, ev);
        }
      } else {
        const enabled = page.get('enabled');
        // 如果页面为disable, 就不要添加任何事件.
        if (!enabled) {
          return;
        }
        pageHandler.onPageDroped(that, ev);
      }
    };
  }
};
