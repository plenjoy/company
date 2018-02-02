import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge } from 'lodash';
import classNames from 'classnames';
import './index.scss';

import { cameoShapeTypes, pageTypes } from '../../contants/strings';

import BookPage from '../../canvasComponents/BookPage';
import BookPageThumbnail from '../BookPageThumbnail';
import PageNumber from '../../components/PageNumber';
import PageNumberSimple from '../../components/PageNumberSimple';
import CoverPageLabel from '../../components/CoverPageLabel';
import DisableHandler from '../DisableHandler';
import NavPageDisableHandler from '../NavPageDisableHandler';

// 导入handler
import * as handler from './handler';

class BookCover extends Component {
  constructor(props) {
    super(props);

    this.getPageElements = (page, elements) =>
      handler.getPageElements(this, page, elements);
    this.computedCoverSheet = (
      workspaceRatio,
      size,
      pages,
      pageIndex,
      position,
      isCrystalOrMetal,
      isHardCover
    ) =>
      handler.computedCoverSheet(
        workspaceRatio,
        size,
        pages,
        pageIndex,
        position,
        isCrystalOrMetal,
        isHardCover
      );
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
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPaintedTextModalActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet,
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
      undoData,
      isShowSimplePageNumber = false,
      shouldSwitchSheet = false,
      isNavpages = false,
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
    let pageNumber = paginationSpread.get('pageNumber');

    const cameoShape = summary.get('cameoShape');
    const coverimage =
      variables && variables.getIn(['coverAsset', 'coverimage']);
    const effectImg = materials.getIn(['cover', 'img']);
    const coverBackgroundColor = variables.get('coverBackgroundColor');
    const bgImage =
      coverimage && effectImg
        ? `url("${urls.baseUrl}${coverimage.substring(1)}")`
        : coverBackgroundColor;

    const containerStyle = merge(
      {},
      {
        width: `${size.renderCoverSize.width}px`,
        height: `${size.renderCoverSize.height}px`
      },
      styles
    );

    const renderStyle = {
      width: `${size.renderCoverSize.width}px`,
      height: `${size.renderCoverSize.height}px`,
      background: bgImage
    };

    const effectImgStyle = {
      width: `${size.renderCoverSize.width + 2}px`,
      height: `${size.renderCoverSize.height + 2}px`,
      left: '-1px',
      top: '-1px'
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
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPaintedTextModalActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet,
      setMouseHoverDomNode
    };
    const bookPages = [];

    let coverPageLabelLeft = 0;
    let coverPageLabelTop = 0;

    if (pages && pages.size) {
      pages.forEach((page, index) => {
        // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.
        const isCrystalOrMetal = summary.get('isSupportHalfImageInCover');
        const isHardCover = summary.get('isHardCover');

        const coverSheetSizeObj = this.computedCoverSheet(
          ratios.coverWorkspace,
          size,
          pages,
          index,
          position,
          isCrystalOrMetal,
          isHardCover
        );

        const pageData = {
          ignoreEmpty,
          isPreview,
          urls,
          summary,
          page,
          images,
          elements: this.getPageElements(page, elements),
          pagination,
          ratio,
          index,
          settings,
          template,
          paginationSpread,
          parameters,
          size: merge({}, size, coverSheetSizeObj),
          undoData,
          variables,
          allImages,
          userId,
          project,
          isNavpages,
          capability,
          allElements,
          materials,
          template,
          env
        };

        const correctOffset = {
          width: isHardCover ? 2 : 2,
          height: isHardCover ? 2 : 4,
          top: isHardCover ? -1 : -2,
          left: 0
        };

        const sheetStyle = {
          width: `${coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.width +
            correctOffset.width}px`,
          height: `${coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.height +
            correctOffset.height}px`,
          top: `${coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.top +
            correctOffset.top}px`,
          left: `${coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.left +
            correctOffset.left}px`
        };

        const sheetWithBleedStyle = {
          width: `${coverSheetSizeObj.renderCoverSheetSize.width}px`,
          height: `${coverSheetSizeObj.renderCoverSheetSize.height}px`,
          top: `${coverSheetSizeObj.renderCoverSheetSize.top}px`,
          left: `${coverSheetSizeObj.renderCoverSheetSize.left}px`
        };

        const isSpine = page.get('type') === pageTypes.spine;
        const isFullPage = page.get('type') === pageTypes.full;

        const coverSheetClassName = classNames('cover-sheet', {
          'overflow-h': isCrystalOrMetal
        });

        if (isFullPage) {
          coverPageLabelLeft =
            coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.left +
            correctOffset.left;

          // 13为label的高.
          coverPageLabelTop =
            coverSheetSizeObj.renderCoverSheetSizeWithoutBleed.top +
            correctOffset.top -
            16;
        }

        // 鼠标移到sheet的空白处时, pagenumber选中样式.
        if (thumbnail) {
          pageNumber = pageNumber.setIn(['leftPage', 'active'], false);
          pageNumber = pageNumber.setIn(['leftPage', 'disable'], true);
          pageNumber = pageNumber.setIn(['rightPage', 'active'], false);
          pageNumber = pageNumber.setIn(['rightPage', 'disable'], true);
        }

        if (thumbnail) {
          bookPages.push(
            <div
              key={page.get('id')}
              className={coverSheetClassName}
              style={sheetStyle}
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
          bookPages.push(
            <div
              key={page.get('id')}
              className={coverSheetClassName}
              style={sheetStyle}
            >
              <div
                className="cover-sheet-with-bleed"
                style={sheetWithBleedStyle}
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
      isBlue: thumbnail,
      style: pageNumberStyle
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

    // coverPageLabel
    const coverPageLabelStyle = {
      left: `${coverPageLabelLeft}px`,
      right: `${coverPageLabelLeft}px`,
      top: `${coverPageLabelTop}px`
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
        {/* PageNumber */}
        {isShowSimplePageNumber
          ? <PageNumberSimple
            actions={pageNumberActions}
            data={pageNumberSimpleData}
          />
          : null}
        <div className="cover-effect" style={renderStyle} draggable="false">
          <img className="effect-img" src={effectImg} style={effectImgStyle} />
        </div>

        {bookPages}

        {/* PageNumber */}
        {thumbnail && !isShowSimplePageNumber
          ? <PageNumber actions={pageNumberActions} data={pageNumberData} />
          : null}

        {isNavpages
          ? <NavPageDisableHandler data={disableHandlerData} />
          : null}
      </div>
    );
  }
}

BookCover.propTypes = {};

BookCover.defaultProps = {};

export default translate('BookCover')(BookCover);
