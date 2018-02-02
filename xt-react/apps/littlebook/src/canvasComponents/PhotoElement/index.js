import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { Group, Image, Rect } from 'react-konva';

import PhotoWarnTip from '../PhotoWarnTip';
import { RESIZE_LIMIT, downloadStatus } from '../../contants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import TextLoading from '../TextLoading';
import LoadFailed from '../LoadFailed';

import { getCropRect } from '../../utils/crop';
import * as handler from './handler';

class PhotoElement extends Component {
  constructor(props) {
    super(props);

    this.onMoveStart = e => handler.onMoveStart(this, e);
    this.onMove = e => handler.onMove(this, e);
    this.onMoveStop = e => handler.onMoveStop(this, e);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.element;
    const newElement = nextProps.element;

    if (
      !Immutable.is(oldElement, newElement) ||
      this.props.imageObj !== nextProps.imageObj ||
      this.props.downloadStatus !== nextProps.downloadStatus
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
      t,
      actions,
      tryToDownload,
      boundTrackerActions,
      capability
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
    const hasImage = Boolean(imgUrl);
    const isSelected = element.get('isSelected');
    const elementId = element.get('id');
    const border = element.getIn(['computed', 'border']);
    const borderSize = border ? border.get('size') : 0;

    // 根据元素的crop信息计算需要从原图中截取的rect
    const crop = this.props.downloadStatus
      ? getCropRect(element.toJS(), imageObj)
      : null;

    const photoElementGroupProps = {
      x,
      y,
      width,
      height,
      offset,
      zIndex,
      ref: node => (this.elementGroupNode = node),
      rotation: element.get('rot'),
      draggable: false,
      name: 'element',
      onMouseEnter: e => {
        actions.onMouseEnter(element, e);
        if (capability.get('canDragCrop')) {
          this.setCursor('grab');
        }
      },
      onMouseLeave: e => {
        actions.onMouseLeave(element, e);
      },
      onMouseOver: e => {
        actions.onMouseOver(this.elementGroupNode, e);
      },
      onMouseOut: e => {
        actions.onMouseOut(this.elementGroupNode, e);
        this.setCursor('default');
      },
      onMouseDown: e => {
        if (capability.get('canDragCrop')) {
          this.onMoveStart(e);
        }
      },
      onMouseMove: e => {
        actions.onMouseMove(element, e);
      }
    };

    const childrenProps = {
      x: 0,
      y: 0,
      width,
      height
    };

    const imageProps = {
      ...childrenProps,
      image: imageObj,
      id: elementId,
      crop
    };

    const rectProps = {
      ...childrenProps,
      fill: '#f6f6f6',
      stroke: '#dfdfdf',
      strokeWidth: 1,
      id: elementId
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
      boundTrackerActions.addTracker('AutoRenderFailed');
    }

    return (
      <Group {...photoElementGroupProps}>
        {hasImage && this.props.downloadStatus
          ? <Image
              ref={elementNode => (this.elementNode = elementNode)}
              {...imageProps}
            />
          : null}

        {!hasImage && !isPreview ? <Rect {...rectProps} /> : null}

        {hasImage && !isPreview && isShowWarnTip
          ? <PhotoWarnTip parentHeight={height} parentWith={width} />
          : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOADING
          ? <TextLoading {...textLoadProps} />
          : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL
          ? <LoadFailed {...loadFailProps} />
          : null}
      </Group>
    );
  }
}

PhotoElement.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  isPreview: PropTypes.bool,
  imageObj: PropTypes.object,
  downloadStatus: PropTypes.number
};

export default translate('PhotoElement')(PhotoElement);
