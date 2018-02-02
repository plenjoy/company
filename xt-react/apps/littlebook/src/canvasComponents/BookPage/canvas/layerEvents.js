import { backgroundTextElementName } from '../../../contants/canvas';
import { getIntersection, findElementData, findCameoElementData } from '../../../utils/canvas/helper';
import * as elementEvents from './elementEvents';
import * as pageHandler from '../handler/page';
import { onEditText, onEditImage, onUploadImage } from '../handler/actionbarEvents';
import {
  elementTypes,
  pageTypes,
  shapeType,
  dragTypes,
  productTypes
} from '../../../contants/strings';
import { getTransferDataByNode } from '../../../../../common/utils/drag';

import { get } from 'lodash';


function getCanvasRelativePosition(containerRect, eventX, eventY) {
  const x = eventX - containerRect.left;
  const y = eventY - containerRect.top;

  return [x, y];
}


function getElementFromPoint(container, elementArray, x, y, isSpinePage) {
  let newElementArray = elementArray;
  // painted text的rot store里面角度为90 页面显示是0
  if (isSpinePage) {
    newElementArray = newElementArray.setIn([0, 'rot'], 0);
  }

  const element = getIntersection({ x, y }, newElementArray);

  return element;
}


/**
 * 给元素的layer添加事件.
 */
export const addEventsToLayerOfElements = (that) => {
  const { data } = that.props;
  const { isPreview, page, ratio, paginationSpread, settings, variables } = data;

  const productType = get(settings, 'spec.product');

  const isCover = paginationSpread.getIn(['summary', 'isCover']);

  const isShowCameo = variables && isCover && get(settings, 'spec.product') !== productTypes.PS ? variables.get('cameoSupportCondition') : false;

  const isSpinePage = page.get('type') === pageTypes.spine;

  // && (ele.get('type') == elementTypes.paintedText);

  const layerNode = that.layerNodeOfElements;

  if (that.stage) {
    // 得到真实的stage对象
    const stageElement = that.stage.getStage();
    const container = stageElement.getContainer();
    let hoverBoxStyle = {};

    container.addEventListener('dragover', (ev) => {
      handleDragOver(ev);
    });

    container.addEventListener('dragend', (ev) => {
      delete __app.dragType;
    });

    container.addEventListener('dragleave', (ev) => {
      pageHandler.onPageDragLeave(that, ev);
    });

    container.addEventListener('mouseup', (ev) => {
      if (__app.isExchangeImage) {
        handleDrop(ev);
      } else if (!that.isDraggingCreatePhotoFrame) {
        const { elementArray, containerRect } = that.state;
        const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY);
        const element = getElementFromPoint(
          container, elementArray, x, y, isSpinePage
        );

        if (that.elementControlsNode) {
          const { isDragging, isResizing, isRotating } = that.elementControlsNode;

          if (element && !isDragging && !isResizing && !isRotating && !ev.dragEndNode) {
            elementEvents.selectElements(that, element, ev);
            // ev.stopPropagation();
          }
        } else if (element && !ev.dragEndNode) {
          elementEvents.selectElements(that, element, ev);
          // ev.stopPropagation();
        }
      }
    });

    container.addEventListener('mousedown', (ev) => {
      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY);

      const element = getElementFromPoint(
        container, elementArray, x, y, isSpinePage
      );

      if (element) {
        ev.stopPropagation();
      } else {
        that.isDraggingCreatePhotoFrame = true;
        that.setState({
          draggingCreatePhotoFrame: {
            startPosition: { x, y }
          }
        });
      }
    });

    container.addEventListener('click', (ev) => {
      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY);
      const element = getElementFromPoint(
        container, elementArray, x, y, isSpinePage
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
                      // onEditImage(that, element, ev);
                    } else {
                      // onUploadImage(that, element, ev);
                    }
                    break;
                  }
                  case elementTypes.paintedText:
                  case elementTypes.text: {
                    // 事件移到相应的element上了.
                    // onEditText(that, element, ev);
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


    container.addEventListener('mousemove', (ev) => {
      if (__app.isExchangeImage) {
        handleDragOver(ev);
      }
    });

    container.addEventListener('drop', (ev) => {
      handleDrop(ev);
    });

    const handleDragOver = (ev) => {
      ev.preventDefault();

      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY);
      const element = getElementFromPoint(
        container, elementArray, x, y, isSpinePage
      );

      if (element &&
        __app.dragType !== dragTypes.template) {
        const dragData = getTransferDataByNode(ev, false);
        if (element) {
          if (element.get('type') === elementTypes.text || dragData.elementId === element.get('id')) {
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
          isDragOver: false,
          hoverBoxStyle
        });
      }
    };

    const handleDrop = (ev) => {
      ev.preventDefault();

      const { data, actions } = that.props;

      const { page } = data;
      const { boundProjectActions, boundTrackerActions } = actions;

      const pageId = page.get('id');

      const { elementArray, containerRect } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY);
      const element = getElementFromPoint(
        container, elementArray, x, y, isSpinePage
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
              boundProjectActions.swapPhotoElement(
                dragData.pageId, dragData.elementId,
                pageId, elementId
              ).then(() => {
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
      } else if (__app.dragType === dragTypes.template) { // 如果当前拖拽的模板
        pageHandler.onPageDroped(that, ev);
        delete __app.dragType;
      } else if (element) {
        if (element.get('type') === elementTypes.photo || element.get('type') === elementTypes.cameo) {
          elementEvents.onDrop(that, element, ev);
          boundTrackerActions.addTracker('DragPhotoToPage');
        }
      } else {
        const enabled = page.get('enabled');
          // 如果页面为disable, 就不要添加任何事件.
        if (!enabled) {
          return;
        }
        pageHandler.onPageDroped(that, ev);
        boundTrackerActions.addTracker('DragPhotoToPage');
      }
    };
  }
};
