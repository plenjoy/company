import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge } from 'lodash';
import classNames from 'classnames';
import './index.scss';

import { cameoShapeTypes, pageTypes } from '../../contants/strings';

import BookPageThumbnail from '../BookPageThumbnail';

// 导入handler
import * as handler from './handler';
import * as exchangeHandler from './handler/exchange';

class BookCoverForInnerWrap extends Component {
  constructor(props) {
    super(props);

    this.computedCoverSheet = (workspaceRatio, size, pages, pageIndex, isCrystalOrMetal) => handler.computedCoverSheet(workspaceRatio, size, pages, pageIndex, isCrystalOrMetal);

    // 交换图片
    this.startExchangeImage = () => exchangeHandler.startExchangeImage(this);
    this.stopExchangeImage = () => exchangeHandler.stopExchangeImage(this);

    this.state = {
      isExchangeImage: false
    };
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
      hideCameoActionBar,
      doSnipping
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
      coverSpreadForInnerWrap,
      settings,
      parameters,
      isPreview,
      ignoreEmpty,
      isCameoActionBarShow,
      undoData,
      specData,
      innerEffectValue
    } = data;
    const { isExchangeImage } = this.state;

    const summary = coverSpreadForInnerWrap.get('summary');
    const pages = coverSpreadForInnerWrap.get('pages');
    const elements = coverSpreadForInnerWrap.get('elements');
    const images = coverSpreadForInnerWrap.get('images');

    const cameoShape = summary.get('cameoShape');
    const coverimage = variables && variables.getIn(['coverAsset', 'coverimage']);
    const effectImg = materials.getIn(['cover', 'img']);
    const bgImage = coverimage && effectImg ? `url("${urls.baseUrl}${coverimage.substring(1)}")` : '';
    const fullPage = pages.find(page => page.get('type') == pageTypes.full);

    // 获取封面的背景色
    const coverPage = pages.find(p => p.get('type') === pageTypes.full || p.get('type') === pageTypes.front);
    const bgColor = coverPage ? coverPage.get('bgColor') : '';

    const containerStyle = merge({}, {
      width: `${innerEffectValue.width}px`,
      height: `${innerEffectValue.height}px`,
      margin: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
      background: bgColor
    });

    const coverClass = classNames('book-cover-in-wrap item');

    // 页面元素
    const ratio = {
      workspace: innerEffectValue.width / fullPage.get('width'),
      cameoTop: cameoShape === cameoShapeTypes.rect
	    ? ratios.rectCameoPaddingTop
	    : ratios.roundCameoPaddingTop,
      cameoLeft: cameoShape === cameoShapeTypes.rect
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
      hideCameoActionBar,
      doSnipping,
      startExchangeImage: this.startExchangeImage,
      stopExchangeImage: this.stopExchangeImage
    };
    const bookPages = [];

    if (pages && pages.size) {
      pages.forEach((page, index) => {
        // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.
        const isCrystalOrMetal = summary.get('isSupportHalfImageInCover');
        const coverSheetSizeObj = this.computedCoverSheet(ratios.coverWorkspace, size, pages, index, position, isCrystalOrMetal);

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
          coverSpreadForInnerWrap,
          parameters,
          variables,
          size: merge({}, size, coverSheetSizeObj),
          isCameoActionBarShow,
          undoData,
          specData,
          isExchangeImage,
          innerEffectValue,
          isRenderText: false,

          // 是否需要水平翻转.
          isFlip: true
        };

        const isSpine = page.get('type') === pageTypes.spine;

        if (!isSpine) {
          bookPages.push(
            <div key={index} className="cover-sheet-with-bleed" style={containerStyle}>
              <BookPageThumbnail actions={pageActions} data={pageData} />
            </div>);
        }
      });
    }

    return (
      <div key="cover" className={coverClass} style={containerStyle}>
        { bookPages }
      </div>
    );
  }
}


export default translate('BookCover')(BookCoverForInnerWrap);

