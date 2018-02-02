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
      boundPaginationActions,
      boundProjectActions,
      boundPaintedTextModalActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet
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
      index,
      settings,
      project,
      parameters,
      snipping,
      isPreview,
      ignoreEmpty,
      undoData,
      allImages,
      userId,
      capability,
      allElements,
      env
    } = data;
    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const bookCoverActions = {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundPaintedTextModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet
    };
    const bookSheetActions = {
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
      switchSheet
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
          ignoreEmpty,
          undoData,
          project,
          allImages,
          userId,
          capability,
          allElements,
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
          project,
          settings,
          snipping,
          isPreview,
          ignoreEmpty,
          parameters,
          undoData,
          allImages,
          userId,
          capability,
          allElements,
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

    return (
      <div>
        {sheets}
      </div>
    );
  }
}

SheetRender.propTypes = {};

SheetRender.defaultProps = {};

export default translate('BookSheet')(SheetRender);
