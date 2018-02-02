import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { Group, Image, Rect, Text } from 'react-konva';

import { downloadStatus } from '../../constants/strings';
import * as helperHandler from '../../utils/canvas/helper';
import TextLoading from '../TextLoading';
import LoadFailed from '../LoadFailed';

class CalendarElement extends Component {
  constructor(props) {
    super(props);
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

  render() {
    const {
      element,
      isPreview,
      imageObj,
      actions,
      tryToDownload,
      isScreenshot
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
    const elementId = element.get('id');

    const CalendarGroupProps = {
      x,
      y,
      width,
      height,
      offset,
      zIndex,
      ref: node => (this.elementGroupNode = node),
      rotation: element.get('rot'),
      draggable: false,
      name: 'element'
    };

    const childrenProps = {
      x: 0,
      y: 0,
      width,
      height
    };
    const textLoadProps = {
      width,
      height
    };
    const loadFailProps = {
      width,
      height,
      tryToDownload
    };

    const imageProps = {
      ...childrenProps,
      image: imageObj,
      id: elementId
    };

    return (
      <Group {...CalendarGroupProps}>
        {hasImage && this.props.downloadStatus !== downloadStatus.DOWNLOADING ? <Image {...imageProps} /> : null}

        {this.props.downloadStatus === downloadStatus.DOWNLOADING && !isScreenshot
          ? <TextLoading {...textLoadProps} />
          : null}
        {this.props.downloadStatus === downloadStatus.DOWNLOAD_FAIL && !isScreenshot
          ? <LoadFailed {...loadFailProps} />
          : null}
      </Group>
    );
  }
}

CalendarElement.propTypes = {
  element: PropTypes.instanceOf(Immutable.Map),
  imageObj: PropTypes.object,
  isShowTextNotFit: PropTypes.bool,
  isShowTextOverflow: PropTypes.bool,
  downloadStatus: PropTypes.number
};

export default CalendarElement;
