import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { translate } from 'react-translate';
import Immutable from 'immutable';
import classNames from 'classnames';
import { hashHistory } from 'react-router';
import { isFunction } from 'lodash';

import {
  elementTypes,
  pageTypes,
  dragElementSelector,
  logoInfo
} from '../../contants/strings';

import './index.scss';

// 导入组件
import BackgroundElement from '../BackgroundElement';
import PhotoElementThumbnail from '../PhotoElementThumbnail';
import TextElementThumbnail from '../TextElementThumbnail';
import SpineTextElementThumbnail from '../SpineTextElementThumbnail';
import ProductLogo from '../ProductLogo';
import EmptyPhotoElement from '../EmptyPhotoElement';

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

import { getImageShapeString } from '../../utils/template/getTemplateId';

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
            isFunction(setMouseHoverDomNode) && setMouseHoverDomNode(event.target);
          }
        },
        handleMouseOut: (data) => {
          const { element } = data;
          if (element.get('type') === elementTypes.photo) {
            isFunction(setMouseHoverDomNode) && setMouseHoverDomNode(null);
          }
        }
      },
      textActions: {},
      hoverElementId: null
    };

    this.onDragEnd = this.onDragEnd.bind(this);

    this.onDragLeave = this.onDragLeave.bind(this);
    this.gotoEditPage = this.gotoEditPage.bind(this);
  }

  componentWillMount() {
    pageHandler.componentWillMount(this);
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  onDragStart(pageId, elementId, pageIdentity, e) {
    if (!window.__isDragPage) {
      const node = ReactDOM.findDOMNode(this.refs[elementId]);
      const dragNode = cloneDragNode(node, dragElementSelector.photo);

      setTransferDragNode(e, dragNode);
      setTransferData(e, {
        pageId,
        elementId,
        pageIdentity
      });

      e.stopPropagation();
      // 拖动的元素id是一个全局的 不仅仅是在一个bookpage内
      window.__dragElementId = elementId;

      this.props.actions.setMouseHoverDomNode(null);
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

  onDrop(pageId, elementId, pageIdentity, event) {
    const { actions, data } = this.props;
    const { template, allElements, allImages } = data;
    const { boundProjectActions, boundTrackerActions, doAutoLayout } = actions;
    const ev = event || window.event;

    // 调用 preventDefault() 来避免浏览器对数据的默认处理
    // （drop 事件的默认行为是以链接形式打开）
    ev.preventDefault();

    const dragData = getTransferData(ev);

    if (dragData && dragData.elementId && elementId !== dragData.elementId) {
      let needApplyTemplate = true;

      let dropElement = null;
      let dragElement = null;
      allElements.forEach((obj) => {
        if (obj.get('id') === elementId) {
          dropElement = obj;
        }

        if (obj.get('id') === dragData.elementId) {
          dragElement = obj;
        }
      });

      if (dragElement && dropElement) {
        let dragImage = null;
        let dropImage = null;

        allImages.forEach((image) => {
          if (image.get('encImgId') === dragElement.get('encImgId')) {
            dragImage = image;
          }

          if (image.get('encImgId') === dropElement.get('encImgId')) {
            dropImage = image;
          }
        });

        if (dragImage && dropImage) {
          const dragImageShapeString = getImageShapeString(dragImage.toJS());
          const dropImageShapeString = getImageShapeString(dropImage.toJS());

          if (dragImageShapeString === dropImageShapeString) {
            needApplyTemplate = false;
          }
        }
      }

      ev.stopPropagation();
      boundProjectActions
        .swapPhotoElement(
          dragData.pageId,
          dragData.elementId,
          pageId,
          elementId
        )
        .then(() => {
          if (needApplyTemplate) {
            const pageIds =
              dragData.pageId !== pageId ? [dragData.pageId, pageId] : [pageId];

            // 由于该组件不能获取所有的pages, 就无法判断page是否是封面, 所以我们就添加一个参数.
            // 第二个参数标识, 封面上的图片更换, 不需要重新应用模板.
            doAutoLayout && doAutoLayout(pageIds, true);
          }
        });

      boundTrackerActions.addTracker(
        `ChangePhotoSequence,${dragData.pageIdentity},${pageIdentity}`
      );
    }

    this.setState({
      hoverElementId: null
    });
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
      size
    } = data;
    const pageIdentity = page.get('pageIdentity');

    const pageId = page.get('id');
    const elementId = element.get('id');

    const { hoverElementId } = this.state;

    const isHover = hoverElementId && hoverElementId === elementId;
    const isCover = summary.get('isCover');

    switch (element.get('type')) {
      case elementTypes.photo: {
        // 过滤空的图片框.
        if (!isCover && !element.get('encImgId')) {
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
            key={elementId}
            onDragStarted={this.onDragStart.bind(
              this,
              pageId,
              elementId,
              pageIdentity
            )}
            onDragEnded={this.onDragEnd}
            onDragOvered={this.onDragOver.bind(this, elementId)}
            onDragLeaved={this.onDragLeave.bind(this, elementId)}
          >
            <XDrop
              onDroped={this.onDrop.bind(this, pageId, elementId, pageIdentity)}
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
        // 过滤空的文本框.
        if (!element.get('text')) {
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

      default:
        return null;
    }
  }

  getRenderHtml() {
    const { elementArray, actionBarData } = this.state;
    const { data } = this.props;
    const { summary, page, ratio, variables, size, isNavpages } = data;
    const html = [];
    const isCover = summary.get('isCover');

    // 给封面的背面添加一个product logo.
    if (isCover) {
      // 计算cover上面 空photo div的位置
      const coverWithoutBleedWidth =
        size.renderCoverSheetSizeWithoutBleed.width;
      const coverWithoutBleedHeight = size.renderCoverSheetSize.height;
      const renderSpainWidth = size.renderSpainWidth;
      const spineRight =
        coverWithoutBleedWidth / 2 +
        renderSpainWidth / 2 -
        size.renderCoverSheetSize.left +
        2;
      const emptyPhotoWidth = coverWithoutBleedWidth / 2 - renderSpainWidth / 2;
      const emptyPhotoTop = -size.renderCoverSheetSize.top - 1;

      if (
        page.get('type') === pageTypes.full &&
        page.getIn(['backend', 'isPrint'])
      ) {
        const logo = summary.get('logo');
        const coverForegroundColor = variables.get('coverForegroundColor');
        const logoWidth = logoInfo.ratio * page.get('width') * ratio.workspace;

        const productLogoData = {
          style: {
            top: `${logo.get('top') * ratio.workspace}px`,
            left: `${logo.get('left') * ratio.workspace - logoWidth / 2}px`,
            width: `${logoWidth}px`
          },
          logoType: coverForegroundColor === '#fefefe' ? 1 : 2
        };

        html.push(<ProductLogo key="ProductLogo" data={productLogoData} />);
      }
      // 空photo div
      if (!elementArray.size && isNavpages) {
        const EmptyPhotoElementStyle = {
          position: 'absolute',
          width: `${emptyPhotoWidth}px`,
          height: `${coverWithoutBleedHeight}px`,
          top: `${emptyPhotoTop}px`,
          left: `${spineRight}px`,
          background: '#F6F6F6'
        };
        html.push(<EmptyPhotoElement style={EmptyPhotoElementStyle} />);
      }
    }

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
    const { paginationSpread } = data;
    const summary = paginationSpread.get('summary');
    actions.switchSheet({
      current: summary.get('sheetIndex')
    });

    hashHistory.push('/editpage');
  }

  render() {
    const { data, actions } = this.props;
    const { page, ratio, summary, paginationSpread } = data;

    const pageEnabled = page.get('enabled');
    const isCover = summary.get('isCover');
    const isPressBook = summary.get('isPressBook');
    const isCrystalOrMetal = summary.get('isSupportHalfImageInCover');

    const offset = page.get('offset');
    const handlerActions = {};
    const handlerData = {};

    const bookPageStyle = {
      cursor: 'pointer',
      position: 'absolute',
      top: `${offset.get('top') * ratio.workspace}px`,
      left: `${offset.get('left') * ratio.workspace}px`,
      width: `${Math.round(page.get('width') * ratio.workspace)}px`,
      height: `${Math.round(page.get('height') * ratio.workspace)}px`,
      background:
        isPressBook && !pageEnabled && !isCover ? '#fff' : page.get('bgColor')
    };

    const bookPageClassName = classNames('book-page-thumbnail');

    return (
      <div
        ref="bookPage"
        className={bookPageClassName}
        style={bookPageStyle}
        onDoubleClick={this.gotoEditPage}
      >
        {this.getRenderHtml()}
      </div>
    );
  }
}

BookPageThumbnail.propTypes = {};

BookPageThumbnail.defaultProps = {};

export default translate('BookPage')(BookPageThumbnail);
