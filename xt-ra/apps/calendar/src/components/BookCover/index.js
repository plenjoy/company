import { merge, get } from 'lodash';
import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';
import XDrop from '../../../../common/ZNOComponents/XDrop';
import './index.scss';

import { formatDate } from '../../../../common/utils/dateFormat';
import { pageTypes, productTypes } from '../../constants/strings';

import BookPage from '../../canvasComponents/BookPage';
import BookPageThumbnail from '../BookPageThumbnail';
import PageNumber from '../PageNumber';

// 导入handler
import * as handler from './handler/main';
import * as exchangeHandler from './handler/exchange';

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
      activePageId: null
    };
    this.stopDragEvent = (ev) => {
      const event = ev || window.event;
      event.stopPropagation();
      event.preventDefault();
    };
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
      boundPropertyModalActions,
      boundTrackerActions,
      boundNotificationActions,
      switchSheet,
      setMouseHoverDomNode,
      reApplyDefaultTemplateToPage
    } = actions;
    const {
      thumbnail,
      urls,
      size,
      ratios,
      styles,
      pageNumberStyle,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      parameters,
      specData,
      isShowSimplePageNumber = false,
      shouldSwitchSheet = false,
      allImages,
      userId,
      project,
      isPreview,
      capability,
      allPageSheetIndex,
      userInfo
    } = data;

    const { isExchangeImage, activePageId } = this.state;

    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const elements = paginationSpread.get('elements');
    const images = paginationSpread.get('images');
    const coverClass = classNames('book-cover item');

    const productType = get(settings, 'spec.product');
    const productSize = get(settings, 'spec.size');
    const imgName = thumbnail ? 'thumbnail_cover' : 'cover';
    const effectImg = `./assets/${productType}/${productSize}/${imgName}.png?randow=${formatDate(new Date(), '')}`;

    const containerStyle = merge({},
      {},
      {
        width: `${get(size,'renderCoverSize.width')}px`,
        height: `${get(size,'renderCoverSize.height')}px`,
        cursor: 'default',
        marginBottom: productType === productTypes.DC ? '46px' : '40px'
      },
      styles
    );

    const coverContainerStyle = merge({},
      {},
      {
        width: `${get(size,'renderCoverSize.width')}px`,
        height: `${get(size,'renderCoverSize.height')}px`,
        cursor: 'default'
      },
      styles
    );

    const renderStyle = {
      width: `${get(size, 'renderCoverSize.width')}px`,
      height: `${get(size, 'renderCoverSize.height')}px`,
      userSelect: 'none'
    };


    const effectImgStyle = {
      width: `${get(size,'renderCoverSize.width')}px`,
      height: `${get(size,'renderCoverSize.height')}px`
    };

    const pageActions = {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      boundTemplateActions,
      switchSheet,
      setMouseHoverDomNode,
      reApplyDefaultTemplateToPage
    };

    const ratio = {
      workspace: thumbnail ? ratios.coverWorkspaceForArrangePages : ratios.coverWorkspace
    };

    const bookPages = [];
    if (pages && pages.size) {
      pages.forEach((page, index) => {
        // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.

        const pageData = {
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
          size: merge(size),
          variables,
          allImages,
          userId,
          project,
          capability,
          allPageSheetIndex,
          userInfo
        };

        const sheetStyle = {
          width: `${get(size, 'renderCoverSheetSizeWithoutBleed.width')}px`,
          height: `${get(size, 'renderCoverSheetSizeWithoutBleed.height')}px`,
          top: `${get(size, 'renderCoverSheetSizeWithoutBleed.top')}px`,
          left: `${get(size, 'renderCoverSheetSizeWithoutBleed.left')}px`
        };

        const sheetWithBleedStyle = {
          width: `${get(size, 'renderCoverSheetSize.width')}px`,
          height: `${get(size, 'renderCoverSheetSize.height')}px`,
          top: `${get(size, 'renderCoverSheetSize.top')}px`,
          left: `${get(size, 'renderCoverSheetSize.left')}px`,
          userSelect: 'none',
          background: 'white'
        };

        const coverSheetClassName = classNames('cover-sheet', {
          'overflow-h': false
        });

        if (thumbnail) {
          bookPages.push(
            <div key={page.get('id')} className={coverSheetClassName} style={sheetStyle}>
              <div
                className="cover-sheet-with-bleed"
                style={sheetWithBleedStyle}
              >
                <XDrop>
                <BookPageThumbnail actions={pageActions} data={pageData} />
                </XDrop>
              </div>
            </div>
          );
        } else {
          bookPages.push(
            <div key={page.get('id')} className={coverSheetClassName} style={sheetStyle}>
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

    const pageNumberData = {
      pageNumberData: {
        month: summary && summary.get('month'),
        year: summary && summary.get('year'),
        sheetIndex: summary && summary.get('sheetIndex')
      }
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

        {thumbnail && productType !== productTypes.LC
          ? <PageNumber data={pageNumberData} />
          : null
        }
        <div className="cover-overflow-container" style={coverContainerStyle}>
          <div
            className="cover-effect"
            style={renderStyle}
            draggable="false"
            onDragStart={this.stopDragEvent}
          >
            <img
              className="effect-img"
              src={effectImg}
              style={effectImgStyle}
              draggable="false"
              onDragStart={this.stopDragEvent}
            />
          </div>
          {bookPages}
        </div>
        {
          thumbnail
            ? null
            : <div className="cover-sign">Cover</div>
        }
      </div>
    );
  }
}

BookCover.propTypes = {};

BookCover.defaultProps = {};

export default translate('BookCover')(BookCover);
