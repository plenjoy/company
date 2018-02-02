import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { translate } from 'react-translate';
import Immutable from 'immutable';
import classNames from 'classnames';
import SnackBar from '../SnackBar';

import {
  elementTypes,
  pageTypes,
  dragElementSelector
} from '../../constants/strings';

import './index.scss';

// 导入组件
import PhotoElementThumbnail from '../PhotoElementThumbnail';
import TextElementThumbnail from '../TextElementThumbnail';
import CalendarElementThumbnail from '../CalendarElementThumbnail';

import XDrag from '../../../../common/ZNOComponents/XDrag';
import XDrop from '../../../../common/ZNOComponents/XDrop';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';

import {
  setTransferDragNode,
  setTransferData,
  getTransferData,
  cloneDragNode
} from '../../../../common/utils/drag';


// 导入处理函数
import * as elementHandler from './handler/element';
import * as pageHandler from './handler/page';
import * as snackbarHandler from './handler/snackbarHandler';

class BookPageThumbnail extends Component {
  constructor(props) {
    super(props);

    // element的相关方法.
    this.computedElementOptions = (element, ratio) => {
      return elementHandler.computedElementOptions(this, element, ratio);
    };

    // 获取待渲染的html
    this.getRenderHtml = this.getRenderHtml.bind(this);

    this.elementRadians = {};
    const { setMouseHoverDomNode, actionbarActions,boundTrackerActions} = this.props.actions;

    this.state = {
      snackBar: {
        isShown: false,
        left: 0,
        top: 0,
        width: '100%',
        templateId: 0,
        zIndex: 200
      },
      elementArray: Immutable.List(),
      photoActions: {
        handleMouseOver: (data, event) => {
          const { element } = data;
          if (element.get('type') === elementTypes.photo) {
            setMouseHoverDomNode(event.target);
          }
        },
        handleMouseLeave: (data) => {
          const { element } = data;
          if (element.get('type') === elementTypes.photo) {
            setMouseHoverDomNode(null);
          }
        },
        handleClick: (data,event) =>{
          const { element } = data;
          boundTrackerActions.addTracker('TapImage');
          pageHandler.onEditImage(this,element);
        },
        removeImage: (element) =>{
          pageHandler.onRemoveImage(this,element);
        }
      },
      textActions: {
        handleClick: (data, event) => {
          const { element } = data;
          pageHandler.onEditText(this, element);
        }
      },
      hoverElementId: null
    };

    this.onDragEnd = this.onDragEnd.bind(this);

    this.onDragLeave = this.onDragLeave.bind(this);

    this.onMouseEnter = () => snackbarHandler.onMouseEnter(this);
    this.onMouseLeave = () => snackbarHandler.onMouseLeave(this);
    this.onReplaceImage = () => snackbarHandler.onReplaceImage(this);
    this.uploadFileClicked = () => snackbarHandler.uploadFileClicked(this);
    this.onSnackBarEditImage = () => snackbarHandler.onSnackBarEditImage(this);
    this.toggleModal = (type, status) => snackbarHandler.toggleModal(this, type, status);
  }

