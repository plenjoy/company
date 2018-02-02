import React, { Component } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import Immutable, { fromJS } from 'immutable';
import classNames from 'classnames';
import { Layer, Stage, Group, Rect, Text } from 'react-konva';

import { getResizeEventType } from '../../../../common/utils/mobile';
import { transform } from '../../../../common/utils/transform';
import projectParser from '../../../../common/utils/projectParser';

import {
  elementTypes,
  pageTypes,
  shapeType,
  cameoShapeTypes,
  cameoSizeTypes,
  productTypes,
  coverTypes
} from '../../contants/strings';

// 默认设置.
import * as canvasOptions from '../../contants/canvas';

// 导入处理函数
import * as elementHandler from './handler/element';
import * as pageHandler from './handler/page';
import * as guideLineHandler from './handler/guideLines';
import * as cameoHandler from './handler/cameo';
import * as selectElementHandler from './handler/selectElement';
import * as safezoneHandler from './handler/safeZone';

import * as actionbarEvents from './handler/actionbarEvents';
import * as autoLayoutHandler from './handler/autoLayout';
import { KeyboardEventsFactory } from './handler/keyboardEvents';

// canvas
import * as helperHandler from '../../utils/canvas/helper';
import * as layerEvents from './canvas/layerEvents';
import * as elementEvents from './canvas/elementEvents';
import { toDownload } from './canvas/downloadImage';

import ElementControls from '../ElementControls';

import MultipleActionBar from '../../components/MultipleActionBar';
import PhotoActionBar from '../../components/PhotoActionBar';
import TextActionBar from '../../components/TextActionBar';
import CameoActionBar from '../../components/CameoActionBar';
import StickerActionBar from '../../components/StickerActionBar';
import BackgroundActionBar from '../../components/BackgroundActionBar';

import ExchangeThumbnail from '../../components/ExchangeThumbnail';

import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';

import PhotoElement from '../PhotoElement';
import StickerElement from '../StickerElement';
import TextElement from '../TextElement';
import CameoElement from '../CameoElement';
import SpineTextElement from '../SpineTextElement';
import BackgroundElement from '../BackgroundElement/';

import Tooltip from '../Tooltip';

import OriginalPhotoLayer from '../../components/OriginalPhotoLayer';

import { findKonvaObjectById } from '../../utils/canvas/konvaSelector';
import { getNewCropByBase } from '../../utils/crop';

const DEVIATION = 0.003;

import './index.scss';

