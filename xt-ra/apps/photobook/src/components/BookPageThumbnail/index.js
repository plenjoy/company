import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { hashHistory } from 'react-router';

import {
  elementTypes,
  pageTypes,
  dragElementSelector
} from '../../contants/strings';

import './index.scss';

// 导入组件
import BackgroundElementThumbnail from '../BackgroundElementThumbnail';
import CameoElementThumbnail from '../CameoElementThumbnail';
import PhotoElementThumbnail from '../PhotoElementThumbnail';
import TextElementThumbnail from '../TextElementThumbnail';
import SpineTextElementThumbnail from '../SpineTextElementThumbnail';
import DecorationElement from '../DecorationElement';

import XDrag from '../../../../common/ZNOComponents/XDrag';
import XDrop from '../../../../common/ZNOComponents/XDrop';

import {
  setTransferDragNode,
  setTransferData,
  getTransferData,
  cloneDragNode
} from '../../../../common/utils/drag';

// 导入处理函数
import * as elementHandler from './handler/element';
import * as pageHandler from './handler/page';

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

    const { setMouseHoverDomNode } = this.props.actions;
    this.state = {
      elementArray: Immutable.List(),
      photoActions: {
        handleMouseOver: (data, event) => {
          const { element } = data;
          if (element.get('type') === elementTypes.photo) {
            setMouseHoverDomNode && setMouseHoverDomNode(event.target);
          }
        },
        handleMouseOut: data => {
          const { element } = data;
          if (element.get('type') === elementTypes.photo) {
            setMouseHoverDomNode && setMouseHoverDomNode(null);
          }
        }
      },
      textActions: {},
      hoverElementId: null
    };

    this.onDragEnd = this.onDragEnd.bind(this);

    this.onDragLeave = this.onDragLeave.bind(this);
    this.gotoEditPage = this.gotoEditPage.bind(this);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
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

    this.props.actions.setMouseHoverDomNode(null);
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
      if (dragElementId === elementId || !dragElementId) return;

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

    // 调用 preventDefault() 来避免浏览器对数据的默认处理
    // （drop 事件的默认行为是以链接形式打开）
    ev.preventDefault();

    if (dragData && dragData.elementId && elementId !== dragData.elementId) {
      ev.stopPropagation();

      boundProjectActions.swapPhotoElement(
        dragData.pageId,
        dragData.elementId,
        pageId,
        elementId
      );
      const isInTheSamePage = pageId == dragData.pageId;
      boundTrackerActions.addTracker(`ArrangePageMovePhoto,${isInTheSamePage}`);

      this.setState({
        hoverElementId: null
      });
    }
  }

  renderElement(element, index) {
    const { actions, data } = this.props;
    const {
      summary,
      page,
      ratio,
      paginationSpread,
      settings,
      parameters,
      size,
      specData,
      materials,
      isRenderText = true,
      ignoreEmpty = true
    } = data;

    const pageId = page.get('id');
    const elementId = element.get('id');

    const { hoverElementId } = this.state;

    const isHover = hoverElementId && hoverElementId === elementId;

    switch (element.get('type')) {
      case elementTypes.cameo: {
        const cameoData = {
          summary,
          element,
          ratio,
          page,
          paginationSpread,
          setting: settings.spec,
          parameters,
          size,
          specData,
          materials
        };
        return (
          <CameoElementThumbnail
            key={index}
            actions={actions}
            data={cameoData}
          />
        );
      }
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
          isHover
        };

        return (
          <XDrag
            key={element.get('id')}
            onDragStarted={this.onDragStart.bind(this, pageId, elementId)}
            onDragEnded={this.onDragEnd}
            onDragOvered={this.onDragOver.bind(this, elementId)}
            onDragLeaved={this.onDragLeave.bind(this, elementId)}
          >
            <XDrop onDroped={this.onDrop.bind(this, pageId, elementId)}>
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
      case elementTypes.paintedText: {
        // 在navpages 不过滤空文本 普通的Thumbnail要过滤
        if ((!element.get('text') && ignoreEmpty) || !isRenderText) {
          return null;
        }
        const { textActions } = this.state;
        const textData = { element, ratio, page };

        if (page.get('type') === pageTypes.spine) {
          return (
            <SpineTextElementThumbnail
              key={index}
              actions={textActions}
              data={textData}
            />
          );
        }
        return (
          <TextElementThumbnail
            key={index}
            actions={textActions}
            data={textData}
          />
        );
      }
      case elementTypes.text: {
        // 在navpages 不过滤空文本 普通的Thumbnail要过滤
        if ((!element.get('text') && ignoreEmpty) || !isRenderText) {
          return null;
        }

        const { textActions } = this.state;
        const textData = { element, ratio, page };
        if (page.get('type') === pageTypes.spine) {
          return (
            <SpineTextElementThumbnail
              key={index}
              actions={textActions}
              data={textData}
            />
          );
        }
        return (
          <TextElementThumbnail
            key={index}
            actions={textActions}
            data={textData}
          />
        );
      }
      case elementTypes.sticker: {
        const { decorationActions } = this.state;
        const decorationData = { element, ratio, page };

        return (
          <DecorationElement
            key={index}
            actions={decorationActions}
            data={decorationData}
          />
        );
      }
      case elementTypes.background: {
        const backgroundData = { element, ratio, page };
        return <BackgroundElementThumbnail key={index} data={backgroundData} />;
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
        if (
          element.get('type') === elementTypes.cameo &&
          summary.get('cameo') === 'none'
        ) {
          // nothing to do here.
        } else {
          html.push(this.renderElement(element, index));
        }
      });
    }

    return html;
  }

  gotoEditPage() {
    const { data, actions } = this.props;
    const { paginationSpread, page } = data;
    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');

    actions.boundPaginationActions.switchSheet(summary.get('sheetIndex'));

    const pageIndex = pages.indexOf(page);
    if (pageIndex !== -1) {
      actions.boundPaginationActions.switchPage(pageIndex, page.get('id'));
    }

    hashHistory.push('/editpage');
  }

  onMouseOver(event) {
    const { actions } = this.props;
    const { setMouseHoverDomNode } = actions;
    setMouseHoverDomNode(event.target);
  }

  onMouseOut(event) {
    const { setMouseHoverDomNode } = this.props.actions;
    setMouseHoverDomNode(null);
  }

  render() {
    const { data, actions, t } = this.props;
    const { page, ratio, summary, paginationSpread, isFlip = false } = data;

    const pageEnabled = page.get('enabled');
    const isCover = summary.get('isCover');
    const isPressBook = summary.get('isPressBook');
    const isCrystalOrMetal = summary.get('isSupportHalfImageInCover');

    const offset = page.get('offset');
    const handlerActions = {};
    const handlerData = {};

    const dataTip = pageEnabled && !isCover ? t('DRAG_TO_MOVE') : '';

    const bookPageStyle = {
      position: 'absolute',
      top: `${offset.get('top') * ratio.workspace}px`,
      left: `${offset.get('left') * ratio.workspace}px`,
      width: `${Math.round(page.get('width') * ratio.workspace)}px`,
      height: `${Math.round(page.get('height') * ratio.workspace)}px`
    };

    // 给内页加上内页的背景色.
    if (!isCover) {
      bookPageStyle.background =
        isPressBook && !pageEnabled ? '#fff' : page.get('bgColor');
    }

    const bookPageClassName = classNames('book-page-thumbnail', {
      // 添加水平翻转的classname
      flip: isFlip
    });

    return (
      <div
        ref="bookPage"
        className={bookPageClassName}
        style={bookPageStyle}
        onDoubleClick={this.gotoEditPage}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        data-tip={dataTip}
      >
        {this.getRenderHtml()}
      </div>
    );
  }
}

BookPageThumbnail.propTypes = {};

BookPageThumbnail.defaultProps = {};

export default translate('BookPage')(BookPageThumbnail);
