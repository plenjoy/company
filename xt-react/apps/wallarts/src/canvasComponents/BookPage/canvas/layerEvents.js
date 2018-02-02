import { get } from 'lodash';
import { getIntersection } from '../../../utils/canvas/helper';
import * as elementEvents from './elementEvents';
import * as pageHandler from '../handler/page';
import { onEditText, onEditImage, onUploadImage } from '../handler/actionbarEvents';
import {
  elementTypes,
  pageTypes,
  dragTypes
} from '../../../constants/strings';
import { getTransferDataByNode } from '../../../../../common/utils/drag';



function getCanvasRelativePosition(containerRect, eventX, eventY, bookpageGroupOffset) {
  const x = eventX - containerRect.left - bookpageGroupOffset.left;
  const y = eventY - containerRect.top - bookpageGroupOffset.top;

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
export const addEventsToLayerOfElements = (that, nextProps) => {
  const { data, actions } = that.props;
  const { isPreview, page, ratio, size } = data;

  const { exchangeImageActions } = actions;
  const { onHoverBoxChange } = exchangeImageActions;

  const isSpinePage = page.get('type') === pageTypes.spine;

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
        const { elementArray, containerRect, bookpageGroupOffset } = that.state;
        const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY, bookpageGroupOffset);
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
      const { elementArray, containerRect, bookpageGroupOffset } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY, bookpageGroupOffset);

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
      const { elementArray, containerRect, bookpageGroupOffset } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY, bookpageGroupOffset);
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
                      //onUploadImage(that, element, ev);
                    }
                    break;
                  }
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
      if (__app.isExchangeImage && !isPreview) {
        handleDragOver(ev);
      }
    });

    container.addEventListener('mousewheel', (ev) => {
      handleMouseWheel(ev);
    });

    container.addEventListener('DOMMouseScroll', (ev) => {
      handleMouseWheel(ev);
    });

    container.addEventListener('drop', (ev) => {
      handleDrop(ev);
    });

    const handleDragOver = (ev) => {
       const renderContainerProps = get(that.props, 'data.size.renderContainerProps');
       const renderSheetSize = get(that.props, 'data.size.renderSheetSize');
       const renderSheetSizeWithoutBleed = get(that.props, 'data.size.renderSheetSizeWithoutBleed');

      ev.preventDefault();

      const { elementArray, containerRect, bookpageGroupOffset } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY, bookpageGroupOffset);
      const element = getElementFromPoint(
        container, elementArray, x, y, isSpinePage
      );

      if (element && __app.dragType !== dragTypes.template) {
        const dragData = getTransferDataByNode(ev, false);
        if (element.get('type') === elementTypes.text || dragData.elementId === element.get('id')) {
          onHoverBoxChange({
            isShowHoverBox: false
          });
          return;
        }
        const computed = element.get('computed');
        hoverBoxStyle = {
          left: `${computed.get('left') + computed.get('rectX') + renderSheetSize.left + renderContainerProps.x + renderSheetSizeWithoutBleed.left}px`,
          top: `${computed.get('top') + computed.get('rectY') + renderSheetSize.top + renderContainerProps.y + renderSheetSizeWithoutBleed.top}px`,
          width: `${computed.get('rectWidth')}px`,
          height: `${computed.get('rectHeight')}px`,
          transform: `rotate(${element.get('rot')}deg)`
        };
        if (__app.isExchangeImage) {
          onHoverBoxChange({
            isShowHoverBox: true,
            hoverBoxStyle
          });
        }
      } else if (__app.isExchangeImage) {
        onHoverBoxChange({
          isShowHoverBox: false
        });
      } else {
        hoverBoxStyle = {
          left: 0,
          top: 0,
          width: `${page.get('width') * ratio.workspace}px`,
          height: `${page.get('height') * ratio.workspace}px`
        };
        onHoverBoxChange({
          isShowHoverBox: false,
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

      const { elementArray, containerRect, bookpageGroupOffset } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY, bookpageGroupOffset);
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
                // that.reSelectElement(elementId);
              });
            }
            // 重置状态
            onHoverBoxChange({
              isShowHoverBox: false
            });
            delete __app.isExchangeImage;
          }
        }
      } else if (__app.dragType === dragTypes.template) { // 如果当前拖拽的模板
        pageHandler.onPageDroped(that, ev);
        delete __app.dragType;
      } else if (element) {
        if (element.get('type') === elementTypes.photo) {
          elementEvents.onDrop(that, element, ev);
          onHoverBoxChange({
            isShowHoverBox: false
          });
          boundTrackerActions.addTracker('DragPhotoToPage');
        }
      } else {
        // const enabled = page.get('enabled');
          // 如果页面为disable, 就不要添加任何事件.
        // if (!enabled) {
        //   return;
        // }
        // pageHandler.onPageDroped(that, ev);
        // boundTrackerActions.addTracker('DragPhotoToPage');
      }
    };

    const handleMouseWheel = (ev) => {
      ev.preventDefault();


      const { data, actions } = that.props;

      const { page } = data;
      const { boundProjectActions, boundTrackerActions } = actions;

      const pageId = page.get('id');

      const { elementArray, containerRect, bookpageGroupOffset } = that.state;
      const [x, y] = getCanvasRelativePosition(containerRect, ev.pageX, ev.pageY, bookpageGroupOffset);
      const element = getElementFromPoint(
        container, elementArray, x, y
      );

      // 如果当前为交换图片模式
      if (element) {
        if (element.get('type') === elementTypes.photo) {
          elementEvents.onMouseWheel(that, element, ev);
        }
      }
    };
  }
};
