import React, { Component } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import classNames from 'classnames';

import BookPage from '../BookPage';
import Loading from '../Loading';

import {
  cameoShapeTypes,
  pageTypes,
  productTypes
} from '../../contants/strings';
import { getScreenRatio } from '../../../common/utils/helper';

import * as handler from './handler';

import './index.scss';

class BookCover extends Component {
  constructor(props) {
    super(props);

    this.getPageElements = (page, elements) =>
      handler.getPageElements(this, page, elements);
    this.computedCoverSheetStyle = params =>
      handler.computedCoverSheetStyle(params);

    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.state = {
      isImgLoading: false
    };
  }
  componentWillReceiveProps(nextProps) {
    const newImgUrl = nextProps.data.paginationSpread.summary.bgImageUrl;
    const oldImgUrl = this.props.data.paginationSpread.summary.bgImageUrl;
    if (newImgUrl && newImgUrl != oldImgUrl) {
      this.setState({
        isImgLoading: true
      });
    }
  }

  onImageLoaded() {
    this.setState({
      isImgLoading: false
    });
  }
  render() {
    const { actions, data, t } = this.props;
    const { isImgLoading } = this.state;
    const {
      boundProjectActions,
      boundPaginationActions,
      boundSystemActions,
      boundUploadedImagesActions,
      toggleModal,
      toggleOperationPanel,
      boundWorkspaceActions,
      boundTrackerActions,
      editText,
      selectElementOnMainContainer,
      editTextWithoutJustify,
      onRemoveImage,
      onCropImage,
    } = actions;
    const {
      paginationSpread,
      rate,
      pagination,
      setting,
      urls,
      parameterMap,
      isPreview,
      isProjectLoadCompleted,
      userInfo,

    } = data;
    const {
      backgroundSize,
      summary,
      pages,
      elements,
      images
    } = paginationSpread;
    const { bgImageUrl, effectImageUrl } = summary;
    const bgRenderWidth = Math.floor(
      get(backgroundSize, 'bgImageWidth') * rate
    );
    const bgRenderHeight = Math.floor(
      get(backgroundSize, 'bgImageHeight') * rate
    );
    const bgPaddingLeft = get(backgroundSize, 'paddingLeft') * rate;
    const bgPaddingRight = get(backgroundSize, 'paddingRight') * rate;
    const bgPaddingTop = get(backgroundSize, 'paddingTop') * rate;
    const bgPaddingBottom = get(backgroundSize, 'paddingBottom') * rate;
    const backgroundImageUrl = bgImageUrl ? `url("${bgImageUrl}")` : '';
    const product = get(setting, 'product');

    const boxCoverClassName = classNames('box-cover-container', {
      hide: pagination.sheetIndex !== 0
    });

    const containerStyle = {
      width: `${bgRenderWidth}px`,
      height: `${bgRenderHeight}px`,
      backgroundImage: backgroundImageUrl
    };

    const renderStyle = {
      width: `${bgRenderWidth}px`,
      height: `${bgRenderHeight}px`
    };

    const centerRenderAreaStyle = {
      width: `${bgRenderWidth - bgPaddingLeft - bgPaddingRight}px`,
      height: `${bgRenderHeight - bgPaddingTop - bgPaddingBottom}px`,
      top: `${bgPaddingTop}px`,
      left: `${bgPaddingLeft}px`
    };
    const centerRenderArea = {
      width: bgRenderWidth - bgPaddingLeft - bgPaddingRight,
      height: bgRenderHeight - bgPaddingTop - bgPaddingBottom
    };

    const screenRatio = getScreenRatio() > 1 ? getScreenRatio() : 1;
    const boxCoverDescribeStyle = {
      width: `${bgRenderWidth - bgPaddingLeft - bgPaddingRight}px`,
      top: `${bgPaddingTop - 26}px`,
      left: `${bgPaddingLeft}px`,
      fontSize: `${12 / screenRatio}px`
    };

    const pageActions = {
      boundProjectActions,
      boundPaginationActions,
      boundSystemActions,
      boundUploadedImagesActions,
      toggleModal,
      toggleOperationPanel,
      boundWorkspaceActions,
      boundTrackerActions,
      editText,
      selectElementOnMainContainer,
      editTextWithoutJustify,
      onRemoveImage,
      onCropImage,
    };

    const bookPages = [];

    if (pages && pages.length) {
      pages.forEach((page, index) => {
        const pageData = {
          isPreview,
          summary,
          urls,
          page,
          images,
          pagination,
          elements: this.getPageElements(page, elements),
          rate,
          index,
          setting,
          paginationSpread,
          parameterMap,
          userInfo,
          centerRenderArea
        };

        const coverSheetStyles = this.computedCoverSheetStyle({
          page,
          pages,
          pageIndex: index,
          rate
        });

        const coverSheetClassName = classNames('cover-sheet', {
          // 'pointer-events-none': page.type === pageTypes.spine
        });

        bookPages.push(
          <div
            key={index}
            className={coverSheetClassName}
            style={coverSheetStyles.renderCoverSheetSizeWithoutBleed}
          >
            <div
              className="cover-sheet-with-bleed"
              style={coverSheetStyles.renderCoverSheetSize}
            >
              <BookPage
                actions={pageActions}
                data={pageData}
                renderCoverSheetSize={coverSheetStyles.renderCoverSheetSize}
              />
            </div>
          </div>
        );
      });
    }

    return (
      <div key="cover" className={boxCoverClassName}>
        {product === productTypes.woodBox ||
        isPreview ||
        !isProjectLoadCompleted ? null : (
          <div
            className="box-cover-describe"
            data-html2canvas-ignore="true"
            style={boxCoverDescribeStyle}
          >
            <span>{t('BACK_COVER')}</span>
            <span>{t('FRONT_COVER')}</span>
          </div>
        )}

        <div className="box-cover" style={containerStyle}>
          <img
            style={{ display: 'none' }}
            width="100%"
            height="100%"
            src={bgImageUrl}
            onLoad={this.onImageLoaded}
          />
          <div className="cover-effect" draggable="false">
            <img className="effect-img" src={effectImageUrl} />
          </div>
          <div className="center-render-area" style={centerRenderAreaStyle}>
            {bookPages}
          </div>

          <Loading
            isShow={isImgLoading}
            isModalShow={isImgLoading}
            isWhiteBackground={isImgLoading}
          />
        </div>
      </div>
    );
  }
}

export default translate('BookCover')(BookCover);
