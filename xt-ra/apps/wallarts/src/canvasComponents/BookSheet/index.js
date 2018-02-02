import { merge, get } from 'lodash';
import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component } from 'react';
import { Layer, Stage, Group, Rect, Image, Circle } from 'react-konva';

import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import BgEffects from '../BgEffects';
import CanvasTopMirror from '../CanvasTopMirror';
import CanvasRightMirror from '../CanvasRightMirror';
import BookPage from '../BookPage';
import SnackBar from '../../components/SnackBar';
import ExchangeThumbnail from '../../components/ExchangeThumbnail';

import { productTypes, canvasBorderTypes } from '../../constants/strings';

import {
  onEditImage,
  onRemoveImage,
  toggleModal,
  uploadFileClicked,
  onCloudClick
} from './handler/actionBar';

import * as exchangeHandler from './handler/exchange';

import './index.scss';

class BookSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideSnackBarTimer: null,
      snackBar: {
        isShown: false,
        left: 0,
        bottom: 0,
        width: 0,
        templateId: 0
      },
      currentPointPhotoElementId: '',
      isExchangeImage: false,
      exchangeImageThumbnail: null,
      exchangeThumbnailRect: {}
    };
    this.changeBookSheetState = this.changeBookSheetState.bind(this);
    this.delayHideSnackBar = this.delayHideSnackBar.bind(this);
    this.clearHideSnackBarTimer = this.clearHideSnackBarTimer.bind(this);
    this.onEditImage = element => onEditImage(this, element);
    this.onRemoveImage = element => onRemoveImage(this, element);
    this.toggleModal = (type, status) => toggleModal(this, type, status);
    this.onCloudClick = (element) => onCloudClick(this, element);
    this.uploadFileClicked = (element) => uploadFileClicked(this, element);

    this.onExchangeDragStart = (pageId, elementId, exchangeImageThumbnail, e) => exchangeHandler.onExchangeDragStart(this, pageId, elementId, exchangeImageThumbnail, e);
    this.onExchangeDragMove = (e) => exchangeHandler.onExchangeDragMove(this, e);
    this.onExchangeDragEnd = (e) => exchangeHandler.onExchangeDragEnd(this, e);
    this.onHoverBoxChange = (e) => exchangeHandler.onHoverBoxChange(this, e);
  }

  changeBookSheetState(options) {
    this.setState(options);
  }

  delayHideSnackBar() {
    const hideSnackBarTimer = window.setTimeout(() => {
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

  clearHideSnackBarTimer() {
    const { hideSnackBarTimer } = this.state;
    hideSnackBarTimer && window.clearTimeout(hideSnackBarTimer);
  }

  render() {
    const { actions, data } = this.props;
    const {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      switchSheet,
      setMouseHoverDomNode,
      boundSnippingActions
    } = actions;
    const {
      urls,
      size,
      ratios,
      styles,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      parameters,
      allImages,
      materials,
      userId,
      project,
      isPreview,
      isScreenShot,
      capability,
      snipping,
      isSplit
    } = data;

    const { isExchangeImage, exchangeThumbnailRect, isShowHoverBox, hoverBoxStyle } = this.state;

    const ratio = ratios.get('workspace');
    const productType = settings.get('product');
    const isFloatFrame = productType === productTypes.floatFrame || productType === productTypes.floatFrame_metalFrame || productType === productTypes.floatFrame_classicFrame;

    const isShowCanvasMirror = productType === productTypes.canvas;
    const canvasBorder = settings.get('canvasBorder');
    const pages = paginationSpread.get('pages');
    const images = paginationSpread.get('images');
    const summary = paginationSpread.get('summary');
    const shape = settings.get('shape');
    const isColorBorder = canvasBorder === canvasBorderTypes.color;
    const canvasBorderColor = pages.size && pages.getIn(['0', 'canvasBorder', 'color']);
    const bookPageClassName = classNames('book-sheet', {
      enabled: true,
      disabled: false
    });
    const stageProps = merge({}, get(size, 'renderStageProps'), {
      ref: stage => (this.stage = stage),
      className: bookPageClassName
    });
    const containerProps = get(size, 'renderContainerProps');
    const BgEffectsData = {
      pagination,
      materials,
      size,
      ratio,
      isPreview,
      settings,
      variables
    };

    const canvasTopMirrorImageSrc = isPreview
      ? snipping && snipping.get('previewCanvasTopMirrorImage')
      : snipping && snipping.get('canvasTopMirrorImage');
    const canvasRightMirrorImageSrc = isPreview
      ? snipping && snipping.get('previewCanvasRightMirrorImage')
      : snipping && snipping.get('canvasRightMirrorImage');
    const canvasTopMirrorProps = {
      isColorBorder,
      canvasBorderColor,
      size,
      canvasTopMirrorImageSrc
    };
    const canvasRightMirrorProps = {
      isColorBorder,
      canvasBorderColor,
      size,
      canvasRightMirrorImageSrc
    };
    const bookPages = [];

    const exchangeImageActions = {
      onExchangeDragStart: this.onExchangeDragStart,
      onExchangeDragMove: this.onExchangeDragMove,
      onExchangeDragEnd: this.onExchangeDragEnd,
      onHoverBoxChange: this.onHoverBoxChange
    };

    //  page的actions和data
    const pageActions = {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      boundTemplateActions,
      switchSheet,
      setMouseHoverDomNode,
      boundSnippingActions,
      onEditImage: this.onEditImage,
      onRemoveImage: this.onRemoveImage,
      onCloudClick: this.onCloudClick,
      changeBookSheetState: this.changeBookSheetState,
      delayHideSnackBar: this.delayHideSnackBar,
      clearHideSnackBarTimer: this.clearHideSnackBarTimer,
      exchangeImageActions
    };
    if (pages && pages.size) {
      pages.forEach((page, index) => {
        const pageData = {
          stage: this.stage,
          capability,
          urls,
          size,
          summary,
          page,
          elements: page.get('elements'),
          template,
          pagination,
          allImages,
          ratio,
          paginationSpread,
          index,
          images,
          settings,
          isPreview,
          isScreenShot,
          parameters,
          materials,
          variables,
          isSplit
        };

        const sheetX = get(size, 'renderSheetSizeWithoutBleed.left');
        const sheetY = get(size, 'renderSheetSizeWithoutBleed.top');
        const sheetWidth = Math.floor(get(size, 'renderSheetSizeWithoutBleed.width'));
        const sheetHeight = Math.floor(get(size, 'renderSheetSizeWithoutBleed.height'));
        const cornerRadius = 3;
        const sheetGroupProps = {
          key: 'sheetWithoutBleed',
          x: sheetX,
          y: sheetY,
          width: sheetWidth,
          height: sheetHeight,
          id: 'sheet'
        };
        //解决canvas产品四边没有被遮挡的问题, 这是因为出素材图的时候九宫格对齐的时候
        // 在  firefox 上会有 间隙条线，通过 clip 抹去素材图四边的缺缝
        if(isShowCanvasMirror){
          sheetGroupProps.clip = {
            x: get(size, 'renderCanvasBorderThickness.left'),
            y: get(size, 'renderCanvasBorderThickness.top') - 1,
            width: sheetWidth + 3,
            height: sheetHeight + 3
          }
        }else{
          // 其它的产品本来不需要 clip， 但是因为上面使用过 clip，如果在切换之后不重置
          // clip 的边界，会导致 canvas 使用的 clip 被继承下来，导致出错
          // 裁剪的起始点 -100 和 宽高加 200 是为了将 阴影完整显示， 避免被裁剪。
          sheetGroupProps.clip = {
            x: get(size, 'renderSheetSize.left') - 100,
            y: get(size, 'renderSheetSize.top') - 100,
            width: get(size, 'renderSheetSize.width') + 200,
            height: get(size, 'renderSheetSize.height') + 200
          }
        }
        //  如果是 floatFrame 的话，需要 画圆角和 阴影
        if (isFloatFrame && !isSplit) {
          if (shape === 'Round') {
          sheetGroupProps.clipFunc = (ctx) => {
            ctx.beginPath();
              var circle = {
                  x : sheetWidth/2,    //圆心的x轴坐标值
                  y : sheetHeight/2,    //圆心的y轴坐标值
                  r : sheetWidth/2      //圆的半径
              };
              //以canvas中的坐标点(100,100)为圆心，绘制一个半径为50px的圆形
              ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.clip();
            };
            const sheetRectProps = {
              key: 'floatFrameSheet',
              x: Math.ceil(sheetX + sheetWidth / 2),
              y: Math.ceil(sheetY + sheetHeight / 2),
              radius: Math.ceil(sheetWidth/2-2),
              fill: 'rgba(244,244,244)',
              listening: false,
              shadowColor: 'rgba(0,0,0, 0.40)',
              shadowBlur: 140 * ratio,
              shadowOffset: {
                x: -56 * ratio,
                y: 42 * ratio
              }

            };
            bookPages.push(<Circle {...sheetRectProps} />);

          }else{

            sheetGroupProps.clipFunc = (ctx) => {
              ctx.beginPath();
            ctx.moveTo(0, cornerRadius);
            ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
            ctx.lineTo(sheetWidth - cornerRadius, 0);
            ctx.quadraticCurveTo(sheetWidth, 0, sheetWidth, cornerRadius);
            ctx.lineTo(sheetWidth, sheetHeight - cornerRadius);
            ctx.quadraticCurveTo(sheetWidth, sheetHeight, sheetWidth - cornerRadius, sheetHeight);
            ctx.lineTo(cornerRadius, sheetHeight);
            ctx.quadraticCurveTo(0, sheetHeight, 0, sheetHeight - cornerRadius);
            ctx.lineTo(0, cornerRadius);
            ctx.closePath();
            ctx.clip();
          };
          const sheetRectProps = {
            key: 'floatFrameSheet',
            x: Math.ceil(sheetX),
            y: Math.ceil(sheetY),
            width: sheetWidth - 1,
            height: sheetHeight - 1,
            fill: 'rgba(244,244,244)',
            listening: false,
            cornerRadius,
            shadowColor: 'rgba(0,0,0, 0.40)',
            shadowBlur: 140 * ratio,
            shadowOffset: {
              x: -56 * ratio,
              y: 42 * ratio
            }

          };
          bookPages.push(<Rect {...sheetRectProps} />);

        }
        }
        bookPages.push(<Group {...sheetGroupProps} key={page.get('id')}>
          <BookPage data={pageData} actions={pageActions} />
        </Group>
        );
      });
    }

    const floatBgImageSrc = get(window._APPMATERIALS, 'floatBgImage');
    const floatBgProps = merge({}, size.renderMatteProps);
    if (isFloatFrame) {
      const floatBgImage = new window.Image();
      floatBgImage.src = floatBgImageSrc;
      floatBgProps.fillPatternImage = floatBgImage;
    }

    const {
      currentPointPhotoElementId,
      snackBar
    } = this.state;
    const newCurrentPointPhotoElement = pages.getIn(['0', 'elements']).find((ele) => {
      return ele.get('id') === currentPointPhotoElementId;
    });
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
        onEditImage: () => this.onEditImage(newCurrentPointPhotoElement),
        // onSwitchLayout: this.actionbarActions.onSwitchLayout,
        onDelete: () => this.onRemoveImage(newCurrentPointPhotoElement)
      },
      element: newCurrentPointPhotoElement
    };

    const exchangeThumbnailProps = {
      isExchangeImage,
      exchangeThumbnailRect,
      exchangeImageThumbnail: this.state.exchangeImageThumbnail
    };

    const hoverBoxClass = classNames('box', {
      hover: isShowHoverBox
    });

    return (
      <div className="stage-container">
        <Stage {...stageProps}>
          <Layer ref={layer => (this.layerNodeOfElements = layer)} >
            <Group {...containerProps} >
              {
                isFloatFrame
                  ? <Image {...floatBgProps} />
                  : null
              }
              { bookPages }
              {
                isShowCanvasMirror
                  ? <CanvasTopMirror {...canvasTopMirrorProps} />
                  : null
              }

              {
                isShowCanvasMirror
                  ? <CanvasRightMirror {...canvasRightMirrorProps} />
                  : null
              }
              <BgEffects {...BgEffectsData} />

            </Group>
          </Layer>
        </Stage>
        {isExchangeImage ? (
          <ExchangeThumbnail {...exchangeThumbnailProps} />
        ) : null}
        {newCurrentPointPhotoElement ? <SnackBar {...snackBarProps} /> : null}
        {!(isPreview || isScreenShot) ? (
          <XFileUpload
            className="hide"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={this.toggleModal}
            ref={fileUpload => (this.fileUpload = fileUpload)}
          />
        ) : null}
        {isShowHoverBox && isSplit ? (
          <div className={hoverBoxClass} style={hoverBoxStyle} />
        ) : null}
      </div>
    );
  }
}

export default translate('BookSheet')(BookSheet);
