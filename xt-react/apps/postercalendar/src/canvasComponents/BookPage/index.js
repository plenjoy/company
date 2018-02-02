import Immutable from 'immutable';
import { merge, get } from 'lodash';
import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';
import { Layer, Stage, Group, Rect, Text } from 'react-konva';

import { transform } from '../../../../common/utils/transform';
import projectParser from '../../../../common/utils/projectParser';

import {
  elementTypes,
  pageTypes,
  productTypes
} from '../../constants/strings';

// 默认设置.
import * as canvasOptions from '../../constants/canvas';

// 导入处理函数
import * as elementHandler from './handler/element';
import * as pageHandler from './handler/page';
import * as selectElementHandler from './handler/selectElement';

import * as actionbarEvents from './handler/actionbarEvents';
import * as autoLayoutHandler from './handler/autoLayout';

// canvas
import * as helperHandler from '../../utils/canvas/helper';
import * as layerEvents from './canvas/layerEvents';
import * as elementEvents from './canvas/elementEvents';
import { toDownload } from './canvas/downloadImage';

import ElementControls from '../ElementControls';

import PhotoElement from '../PhotoElement';
import TextElement from '../TextElement';
import CalendarElement from '../CalendarElement';

import SnackBar from '../../components/SnackBar';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';

import { findKonvaObjectById } from '../../utils/canvas/konvaSelector';

import './index.scss';

class BookPage extends Component {
  constructor(props) {
    super(props);

    // element的相关方法.
    this.computedElementOptions = (props, element, ratio, settings) => {
      return elementHandler.computedElementOptions(this, props, element, ratio, settings);
    };

    // autolayout
    this.doAutoLayout = addedElements =>
      autoLayoutHandler.doAutoLayout(this, addedElements);
    this.applyTemplate = guid => autoLayoutHandler.applyTemplate(this, guid);

    // canvas的渲染.
    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.toDownload = (elementArray, forceToDownload) =>
      toDownload(this, elementArray, forceToDownload);

    // layer events
    this.addEventsToLayerOfElements = () =>
      layerEvents.addEventsToLayerOfElements(this);
    this.createNewPhotoFrame = () => layerEvents.createNewPhotoFrame(this);
    this.setEndPosition = e => layerEvents.setEndPosition(this, e);

    this.onMouseUp = (element, e) => elementEvents.onMouseUp(this, element, e);
    this.onMouseEnter = (element, e) =>
      elementEvents.onMouseEnter(this, element, e);
    this.onMouseLeave = (element, e) =>
      elementEvents.onMouseLeave(this, element, e);
    this.onMouseOver = (elementGroupNode, element, e) =>
      elementEvents.onMouseOver(this, elementGroupNode, element, e);
    this.onMouseOut = (elementGroupNode, element, e) =>
      elementEvents.onMouseOut(this, elementGroupNode, element, e);
    this.onMouseMove = (element, e) =>
      elementEvents.onMouseMove(this, element, e);

    this.onClick = (element, e) => elementEvents.onClick(this, element, e);

    const self = this;

    this.stopEvent = event => pageHandler.stopEvent(event);
    this.changeCurrentElement = element =>
      pageHandler.changeCurrentElement(this, element);
    this.switchPage = e => pageHandler.switchPage(this, e);

    this.state = {
      elementArray: Immutable.List(),
      downloadData: Immutable.Map(),

      tooltip: {
        isShown: false,
        content: '',
        elementRect: {},
        containerHeight: 0
      },
      snackBar: {
        isShown: false,
        left: 0,
        bottom: 0,
        width: 0,
        templateId: 0
      },
      containerRect: null,
      isDragOver: false,
      hoverBoxStyle: {},
      controlRectRot: 0,
      isExchangeImage: false,
      exchangeImageThumbnail: null,
      exchangeThumbnailRect: {},

      draggingCreatePhotoFrame: {
        startPosition: { x: 0, y: 0 },
        endPosition: { x: 0, y: 0 }
      },

      originalPhotoLayer: {
        isShown: false,
        x: 0,
        y: 0,
        imageUrl: ''
      },
      hideSnackBarTimer: null,
      currentPointPhotoElementId: -1
    };

    this.onElementArrayChange = this.onElementArrayChange.bind(this);
    this.updateElement = this.updateElement.bind(this);

    this.clearHideSnackBarTimer = this.clearHideSnackBarTimer.bind(this);
    this.delayHideSnackBar = this.delayHideSnackBar.bind(this);

    this.updateOffset = this.updateOffset.bind(this);
    this.delayUpdateOffset = this.delayUpdateOffset.bind(this);

    this.submitElementArray = this.submitElementArray.bind(this);
    this.syncControlDegree = this.syncControlDegree.bind(this);
    this.checkTextElementOverflowPage = this.checkTextElementOverflowPage.bind(this);
    this.clearSelected = this.clearSelected.bind(this);

    this.actionbarActions = {
      onEditImage: (element) => {
        return actionbarEvents.onEditImage(this, element);
      },
      onRemoveImage: (element) => {
        return actionbarEvents.onRemoveImage(this, element);
      }
    };

    window.addEventListener('mousedown', this.clearSelected);
    window.addEventListener('mousemove', this.setEndPosition);
    window.addEventListener('mouseup', this.createNewPhotoFrame);
    window.addEventListener('resize', this.delayUpdateOffset);
    // document.addEventListener('keydown', this.onKeyDown);

    this.clicksObj = {
      num: 0,
      clickElementId: null
    };
  }

