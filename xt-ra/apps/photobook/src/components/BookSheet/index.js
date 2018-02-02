import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import classNames from 'classnames';
import { pageTypes } from '../../contants/strings';
import Immutable from 'immutable';

import XDrag from '../../../../common/ZNOComponents/XDrag';
import XDrop from '../../../../common/ZNOComponents/XDrop';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XDeleteIcon from '../../../../common/ZNOComponents/XDeleteIcon';
import './index.scss';

// import BookPage from '../BookPage';
import BookPage from '../../canvasComponents/BookPage';
import BookPageThumbnail from '../BookPageThumbnail';
import ShadowElement from '../ShadowElement';
import PageNumber from '../../components/PageNumber';
import PageNumberSimple from '../../components/PageNumberSimple';
import NavPageDisableHandler from '../NavPageDisableHandler';
import PageHover from '../PageHover';
import DragLine from '../DragLine';

// 导入handler
import * as pageHandler from './handler/page';
import * as exchangeHandler from './handler/exchange';
import BookCoverForInnerWrap from '../BookCoverForInnerWrap';

class BookSheet extends Component {
  constructor(props) {
    super(props);

    this.computedInnerSheet = (
      workspaceRatio,
      size,
      pages,
      pageIndex,
      bookShape
    ) =>
      pageHandler.computedInnerSheet(
        workspaceRatio,
        size,
        pages,
        pageIndex,
        bookShape
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

    // 交换图片
    this.startExchangeImage = () => exchangeHandler.startExchangeImage(this);
    this.stopExchangeImage = () => exchangeHandler.stopExchangeImage(this);

    this.state = {
      // 是否显示拖拽时, 进入目标元素后的样式.
      dropPageId: null,

      // 被拖拽的page的id.
      dragPageId: null,

      isExchangeImage: false,

      // 显示删除page的icon.
      isShowDeleteIcon: false,

      // 存放选中pagehover的状态.
      pageHovers: []
    };
    // chosePage
    this.switchSheet = this.switchSheet.bind(this);

    this.deletePages = pages => pageHandler.deletePages(this, pages);
    this.onMouseOver = (pages, ev) => pageHandler.onMouseOver(this, pages, ev);
    this.onMouseOut = ev => pageHandler.onMouseOut(this, ev);

    this.onMouseOverInnerSheet = (page, ev) =>
      pageHandler.onMouseOverInnerSheet(this, page, ev);
    this.onMouseOutInnerSheet = (page, ev) =>
      pageHandler.onMouseOutInnerSheet(this, page, ev);
  }

  componentDidUpdate() {
    const {
      pagination,
      paginationSpread,
      shouldSwitchSheet = false
    } = this.props.data;
    const summary = paginationSpread.get('summary');
    const sheetIndex = summary.get('sheetIndex');

    // 修复ASH-4654： 【book2.1】【mac】切换到pages时页面跳上去了
    if (pagination.sheetIndex === sheetIndex && shouldSwitchSheet) {
      if (this.componentRef.scrollIntoViewIfNeeded) {
        this.componentRef.scrollIntoViewIfNeeded();
      } else {
        this.componentRef.scrollIntoView();
      }
    }
  }

  switchSheet() {
    const { onNavPagesSwitchSheet, shouldSwitchSheet } = this.props.data;

    if (!shouldSwitchSheet) {
      return;
    }
    onNavPagesSwitchSheet(this);
  }

  render() {
    const { data, actions } = this.props;
    const {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPropertyModalActions,
      boundTrackerActions,
      boundNotificationActions,
      boundGlobalLoadingActions,
      boundUndoActions,
      boundClipboardActions,
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
      coverSpreadForInnerWrap,
      index,
      thumbnail,
      ignoreEmpty,
      isPreview,
      parameters,
      undoData,
      specData,
      capability,

      backgroundArray,
      stickerArray,
      clipboardData,

      isShowSimplePageNumber = false,
      isShowPageNumber = false,
      shouldSwitchSheet = false,
      isNavpages = false,
      isUseFastCrop,

      isDragPage,
      allSheets,
      env
    } = data;

    const isAdvancedMode = capability
      ? capability.get('isAdvancedMode')
      : false;

    const { isExchangeImage, pageHovers, dragPageId } = this.state;

    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const pageIds = paginationSpread.get('pageIds');
    const images = paginationSpread.get('images');
    const shadow = paginationSpread.get('shadow');
    const isSetCoverAsInnerBg = summary.get('isSetCoverAsInnerBg');
    const sheetIndex = summary.get('sheetIndex');
    const bookShape = summary.get('bookShape');
    let pageNumber = paginationSpread.get('pageNumber');

    // 页面元素
    const ratio = {
      workspace: ratios.innerWorkspace
    };

    // const className = classNames('book-sheet item', {'show': pagination.sheetIndex % 3 === index});
    const bookSheetClass = classNames('book-sheet item');

    const containerStyle = merge(
      {},
      {
        width: `${size.innerWorkspaceSize.width}px`,
        height: `${size.innerWorkspaceSize.height}px`,
        cursor: isNavpages ? 'pointer' : 'default'
      },
      styles,
      {
        opacity:
          pageIds.indexOf(dragPageId) !== -1 && !summary.get('isPressBook')
            ? 0.3
            : 1
      }
    );

    // 获取封面素材的地址.
    const coverimage =
      variables && variables.getIn(['coverAsset', 'coverimage']);
    const effectImg = materials.getIn(['cover', 'img']);
    const bgImage =
      coverimage && effectImg
        ? `url("${urls.baseUrl}${coverimage.substring(1)}")`
        : 'transparent';

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
      background: bgImage,
      backgroundPosition: `${position.render.outLeft}px ${
        isSetCoverAsInnerBg
          ? position.render.outTop - 2
          : position.render.outTop - 5
      }px`,
      backgroundSize: `${size.renderInnerSize.width -
        position.render.outLeft * 2}px ${size.renderInnerSize.height -
        position.render.outTop * 2 +
        10}px`,
      position: 'relative',
      pointerEvents: 'none',
      overflow: 'hidden'
    };

    const innerEffectValue = {
      width: size.renderInnerSize.width,
      height: size.renderInnerSize.height
    };

    const BookCoverForInnerWrapData = merge({}, data, { innerEffectValue });

    const sheetWithBleedStyle = {
      width: `${size.renderInnerSheetSize.width}px`,
      height: `${size.renderInnerSheetSize.height}px`,
      top: `${-sheetWithBleedPosition.top}px`,
      left: `${-sheetWithBleedPosition.left}px`
    };

    // book page的actions和data
    const pageActions = {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPropertyModalActions,
      boundTrackerActions,
      boundNotificationActions,
      boundGlobalLoadingActions,
      boundUndoActions,
      boundClipboardActions,
      setMouseHoverDomNode,
      startExchangeImage: this.startExchangeImage,
      stopExchangeImage: this.stopExchangeImage
    };
    const bookPages = [];
    const handlerActions = {
      handleDragOver: this.onSheetDragOver,
      handleDrop: this.onSheetDroped
    };
    const handlerData = {};
    let isCover = false;
    let correctRenderInnerSheetWidthWithoutBleed = 0;

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
          elements: page.get('elements'),
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
          variables,
          undoData,
          specData,
          isExchangeImage,
          isNavpages,
          capability,
          materials,
          position,
          backgroundArray,
          stickerArray,
          clipboardData,
          isUseFastCrop,
          env
        };
        const ref = pageHandler.getRefName(sheetIndex, index);

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
            bookShape
          );

          pageData = merge({}, pageData, {
            size: innerSheetSizeObj
          });

          correctRenderInnerSheetWidthWithoutBleed +=
            innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.width;

          const innerSheetPosition = {
            top:
              position.render.top +
              innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.top,
            left:
              position.render.left +
              innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.left
          };
          const innerSheetStyle = {
            width: `${
              innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.width
            }px`,
            height: `${
              innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.height
            }px`,
            top: `${innerSheetPosition.top}px`,
            left: `${innerSheetPosition.left}px`,
            overflow:
              isAdvancedMode && !isPreview & !thumbnail ? 'visible' : 'hidden'
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

          // 鼠标移到sheet的空白处时, pagenumber选中样式.
          if (thumbnail) {
            // 全页, 两个都要选中.
            if (page.get('type') === pageTypes.sheet) {
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
            } else {
              // 半页. 只需要选中一个.
              if (index === 0) {
                pageNumber = pageNumber.setIn(
                  ['leftPage', 'active'],
                  isPageHovered
                );

                pageNumber = pageNumber.setIn(
                  ['leftPage', 'disable'],
                  !isPageHovered
                );
              } else {
                pageNumber = pageNumber.setIn(
                  ['rightPage', 'active'],
                  isPageHovered
                );

                pageNumber = pageNumber.setIn(
                  ['rightPage', 'disable'],
                  !isPageHovered
                );
              }
            }
          }

          // 内页.
          if (thumbnail) {
            let bookPageHtml = (
              <BookPageThumbnail
                ref={ref}
                actions={pageActions}
                data={pageData}
              />
            );

            const droppableBookPageHtml = (
              <XDrop
                onDroped={this.onDropPage.bind(this, page)}
                onDragOvered={this.onDragOvered.bind(this, page)}
                onDragLeaved={this.onDragLeaved.bind(this, page)}
                data={dropData}
              >
                {bookPageHtml}
              </XDrop>
            );

            if (isPageDropable && summary.get('isHalfPage')) {
              bookPageHtml = droppableBookPageHtml;
            }

            const dropData = { isShowDropActive: this.state.isShowDropActive };

            let nextPage = page;
            let leftPageDropTarget = null;
            let rightPageDropTarget = null;
            let drawLineData = null;
            const { renderInnerSheetSize } = innerSheetSizeObj;

            if (!isNavpages) {
              leftPageDropTarget = {
                position: 'absolute',
                width: renderInnerSheetSize.width / 2,
                height: renderInnerSheetSize.height,
                top: renderInnerSheetSize.top,
                left: renderInnerSheetSize.left,
                background: 'yellow'
              };

              rightPageDropTarget = {
                position: 'absolute',
                width: renderInnerSheetSize.width / 2,
                height: renderInnerSheetSize.height,
                top: renderInnerSheetSize.top,
                left:
                  renderInnerSheetSize.left + renderInnerSheetSize.width / 2,
                background: 'yellow'
              };

              const nextSheet = allSheets.get(summary.get('sheetIndex') + 1);

              if (nextSheet) {
                nextPage = nextSheet.getIn(['pages', '0']);
              }

              const { dropPageId } = this.state;

              // drag line
              const dragLineStyle = {
                height: renderStyle.height,
                top: 0,

                // 如果为第一页, drawline需要显示在两个sheet中间.
                left:
                  index === 0
                    ? innerSheetPosition.left - (10 + position.render.left)
                    : innerSheetPosition.left
              };

              drawLineData = {
                style: dragLineStyle,
                isShown:
                  dropPageId === page.get('id') ||
                  dropPageId === nextPage.get('id')
              };

              if (page.get('id') !== dropPageId) {
                dragLineStyle.left = size.renderInnerSize.width + 10;
              }
            }

            bookPages.push(
              <div key={page.get('id')}>
                {!isNavpages && isPageDraggable ? (
                  <DragLine data={drawLineData} />
                ) : null}

                {!isNavpages &&
                isPageDropable &&
                !summary.get('isHalfPage') &&
                isDragPage &&
                page.get('id') !== dragPageId ? (
                  <div>
                    <XDrop
                      onDroped={this.onDropPage.bind(this, page)}
                      onDragOvered={this.onDragOvered.bind(this, page)}
                      onDragLeaved={this.onDragLeaved.bind(this, page)}
                      data={dropData}
                    >
                      <div
                        className="left-page-drop-target"
                        style={leftPageDropTarget}
                        onClick={() => {
                          console.log('click left page');
                        }}
                      />
                    </XDrop>

                    <XDrop
                      onDroped={this.onDropPage.bind(this, nextPage)}
                      onDragOvered={this.onDragOvered.bind(this, nextPage)}
                      onDragLeaved={this.onDragLeaved.bind(this, nextPage)}
                      data={dropData}
                    >
                      <div
                        className="right-page-drop-target"
                        style={rightPageDropTarget}
                        onClick={() => {
                          console.log('click right page');
                        }}
                      />
                    </XDrop>
                  </div>
                ) : null}

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
                    {isPageDraggable ? (
                      <XDrag
                        onDragStarted={this.onDragPageStarted.bind(
                          this,
                          page,
                          ref
                        )}
                        onDragEnded={this.onDragPageEnd.bind(this)}
                      >
                        {bookPageHtml}
                      </XDrag>
                    ) : (
                      bookPageHtml
                    )}
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
    const sheetStyle = {
      width: `${correctRenderInnerSheetWidthWithoutBleed}px`,
      height: `${size.renderInnerSheetSizeWithoutBleed.height}px`,
      top: `${position.render.top}px`,
      left: `${position.render.left}px`
    };

    // delete icon
    const canShowDeleteSheetIcon =
      capability && capability.get('canShowDeleteSheetIcon');
    const deleteIconStyle = {
      top: `${-position.render.top}px`,
      left: `${-position.render.left + size.renderInnerSize.width}px`
    };

    return (
      <div
        key={index}
        className={bookSheetClass}
        style={containerStyle}
        onClick={this.switchSheet}
        ref={c => {
          this.componentRef = c;
        }}
        onMouseOver={this.onMouseOver.bind(this, pages)}
        onMouseOut={this.onMouseOut}
      >
        {/* PageNumber */}
        {thumbnail ? (
          isShowSimplePageNumber ? (
            <PageNumberSimple
              actions={pageNumberActions}
              data={pageNumberSimpleData}
            />
          ) : (
            <PageNumber actions={pageNumberActions} data={pageNumberData} />
          )
        ) : null}

        {isAdvancedMode && !thumbnail ? null : (
          <div className="inner-effect" style={renderStyle} draggable="false">
            {isSetCoverAsInnerBg ? (
              <BookCoverForInnerWrap
                actions={actions}
                data={BookCoverForInnerWrapData}
              />
            ) : null}

            <img
              alt=""
              className="effect-img"
              src={materials.getIn(['inner', 'img'])}
              draggable="false"
            />
          </div>
        )}

        {/* 渲染内页的page */}
        {!isCover ? bookPages : null}

        {isAdvancedMode && !thumbnail ? null : (
          <div className="inner-sheet no-event" style={sheetStyle}>
            <div className="inner-sheet-with-bleed" style={sheetWithBleedStyle}>
              {isCover ? bookPages : null}
              {shadowElements}
            </div>
          </div>
        )}

        {isNavpages ? (
          <NavPageDisableHandler data={disableHandlerData} />
        ) : null}

        {/* delete icon */}
        {canShowDeleteSheetIcon ? (
          <XDeleteIcon
            isBlack
            isShow={this.state.isShowDeleteIcon}
            style={deleteIconStyle}
            onClicked={this.deletePages.bind(this, pageIds)}
          />
        ) : null}
      </div>
    );
  }
}

BookSheet.propTypes = {};

BookSheet.defaultProps = {};

export default translate('BookSheet')(BookSheet);
