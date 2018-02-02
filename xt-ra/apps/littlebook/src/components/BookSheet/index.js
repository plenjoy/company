import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import classNames from 'classnames';
import { spineExpandingTopRatio } from '../../contants/strings';

import XDrag from '../../../../common/ZNOComponents/XDrag';
import XDrop from '../../../../common/ZNOComponents/XDrop';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import './index.scss';

import PageNumberSimple from '../../components/PageNumberSimple';
import BookPage from '../../canvasComponents/BookPage';
import BookPageThumbnail from '../BookPageThumbnail';
import ShadowElement from '../ShadowElement';
import PageNumber from '../../components/PageNumber';
import DisableHandler from '../DisableHandler';
import PageHover from '../PageHover';
import DragLine from '../DragLine';
import NavPageDisableHandler from '../NavPageDisableHandler';

// 导入handler
import * as pageHandler from './handler/page';

class BookSheet extends Component {
  constructor(props) {
    super(props);

    this.getPageElements = (page, elements) =>
      pageHandler.getPageElements(this, page, elements);
    this.computedInnerSheet = (
      workspaceRatio,
      size,
      pages,
      pageIndex,
      isHardCover
    ) =>
      pageHandler.computedInnerSheet(
        workspaceRatio,
        size,
        pages,
        pageIndex,
        isHardCover
      );

    // 移动page时触发.
    this.onDragPageStarted = (page, ref, event) =>
      pageHandler.onDragPageStarted(this, page, ref, event);
    this.onDragPageEnd = event => pageHandler.onDragPageEnd(this, event);

    // 移到page的title时触发.
    this.onDragPageTitleStarted = (sheetIndex, pageIndex, event) =>
      pageHandler.onDragPageTitleStarted(this, sheetIndex, pageIndex, event);
    this.onDragPageTitleEnd = (sheetIndex, pageIndex, event) =>
      pageHandler.onDragPageTitleEnd(this, sheetIndex, pageIndex, event);

    // 在目标元素上释放鼠标时触发.
    this.onDropPage = (page, event) =>
      pageHandler.onDropPage(this, page, event);
    this.onDragLeaved = (page, event) =>
      pageHandler.onDragLeaved(this, page, event);
    this.onDragOvered = (page, event) =>
      pageHandler.onDragOvered(this, page, event);

    this.state = {
      // 是否显示拖拽时, 进入目标元素后的样式.
      dropPageId: null,

      // 被拖拽的page的id.
      dragPageId: null,

      // 存放选中pagehover的状态.
      pageHovers: []
    };

    this.onMouseOverInnerSheet = (page, ev) =>
      pageHandler.onMouseOverInnerSheet(this, page, ev);
    this.onMouseOutInnerSheet = (page, ev) =>
      pageHandler.onMouseOutInnerSheet(this, page, ev);

    // chosePage
    this.switchSheet = this.switchSheet.bind(this);
  }

  switchSheet() {
    const { onNavPagesSwitchSheet, shouldSwitchSheet } = this.props.data;

    if (!shouldSwitchSheet) {
      return;
    }
    onNavPagesSwitchSheet(this);
  }

  componentDidUpdate() {
    const {
      pagination,
      paginationSpread,
      shouldSwitchSheet = false
    } = this.props.data;
    const summary = paginationSpread.get('summary');
    const sheetIndex = summary.get('sheetIndex');

    if (pagination.sheetIndex === sheetIndex && shouldSwitchSheet) {
      if (this.componentRef.scrollIntoViewIfNeeded) {
        this.componentRef.scrollIntoViewIfNeeded();
      } else {
        this.componentRef.scrollIntoView();
      }
    }
  }