  componentWillMount() {
    pageHandler.componentWillMount(this);
  }

  componentDidMount() {
    this.toDownload(this.state.elementArray);

    // // 给元素的layer添加事件.
    this.addEventsToLayerOfElements();

    this.delayUpdateOffset();
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.clearSelected);
    window.removeEventListener('mousemove', this.setEndPosition);
    window.removeEventListener('mouseup', this.createNewPhotoFrame);
    window.removeEventListener('resize', this.delayUpdateOffset);
    // document.removeEventListener('keydown', this.onKeyDown);
  }

  updateOffset() {
    const { page, ratio, paginationSpread, size, parameters } = this.props.data;
    let containerRect = {};
    if (this.stage) {
      containerRect = this.stage
        .getStage()
        .getContainer()
        .getBoundingClientRect();
    }

    if (this.elementControlsNode) {
      this.elementControlsNode.needRedrawElementControlsRect();
    }

    this.setState({
      containerRect
    });
  }

  delayUpdateOffset() {
    clearTimeout(this.updateOffsetTimer);
    this.updateOffsetTimer = setTimeout(() => {
      this.updateOffset();
    }, 500);
  }

  clearSelected() {
    const { elementArray } = this.state;

    const newElementArray = elementArray.map((element) => {
      return element.set('isSelected', false);
    });

    if (!Immutable.is(elementArray, newElementArray)) {
      this.setState({
        elementArray: newElementArray
      });
    }
  }

  onKeyDown(event) {
    const ev = event || window.event;

    // 如果按下了ctrl键
    if (ev.ctrlKey) {
      switch (ev.keyCode) {
        // z
        case 90:
        // y
        case 89: {
          selectElementHandler.unSelectElements(this);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  syncControlDegree(controlRectRot) {
    this.setState({
      controlRectRot
    });
  }

  checkTextElementOverflowPage(element) {
    const { data } = this.props;
    const { page, size, summary, ratio } = data;

    let flag = false;

    if (this.unselectElements) {
      const elementNode = findKonvaObjectById(
        this.unselectElements,
        element.get('id')
      );

      if (elementNode) {
        const isCover = summary.get('isCover');
        const sheetSizeWithoutBleed = isCover
          ? size.renderCoverSheetSizeWithoutBleed
          : size.renderInnerSheetSizeWithoutBleed;

        const pageBleed = page.get('bleed');
        const startX = Math.floor(pageBleed.get('left') * ratio.workspace);
        const startY = Math.floor(pageBleed.get('top') * ratio.workspace);

        const elementGroupNode = elementNode.getParent();

        const rect = elementGroupNode.getClientRect();
        const x = Math.floor(rect.x);
        const y = Math.floor(rect.y);
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        if (
          x < startX ||
          y < startY ||
          x > sheetSizeWithoutBleed.width - width + startX ||
          y > sheetSizeWithoutBleed.height - height + startY
        ) {
          flag = true;
        }
      }
    }

    return flag;
  }

  getRenderHtml(elementArray) {
    const { data, t } = this.props;
    const {
      isPreview,
      page
    } = data;
    const pageId = page.get('id');
    const html = [];

    const { downloadData } = this.state;

    const sortedElementArray = helperHandler.sortElementsByZIndex(elementArray);

    const basicActions = {
      onMouseUp: this.onMouseUp,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onMouseOver: this.onMouseOver,
      onMouseOut: this.onMouseOut,
      onMouseMove: this.onMouseMove
    };

    // 如果页面上有元素.
    if (sortedElementArray && sortedElementArray.size) {
      sortedElementArray.forEach((element) => {
        const elementId = element.get('id');

        const theDownloadData = downloadData.get(elementId) || Immutable.Map();

        const isTextElementOverflowPage = this.checkTextElementOverflowPage(
          element
        );

        const textElementProps = {
          key: elementId,
          element,
          isPreview,
          actions: basicActions,
          imageObj: theDownloadData.get('imageObj'),
          downloadStatus: theDownloadData.get('downloadStatus'),
          isShowTextNotFit: theDownloadData.get('isShowTextNotFit'),
          isShowTextOverflow: isTextElementOverflowPage,
          tryToDownload: () => this.toDownload(Immutable.List([element]))
        };

        switch (element.get('type')) {
          case elementTypes.photo: {
            const forceToDownload = true;
            const photoElementProps = {
              key: elementId,
              element,
              isPreview,
              pageId,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              actions: merge({}, basicActions, {
                onElementArrayChange: this.onElementArrayChange,
                updateElement: this.updateElement,
                changeCurrentElement: this.changeCurrentElement
              }),
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload)
            };
            html.push(<PhotoElement {...photoElementProps} />);
            break;
          }
          case elementTypes.text: {
            if (isPreview && !element.get('text')) {
              return;
            }
            html.push(<TextElement {...textElementProps} />);

            break;
          }
          case elementTypes.calendar: {
            const calendarElementsProps = {
              key: elementId,
              element,
              isPreview,
              actions: {},
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              tryToDownload: () => this.toDownload(Immutable.List([element]))
            };
            html.push(<CalendarElement {...calendarElementsProps} />);
          }
          default:
            break;
        }
      });
    }

    return html;
  }

  submitElementArray(selectedElementArray, doingType) {
    const { data, actions } = this.props;
    const { ratio, page, paginationSpread } = data;
    const { boundProjectActions } = actions;

    const summary = paginationSpread.get('summary');
    const isSupportPaintedText = summary.get('isSupportPaintedText');
    const isCover = summary.get('isCover');

    const pageWidth = page.get('width') * ratio.workspace;
    const pageHeight = page.get('height') * ratio.workspace;

    const pageBleed = page.get('bleed');
    const bleedLeft = pageBleed.get('left') * ratio.workspace;
    const bleedRight = pageBleed.get('right') * ratio.workspace;
    const bleedTop = pageBleed.get('top') * ratio.workspace;
    const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

    const bottomEdge = pageHeight - bleedBottom;
    let rightEdge = pageWidth - bleedRight;

    const { x, y, width, height, degree } = this.elementControlsNode.state;

    const transformedRect = transform({ x, y, width, height }, degree);

    const minX = transformedRect.left;
    const minY = transformedRect.top;
    const maxX = transformedRect.left + transformedRect.width;
    const maxY = transformedRect.top + transformedRect.height;

    let updateObjectArray = Immutable.List();
    let needRedrawElementControlsRect = false;

    selectedElementArray.forEach((element) => {
      const computed = element.get('computed');
      const width = computed.get('width') / ratio.workspace;
      const height = computed.get('height') / ratio.workspace;
      const x = computed.get('left') / ratio.workspace;
      const y = computed.get('top') / ratio.workspace;

      let updateObject = Immutable.Map({
        id: element.get('id')
      });

      switch (doingType) {
        case 'move':
          updateObject = updateObject.merge({
            x,
            y
          });

          // if (
          //   element.get('type') === elementTypes.photo &&
          //   !element.get('rot')
          // ) {
          //   updateObject = this.clampBySafezone(
          //     updateObject.merge({
          //       width: element.get('width'),
          //       height: element.get('height')
          //     })
          //   );

          //   needRedrawElementControlsRect = true;
          // }
          break;
        case 'resize': {
          if (
            element.get('type') !== elementTypes.paintedText ||
            !isCover ||
            !isSupportPaintedText
          ) {
            updateObject = updateObject.merge({
              x,
              y,
              width,
              height
            });
            // if (
            //   element.get('type') === elementTypes.photo &&
            //   !element.get('rot')
            // ) {
            //   updateObject = this.clampBySafezone(updateObject);
            // }
          }
          break;
        }
        case 'rotate':
          if (
            element.get('type') !== elementTypes.paintedText ||
            !isCover ||
            !isSupportPaintedText
          ) {
            updateObject = updateObject.merge({
              rot: Math.round(element.get('rot')),
              x,
              y
            });
          }
          break;
        case 'editImage':
          updateObject = updateObject.merge({
            encImgId: element.get('encImgId')
          });
          break;
        default:
      }

      if (updateObject) {
        updateObjectArray = updateObjectArray.push(updateObject);
      }
    });

    if (updateObjectArray.size) {
      boundProjectActions.updateElements(updateObjectArray);

      if (needRedrawElementControlsRect) {
        this.elementControlsNode.needRedrawElementControlsRect();
      }
    }
  }

  onElementArrayChange(selectedElementArray, callback) {
    const { elementArray } = this.state;
    this.setState(
      {
        elementArray: elementArray.map((element) => {
          const elementId = element.get('id');
          const selectedElement = selectedElementArray.find((o) => {
            return o.get('id') === elementId;
          });

          if (selectedElement) {
            return selectedElement;
          }

          return element;
        })
      },
      () => {
        callback && callback();
      }
    );
  }

  updateElement(element) {
    const { actions } = this.props;
    const { boundProjectActions } = actions;
    delete element.computed;
    boundProjectActions.updateElement(element);
  }

  clearHideSnackBarTimer() {
    const { hideSnackBarTimer } = this.state;
    window.clearTimeout(hideSnackBarTimer);
  }

  delayHideSnackBar() {
    const hideSnackBarTimer = window.setTimeout(() => {
      this.state &&
      this.setState({
        snackBar: Object.assign({}, this.state.snackBar, {
          isShown: false
        })
      });
    }, 30);
    this.setState({
      hideSnackBarTimer
    });
  }

  renderBackgroundTextElement() {
    const { data, t } = this.props;
    const { isPreview, page, summary } = data;
    const pageEnabled = page.get('enabled');

    if (!isPreview) {
      // 没有元素时, 就添加一个提示文字.
      let text = pageEnabled ? t('ENABLED_BACKGROUND_TIP') : '';
      let color = canvasOptions.defaultTextColor;

      if (text) {
        const attrs = helperHandler.getBackgroundElementOptions(
          this,
          text,
          color
        );
        attrs.ref = (node) => {
          this.backgroundTextNode = node;
        };

        return <Text {...attrs} />;
      }
    }

    return null;
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  render() {
    const { data, actions, t } = this.props;
    const {
      isDragOver,
      hoverBoxStyle,
      controlRectRot,
      downloadData,
      isExchangeImage,
      exchangeThumbnailRect
    } = this.state;
    const {
      page,
      ratio,
      summary,
      settings,
      specData,
      isPreview,
      isBookCoverInnerWarp,
      innerEffectValue
    } = data;
    const { boundImagesActions } = actions;

    const pageEnabled = page.get('enabled');
    const pageId = page.get('id');
    const isCover = summary.get('isCover');
    const isActive = page.get('isActive');

    let isSpinePage = false;
    let isSpineText = false;

    // canvas样式.
    const bookPageClassName = classNames('book-page', {
      enabled: pageEnabled,
      disabled: !pageEnabled,

      cover: isCover,
      inner: !isCover
    });

    const canvasSize = {
      width: Math.round(page.get('width') * ratio.workspace),
      height: Math.round(page.get('height') * ratio.workspace)
    };

    const {
      elementArray,
      containerRect,
      tooltip,
      snackBar,
      draggingCreatePhotoFrame,
      originalPhotoLayer,
      currentPointPhotoElementId
    } = this.state;

    let selectedElementArray = Immutable.List();
    let unselectedElementArray = Immutable.List();
    elementArray.forEach((element) => {
      if (element.get('isSelected')) {
        selectedElementArray = selectedElementArray.push(element);
      } else {
        unselectedElementArray = unselectedElementArray.push(element);
      }
    });

    const newCurrentPointPhotoElement = elementArray.find((element) => {
      return element.get('id') === currentPointPhotoElementId;
    });

    let renderElementArray = elementArray;
    let isShowFakeElements = false;

    if (this.elementControlsNode) {
      if (this.elementControlsNode.isRotating) {
        renderElementArray = unselectedElementArray;
        isShowFakeElements = true;
      }
    }

    let exchangeImageThumbnail = null;
    let element = null;
    let elementId = -1;
    if (selectedElementArray.size === 1) {
      element = selectedElementArray.get(0);
      elementId = element.get('id');
    }
    if (
      selectedElementArray.size &&
      selectedElementArray.getIn([0, 'encImgId'])
    ) {
      exchangeImageThumbnail = downloadData.getIn([elementId, 'imageObj']);
    }
    const theDownloadData = downloadData.get(elementId) || Immutable.Map();
    // const isTextElementOverflowPage =
    //   element && this.checkTextElementOverflowPage(element);

    const hoverBoxClass = classNames('box', {
      hover: isDragOver && page.get('type') !== pageTypes.spine
    });

    const isShowActionBar = Boolean(selectedElementArray.size);
    const isTextElementOverflowPage =
      element && this.checkTextElementOverflowPage(element);

    const stageProps = {
      ref: stage => (this.stage = stage),
      width: canvasSize.width,
      height: canvasSize.height,
      className: bookPageClassName,
      onMouseDown: this.switchPage
    };

    const elementControlsProps = {
      selectedElementArray,
      containerRect,
      ratio,
      submitElementArray: this.submitElementArray,
      onElementArrayChange: this.onElementArrayChange,
      minContainerWidth: Math.floor(360 * ratio.workspace),
      selectedElements: this.selectedElements,
      showGuideLineIfNear: this.showGuideLineIfNear,
      hideAllGuideLines: this.hideAllGuideLines,
      snapToGuideLine: this.snapToGuideLine,
      syncControlDegree: this.syncControlDegree,
      actionbarActions: this.actionbarActions,
      restrictResize: this.restrictResize,
      checkSpineEdge: this.checkSpineEdge,
      onExchangeDragStart: (e) => {
        this.onExchangeDragStart(pageId, elementId, exchangeImageThumbnail, e);
      },
      onExchangeDragMove: this.onExchangeDragMove,
      onExchangeDragEnd: this.onExchangeDragEnd,
      ref: node => (this.elementControlsNode = node),
      isShowTextNotFit: theDownloadData.get('isShowTextNotFit'),
      isShowTextOverflow: isTextElementOverflowPage,
      downloadStatus: theDownloadData.get('downloadStatus'),
      toDownload: this.toDownload,
      clicksObj: this.clicksObj
    };

    if (actions.activePage) {
      stageProps.onMouseUp = this.activePage;
    }

    const isShowEdit =
      newCurrentPointPhotoElement &&
      newCurrentPointPhotoElement.get('encImgId');

    const snackBarProps = {
      ...snackBar,
      isShowEdit,
      isShowDelete: isShowEdit,
      actions: {
        onMouseEnter: this.clearHideSnackBarTimer,
        onMouseLeave: this.delayHideSnackBar,
        onEditImage: () => {
          this.actionbarActions.onEditImage(newCurrentPointPhotoElement);
        },
        onSwitchLayout: this.actionbarActions.onSwitchLayout,
        onDelete: () => {
          this.actionbarActions.onRemoveImage(newCurrentPointPhotoElement);
        }
      },
      element: newCurrentPointPhotoElement
    };

    const { startPosition, endPosition } = draggingCreatePhotoFrame;
    const dragCreatePhotoFrameRect = {
      fill: '#f6f6f6',
      stroke: '#dfdfdf',
      strokeWidth: 1
    };

    if (startPosition && endPosition) {
      dragCreatePhotoFrameRect.x = startPosition.x;
      dragCreatePhotoFrameRect.y = startPosition.y;
      dragCreatePhotoFrameRect.width = endPosition.x - startPosition.x;
      dragCreatePhotoFrameRect.height = endPosition.y - startPosition.y;
    }

    return (
      <div className="stage-container">
        <Stage {...stageProps}>
          <Layer ref={layer => (this.layerNodeOfElements = layer)}>

            <Group ref={group => (this.unselectElements = group)}>
              {this.getRenderHtml(renderElementArray)}
            </Group>
            <Group
              ref={group => (this.selectedElements = group)}
              visible={isShowFakeElements}
            >
              {this.getRenderHtml(selectedElementArray) }
            </Group>

            {!elementArray.size ? this.renderBackgroundTextElement() : null}
            {/* 禁用图片框的 resize 和 拖动功能 */}
            {/* pageEnabled
              ? <ElementControls {...elementControlsProps} />
              : null */}

          </Layer>
        </Stage>
        {pageEnabled
          ? <XFileUpload
            className="hide"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={this.toggleModal}
            ref={fileUpload => (this.fileUpload = fileUpload)}
          />
          : null}
        {newCurrentPointPhotoElement ? <SnackBar {...snackBarProps} /> : null}
      </div>
    );
  }
}

BookPage.propTypes = {};

BookPage.defaultProps = {};

export default translate('BookPage')(BookPage);
