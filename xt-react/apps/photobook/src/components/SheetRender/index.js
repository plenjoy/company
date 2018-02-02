import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { merge } from 'lodash';
import classNames from 'classnames';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import './index.scss';

// 导入组件.
import BookCover from '../../components/BookCover';
import BookSheet from '../../components/BookSheet';

class SheetRender extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, data } = this.props;
    const {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundPaintedTextModalActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPropertyModalActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundNotificationActions,
      boundGlobalLoadingActions,
      boundUndoActions,
      boundClipboardActions,
      doSnipping
    } = actions;
    const {
      urls,
      size,
      ratios,
      position,
      materials,
      variables,
      template,
      pagination,
      paginationSpread,
      coverSpreadForInnerWrap,
      index,
      settings,
      project,
      parameters,
      snipping,
      isPreview,
      isShowSimplePageNumber,
      isShowPageNumber,
      ignoreEmpty,
      isCameoActionBarShow,
      undoData,
      specData,
      capability,
      backgroundArray,
      stickerArray,
      clipboardData,
      isUseFastCrop,
      env
    } = data;
    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const bookCoverActions = {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundPaintedTextModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPropertyModalActions,
      boundNotificationActions,
      boundGlobalLoadingActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundUndoActions,
      boundClipboardActions,
      doSnipping
    };
    const bookSheetActions = {
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
      boundClipboardActions
    };

    const sheets = [];

    if (pages && pages.size) {
      // 判断是否向右翻页.
      const sheetPageIndex = 0;

      // 是否为封面.
      if (summary.get('isCover')) {
        // cover
        const bookCoverData = {
          urls,
          size,
          ratios,
          position: position.cover,
          materials,
          variables,
          template,
          pagination,
          paginationSpread,
          settings,
          parameters,
          isPreview,
          isShowSimplePageNumber,
          isShowPageNumber,
          ignoreEmpty,
          isCameoActionBarShow,
          undoData,
          specData,
          project,
          capability,
          backgroundArray,
          stickerArray,
          clipboardData,
          isUseFastCrop,
          env
        };
        sheets.push(
          <BookCover
            key={sheetPageIndex}
            actions={bookCoverActions}
            data={bookCoverData}
          />
        );
      } else {
        const bookData = {
          urls,
          size,
          ratios,
          position: position.inner,
          materials,
          variables,
          template,
          pagination,
          paginationSpread,
          coverSpreadForInnerWrap,
          project,
          settings,
          snipping,
          isPreview,
          isShowSimplePageNumber,
          isShowPageNumber,
          ignoreEmpty,
          isCameoActionBarShow,
          parameters,
          undoData,
          specData,
          capability,
          backgroundArray,
          stickerArray,
          clipboardData,
          isUseFastCrop,
          env
        };
        sheets.push(
          <BookSheet
            key={sheetPageIndex}
            actions={bookSheetActions}
            data={bookData}
          />
        );
      }
    }

    return <div>{sheets}</div>;
  }
}

SheetRender.propTypes = {};

SheetRender.defaultProps = {};

export default translate('BookSheet')(SheetRender);
