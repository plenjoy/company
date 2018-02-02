import { backgroundTextElementName } from '../../../contants/canvas';
import { getIntersection, findElementData, findCameoElementData } from '../../../utils/canvas/helper';
import * as elementEvents from './elementEvents';
import * as pageHandler from '../handler/page';
import {
  elementTypes,
  pageTypes,
  shapeType,
  dragTypes,
  productTypes
} from '../../../contants/strings';
import { getTransferDataByNode } from '../../../../../common/utils/drag';

import { get } from 'lodash';

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
      } else {
        const clientRect = container.getBoundingClientRect();

        const ex = ev.pageX - clientRect.left;
        const ey = ev.pageY - clientRect.top;

        const shape = getIntersection(that, layerNode, ex, ey);
        const shapeId = shape ? shape.id() : '';
        let element = '';
        if (shapeId === shapeType.cameoElement ||
            (isCover && shapeId === shapeType.backgroundElement)) {
          element = findCameoElementData(that);
        } else {
          element = findElementData(that, shapeId);
        }
        if (that.elementControlsNode) {
          const { isDragging, isResizing, isRotating } = that.elementControlsNode;

          if (element && !isDragging && !isResizing && !isRotating) {
            elementEvents.selectElements(that, element, ev);
            ev.stopPropagation();
          }
        } else if (element) {
          elementEvents.selectElements(that, element, ev);
          ev.stopPropagation();
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

      const clientRect = container.getBoundingClientRect();

      const ex = ev.pageX - clientRect.left;
      const ey = ev.pageY - clientRect.top;

      const shape = getIntersection(that, layerNode, ex, ey);

      if (shape &&
        shape.id() !== shapeType.backgroundRect &&
        __app.dragType !== dragTypes.template) {
        const dragData = getTransferDataByNode(ev, false);
        const element = findElementData(that, shape.id());
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

      // 获取鼠标释放区域所在的元素.
      const clientRect = container.getBoundingClientRect();

      const ex = ev.pageX - clientRect.left;
      const ey = ev.pageY - clientRect.top;

      const shape = getIntersection(that, layerNode, ex, ey);

      const shapeId = shape ? shape.id() : '';

      // 如果当前为交换图片模式
      if (__app.isExchangeImage) {
        if (shapeId !== shapeType.backgroundRect &&
            shapeId !== shapeType.backgroundElement &&
            __app.dragType !== dragTypes.template) {
          const element = findElementData(that, shapeId);
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
      } else {
        // 2. 判断是不是cameoelement.
        if (
            shapeId === shapeType.cameoElement ||
            (isCover && shapeId === shapeType.backgroundElement)
          ) {
          const element = findCameoElementData(that);
          if (element) {
            elementEvents.onDrop(that, element, ev);
          } else {
            pageHandler.onPageDroped(that, ev);
          }
        } else {
          // 页面是否为enabled.
          const enabled = page.get('enabled');

          // 如果页面为disable, 就不要添加任何事件.
          if (!enabled) {
            return;
          }

          // a. 拖拽的layout
          if (shapeId === shapeType.backgroundRect ||
              shapeId === shapeType.backgroundElement ||
              __app.dragType === dragTypes.template) {
            pageHandler.onPageDroped(that, ev);
            delete __app.dragType;
          } else {
            // b. 拖拽的是图片.
            const element = findElementData(that, shapeId);

            if (element) {
              if (element.get('type') === elementTypes.photo) {
                elementEvents.onDrop(that, element, ev);
              } else {
                pageHandler.onPageDroped(that, ev);
              }
            }
          }
        }
      }
    };
  }
};
