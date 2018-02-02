import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import classNames from 'classnames';

import { formatDate } from '../../../../common/utils/dateFormat';
import XDrag from '../../../../common/ZNOComponents/XDrag';
import XDrop from '../../../../common/ZNOComponents/XDrop';
import './index.scss';

import BookPage from '../../canvasComponents/BookPage';
import BookPageThumbnail from '../BookPageThumbnail';
import PageNumber from '../PageNumber';
// import PageHover from '../PageHover';
// import DragLine from '../DragLine';

import { productTypes } from '../../constants/strings';

// // 导入handler
import * as pageHandler from './handler/page';
import * as exchangeHandler from './handler/exchange';

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

      isExchangeImage: false
    };
    // chosePage
    this.switchSheet = this.switchSheet.bind(this);
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
      setMouseHoverDomNode,
      reApplyDefaultTemplateToPage
    } = actions;
    const {
      urls,
      size,
      settings,
      ratios,
      variables,
      styles,
      template,
      pagination,
      paginationSpread,
      index,
      thumbnail,
      isPreview,
      parameters,
      specData,

      isShowSimplePageNumber = false,
      shouldSwitchSheet = false,
      isNavpages = false,
      capability,
      allPageSheetIndex,
      userInfo
    } = data;
    const { isExchangeImage } = this.state;

    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const images = paginationSpread.get('images');
    const sheetIndex = summary.get('sheetIndex');

    const className = classNames('book-sheet item');
    const productType = get(settings, 'spec.product');
    const productSize = get(settings, 'spec.size');
    const imgName = thumbnail ? 'thumbnail_inner' : 'inner';
    const effectImg = `./assets/${productType}/${productSize}/${imgName}.png?randow=${formatDate(new Date(), '')}`;

    // 页面元素
    const ratio = {
      workspace: thumbnail ? ratios.innerWorkspaceForArrangePages : ratios.innerWorkspace
    };


    const containerStyle = merge(
      {},
      {
        width: `${get(size, 'renderInnerSize.width')}px`,
        height: `${get(size, 'renderInnerSize.height')}px`,
        cursor: isNavpages ? 'pointer' : 'default',
        marginBottom: productType === productTypes.DC ? '46px' : '40px'
      },
      styles
    );

    const innerContainerStyle = merge(
      {},
      {
        width: `${get(size, 'renderInnerSize.width')}px`,
        height: `${get(size, 'renderInnerSize.height')}px`,
        cursor: isNavpages ? 'pointer' : 'default'
      },
      styles
    );

    const renderStyle = {
      width: `${get(size, 'renderInnerSize.width')}px`,
      height: `${get(size, 'renderInnerSize.height')}px`,
      pointerEvents: 'none',
      overflow: 'hidden'
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
      startExchangeImage: this.startExchangeImage,
      stopExchangeImage: this.stopExchangeImage,
      setMouseHoverDomNode,
      reApplyDefaultTemplateToPage
    };

    let isCover = false;
    const selectedPageId = pagination.pageId;
    const bookPages = [];

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
          isPreview,
          parameters,
          variables,
          specData,
          isExchangeImage,
          capability,
          allPageSheetIndex,
          userInfo
        };

        const ref = pageHandler.getRefName(sheetIndex, index);

        // 是否渲染缩略图
        if (isCover) {
          if (thumbnail) {
            bookPages.push(
              <XDrop>
              <BookPageThumbnail
                key={page.get('id')}
                actions={pageActions}
                data={pageData}
              />
               </XDrop>
            );
          } else {
            bookPages.push(
              <BookPage key={page.get('id')} actions={pageActions} data={pageData} />
            );
          }
        } else {
          // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.
          const innerSheetSizeObj = this.computedInnerSheet(
            ratios.innerWorkspace,
            size,
            pages,
            index
          );

          pageData = merge({}, pageData, {
            size: innerSheetSizeObj
          });

          const innerSheetWithoutBleedStyle = {
            width: `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.width}px`,
            height: `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.height}px`,
            top: `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.top}px`,
            left: `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.left}px`
          };

          const innerSheetWithBleedStyle = {
            width: `${innerSheetSizeObj.renderInnerSheetSize.width}px`,
            height: `${innerSheetSizeObj.renderInnerSheetSize.height}px`,
            top: `${innerSheetSizeObj.renderInnerSheetSize.top}px`,
            left: `${innerSheetSizeObj.renderInnerSheetSize.left}px`,
            background: 'white'
          };

          // pagehover
          const pageHoverStyle = {
            width: innerSheetWithoutBleedStyle.width,
            height: innerSheetWithoutBleedStyle.height,
            top: 0,
            left: 0
          };
          const pageHoverData = {
            style: pageHoverStyle
          };

          // drag line
          const dragLineStyle = {
            height: renderStyle.height,
            top: 0,

            // 如果为第一页, drawline需要显示在两个sheet中间.
            left: index === 0
              ? `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.left - 0}px`
              : `${innerSheetSizeObj.renderInnerSheetSizeWithoutBleed.left}px`
          };
          const drawLineData = {
            style: dragLineStyle,
            isShown: this.state.dropPageId === page.get('id')
          };

          // 内页.
          if (thumbnail) {
            const bookPageHtml = (
               <XDrop >
              <BookPageThumbnail
                ref={ref}
                actions={pageActions}
                data={pageData}
              />
              </XDrop>
            );
            const dropData = { isShowDropActive: this.state.isShowDropActive };

            bookPages.push(
              <div key={page.get('id')}>
                {/* isPageDraggable ? <DragLine data={drawLineData} /> : null */}

                <div
                  key={page.get('id')}
                  className="inner-sheet"
                  style={innerSheetWithoutBleedStyle}
                >
                  {/* isPageDraggable ? <PageHover data={pageHoverData} /> : null */}

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
                            ? (<XDrop
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
                              </XDrop>)
                            : bookPageHtml
                          }
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
              <div key={page.get('id')} className="inner-sheet" style={innerSheetWithoutBleedStyle}>
                <div
                  className="inner-sheet-with-bleed"
                  style={innerSheetWithBleedStyle}
                >
                  {
                    page.get('id') !== selectedPageId && !isPreview
                      ? <div className="change-page-helper"
                        onClick={() => boundPaginationActions.switchPage(index, page.get('id'))}
                      ></div>
                      : null
                  }
                  <BookPage actions={pageActions} data={pageData} />
                </div>
              </div>
            );
          }
        }
      });
    }

    const pageNumberData = {
      pageNumberData: {
        month: summary && summary.get('month'),
        year: summary && summary.get('year'),
        sheetIndex: summary && summary.get('sheetIndex')
      }
    };

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
        {thumbnail && productType !== productTypes.LC
          ? <PageNumber data={pageNumberData} />
          : null
        }
        <div className="inner-overflow-container" style={innerContainerStyle}>
          <div className="inner-effect" style={renderStyle} draggable="false">
            <img
              alt=""
              className="effect-img"
              src={effectImg}
              draggable="false"
            />
          </div>
          {/* 渲染内页的page */}
          {!isCover ? bookPages : null}
        </div>
        {
          thumbnail || (productType === productTypes.WC && !isPreview) || productType === productTypes.LC
            ? null
            : <div className="inner-sign">Inner</div>
        }
      </div>
    );
  }
}

BookSheet.propTypes = {};

BookSheet.defaultProps = {};

export default translate('BookSheet')(BookSheet);
