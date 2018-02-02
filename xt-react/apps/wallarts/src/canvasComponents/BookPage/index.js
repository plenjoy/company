import React, { Component } from 'react';
import Immutable from 'immutable';
import { merge, isEqual, get } from 'lodash';
import { translate } from 'react-translate';
import { Group, Rect, Text } from 'react-konva';

import * as helperHandler from '../../utils/canvas/helper';
import {
  elementTypes,
  productTypes,
  canvasBorderTypes,
  acrylicPrintSourceInfo,
  enumShape
} from '../../constants/strings';

import PhotoElement from '../PhotoElement';
// 导入处理函数
import * as elementHandler from './handler/element';
import * as pageHandler from './handler/page';
import * as elementEvents from './canvas/elementEvents';
import { toDownload } from './canvas/downloadImage';

import * as layerEvents from './canvas/layerEvents';

import './index.scss';

class BookPage extends Component {
  constructor(props) {
    super(props);

    // element的相关方法.
    this.computedElementOptions = (props, element, ratio) => {
      return elementHandler.computedElementOptions(this, props, element, ratio);
    };

    // layer events
    this.addEventsToLayerOfElements = () =>
      layerEvents.addEventsToLayerOfElements(this);

    this.onMouseEnter = (element, e) =>
      elementEvents.onMouseEnter(this, element, e);
    this.onMouseLeave = (element, e) =>
      elementEvents.onMouseLeave(this, element, e);
    this.onClick = (element, e) => elementEvents.onClick(this, element, e);
    this.onMouseOver = (elementGroupNode, e) =>
      elementEvents.onMouseOver(this, elementGroupNode, e);
    this.onMouseMove = (element, e) =>
      elementEvents.onMouseMove(this, element, e);
    this.onMouseOut = (elementGroupNode, e) =>
      elementEvents.onMouseOut(this, elementGroupNode, e);
    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.updateOffset = this.updateOffset.bind(this);
    this.toDownload = (elementArray, forceToDownload) =>
      toDownload(this, elementArray, forceToDownload);
    this.updateCanvasBorderImages = this.updateCanvasBorderImages.bind(this);

    this.changeCurrentElement = element =>
      pageHandler.changeCurrentElement(this, element);
    this.onElementArrayChange = this.onElementArrayChange.bind(this);
    this.updateElement = this.updateElement.bind(this);

    this.state = {
      elementArray: Immutable.List(),
      downloadData: Immutable.Map(),
      snackBar: {
        isShown: false,
        left: 0,
        bottom: 0,
        width: 0,
        templateId: 0
      },
      bookpageGroupOffset: {
        left: 0,
        top: 0
      },
      isDragOver: false,
      containerRect: null,
      hideSnackBarTimer: null,
      currentPointPhotoElementId: -1,
      hoverBoxStyle: {},
      isLayerEventBinded: false,

      originalPhotoLayer: {
        isShown: false,
        x: 0,
        y: 0,
        imageUrl: ''
      }
    };
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
    this.updateCanvasBorderImages();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  componentDidUpdate() {
    this.updateCanvasBorderImages();
  }

  updateCanvasBorderImages() {
    const { actions, data } = this.props;
    const { size, settings, isScreenShot, isPreview } = data;
    const { boundSnippingActions } = actions;

    const product = settings.get('product');
    const canvasBorder = settings.get('canvasBorder');
    if (
      product === productTypes.canvas &&
      (isScreenShot || isPreview) &&
      canvasBorder !== canvasBorderTypes.color
    ) {
      const topMirrorCropParam = get(
        size,
        'renderCanvasMirrorParams.topMirrorCropParams'
      );
      const rightMirrorCropParam = get(
        size,
        'renderCanvasMirrorParams.rightMirrorCropParams'
      );
      const topCropParams = {
        x: topMirrorCropParam.x,
        y: topMirrorCropParam.y,
        width: topMirrorCropParam.width,
        height: topMirrorCropParam.height
      };
      const rightCropParams = {
        x: rightMirrorCropParam.x,
        y: rightMirrorCropParam.y,
        width: rightMirrorCropParam.width,
        height: rightMirrorCropParam.height
      };
      this.getImageTimer && clearTimeout(this.getImageTimer);
      this.getImageTimer = setTimeout(() => {
        const updateCanvasTopMirrorImageKey = isScreenShot
          ? 'canvasTopMirrorImage'
          : 'previewCanvasTopMirrorImage';
        const updateCanvasRightMirrorImageKey = isScreenShot
          ? 'canvasRightMirrorImage'
          : 'previewCanvasRightMirrorImage';
        const canvasTopMirrorImage =
          this.pageGroup && this.pageGroup.toDataURL(topCropParams);
        const canvasRightMirrorImage =
          this.pageGroup && this.pageGroup.toDataURL(rightCropParams);
        boundSnippingActions.updateSnippingImages({
          [updateCanvasTopMirrorImageKey]: canvasTopMirrorImage,
          [updateCanvasRightMirrorImageKey]: canvasRightMirrorImage
        });
      }, 300);
    }
  }

  onElementArrayChange(selectedElementArray, callback) {
    const { elementArray } = this.state;
    this.setState(
      {
        elementArray: elementArray.map(element => {
          const elementId = element.get('id');
          const selectedElement = selectedElementArray.find(o => {
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

  updateOffset(sizeObj) {
    if (this.stage && sizeObj) {
      const {
        renderSheetSize,
        renderSheetSizeWithoutBleed,
        renderContainerProps
      } = sizeObj;
      //  getBoundingClientRect 获取出来的是一个 DOM 对象，不是简单的键值对对象，会导致组件比较的时候死循环
      //  需要将该对象转为普通对象
      const containerDOMRect = this.stage
        .getStage()
        .getContainer()
        .getBoundingClientRect();
      this.setState({
        containerRect: {
          x: containerDOMRect.x,
          y: containerDOMRect.y,
          width: containerDOMRect.width,
          height: containerDOMRect.height,
          top: containerDOMRect.top,
          right: containerDOMRect.right,
          bottom: containerDOMRect.bottom,
          left: containerDOMRect.left
        },
        bookpageGroupOffset: {
          left:
            renderContainerProps.x +
            renderSheetSizeWithoutBleed.left -
            renderSheetSize.left,
          top:
            renderContainerProps.y +
            renderSheetSizeWithoutBleed.top -
            renderSheetSize.top
        }
      });
    }
  }

  getRenderHtml(elementArray) {
    const { data, t, actions } = this.props;
    const { boundTrackerActions, onCloudClick, onEditImage, onRemoveImage, exchangeImageActions } = actions;
    const {
      isPreview,
      isScreenShot,
      page,
      ratio,
      isBookCoverInnerWarp,
      images,
      capability,
      settings,
      size,
      variables,
      isSplit,
      parameters
    } = data;
    const pageId = page.get('id');
    const html = [];

    const product = settings.get('product');
    const canvasBorder = settings.get('canvasBorder');
    const isRoundShape = settings.get('shape') === enumShape.round;
    const isFrameCanvas = product === productTypes.frameCanvas;
    const isMirrorOrColorBorderOfCanvas =
      product === productTypes.canvas &&
      canvasBorder !== canvasBorderTypes.image;
    const { downloadData } = this.state;

    const sortedElementArray = helperHandler.sortElementsByZIndex(elementArray);

    const basicActions = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onMouseOver: this.onMouseOver,
      onMouseOut: this.onMouseOut,
      onClick: this.onClick,
      onMouseMove: this.onMouseMove
    };

    if (sortedElementArray && sortedElementArray.size) {
      sortedElementArray.forEach(element => {
        const elementId = element.get('id');

        const theDownloadData = downloadData.get(elementId) || Immutable.Map();

        const textElementProps = {
          key: elementId,
          element,
          isPreview,
          isScreenShot,
          actions: basicActions,
          imageObj: theDownloadData.get('imageObj'),
          downloadStatus: theDownloadData.get('downloadStatus'),
          isShowTextNotFit: theDownloadData.get('isShowTextNotFit'),
          tryToDownload: () => this.toDownload(Immutable.List([element]))
        };
        const canvasBorderThickness = page.get('canvasBorderThickness') ? page.get('canvasBorderThickness') : page.get('canvasBorder');
        const bleed = page.get('bleed');
        let offsetX = 0;
        let offsetY = 0;
        if (product === productTypes.acrylicPrint) {
          const acrylicPrintAsset = variables.get('acrylicPrintAsset');
          const acrylicButtonWidth = acrylicPrintAsset.get('cylinder');
          const distanceH = acrylicPrintAsset.get('left') * ratio;
          const distanceV = acrylicPrintAsset.get('top') * ratio;
          const acrylicButtonDisplayWidth = acrylicButtonWidth * ratio;
          offsetX =
            distanceH +
            acrylicButtonDisplayWidth / 2 +
            size.renderBoardInFrameSize.right -
            21;
          offsetY =
            distanceV +
            acrylicButtonDisplayWidth *
              (1 + acrylicPrintSourceInfo.shadowRatio) +
            size.renderBoardInFrameSize.top -
            20;
        }
        if (isMirrorOrColorBorderOfCanvas || isFrameCanvas) {
          offsetX += bleed.get('top') * ratio + size.renderBoardInFrameSize.top;
          offsetY +=
            bleed.get('right') * ratio + size.renderBoardInFrameSize.right;
        } else {
          offsetX +=
            canvasBorderThickness.get('top') * ratio +
            bleed.get('top') * ratio +
            size.renderBoardInFrameSize.top;
          offsetY +=
            canvasBorderThickness.get('right') * ratio +
            bleed.get('right') * ratio +
            size.renderBoardInFrameSize.right;
        }

        // 如果圆形产品，则提示符居中
        if(element.get('type') === elementTypes.photo && settings.get('shape') === 'Round') {
          offsetX = size.renderSheetSizeWithoutBleed.width / 2 + 9 - 12 - 18 + 4;
        }

        switch (element.get('type')) {
          case elementTypes.photo: {
            const forceToDownload = true;
            const photoElementProps = {
              key: elementId,
              element,
              images,
              isPreview,
              isScreenShot,
              pageId,
              offsetX,
              offsetY,
              page,
              ratio,
              isRoundShape,
              parameters,
              isMirrorOrColorBorderOfCanvas,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              actions: merge({}, basicActions, {
                onElementArrayChange: this.onElementArrayChange,
                updateElement: this.updateElement,
                changeCurrentElement: this.changeCurrentElement,
                onCloudClick,
                onEditImage,
                onRemoveImage
              }),
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload),
              isBookCoverInnerWarp,
              boundTrackerActions,
              capability,
              actualPageBleed: page.get('bleed').map(o => {
                return Math.floor(o * ratio);
              }),
              isSplit,
              exchangeImageActions
            };
            html.push(<PhotoElement {...photoElementProps} />);
            break;
          }
          case elementTypes.text: {
            // 在预览模式下, 要过滤空的文本框.
            if ((isPreview || isScreenShot) && !element.get('text')) {
              return null;
            }
            html.push(<TextElement {...textElementProps} />);
            break;
          }
          default:
            break;
        }
      });
    }

    return html;
  }

  updateElement(element) {
    const { actions } = this.props;
    const { boundProjectActions } = actions;
    delete element.computed;
    boundProjectActions.updateElement(element);
  }

  render() {
    const { data, actions, t } = this.props;
    const {
      page,
      ratio,
      size,
      zIndex,
      parameters,
      summary,
      paginationSpread,
      index,
      isSplit
    } = data;
    const { renderSheetSize, renderSheetSizeWithoutBleed } = size;
    const bookPageProps = {
      ref: group => (this.pageGroup = group),
      x: renderSheetSize.left,
      y: renderSheetSize.top,
      width: renderSheetSize.width,
      height: renderSheetSize.height,
      zIndex
    };
    const backRectProps = {
      x: 0,
      y: 0,
      width: renderSheetSize.width,
      height: renderSheetSize.height,

      // fill: '#f00'
      fill: !isSplit ? '#fff' : 'transparent'
    };
    const { elementArray } = this.state;

    return (
      <Group {...bookPageProps}>
        <Rect {...backRectProps} />
        <Group ref={group => (this.unselectElements = group)}>
          {this.getRenderHtml(elementArray)}
        </Group>
      </Group>
    );
  }
}

BookPage.propTypes = {};

BookPage.defaultProps = {};

export default translate('BookPage')(BookPage);
