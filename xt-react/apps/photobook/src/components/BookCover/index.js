import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge } from 'lodash';
import classNames from 'classnames';
import './index.scss';

import { cameoShapeTypes, pageTypes } from '../../contants/strings';

// import BookPage from '../BookPage';
import BookPage from '../../canvasComponents/BookPage';

import BookPageThumbnail from '../BookPageThumbnail';
import PageNumber from '../../components/PageNumber';
import PageNumberSimple from '../../components/PageNumberSimple';
import CoverPageLabel from '../../components/CoverPageLabel';
import NavPageDisableHandler from '../NavPageDisableHandler';

// 导入handler
import * as handler from './handler';
import * as exchangeHandler from './handler/exchange';

class BookCover extends Component {
  constructor(props) {
    super(props);
    this.computedCoverSheet = (
      workspaceRatio,
      size,
      pages,
      pageIndex,
      position,
      isCrystalOrMetal,
      isHardCover,
      bookShape
    ) =>
      handler.computedCoverSheet(
        workspaceRatio,
        size,
        pages,
        pageIndex,
        position,
        isCrystalOrMetal,
        isHardCover,
        bookShape
      );

    // 交换图片
    this.startExchangeImage = () => exchangeHandler.startExchangeImage(this);
    this.stopExchangeImage = () => exchangeHandler.stopExchangeImage(this);
    this.activePage = this.activePage.bind(this);
    this.switchSheet = this.switchSheet.bind(this);
    this.state = {
      isExchangeImage: false,
      activePageId: null,

      // 存放选中pagehover的状态.
      pageHovers: []
    };
    this.stopDragEvent = (ev) => {
      const event = ev || window.event;
      event.stopPropagation();
      event.preventDefault();
    };

    this.onMouseOverInnerSheet = (page, ev) =>
      handler.onMouseOverInnerSheet(this, page, ev);
    this.onMouseOutInnerSheet = (page, ev) =>
      handler.onMouseOutInnerSheet(this, page, ev);
  }

  activePage(pageId) {
    this.setState({
      activePageId: pageId
    });
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
    const {
      onNavPagesSwitchSheet,
      shouldSwitchSheet = false
    } = this.props.data;

    if (!shouldSwitchSheet) {
      return;
    }
    onNavPagesSwitchSheet(this);
  }

