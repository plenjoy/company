import Immutable from 'immutable';
import { merge, get } from 'lodash';
import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';
import { Layer, Stage, Group, Rect, Text } from 'react-konva';

import { transform } from '../../../../common/utils/transform';

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

import PhotoElement from '../PhotoElement';
import TextElement from '../TextElement';
import CalendarElement from '../CalendarElement';

import './index.scss';

class BookPageScreenshot extends Component {
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
    this.toDownload = ele => toDownload(this, ele);


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
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  componentWillUnmount() {

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
      materials,
      project
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

        const textElementProps = {
          key: elementId,
          element,
          isPreview,
          actions: basicActions,
          imageObj: theDownloadData.get('imageObj'),
          downloadStatus: theDownloadData.get('downloadStatus'),
          isShowTextNotFit: false,
          isShowTextOverflow: false,
          tryToDownload: () => this.toDownload(Immutable.List([element])),
          isScreenshot: true
        };

        switch (element.get('type')) {
          case elementTypes.photo: {
            const forceToDownload = true;
            const photoElementProps = {
              key: elementId,
              element,
              isPreview: true,
              pageId,
              isScreenshot: true,
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
            if (!element.get('text')) {
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
              tryToDownload: () => this.toDownload(Immutable.List([element])),
              isScreenshot: true
            };
            html.push(<CalendarElement {...calendarElementsProps} />);
          }
          default:
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
      isBookCoverInnerWarp,
      innerEffectValue,
      project,
      x,
      y
    } = data;
    const { boundImagesActions } = actions;

    const pageEnabled = page.get('enabled');
    const pageId = page.get('id');
    const isCover = summary.get('isCover');
    const isActive = page.get('isActive');

    const isSpinePage = false;
    const isSpineText = false;

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

    const renderElementArray = elementArray;

    const isShowFakeElements = false;

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
    const sheetGroupProps = {
      x,
      y
    };
    return (


      <Group ref={group => (this.unselectElements = group)} {...sheetGroupProps}>
        {this.getRenderHtml(renderElementArray)}
      </Group>

    );
  }
}

BookPageScreenshot.propTypes = {};

BookPageScreenshot.defaultProps = {};

export default translate('BookPageScreenshot')(BookPageScreenshot);
