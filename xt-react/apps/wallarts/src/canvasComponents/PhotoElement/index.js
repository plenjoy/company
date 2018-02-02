import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { Group, Image, Rect } from 'react-konva';

import PhotoWarnTip from '../PhotoWarnTip';
import ExchangeImage from '../ExchangeImage';
import { RESIZE_LIMIT, downloadStatus } from '../../constants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import PhotoSnackBar from '../PhotoSnackBar';
import TextLoading from '../TextLoading';
import LoadFailed from '../LoadFailed';

import { getCropRect } from '../../utils/crop';
import cloudImage from './cloud2.png';
import * as handler from './handler';

class PhotoElement extends Component {
  constructor(props) {
    super(props);

    this.onMoveStart = e => handler.onMoveStart(this, e);
    this.onMove = e => handler.onMove(this, e);
    this.onMoveStop = e => handler.onMoveStop(this, e);
    this.state = {
      isSnackBarShow: false,
      isExchangeShow: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    if (
      !Immutable.is(oldElement, newElement) ||
      this.props.imageObj !== nextProps.imageObj ||
      this.props.downloadStatus !== nextProps.downloadStatus ||
      this.props.isSplit !== nextProps.isSplit ||
      this.state.isSnackBarShow !== nextState.isSnackBarShow ||
      this.state.isExchangeShow !== nextState.isExchangeShow
    ) {
      return true;
    }

    return false;
  }

  setCursor(cursorStyle) {
    let cursor = cursorStyle;
    if (this.elementNode) {
      if (cursorStyle === 'grab') {
        if (navigator.userAgent.match(/Safari/)) {
          cursor = '-webkit-grab';
        }
      }
      this.elementNode.getStage().content.style.cursor = cursor;
    }
  }

  render() {
    const {
      element,
      imageObj,
      isPreview,
      isScreenShot,
      t,
      actions,
      tryToDownload,
      boundTrackerActions,
      capability,
      isMirrorOrColorBorderOfCanvas,
      offsetX,
      offsetY,
      isSplit,
      page,
      ratio,
      parameters,
      isRoundShape,
      exchangeImageActions,
    } = this.props;

    const {
      imgUrl,
      offset,
      x,
      y,
      width,
      height,
      zIndex
    } = helperHandler.getRenderElementOptions(element);

    const pageId = page.get('id');

    const hasImage = Boolean(imgUrl);
    const isSelected = element.get('isSelected');
    const elementId = element.get('id');
    const border = element.getIn(['computed', 'border']);
    const borderSize = border ? border.get('size') : 0;
    const computed = element.get('computed');

    // 根据元素的crop信息计算需要从原图中截取的rect
    const crop = this.props.downloadStatus
      ? getCropRect(element.toJS(), imageObj)
      : null;
    const newWidth = isMirrorOrColorBorderOfCanvas ? width + 3 : width;
    const newHeight = isMirrorOrColorBorderOfCanvas ? height + 2 : height;
    const newX = isMirrorOrColorBorderOfCanvas ? x - 1 : x;
    const newY = isMirrorOrColorBorderOfCanvas ? y - 1 : y;
    const photoElementContainerGroupProps = {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      offset,
      zIndex,
      rotation: element.get('rot')
    };
    const photoElementGroupProps = {
      // x: newX,
      // y: newY,
      // width,
      // height,
      x: 0,
      y: 0,
      width: newWidth,
      height: newHeight,
      // offset,
      // zIndex,
      ref: node => (this.elementGroupNode = node),
      // rotation: element.get('rot'),
      draggable: false,
      name: 'element',
      onMouseEnter: e => {
        this.setState({
          isSnackBarShow: true,
          isExchangeShow: true
        });
        // actions.onMouseEnter(element, e);
        if (capability.get('canDragCrop')) {
          this.setCursor('grab');
        }
      },
      onMouseLeave: e => {
        this.setState({
          isSnackBarShow: false,
          isExchangeShow: false
        });
        actions.onMouseLeave(element, e);
      },
      onMouseOver: e => {
        actions.onMouseOver(this.elementGroupNode, e);
        if (capability.get('canDragCrop')) {
          this.setCursor('grab');
        }
      },
      onMouseOut: e => {
        actions.onMouseOut(this.elementGroupNode, e);
        this.setCursor('default');
      },
      onMouseDown: e => {
        if (capability.get('canDragCrop')) {
          if (!element.get('encImgId')) {
            actions.onCloudClick(element);
          } else {
            this.onMoveStart(e);
          }
        }
      },
      onMouseMove: e => {
        actions.onMouseMove(element, e);
      }
    };

    let shadowRectProps = {};
    if (isSplit) {
      const startX = computed.get('rectX');
      const startY = computed.get('rectY');
      const clipWidth = computed.get('rectWidth');
      const clipHeight = computed.get('rectHeight');
      const cornerRadius = 3;
      photoElementGroupProps.clipFunc = function(ctx) {
        if (computed.get('rectWidth')) {
          ctx.beginPath();
          ctx.moveTo(startX, startY + cornerRadius);
          ctx.quadraticCurveTo(startX, startY, startX + cornerRadius, startY);
          ctx.lineTo(startX + clipWidth - cornerRadius, startY);
          ctx.quadraticCurveTo(
            startX + clipWidth,
            startY,
            startX + clipWidth,
            startY + cornerRadius
          );
          ctx.lineTo(startX + clipWidth, startY + clipHeight - cornerRadius);
          ctx.quadraticCurveTo(
            startX + clipWidth,
            startY + clipHeight,
            startX + clipWidth - cornerRadius,
            startY + clipHeight
          );
          ctx.lineTo(startX + cornerRadius, startY + clipHeight);
          ctx.quadraticCurveTo(
            startX,
            startY + clipHeight,
            startX,
            startY + clipHeight - cornerRadius
          );
          ctx.lineTo(startX, startY + cornerRadius);
          ctx.closePath();
          ctx.clip();
          // ctx.rect(computed.get('rectX'), computed.get('rectY'), computed.get('rectWidth'), computed.get('rectHeight'));
          // ctx.clip();
        }
      };

      shadowRectProps = {
        key: 'floatFramePhotoElementShadow',
        x: Math.ceil(startX) + 1,
        y: Math.ceil(startY) + 1,
        width: clipWidth - 3,
        height: clipHeight - 2,
        fill: 'rgba(255,255,255)',
        listening: false,
        cornerRadius,
        shadowColor: 'rgba(0,0,0, 0.40)',
        shadowBlur: 140 * ratio,
        shadowOffset: {
          x: -56 * ratio,
          y: 42 * ratio
        }
      };
    }

    const childrenProps = {
      x: 0,
      y: 0,
      width: Math.ceil(newWidth),
      height: Math.ceil(newHeight)
    };

    const imageProps = {
      ...childrenProps,
      image: imageObj,
      id: elementId,
      crop
    };

    const rectProps = {
      ...childrenProps,
      fill: isPreview || isScreenShot ? '#fff' : '#f6f6f6',
      stroke: '#dfdfdf',
      strokeWidth: 1,
      id: elementId
    };

    const cloudImageObj = new window.Image();
    cloudImageObj.src = cloudImage;
    let uploadCloudWidth = newWidth / 5;
    uploadCloudWidth = uploadCloudWidth < 140 ? 140 : uploadCloudWidth;
    uploadCloudWidth =
      uploadCloudWidth > newWidth - 10 ? newWidth - 10 : uploadCloudWidth;
    let uploadCloudHeight = 122 / 162 * uploadCloudWidth;
    if (uploadCloudHeight > newHeight - 10) {
      uploadCloudHeight = newHeight - 10;
      uploadCloudWidth = 162 / 122 * uploadCloudHeight;
    }
    const uploadCloudProps = {
      x: (newWidth - uploadCloudWidth) / 2,
      y: (newHeight - uploadCloudHeight) / 2,
      width: uploadCloudWidth,
      height: uploadCloudHeight,
      image: cloudImageObj
    };

    const textLoadProps = {
      width: width - borderSize,
      height: height - borderSize
    };
    const loadFailProps = {
      width: width - borderSize,
      height: height - borderSize,
      tryToDownload
    };

    const scale = element.getIn(['computed', 'scale']);
    const isShowWarnTip = scale > RESIZE_LIMIT;
    if (this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL) {
      boundTrackerActions && boundTrackerActions.addTracker && boundTrackerActions.addTracker('AutoRenderFailed');
    }
    const elementBleedBottom =
      (element.getIn(['bleed', 'bottom']) || 0) * ratio;
    const canvasBorderBottom =
      page.getIn(['canvasBorderThickness', 'bottom']) || 0;
    let boardHideSize =
      parameters.getIn(['boardInMatting', 'bottom']) ||
      parameters.getIn(['boardInFrame', 'bottom']) ||
      0;
    if (boardHideSize) {
      boardHideSize -= page.getIn(['bleed', 'bottom']);
    }
    let snackBarTop = height - elementBleedBottom - 43;
    const maxSnackBarTop =
      (page.get('height') -
        page.getIn(['bleed', 'bottom']) -
        canvasBorderBottom -
        boardHideSize -
        element.get('y')) *
        ratio -
      43;
    if (snackBarTop > maxSnackBarTop) {
      snackBarTop = maxSnackBarTop;
    }

    const exchangeActions = {
      onExchangeDragStart: (e) => {
        exchangeImageActions.onExchangeDragStart(pageId, elementId, imageObj, e);
        document.onmouseup = () => {
          this.setState({
            isSnackBarShow: false,
            isExchangeShow: false
          });
          document.onmouseup = null;
        }
      },
      onExchangeDragMove: exchangeImageActions.onExchangeDragMove,
      onExchangeDragEnd: exchangeImageActions.onExchangeDragEnd,
      onMouseDown: (e) => {
        e.cancelBubble = true;
      }
    };
    return (
      <Group {...photoElementContainerGroupProps}>
        {isSplit ? <Rect {...shadowRectProps} /> : null}

        <Group {...photoElementGroupProps}>
          {hasImage && this.props.downloadStatus ? (
            <Image
              ref={elementNode => (this.elementNode = elementNode)}
              {...imageProps}
            />
          ) : null}

          {hasImage && this.state.isExchangeShow && isSplit && !(isPreview || isScreenShot) ? <ExchangeImage actions={exchangeActions} /> : null}

          {!hasImage ? <Rect {...rectProps} /> : null}

          {!hasImage && !(isPreview || isScreenShot) ? (
            <Image {...uploadCloudProps} />
          ) : null}

          {hasImage && !(isPreview || isScreenShot) && isShowWarnTip ? (
            <PhotoWarnTip
              parentHeight={height}
              parentWith={width}
              offsetX={offsetX}
              offsetY={offsetY}
            />
          ) : null}

          {this.props.downloadStatus === downloadStatus.DOWNLOADING && !isScreenShot? (
            <TextLoading {...textLoadProps} />
          ) : null}

          {this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL && !isScreenShot ? (
            <LoadFailed {...loadFailProps} />
          ) : null}
          {hasImage &&
          !(isPreview || isScreenShot) &&
          this.state.isSnackBarShow ? (
            <PhotoSnackBar
              x={0}
              y={snackBarTop}
              width={newWidth}
              height={44}
              isHideText={isRoundShape}
              onEditImage={() => actions.onEditImage(element)}
              onRemoveImage={() => actions.onRemoveImage(element)}
            />
          ) : null}
        </Group>
      </Group>
    );
  }
}

PhotoElement.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  isPreview: PropTypes.bool,
  isScreenShot: PropTypes.bool,
  imageObj: PropTypes.object,
  downloadStatus: PropTypes.number
};

export default translate('PhotoElement')(PhotoElement);
