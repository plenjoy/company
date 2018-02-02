import React, { Component } from 'react';
import { translate } from 'react-translate';
import { merge, get, template } from 'lodash';
import classNames from 'classnames';

import { productTypes } from '../../contants/strings';
import { IMAGES_CROPPER, IMAGES_CROPPER_PARAMS } from '../../contants/apiUrl';
import { computedInnerSheet, getPageElements } from './handler.js';
import securityString from '../../../../common/utils/securityString';
import BookPage from '../BookPage';

import './index.scss';

class BookSheet extends Component {
  constructor(props) {
    super(props);

    this.getPageElements = (page, elements) =>
      getPageElements(this, page, elements);
    this.computedInnerSheet = params => computedInnerSheet(params);
  }
  render() {
    const { actions, data } = this.props;
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
      urls,
      setting,
      pagination,
      parameterMap,
      isPreview,
      userInfo,
    } = data;

    const {
      backgroundSize,
      summary,
      pages,
      images,
      elements
    } = paginationSpread;
    const {
      bgImageUrl,
      effectImageUrl,
      isSetCoverAsInnerBg,
      innerPageBackImageEncImgID
    } = summary;
    const bgRenderWidth = Math.floor(
      get(backgroundSize, 'bgImageWidth') * rate
    );
    const bgRenderHeight = Math.floor(
      get(backgroundSize, 'bgImageHeight') * rate
    );
    const bgPaddingTop = get(backgroundSize, 'paddingTop') * rate;
    const bgPaddingRight = get(backgroundSize, 'paddingRight') * rate;
    const bgPaddingBottom = get(backgroundSize, 'paddingBottom') * rate;
    const bgPaddingLeft = get(backgroundSize, 'paddingLeft') * rate;
    const backgroundImageUrl = bgImageUrl ? `url("${bgImageUrl}")` : '';
    const product = get(setting, 'product');

    const boxSheetClassName = classNames('box-sheet-container', {
      hide: pagination.sheetIndex !== 1
    });

    const containerStyle = {
      width: `${bgRenderWidth}px`,
      height: `${bgRenderHeight}px`,
      backgroundImage: backgroundImageUrl
    };

    const renderStyle = {
      width: `${bgRenderWidth}px`,
      height: `${bgRenderHeight}px`,
      zIndex: product === productTypes.usbCase ? 50 : 200
    };

    //  如果是 cover为 hard Cover 或者 none的时候，给内页设置背景图。
    let innerPageBackImageUrl;
    if (isSetCoverAsInnerBg) {
      innerPageBackImageUrl = innerPageBackImageEncImgID
        ? template(`${IMAGES_CROPPER}${IMAGES_CROPPER_PARAMS}`)({
            encImgId: innerPageBackImageEncImgID,
            imgFlip: true,
            shape: 'rect',
            px: 0,
            py: 0,
            pw: 1,
            ph: 1,
            width: Math.round(bgRenderWidth - bgPaddingLeft - bgPaddingRight),
            height: Math.round(bgRenderHeight - bgPaddingTop - bgPaddingBottom),
            rotation: 0,
            effectId: 0,
            opacity: 100,
            baseUrl: urls.baseUrl,
            ...securityString
          })
        : null;
    }

    const centerRenderAreaStyle = {
      width: `${Math.ceil(bgRenderWidth - bgPaddingLeft - bgPaddingRight) +
        2}px`,
      height: `${Math.ceil(bgRenderHeight - bgPaddingTop - bgPaddingBottom) +
        2}px`,
      top: `${bgPaddingTop}px`,
      left: `${bgPaddingLeft}px`,
      backgroundImage: innerPageBackImageUrl
        ? `url(${innerPageBackImageUrl})`
        : '',
      backgroundSize: '100% 100%'
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

        };

        const innerSheetStyles = this.computedInnerSheet({
          page,
          pageIndex: index,
          rate,
          backgroundSize
        });

        bookPages.push(
          <div
            key={index}
            className="inner-sheet"
            style={innerSheetStyles.renderInnerSheetSizeWithoutBleed}
          >
            <div
              className="inner-sheet-with-bleed"
              style={innerSheetStyles.renderInnerSheetSize}
            >
              <BookPage actions={pageActions} data={pageData} />
            </div>
          </div>
        );
      });
    }

    return (
      <div key="inner" className={boxSheetClassName}>
        <div className="box-sheet" style={containerStyle}>
          <div className="inner-effect" style={renderStyle} draggable="false">
            <img className="effect-img" src={effectImageUrl} />
          </div>
          <div
            className="center-render-area"
            style={centerRenderAreaStyle}
          >
            {bookPages}
          </div>
        </div>
      </div>
    );
  }
}

export default translate('BookSheet')(BookSheet);