  render() {
    const { actions, data } = this.props;
    const {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPaintedTextModalActions,
      boundPropertyModalActions,
      boundTrackerActions,
      boundNotificationActions,
      boundGlobalLoadingActions,
      boundUndoActions,
      boundClipboardActions,
      hideCameoActionBar,
      setMouseHoverDomNode
    } = actions;
    const {
      thumbnail,
      urls,
      size,
      ratios,
      position,
      styles,
      pageNumberStyle,
      materials,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      parameters,
      isPreview,
      ignoreEmpty,
      isCameoActionBarShow,
      undoData,
      specData,
      capability,
      clipboardData,
      isShowSimplePageNumber = false,
      isShowPageNumber = false,
      shouldSwitchSheet = false,
      isShowBgColor = false,
      isNavpages = false,
      backgroundArray,
      stickerArray,
      isUseFastCrop,
      env
    } = data;

    const isAdvancedMode = capability
      ? capability.get('isAdvancedMode')
      : false;
    const { isExchangeImage, activePageId, pageHovers } = this.state;

    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const elements = paginationSpread.get('elements');
    const images = paginationSpread.get('images');

    const cameoShape = summary.get('cameoShape');
    const coverimage =
      variables && variables.getIn(['coverAsset', 'coverimage']);
    const effectImg = materials.getIn(['cover', 'img']);
    const bgImage =
      coverimage && effectImg
        ? `url("${urls.baseUrl}${coverimage.substring(1)}")`
        : '';
    const isCrystalOrMetal = summary.get('isSupportHalfImageInCover');
    const isSupportFullImageInCover = summary.get('isSupportFullImageInCover');
    const isHardCover = summary.get('isHardCover');
    const bookShape = summary.get('bookShape');
    const isSmallView = handler.isSmallView(size.renderCoverSheetSize);
    let pageNumber = paginationSpread.get('pageNumber');

    // 查找cover page上使用的背景色.
    const coverPage = pages.find(
      p => p.get('type') === pageTypes.full || p.get('type') === pageTypes.front
    );
    const bgColor = coverPage ? coverPage.get('bgColor') : '#fff';

    const containerStyle = merge(
      {},
      {
        width: `${size.renderCoverSize.width}px`,
        height: `${size.renderCoverSize.height}px`,
        cursor: isNavpages ? 'pointer' : 'default'
      },
      styles
    );

    const renderStyle = {
      width: `${size.renderCoverSize.width}px`,
      height: `${size.renderCoverSize.height}px`,
      backgroundPosition: '4px 4px',
      backgroundSize: `${size.renderCoverSize.width - 8}px ${size
        .renderCoverSize.height - 8}px`,
      // backgroundImage: bgImage,
      userSelect: 'none',

      // 在arrange page, editpage下方的page navagtion中需要显示page bgColor
      // 但在editpage的主编辑界面不需要因为page的bgColor在konva中绘制了.
      background: isShowBgColor ? bgColor : ''
    };

    const effectImgOffset = {
      width:
        isSupportFullImageInCover && size.renderCoverSize.width > 500 ? 2 : 0,
      height:
        isSupportFullImageInCover && size.renderCoverSize.width > 500 ? 2 : 0,
      top:
        isSupportFullImageInCover && size.renderCoverSize.width > 500 ? -1 : 0,
      left:
        isSupportFullImageInCover && size.renderCoverSize.width > 500 ? -1 : 0
    };
    const effectImgStyle = {
      width: `${size.renderCoverSize.width + effectImgOffset.width}px`,
      height: `${size.renderCoverSize.height + effectImgOffset.height}px`,
      top: `${effectImgOffset.top}px`,
      left: `${effectImgOffset.left}px`
    };

    const coverClass = classNames('book-cover item');

    // 页面元素
    const ratio = {
      workspace: ratios.coverWorkspace,
      cameoTop:
        cameoShape === cameoShapeTypes.rect
          ? ratios.rectCameoPaddingTop
          : ratios.roundCameoPaddingTop,
      cameoLeft:
        cameoShape === cameoShapeTypes.rect
          ? ratios.rectCameoPaddingLeft
          : ratios.roundCameoPaddingLeft
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
      boundPaintedTextModalActions,
      boundTrackerActions,
      boundNotificationActions,
      boundGlobalLoadingActions,
      hideCameoActionBar,
      boundUndoActions,
      boundClipboardActions,
      setMouseHoverDomNode,
      startExchangeImage: this.startExchangeImage,
      stopExchangeImage: this.stopExchangeImage,
      activePage: this.activePage
    };
    const bookPages = [];

    let bgImageWidth = 0;

    if (pages && pages.size) {
      pages.forEach((page, index) => {
        // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.
        const isSupportPaintedText = summary.get('isSupportPaintedText');
        const coverSheetSizeObj = this.computedCoverSheet(
          ratios.coverWorkspace,
          size,
          pages,
          index,
          position,
          isCrystalOrMetal,
          isHardCover,
          bookShape
        );

        const pageData = {
          ignoreEmpty,
          isPreview,
          urls,
          summary,
          page,
          images,
          elements: page.get('elements'),
          pagination,
          ratio,
          index,
          settings,
          template,
          paginationSpread,
          parameters,
          variables,
          size: merge({}, size, coverSheetSizeObj),
          isCameoActionBarShow,
          undoData,
          specData,
          isExchangeImage,
          activePageId,
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

        const sheetStyle = {
          width: `${
            coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.width
          }px`,
          height: `${
            coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.height
          }px`,
          top: `${coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.top}px`,
          left: `${coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.left}px`,

          // crystal, metal的封面比较的特殊. 右侧需要显示背景色. 左侧是封面的素材图.
          background:
            isCrystalOrMetal && page.get('type') === pageTypes.front
              ? bgColor
              : ''
        };

        // 只有crystal/metal等素材, 在计算宽度时, 才需要把spine加上.
        if (page.get('type') !== pageTypes.spine) {
          bgImageWidth +=
            coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.width;
        } else if (isCrystalOrMetal) {
          bgImageWidth +=
            coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.width;
        }

        const sheetWithBleedStyle = {
          width: `${coverSheetSizeObj.renderCoverSheetSize.width}px`,
          height: `${coverSheetSizeObj.renderCoverSheetSize.height}px`,
          top: `${coverSheetSizeObj.renderCoverSheetSize.top}px`,
          left: `${coverSheetSizeObj.renderCoverSheetSize.left}px`,
          userSelect: 'none'
        };

        const isSpine = page.get('type') === pageTypes.spine;

        const coverSheetClassName = classNames('cover-sheet', {
          'overflow-h':
            (isCrystalOrMetal && !isAdvancedMode) || isSpine || thumbnail,
          'pointer-events-none': !isSupportPaintedText && isSpine
        });

        // 鼠标移到sheet的空白处时, pagenumber选中样式.
        if (thumbnail) {
          pageNumber = pageNumber.setIn(['leftPage', 'active'], false);
          pageNumber = pageNumber.setIn(['rightPage', 'active'], false);
        }

        if (thumbnail) {
          bookPages.push(
            <div
              key={index}
              className={coverSheetClassName}
              style={sheetStyle}
              onMouseOver={this.onMouseOverInnerSheet.bind(this, page)}
              onMouseOut={this.onMouseOutInnerSheet.bind(this, page)}
            >
              <div
                className="cover-sheet-with-bleed"
                style={sheetWithBleedStyle}
              >
                <BookPageThumbnail actions={pageActions} data={pageData} />
              </div>
            </div>
          );
        } else {
          let newSheetWithBleedStyle = merge({}, sheetWithBleedStyle);

          // 高级模式时, 书脊上不需要重复渲染background.
          if (isAdvancedMode && !thumbnail && !isSpine) {
            newSheetWithBleedStyle = merge({}, sheetWithBleedStyle, {
              backgroundImage: bgImage,
              backgroundSize: 'cover'
            });
          }

          bookPages.push(
            <div key={index} className={coverSheetClassName} style={sheetStyle}>
              <div
                className="cover-sheet-with-bleed"
                style={newSheetWithBleedStyle}
              >
                <BookPage actions={pageActions} data={pageData} />
              </div>
            </div>
          );
        }
      });
    }

    // disable handler的数据.
    const disableHandlerData = {
      style: {
        width: `${size.renderCoverSize.width}px`,
        height: `${size.renderCoverSize.height}px`,
        background: 'transparent',
        backgroundImage: ''
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

    const pageNumberActions = {};
    const pageNumberData = {
      pageNumber,
      pageItemStyle,
      style: pageNumberStyle,
      isBlue: thumbnail
    };
    const pageNumberSimpleData = merge({}, pageNumberData, {
      isCover: true,
      isActive: pagination.sheetIndex === 0
    });
    pageNumberData.style = merge({}, pageNumberData.style, {
      top: `${size.renderCoverSize.height}px`
    });
    const pageNumberHtml = [];
    if (thumbnail) {
      pageNumberHtml.push();
    }

    const hasBleed = handler.hasBleed(pages);
    const bgImageOffset = {
      width: hasBleed ? -2 : isSmallView ? 0 : 2,
      height: hasBleed ? -4 : isSmallView ? 0 : -2,
      top: hasBleed ? 2 : isSmallView ? 0 : 1,
      left: hasBleed ? 1 : isSmallView ? 0 : -1
    };

    const bgImageStyle = {
      position: 'absolute',
      width: `${bgImageWidth + bgImageOffset.width}px`,
      height: `${size.renderCoverSize.height + bgImageOffset.height}px`,
      top: `${bgImageOffset.top}px`,
      left: `${(size.renderCoverSize.width - bgImageWidth) / 2 +
        bgImageOffset.left}px`,
      backgroundImage: bgImage,
      backgroundSize: 'cover'
    };

    return (
      <div
        key="cover"
        className={coverClass}
        style={containerStyle}
        draggable="false"
        onDragStart={this.stopDragEvent}
        onClick={this.switchSheet}
        ref={(c) => {
          this.componentRef = c;
        }}
      >
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
          <div
            className="cover-effect"
            style={renderStyle}
            draggable="false"
            onDragStart={this.stopDragEvent}
          >
            <div className="bg-image" style={bgImageStyle} draggable="false" />

            <img
              className="effect-img"
              src={effectImg}
              style={effectImgStyle}
              draggable="false"
              onDragStart={this.stopDragEvent}
            />
          </div>
        )}

        {bookPages}

        {isNavpages ? (
          <NavPageDisableHandler data={disableHandlerData} />
        ) : null}
      </div>
    );
  }
}

BookCover.propTypes = {};

BookCover.defaultProps = {};

export default translate('BookCover')(BookCover);