  componentWillMount() {
    pageHandler.componentWillMount(this);
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  onDragStart(pageId, elementId, e) {
    if (!window.__isDragPage) {
      const node = ReactDOM.findDOMNode(this.refs[elementId]);
      const dragNode = cloneDragNode(node, dragElementSelector.photo);

      setTransferDragNode(e, dragNode);
      setTransferData(e, {
        pageId,
        elementId
      });

      e.stopPropagation();
      // 拖动的元素id是一个全局的 不仅仅是在一个bookpage内
      window.__dragElementId = elementId;
    }
  }

  onDragEnd(e) {
    // e.stopPropagation();

    const dragNode = document.getElementById(dragElementSelector.photo);

    if (dragNode) {
      dragNode.parentNode.removeChild(dragNode);
    }

    delete window.__dragElementId;

    this.setState({
      hoverElementId: null
    });
  }

  onDragOver(elementId, e) {
    if (!window.__isDragPage) {
      const dragElementId = window.__dragElementId;
      if (dragElementId && dragElementId === elementId) return;

      this.setState({
        hoverElementId: elementId
      });

      e.stopPropagation();
    }
  }

  onDragLeave(elementId) {
    if (elementId === this.state.hoverElementId) {
      this.setState({
        hoverElementId: null
      });
    }
  }

  onDrop(pageId, elementId, event) {
    const { actions } = this.props;
    const { boundProjectActions, boundTrackerActions } = actions;

    const ev = event || window.event;
    const dragData = getTransferData(ev);
    this.setState({
        hoverElementId: null
    });
    // 调用 preventDefault() 来避免浏览器对数据的默认处理
    // （drop 事件的默认行为是以链接形式打开）
    ev.preventDefault();

    if (dragData && dragData.elementId && elementId !== dragData.elementId) {
      ev.stopPropagation();

      boundTrackerActions.addTracker('SwapImages');
      boundProjectActions.swapPhotoElement(
        dragData.pageId, dragData.elementId,
        pageId, elementId
      );


    } else if ((dragData instanceof Array)  && dragData.length) {
      const curElement = dragData[0];
      const elementData = {
        id: elementId,
        encImgId: curElement.encImgId,
        imageid: curElement.imageid,
        imgRot: 0,
        style: {
          effectId: 0,
          opacity: 100
        },
        imgFlip: false
      };
      boundProjectActions.updateElement(elementData);
    }

  }

  renderElement(element, index) {
    const { actions, data } = this.props;
    const { summary, page, ratio, paginationSpread, settings, parameters, size, specData, materials, isRenderText = true, ignoreEmpty = false } = data;

    const pageId = page.get('id');
    const elementId = element.get('id');

    const { hoverElementId } = this.state;

    const isHover = (hoverElementId && hoverElementId === elementId);

    switch (element.get('type')) {
      case elementTypes.photo: {
        // 在navpages 不过滤空的图片框 普通的Thumbnail要过滤
        if (!element.get('encImgId') && ignoreEmpty) {
          return null;
        }

        const { photoActions } = this.state;

        const photoData = {
          summary,
          element,
          ratio,
          page,
          paginationSpread,
          isHover,
          product: settings.spec.product
        };

        const isDisabled = !element.get('encImgId');

        return (
          <XDrag
            key={element.get('id')}
            onDragStarted={this.onDragStart.bind(this, pageId, elementId)}
            onDragEnded={this.onDragEnd}
            onDragOvered={this.onDragOver.bind(this, elementId)}
            onDragLeaved={this.onDragLeave.bind(this, elementId)}
            isDisabled={isDisabled}
          >
            <XDrop
              onDroped={this.onDrop.bind(this, pageId, elementId)}
            >
              <PhotoElementThumbnail
                key={index}
                actions={photoActions}
                data={photoData}
                ref={element.get('id')}
              />
            </XDrop>
          </XDrag>
        );
      }
      case elementTypes.text: {
        // 在navpages 不过滤空文本 普通的Thumbnail要过滤
        if ((!element.get('text') && ignoreEmpty) || !isRenderText) {
          return null;
        }

        const { textActions } = this.state;
        const textData = { element, ratio, page };
        return (
          <TextElementThumbnail
            key={index}
            actions={textActions}
            data={textData}
          />
        );
      }
      case elementTypes.calendar: {
        // 在navpages 不过滤空的图片框 普通的Thumbnail要过滤
        if (!element.get('encImgId') && ignoreEmpty) {
          return null;
        }

        // const { photoActions } = this.state;
        const photoActions = {};

        const calendarData = {
          summary,
          element,
          ratio,
          page,
          paginationSpread,
          isHover
        };

        return (
          <CalendarElementThumbnail
            key={index}
            actions={photoActions}
            data={calendarData}
            ref={element.get('id')}
          />
        );
      }
      default:
        return null;
    }
  }

  getRenderHtml() {
    const { elementArray, actionBarData } = this.state;
    const { data } = this.props;
    const { summary, page, ratio } = data;
    const html = [];

    if (elementArray.size) {
      elementArray.forEach((element, index) => {
        if (element.get('type') === elementTypes.cameo && summary.get('cameo') === 'none') {
          // nothing to do here.
        } else {
          html.push(this.renderElement(element, index));
        }
      });
    }

    return html;
  }

  render() {
    const { data, actions } = this.props;
    const { boundImagesActions } = actions;
    const { page, ratio, summary, paginationSpread, size } = data;

    const pageEnabled = page.get('enabled');
    const isCover = summary.get('isCover');

    const offset = page.get('offset');
    const handlerActions = { };
    const handlerData = { };

    const bookPageStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${Math.round(page.get('width') * ratio.workspace)}px`,
      height: `${Math.round(page.get('height') * ratio.workspace)}px`
    };

    const bookPageClassName = classNames('book-page-thumbnail');

    const { snackBar } = this.state;
    const snackBarProps = {
      ...snackBar,
      isShowReplace: true,
      isShowEdit: true,
      isShowDelete: false,
      actions: {
        onMouseEnter: () => {},
        onMouseLeave: () => {},
        onEditImage: this.onSnackBarEditImage,
        onReplaceImage: this.onReplaceImage
      },
      element: null
    };

    return (
      <div
        ref="bookPage"
        className={bookPageClassName}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={bookPageStyle}
      >
        { this.getRenderHtml() }
        <SnackBar {...snackBarProps} />
        <XFileUpload
          className="hide"
          boundUploadedImagesActions={boundImagesActions}
          toggleModal={this.toggleModal}
          ref={fileUpload => (this.fileUpload = fileUpload)}
        />
      </div>
    );
  }
}

BookPageThumbnail.propTypes = {
};

BookPageThumbnail.defaultProps = {
};

export default translate('BookPage')(BookPageThumbnail);