  render() {
    const { data, actions } = this.props;
    const {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet,
      setMouseHoverDomNode
    } = actions;
    const {
      urls,
      size,
      settings,
      position,
      ratios,
      variables,
      styles,
      pageNumberStyle,
      materials,
      template,
      pagination,
      paginationSpread,
      index,
      thumbnail,
      snipping,
      ignoreEmpty,
      isPreview,
      parameters,
      isShowSimplePageNumber = false,
      shouldSwitchSheet = false,
      isNavpages = false,
      undoData,
      allImages,
      userId,
      project,
      capability,
      allElements,
      env
    } = data;
    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const elements = paginationSpread.get('elements');
    const images = paginationSpread.get('images');
    const shadow = paginationSpread.get('shadow');
    const isSetCoverAsInnerBg = summary.get('isSetCoverAsInnerBg');
    const sheetIndex = summary.get('sheetIndex');
    const isHardCover = summary.get('isHardCover');
    let pageNumber = paginationSpread.get('pageNumber');

    const coverBackgroundColor = summary.get('coverBackgroundColor');
    const { pageHovers } = this.state;

    // 页面元素
    const ratio = {
      workspace: ratios.innerWorkspace
    };

    const className = classNames('book-sheet item');

    const containerStyle = merge(
      {},
      {
        width: `${size.innerWorkspaceSize.width}px`,
        height: `${size.innerWorkspaceSize.height}px`
      },
      styles
    );

    // 获取封面素材的地址.
    const bgColor = isSetCoverAsInnerBg ? coverBackgroundColor : 'transparent';

    const sheetWithBleedPosition = {
      top:
        (size.renderInnerSheetSize.height -
          size.renderInnerSheetSizeWithoutBleed.height) /
        2,
      left:
        (size.renderInnerSheetSize.width -
          size.renderInnerSheetSizeWithoutBleed.width) /
        2
    };

    const renderStyle = {
      width: `${size.renderInnerSize.width}px`,
      height: `${size.renderInnerSize.height}px`,
      background: bgColor
    };

    const sheetStyle = {
      width: `${size.renderInnerSheetSizeWithoutBleed.width}px`,
      height: `${size.renderInnerSheetSizeWithoutBleed.height}px`,
      top: `${position.render.top}px`,
      left: `${position.render.left}px`
    };

    const sheetWithBleedStyle = {
      width: `${size.renderInnerSheetSize.width}px`,
      height: `${size.renderInnerSheetSize.height}px`,
      top: `${-sheetWithBleedPosition.top}px`,
      left: `${-sheetWithBleedPosition.left}px`
    };

    // book page的actions和data
    const pageActions = {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet,
      setMouseHoverDomNode
    };
    const bookPages = [];
    const handlerActions = {
      handleDragOver: this.onSheetDragOver,
      handleDrop: this.onSheetDroped
    };
    const handlerData = {};
    let isCover = false;

    if (pages.size) {
      pages.forEach((page, index) => {
        isCover = summary.get('isCover');
        const isPageDraggable = page.get('isPageDraggable');
        const isPageDropable = page.get('isPageDropable');

        let pageData = {
          urls,
          size,
          summary,
          page,
          elements: this.getPageElements(page, elements),
          template,
          pagination,
          ratio,
          paginationSpread,
          index,
          images,
          settings,
          ignoreEmpty,
          isPreview,
          parameters,
          undoData,
          variables,
          allImages,
          userId,
          project,
          capability,
          allElements,
          materials,
          template,
          env
        };

        const ref = pageHandler.getRefName(sheetIndex, index);
        const isPaperCover = summary.get('isPaperCover');

        // 是否渲染缩略图
        if (isCover) {
          if (thumbnail) {
            bookPages.push(
              <BookPageThumbnail
                key={index}
                actions={pageActions}
                data={pageData}
              />
            );
          } else {
            bookPages.push(
              <BookPage key={index} actions={pageActions} data={pageData} />
            );
          }
        } else {
          // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.
          const innerSheetSizeObj = this.computedInnerSheet(
            ratios.innerWorkspace,
            size,
            pages,
            index,
            isHardCover
          );

          pageData = merge({}, pageData, {
            size: innerSheetSizeObj
          });

          const innerSheetPosition = {
            top:
              position.render.top +
              innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.top,
            left:
              position.render.left +
              innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.left
          };
          const innerSheetStyle = {
            width: `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed
              .width}px`,
            height: `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed
              .height + (isPaperCover ? 1 : 0)}px`,
            top: `${innerSheetPosition.top}px`,
            left: `${innerSheetPosition.left}px`,
            background: '#fff'
          };

          const innerSheetWithBleedStyle = {
            width: `${innerSheetSizeObj.renderInnerSheetSize.width}px`,
            height: `${innerSheetSizeObj.renderInnerSheetSize.height}px`,
            top: `${innerSheetSizeObj.renderInnerSheetSize.top -
              (size.renderInnerSheetSize.height -
                size.renderInnerSheetSizeWithoutBleed.height) /
                2}px`,
            left: `${innerSheetSizeObj.renderInnerSheetSize.left -
              (size.renderInnerSheetSize.width -
                size.renderInnerSheetSizeWithoutBleed.width) /
                2}px`
          };

          // pagehover
          const pageHoverStyle = {
            width: innerSheetStyle.width,
            height: innerSheetStyle.height,
            top: 0,
            left: 0,
            borderColor: 'transparent'
          };

          const pageHoverStatus = pageHovers.find(m => m.id === page.get('id'));
          const isPageHovered = !!(pageHoverStatus && pageHoverStatus.value);

          if (isPageHovered) {
            pageHoverStyle.borderColor = '#4CC1FC';
          }

          const pageHoverData = {
            style: pageHoverStyle
          };

          // drag line
          const dragLineStyle = {
            height: renderStyle.height,
            top: 0,

            // 如果为第一页, drawline需要显示在两个sheet中间.
            left:
              index === 0
                ? `${innerSheetPosition.left - (15 + position.render.left)}px`
                : `${innerSheetPosition.left}px`
          };
          const drawLineData = {
            style: dragLineStyle,
            isShown: this.state.dropPageId === page.get('id')
          };

          // 内页.
          if (thumbnail) {
            // 全页, 两个都要选中.
            pageNumber = pageNumber.setIn(
              ['leftPage', 'active'],
              isPageHovered
            );
            pageNumber = pageNumber.setIn(
              ['rightPage', 'active'],
              isPageHovered
            );

            pageNumber = pageNumber.setIn(
              ['leftPage', 'disable'],
              !isPageHovered
            );
            pageNumber = pageNumber.setIn(
              ['rightPage', 'disable'],
              !isPageHovered
            );

            const bookPageHtml = (
              <BookPageThumbnail
                ref={ref}
                actions={pageActions}
                data={pageData}
              />
            );
            const dropData = { isShowDropActive: this.state.isShowDropActive };

            bookPages.push(
              <div key={page.get('id')}>
                {isPageDraggable ? <DragLine data={drawLineData} /> : null}

                <div
                  key={index}
                  className="inner-sheet"
                  style={innerSheetStyle}
                  onMouseOver={this.onMouseOverInnerSheet.bind(this, page)}
                  onMouseOut={this.onMouseOutInnerSheet.bind(this, page)}
                >
                  {isPageDraggable ? <PageHover data={pageHoverData} /> : null}

                  <div
                    className="inner-sheet-with-bleed"
                    style={innerSheetWithBleedStyle}
                  >
                    {isPageDraggable
                      ? <XDrag
                        onDragStarted={this.onDragPageStarted.bind(
                            this,
                            page,
                            ref
                          )}
                        onDragEnded={this.onDragPageEnd.bind(this)}
                      >
                        {isPageDropable
                            ? <XDrop
                              onDroped={this.onDropPage.bind(this, page)}
                              onDragOvered={this.onDragOvered.bind(
                                  this,
                                  page
                                )}
                              onDragLeaved={this.onDragLeaved.bind(
                                  this,
                                  page
                                )}
                              data={dropData}
                            >
                              {bookPageHtml}
                            </XDrop>
                            : bookPageHtml}
                      </XDrag>
                      : isPageDropable
                        ? <XDrop
                          onDroped={this.onDropPage.bind(this, page)}
                          onDragOvered={this.onDragOvered.bind(this, page)}
                          onDragLeaved={this.onDragLeaved.bind(this, page)}
                          data={dropData}
                        >
                          {bookPageHtml}
                        </XDrop>
                        : bookPageHtml}
                  </div>
                </div>
              </div>
            );
          } else {
            bookPages.push(
              <div key={index} className="inner-sheet" style={innerSheetStyle}>
                <div
                  className="inner-sheet-with-bleed"
                  style={innerSheetWithBleedStyle}
                >
                  <BookPage actions={pageActions} data={pageData} />
                </div>
              </div>
            );
          }
        }
      });
    }

    const shadowElements = [];
    // 给内页的sheet添加一个shadow.
    if (!isCover) {
      const shadowActions = {};
      const shadowData = { element: shadow, ratio };
      shadowElements.push(
        <ShadowElement
          key="shadow-element"
          actions={shadowActions}
          data={shadowData}
        />
      );
    }

    // disable handler的数据.
    const disableHandlerData = {
      style: {
        width: `${size.renderInnerSize.width}px`,
        height: `${size.renderInnerSize.height}px`
      }
    };

    // PageNumber
    const pageItemStyle = {
      leftStyle: {
        paddingLeft: `${position.render.left}px`
      },
      rightStyle: {
        paddingRight: `${position.render.left}px`
      }
    };

    const pageNumberActions = {
      onDragStarted: this.onDragPageTitleStarted,
      onDragEnded: this.onDragPageTitleEnd,
      onMouseEnter: this.onMouseOverInnerSheet,
      onMouseLeave: this.onMouseOutInnerSheet
    };
    const pageNumberData = {
      pageNumber,
      pageItemStyle,
      pages,
      isBlue: thumbnail,
      style: pageNumberStyle
    };
    const pageNumberSimpleData = merge({}, pageNumberData, {
      isCover: false,
      isActive: pagination.sheetIndex === sheetIndex
    });

    pageNumberData.style = merge({}, pageNumberData.style, {
      top: `${size.renderInnerSize.height}px`
    });

    return (
      <div
        key={index}
        className={className}
        style={containerStyle}
        onClick={this.switchSheet}
        ref={(c) => {
          this.componentRef = c;
        }}
      >
        {/* PageNumber */}
        {thumbnail
          ? isShowSimplePageNumber
            ? <PageNumberSimple
              actions={pageNumberActions}
              data={pageNumberSimpleData}
            />
            : <PageNumber actions={pageNumberActions} data={pageNumberData} />
          : null}

        <div className="inner-effect" style={renderStyle} draggable="false">
          <img
            alt=""
            className="effect-img"
            src={materials.getIn(['inner', 'img'])}
            draggable="false"
          />
        </div>

        {/* 渲染内页的page */}
        {!isCover ? bookPages : null}

        <div className="inner-sheet no-event" style={sheetStyle}>
          <div className="inner-sheet-with-bleed" style={sheetWithBleedStyle}>
            {isCover ? bookPages : null}
            {shadowElements}
          </div>
        </div>
        {isNavpages
          ? <NavPageDisableHandler data={disableHandlerData} />
          : null}
      </div>
    );
  }
}

BookSheet.propTypes = {};

BookSheet.defaultProps = {};

export default translate('BookSheet')(BookSheet);