class BookPage extends Component {
  constructor(props) {
    super(props);

    // element的相关方法.
    this.computedElementOptions = (props, element, ratio) =>
      elementHandler.computedElementOptions(this, props, element, ratio);

    this.failTryToDownload = () => {
      elementHandler.failTryToDownload(this);
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
    this.onMouseOver = (elementGroupNode, e) =>
      elementEvents.onMouseOver(this, elementGroupNode, e);
    this.onMouseOut = (elementGroupNode, e) =>
      elementEvents.onMouseOut(this, elementGroupNode, e);
    this.onMouseMove = (element, e) =>
      elementEvents.onMouseMove(this, element, e);
    this.onClick = (element, e) => elementEvents.onClick(this, element, e);

    this.onExchangeDragStart = (pageId, elementId, imageObj, e) =>
      elementEvents.onExchangeDragStart(this, pageId, elementId, imageObj, e);
    this.onExchangeDragMove = e => elementEvents.onExchangeDragMove(this, e);
    this.onExchangeDragEnd = e => elementEvents.onExchangeDragEnd(this, e);

    this.switchPage = e => pageHandler.switchPage(this, e);
    this.activePage = e => pageHandler.activePage(this, e);

    const self = this;
    // 右键菜单的点击事件
    this.actionbarActions = {
      onEditImage: element => actionbarEvents.onEditImage(this, element),
      onRotateImage: element => actionbarEvents.onRotateImage(this, element),
      onFlipImage: element => actionbarEvents.onFlipImage(this, element),
      onExpandToFullSheet: element => {
        actionbarEvents.onExpandToFullSheet(this, element);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onExpandToLeftPage: element => {
        actionbarEvents.onExpandToLeftPage(this, element);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onExpandToRightPage: element => {
        actionbarEvents.onExpandToRightPage(this, element);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onFilter: element => actionbarEvents.onFilter(this, element),
      onRemoveImage: element => actionbarEvents.onRemoveImage(this, element),
      onUploadImage: element => actionbarEvents.onUploadImage(this, element),
      onBringToFront: element => actionbarEvents.onBringToFront(this, element),
      onSendToback: element => actionbarEvents.onSendToback(this, element),
      onBringForward: element => actionbarEvents.onBringForward(this, element),
      onSendBackward: element => actionbarEvents.onSendBackward(this, element),
      onEditText: element => actionbarEvents.onEditText(this, element),
      onFitFrameToImage: element => {
        actionbarEvents.onFitFrameToImage(this, element);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onAlignLeft: selectedElementArray => {
        actionbarEvents.onAlignLeft(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onAlignCenter: selectedElementArray => {
        actionbarEvents.onAlignCenter(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onAlignRight: selectedElementArray => {
        actionbarEvents.onAlignRight(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onAlignTop: selectedElementArray => {
        actionbarEvents.onAlignTop(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onAlignMiddle: selectedElementArray => {
        actionbarEvents.onAlignMiddle(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onAlignBottom: selectedElementArray => {
        actionbarEvents.onAlignBottom(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onSpaceHorizontal: selectedElementArray => {
        actionbarEvents.onSpaceHorizontal(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onSpaceVertical: selectedElementArray => {
        actionbarEvents.onSpaceVertical(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onClearAll: selectedElementArray => {
        actionbarEvents.onClearAll(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onMatchWidestWidth: selectedElementArray => {
        actionbarEvents.onMatchWidestWidth(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onMatchNarrowestWidth: selectedElementArray => {
        actionbarEvents.onMatchNarrowestWidth(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onMatchTallestHeight: selectedElementArray => {
        actionbarEvents.onMatchTallestHeight(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onMatchShortestHeight: selectedElementArray => {
        actionbarEvents.onMatchShortestHeight(this, selectedElementArray);
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onMatchFirstSelectWidthAndHeight: selectedElementArray => {
        actionbarEvents.onMatchFirstSelectWidthAndHeight(
          this,
          selectedElementArray
        );
        self.elementControlsNode.needRedrawElementControlsRect();
      },
      onCrop: element => {
        cameoHandler.onCrop(this, element);
      },
      onRotate: element => {
        cameoHandler.onRotate(this, element);
      },
      onFlip: element => {
        cameoHandler.onFlip(this, element);
      },
      onRect: element => {
        cameoHandler.onRect(this, element);
      },
      onRound: element => {
        cameoHandler.onRound(this, element);
      },
      onSmall: element => {
        cameoHandler.onSmall(this, element);
      },
      onMedium: element => {
        cameoHandler.onMedium(this, element);
      },
      onLarge: element => {
        cameoHandler.onLarge(this, element);
      },
      onClear: element => {
        cameoHandler.onClear(this, element);
      }
    };

    this.toggleModal = (type, status) =>
      actionbarEvents.toggleModal(this, type, status);

    this.renderGuideLines = () => {
      return guideLineHandler.renderGuideLines(this);
    };
    this.renderBleedGuideLines = () => {
      const capability = get(this.props, 'data.capability');
      const isAdvancedMode = capability
        ? capability.get('isAdvancedMode')
        : false;
      if (!isAdvancedMode) {
        return guideLineHandler.renderBleedGuideLines(this);
      }

      return null;
    };
    this.showGuideLineIfNear = () => guideLineHandler.showGuideLineIfNear(this);
    this.hideAllGuideLines = () => guideLineHandler.hideAllGuideLines(this);
    this.snapToGuideLine = params =>
      guideLineHandler.snapToGuideLine(this, params);
    this.restrictResize = params =>
      guideLineHandler.restrictResize(this, params);

    this.reSelectElement = elementId =>
      selectElementHandler.reSelectElement(this, elementId);
    this.unSelectElements = () => selectElementHandler.unSelectElements(this);

    this.stopEvent = event => pageHandler.stopEvent(event);

    this.clampBySafezone = element =>
      safezoneHandler.clampBySafezone(this, element);

    this.state = {
      elementArray: Immutable.List(),
      downloadData: Immutable.Map(),

      staticGuideLines: [],
      dynamicGuideLines: [],
      tooltip: {
        isShown: false,
        content: '',
        elementRect: {},
        containerHeight: 0
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
      }
    };

    this.onElementArrayChange = this.onElementArrayChange.bind(this);
    this.submitElementArray = this.submitElementArray.bind(this);
    this.syncControlDegree = this.syncControlDegree.bind(this);
    this.isInTypes = this.isInTypes.bind(this);
    this.checkTextElementOverflowPage = this.checkTextElementOverflowPage.bind(
      this
    );
    this.clearSelected = this.clearSelected.bind(this);
    this.delayUpdateOffset = this.delayUpdateOffset.bind(this);

    window.addEventListener('mousedown', this.clearSelected);
    window.addEventListener('mousemove', this.setEndPosition);
    window.addEventListener('mouseup', this.createNewPhotoFrame);

    const resizeEventType = getResizeEventType();
    window.addEventListener(resizeEventType, this.delayUpdateOffset);

    this.clicksObj = {
      num: 0,
      clickElementId: null
    };

    if (this.props.data.page.get('type') !== pageTypes.spine) {
      this.keyboardEvents = new KeyboardEventsFactory(this);
      window.addEventListener('keydown', this.keyboardEvents.onKeyDown);
      window.addEventListener('keyup', this.keyboardEvents.onKeyUp);
    }
  }

  componentWillMount() {
    pageHandler.componentWillMount(this);
  }

  componentDidMount() {
    this.toDownload(this.state.elementArray);

    // 给元素的layer添加事件.
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

    const resizeEventType = getResizeEventType();
    window.removeEventListener(resizeEventType, this.delayUpdateOffset);

    if (this.props.data.page.get('type') !== pageTypes.spine) {
      window.removeEventListener('keydown', this.keyboardEvents.onKeyDown);
      window.removeEventListener('keyup', this.keyboardEvents.onKeyUp);
    }
  }

  updateOffset() {
    const { page, ratio, paginationSpread, size, parameters } = this.props.data;
    const staticGuideLines = guideLineHandler.covertStaticGuideLines(
      this,
      page,
      ratio,
      paginationSpread,
      size,
      parameters
    );
    let containerRect = {};
    if (this.stage) {
      containerRect = this.stage
        .getStage()
        .getContainer()
        .getBoundingClientRect();
    }

    this.setState(
      {
        staticGuideLines,
        containerRect
      },
      () => {
        if (this.elementControlsNode) {
          this.elementControlsNode.redrawElementControlsRect();
        }
      }
    );
  }

  delayUpdateOffset() {
    clearTimeout(this.updateOffsetTimer);
    this.updateOffsetTimer = setTimeout(() => {
      this.updateOffset();
    }, 500);
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
      page,
      summary,
      ratio,
      settings,
      parameters,
      paginationSpread,
      isBookCoverInnerWarp,
      materials
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
      sortedElementArray.forEach(element => {
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
              ref: node => (this.selectedPhotoElement = node),
              actions: basicActions,
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload),
              isBookCoverInnerWarp,
              ratio
            };
            html.push(<PhotoElement {...photoElementProps} />);
            break;
          }

          case elementTypes.sticker: {
            const forceToDownload = true;
            const stickerElementProps = {
              key: elementId,
              element,
              isPreview,
              pageId,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              actions: basicActions,
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload),
              isBookCoverInnerWarp
            };
            html.push(<StickerElement {...stickerElementProps} />);
            break;
          }

          case elementTypes.background: {
            const forceToDownload = true;
            const BackgroundElementProps = {
              key: elementId,
              element,
              isPreview,
              pageId,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              actions: basicActions,
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload),
              isBookCoverInnerWarp
            };
            html.push(<BackgroundElement {...BackgroundElementProps} />);
            break;
          }

          case elementTypes.text: {
            // 如果是spine不渲染任何text
            if (page.get('type') === pageTypes.spine) {
              return;
            }
            if (isPreview && !element.get('text')) {
              return;
            }

            if (element.get('isSpineText')) {
              html.push(<SpineTextElement {...textElementProps} />);
            } else {
              // isBookCoverInnerWarp 不渲染文字
              if (!isBookCoverInnerWarp) {
                html.push(<TextElement {...textElementProps} />);
              }
            }

            break;
          }
          case elementTypes.cameo: {
            const cameoElementsProps = {
              key: elementId,
              element,
              isPreview,
              summary,
              ratio,
              settings,
              parameters,
              paginationSpread,
              materials,
              actions: {
                onMouseUp: this.onMouseUp
              }
            };
            html.push(<CameoElement {...cameoElementsProps} />);
            break;
          }
          case elementTypes.paintedText: {
            // 在预览模式下, 要过滤空的文本框.
            if (isPreview && !element.get('text')) {
              return null;
            }
            if (page.get('type') === pageTypes.spine) {
              html.push(<SpineTextElement {...textElementProps} />);
            } else {
              html.push(<TextElement {...textElementProps} />);
            }
            break;
          }
          default:
        }
      });
    }

    return html;
  }

  renderBackgroundTextElement() {
    const { data, t } = this.props;
    const { isPreview, page, summary } = data;
    const isSpinePage = page.get('type') === pageTypes.spine;
    const pageEnabled = page.get('enabled');
    const isPressBook = summary.get('isPressBook');
    const isCover = summary.get('isCover');

    if (!isPreview && !isSpinePage) {
      // 只有不是preview, 并且也不是spine的情况下, 才加上默认的提示语.

      // 没有元素时, 就添加一个提示文字.
      let text = pageEnabled ? t('ENABLED_BACKGROUND_TIP') : '';
      let color = canvasOptions.defaultTextColor;

      // 如果是pressbook, 并且page为disable并且是内页. 那么就直接添加一个默认的提示元素.
      if (isPressBook && !pageEnabled && !isCover) {
        text = t('DISABLED_BACKGROUND_TIP');
        color = '#b7b7b7';
      }

      if (text) {
        const attrs = helperHandler.getBackgroundElementOptions(
          this,
          text,
          color
        );
        attrs.ref = node => {
          this.backgroundTextNode = node;
        };

        return <Text {...attrs} />;
      }
    }

    return null;
  }

  submitElementArray(selectedElementArray, doingType) {
    const { data, actions } = this.props;
    const { ratio, page, paginationSpread, capability } = data;
    const { boundProjectActions, boundUndoActions } = actions;

    const canUseSafezoneClamp = capability.get('canUseSafezoneClamp');

    const summary = paginationSpread.get('summary');
    const isSupportPaintedText = summary.get('isSupportPaintedText');
    const isCover = summary.get('isCover');
    const isHalfCover =
      page.get('type') === pageTypes.back ||
      page.get('type') === pageTypes.front;

    const pageWidth = page.get('width') * ratio.workspace;
    const pageHeight = page.get('height') * ratio.workspace;

    const pageBleed = page.get('bleed');
    const bleedLeft = pageBleed.get('left') * ratio.workspace;
    const bleedRight = pageBleed.get('right') * ratio.workspace;
    const bleedTop = pageBleed.get('top') * ratio.workspace;
    const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

    const bottomEdge = pageHeight - bleedBottom;
    let rightEdge = pageWidth - bleedRight;

    const spinePage = paginationSpread
      .get('pages')
      .find(p => p.get('type') === pageTypes.spine);

    let spineLeft = 0;
    let spineRight = 0;
    let spineWidth = 0;

    if (isCover) {
      spineWidth = spinePage.get('width') * ratio.workspace;
      spineLeft = (pageWidth - spineWidth) / 2 + bleedLeft;
      spineRight = (pageWidth + spineWidth) / 2 - bleedLeft;

      if (isHalfCover) {
        spineLeft = pageWidth - spineWidth / 2 + bleedLeft;
        rightEdge = pageWidth;
      }
    }

    const { x, y, width, height, degree } = this.elementControlsNode.state;

    const transformedRect = transform(
      {
        x,
        y,
        width,
        height
      },
      degree
    );

    const minX = transformedRect.left;
    const minY = transformedRect.top;
    const maxX = transformedRect.left + transformedRect.width;
    const maxY = transformedRect.top + transformedRect.height;

    let updateObjectArray = Immutable.List();
    let needRedrawElementControlsRect = false;

    const isUpdateElement = false;

    selectedElementArray.forEach(element => {
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
          if (
            element.get('type') === elementTypes.photo &&
            !element.get('rot')
          ) {
            updateObject = updateObject.merge({
              width: element.get('width'),
              height: element.get('height')
            });
            needRedrawElementControlsRect = true;
            if (canUseSafezoneClamp) {
              // FIXME: 重复更新元素，需要修复
              // 保留上次裁剪前的状态用于计算crop

              const clampedObject = this.clampBySafezone(updateObject);
              if (clampedObject.hasClamp) {
                updateObject = clampedObject.element;
                const encImgId = element.get('encImgId');
                const newElement = element.merge(updateObject);

                const oldEleRatio =
                  element.get('width') / element.get('height');
                const newEleRatio =
                  newElement.get('width') / newElement.get('height');

                if (encImgId) {
                  const theImage = paginationSpread.getIn(['images', encImgId]);
                  const cropOptions = getNewCropByBase(
                    newElement,
                    element,
                    theImage.toJS(),
                    ratio.workspace
                  );

                  updateObject = updateObject.merge(cropOptions);
                }
              }
            }
          }
          break;
        case 'resize': {
          if (
            element.get('type') !== elementTypes.paintedText ||
            !isCover ||
            !isSupportPaintedText ||
            (minX >= bleedLeft &&
              maxX <= spineLeft &&
              minY >= bleedTop &&
              maxY <= bottomEdge) ||
            (minX >= spineRight &&
              maxX <= rightEdge &&
              minY >= bleedTop &&
              maxY <= bottomEdge)
          ) {
            updateObject = updateObject.merge({
              x,
              y,
              width,
              height
            });
            if (
              element.get('type') === elementTypes.photo &&
              !element.get('rot') &&
              canUseSafezoneClamp
            ) {
              const clampedObject = this.clampBySafezone(updateObject);
              if (clampedObject.hasClamp) {
                updateObject = clampedObject.element;
                needRedrawElementControlsRect = true;

                const encImgId = element.get('encImgId');
                const computed = element.get('computed');
                const newElement = element.merge(updateObject);

                const oldElement = element.merge({
                  x: computed.get('left') / ratio.workspace,
                  y: computed.get('top') / ratio.workspace,
                  width: computed.get('width') / ratio.workspace,
                  height: computed.get('height') / ratio.workspace
                });

                const oldEleRatio =
                  element.get('width') / element.get('height');
                const newEleRatio =
                  newElement.get('width') / newElement.get('height');

                if (
                  encImgId &&
                  Math.abs(oldEleRatio - newEleRatio) >= DEVIATION
                ) {
                  const theImage = paginationSpread.getIn(['images', encImgId]);
                  const cropOptions = getNewCropByBase(
                    newElement,
                    oldElement,
                    theImage.toJS(),
                    ratio.workspace
                  );

                  updateObject = updateObject.merge(cropOptions);
                }
              } else {
                updateObject = updateObject.merge({
                  cropLUX: element.get('cropLUX'),
                  cropLUY: element.get('cropLUY'),
                  cropRLX: element.get('cropRLX'),
                  cropRLY: element.get('cropRLY')
                });
              }
            } else if (
              element.get('type') === elementTypes.photo &&
              !element.get('rot') &&
              !canUseSafezoneClamp
            ) {
              const encImgId = element.get('encImgId');
              const computed = element.get('computed');
              const newElement = element.merge(updateObject);

              const oldElement = element.merge({
                x: computed.get('left') / ratio.workspace,
                y: computed.get('top') / ratio.workspace,
                width: computed.get('width') / ratio.workspace,
                height: computed.get('height') / ratio.workspace
              });

              const oldEleRatio = element.get('width') / element.get('height');
              const newEleRatio =
                newElement.get('width') / newElement.get('height');

              if (
                encImgId &&
                Math.abs(oldEleRatio - newEleRatio) >= DEVIATION
              ) {
                const theImage = paginationSpread.getIn(['images', encImgId]);
                const cropOptions = getNewCropByBase(
                  newElement,
                  oldElement,
                  theImage.toJS(),
                  ratio.workspace
                );

                updateObject = updateObject.merge(cropOptions);
              }
            }
          } else if (
            isCover &&
            element.get('type') === elementTypes.paintedText
          ) {
            needRedrawElementControlsRect = true;
          }
          break;
        }
        case 'rotate':
          if (
            element.get('type') !== elementTypes.paintedText ||
            !isCover ||
            !isSupportPaintedText ||
            (minX >= bleedLeft &&
              maxX <= spineLeft &&
              minY >= bleedTop &&
              maxY <= bottomEdge) ||
            (minX >= spineRight &&
              maxX <= rightEdge &&
              minY >= bleedTop &&
              maxY <= bottomEdge)
          ) {
            updateObject = updateObject.merge({
              rot: Math.round(element.get('rot')),
              x,
              y
            });
          } else {
            this.elementControlsNode.redrawElementControlsRect();
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
      if (isUpdateElement) {
        boundUndoActions && boundUndoActions.stopUndo();
      }

      boundProjectActions.updateElements(updateObjectArray);
      if (needRedrawElementControlsRect) {
        this.elementControlsNode.redrawElementControlsRect();
      }
    }
    boundUndoActions && boundUndoActions.startUndo();
  }

  onElementArrayChange(selectedElementArray, callback) {
    const { elementArray } = this.state;

    const { data } = this.props;
    const { paginationSpread, ratio } = data;

    this.setState(
      {
        elementArray: elementArray.map(element => {
          const elementId = element.get('id');
          let selectedElement = selectedElementArray.find(
            o => o.get('id') === elementId
          );

          if (selectedElement) {
            const encImgId = selectedElement.get('encImgId');

            const oldComputed = element.get('computed');
            const newComputed = selectedElement.get('computed');

            const oldElement = element.merge({
              x: oldComputed.get('left') / ratio.workspace,
              y: oldComputed.get('top') / ratio.workspace,
              width: oldComputed.get('width') / ratio.workspace,
              height: oldComputed.get('height') / ratio.workspace
            });

            const newElement = selectedElement.merge({
              x: newComputed.get('left') / ratio.workspace,
              y: newComputed.get('top') / ratio.workspace,
              width: newComputed.get('width') / ratio.workspace,
              height: newComputed.get('height') / ratio.workspace
            });

            const oldEleRatio = element.get('width') / element.get('height');
            const newEleRatio =
              newElement.get('width') / newElement.get('height');

            if (encImgId && Math.abs(oldEleRatio - newEleRatio) >= DEVIATION) {
              const theImage = paginationSpread.getIn(['images', encImgId]);
              const cropOptions = getNewCropByBase(
                newElement,
                oldElement,
                theImage.toJS(),
                ratio.workspace
              );

              selectedElement = selectedElement.merge(cropOptions);
            }
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

  stopEvent(e) {
    e.stopPropagation();
  }

  isInTypes(type, availTypes) {
    const index = availTypes.findIndex(item => item.id === type);
    return index >= 0;
  }

  clearSelected() {
    const { elementArray } = this.state;

    const newElementArray = elementArray.map(element =>
      element.set('isSelected', false)
    );

    if (!Immutable.is(elementArray, newElementArray)) {
      this.setState({
        elementArray: newElementArray
      });
    }
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
      isBookCoverInnerWarp,
      innerEffectValue,
      capability,
      paginationSpread,
      parameters,
      urls,
      template,
      variables,
      materials,
      size,
      isPreview,
      position,
      isUseFastCrop
    } = data;
    const { boundImagesActions, boundProjectActions } = actions;

    const pageEnabled = page.get('enabled');
    const pageId = page.get('id');
    const isPressBook = summary.get('isPressBook');
    const isCover = summary.get('isCover');
    const isActive = page.get('isActive');
    const isSupportHalfImageInCover = summary.get('isSupportHalfImageInCover');
    const images = paginationSpread.get('images');

    const pageWidth = page.get('width') * ratio.workspace;
    const pageHeight = page.get('height') * ratio.workspace;
    const pageBleed = page.get('bleed');
    const bleedLeft = pageBleed.get('left') * ratio.workspace;
    const bleedRight = pageBleed.get('right') * ratio.workspace;
    const bleedTop = pageBleed.get('top') * ratio.workspace;
    const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

    let isSpinePage = false;
    let isSpineText = false;
    // 如果是 spine 则不能移动不能旋转
    if (page.get('type') === pageTypes.spine) {
      isSpinePage = true;
    }

    // canvas样式.
    const bookPageClassName = classNames('book-page', {
      enabled: pageEnabled,
      disabled: !pageEnabled,

      cover: isCover,
      inner: !isCover,

      pressbook: isPressBook
    });

    const canvasSize = {
      width: isBookCoverInnerWarp
        ? innerEffectValue.width - 1
        : Math.round(page.get('width') * ratio.workspace),
      height: isBookCoverInnerWarp
        ? innerEffectValue.height - 1
        : Math.round(page.get('height') * ratio.workspace)
    };

    const {
      elementArray,
      containerRect,
      tooltip,
      draggingCreatePhotoFrame,
      originalPhotoLayer
    } = this.state;

    let selectedElementArray = Immutable.List();
    let unselectedElementArray = Immutable.List();
    elementArray.forEach(element => {
      if (element.get('isSelected')) {
        selectedElementArray = selectedElementArray.push(element);
      } else {
        unselectedElementArray = unselectedElementArray.push(element);
      }
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
    const isTextElementOverflowPage =
      element && this.checkTextElementOverflowPage(element);
    const elementControlsProps = {
      selectedElementArray,
      containerRect,
      ratio,
      downloadData,
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
      onExchangeDragStart: e => {
        this.onExchangeDragStart(pageId, elementId, exchangeImageThumbnail, e);
      },
      onExchangeDragMove: this.onExchangeDragMove,
      onExchangeDragEnd: this.onExchangeDragEnd,
      ref: node => (this.elementControlsNode = node),
      isShowTextNotFit: theDownloadData.get('isShowTextNotFit'),
      isShowTextOverflow: isTextElementOverflowPage,
      failTryToDownload: this.failTryToDownload,
      toDownload: this.toDownload,
      clicksObj: this.clicksObj,
      selectedPhotoElement: this.selectedPhotoElement,
      boundProjectActions,
      isUseFastCrop,
      images
    };

    const exchangeThumbnailProps = {
      isExchangeImage,
      exchangeThumbnailRect,
      exchangeImageThumbnail: this.state.exchangeImageThumbnail
    };

    const hoverBoxClass = classNames('box', {
      hover: isDragOver && page.get('type') !== pageTypes.spine
    });

    const isCameo =
      selectedElementArray.size === 1 &&
      selectedElementArray.getIn([0, 'type']) == elementTypes.cameo;
    const isBackgroundElement =
      selectedElementArray.size === 1 &&
      selectedElementArray.getIn([0, 'type']) == elementTypes.background;
    const isShowActionBar =
      Boolean(selectedElementArray.size) && !isBackgroundElement;
    const isOnlyExpandFull =
      (isCover && isSupportHalfImageInCover) || (!isCover && isPressBook);
    let ActionBar = null;
    const actionBarProps = {
      t,
      containerRect,
      actions: this.actionbarActions,
      page: {
        x: 0,
        y: 0,

        // 允许actionbar在上下位置超过出血30px.
        offsetTop: 30,
        width: pageWidth,
        height: pageHeight
      },
      style: {}
    };

    if (isShowActionBar) {
      const { left, top } = containerRect;
      if (selectedElementArray.size === 1) {
        const firstElement = selectedElementArray.first();
        const elementType = firstElement.get('type');
        switch (elementType) {
          case elementTypes.photo:
            ActionBar = PhotoActionBar;
            actionBarProps.isOnlyExpandFull = isOnlyExpandFull;
            break;
          case elementTypes.sticker:
            ActionBar = StickerActionBar;
            break;
          case elementTypes.background:
            ActionBar = BackgroundActionBar;
            break;
          case elementTypes.text:
            ActionBar = TextActionBar;
            break;

          case elementTypes.paintedText:
            ActionBar = TextActionBar;
            break;
          case elementTypes.cameo:
            ActionBar = CameoActionBar;
            break;
          default:
        }
        actionBarProps.element = firstElement;
        actionBarProps.containerRect = containerRect;

        // spinetext 数据和表现不一致改为0
        isSpineText =
          (firstElement.get('type') == elementTypes.paintedText &&
            isSpinePage) ||
          firstElement.get('isSpineText');

        if (elementType === elementTypes.cameo) {
          const setting = get(settings, 'spec');

          const configurableOptionArray = get(
            specData,
            'configurableOptionArray'
          );
          const allOptionMap = get(specData, 'allOptionMap');
          const disableOptionArray = get(specData, 'disableOptionArray');

          const availableOptionMap = projectParser.getAvailableOptionMap(
            setting,
            configurableOptionArray,
            allOptionMap,
            disableOptionArray
          );
          const availCameoShapeTypes = availableOptionMap.cameoShape;
          const availCameoSizeTypes = availableOptionMap.cameo;

          const hasImage = !!firstElement.get('encImgId');

          let rectDisable = !this.isInTypes(
            cameoShapeTypes.rect,
            availCameoShapeTypes
          );
          let roundDisable =
            !this.isInTypes(cameoShapeTypes.round, availCameoShapeTypes) &&
            !this.isInTypes(cameoShapeTypes.oval, availCameoShapeTypes);

          let sDisable = !this.isInTypes(
            cameoSizeTypes.small,
            availCameoSizeTypes
          );
          let mDisable = !this.isInTypes(
            cameoSizeTypes.middle,
            availCameoSizeTypes
          );
          let lDisable = !this.isInTypes(
            cameoSizeTypes.large,
            availCameoSizeTypes
          );

          let removeDisable = false;

          // 如果为PressBook，且Cover为Linen cover和Leatherette自动添加天窗
          if (
            get(setting, 'product') === productTypes.PS &&
            [coverTypes.PSNC, coverTypes.PSLC].indexOf(get(setting, 'cover')) >=
              0
          ) {
            rectDisable = roundDisable = sDisable = mDisable = lDisable = removeDisable = true;
          }

          const cameo = firstElement.get('cameo');
          const cameoShape = firstElement.get('cameoShape');

          actionBarProps.highlightIcons = {
            largeHightlight: cameo === cameoSizeTypes.large || false,
            mediumHightlight: cameo === cameoSizeTypes.middle || false,
            smallHightlight: cameo === cameoSizeTypes.small || false,
            rectHightlight: cameoShape === cameoShapeTypes.rect || false,
            roundHightlight:
              cameoShape === cameoShapeTypes.round ||
              cameoShape === cameoShapeTypes.oval ||
              false
          };

          actionBarProps.roundLabel = this.isInTypes(
            cameoShapeTypes.round,
            availCameoShapeTypes
          )
            ? cameoShapeTypes.round
            : cameoShapeTypes.oval;

          actionBarProps.disabledIcons = {
            cropDisable: !hasImage,
            rotateDisable: !hasImage,
            flipDisable: !hasImage,
            rectDisable,
            roundDisable,
            sDisable,
            mDisable,
            lDisable,
            removeDisable
          };

          actionBarProps.cameoRect = {
            width: firstElement.get('pw') * page.get('width') * ratio.workspace,
            height:
              firstElement.get('ph') * page.get('height') * ratio.workspace,
            left: firstElement.get('px') * page.get('width') * ratio.workspace,
            top: firstElement.get('py') * page.get('height') * ratio.workspace
          };
        } else {
          actionBarProps.isSpine = isSpineText;
          if (isSpineText) {
            actionBarProps.degree = 0;
          } else {
            actionBarProps.degree = controlRectRot;
          }
        }
      } else {
        ActionBar = MultipleActionBar;
        actionBarProps.selectedElementArray = selectedElementArray;
        actionBarProps.containerRect = containerRect;
        actionBarProps.degree = controlRectRot;

        const [minPos, maxPos] = guideLineHandler.getSelectedElementPosition(
          this
        );

        const controlWidth = maxPos.x - minPos.x;
        const controlHeight = maxPos.y - minPos.y;

        actionBarProps.controlRect = {
          minPos,
          maxPos,
          width: controlWidth,
          height: controlHeight
        };
      }
    }

    const backgroundRect = {
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      fill:
        isPressBook && !pageEnabled && !isCover
          ? '#ffffff'
          : page.get('bgColor'),
      id: shapeType.backgroundRect
    };

    const stageProps = {
      ref: stage => (this.stage = stage),
      width: canvasSize.width,
      height: canvasSize.height,
      className: bookPageClassName,
      onMouseDown: this.switchPage
    };

    if (actions.activePage) {
      stageProps.onMouseUp = this.activePage;
    }

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
            {pageEnabled || (isPressBook && !pageEnabled && !isCover) ? (
              <Rect {...backgroundRect} />
            ) : null}

            <Group ref={group => (this.unselectElements = group)}>
              {this.getRenderHtml(renderElementArray)}
            </Group>
            <Group
              ref={group => (this.selectedElements = group)}
              visible={isShowFakeElements}
            >
              {this.getRenderHtml(selectedElementArray)}
            </Group>

            {!elementArray.size ? this.renderBackgroundTextElement() : null}

            {this.renderGuideLines()}

            {!isSpinePage &&
            !isCameo &&
            !isSpineText &&
            !isBackgroundElement &&
            selectedElementArray.size ? (
              <ElementControls {...elementControlsProps} />
            ) : null}

            {tooltip.isShown ? <Tooltip {...tooltip} /> : null}

            {this.isDraggingCreatePhotoFrame ? (
              <Rect {...dragCreatePhotoFrameRect} />
            ) : null}
          </Layer>
        </Stage>

        {this.renderBleedGuideLines()}
        {pageEnabled ? (
          <div className={hoverBoxClass} style={hoverBoxStyle} />
        ) : null}

        {pageEnabled ? (
          <XFileUpload
            className="hide"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={this.toggleModal}
            ref={fileUpload => (this.fileUpload = fileUpload)}
          />
        ) : null}
        <div className="actionbar-container" onMouseUp={this.stopEvent}>
          {isShowActionBar ? <ActionBar {...actionBarProps} /> : null}
        </div>
        {isExchangeImage ? (
          <ExchangeThumbnail {...exchangeThumbnailProps} />
        ) : null}

        <OriginalPhotoLayer {...originalPhotoLayer} />
      </div>
    );
  }
}

BookPage.propTypes = {};

BookPage.defaultProps = {};

export default translate('BookPage')(BookPage);
