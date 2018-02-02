import { merge } from 'lodash';
import classNames from 'classnames';
import {
  translate
} from 'react-translate';
import React, {
  Component,
  PropTypes
} from 'react';

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
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPropertyModalActions,
      boundTrackerActions,
      boundNotificationActions,
      reApplyDefaultTemplateToPage
    } = actions;
    const {
      urls,
      size,
      ratios,
      materials,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      project,
      parameters,
      isPreview,
      specData,
      allImages,
      userId,
      capability,
      userInfo
    } = data;
    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const bookCoverActions = {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPropertyModalActions,
      boundNotificationActions,
      boundTrackerActions,
      reApplyDefaultTemplateToPage
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
      reApplyDefaultTemplateToPage
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
          materials,
          variables,
          template,
          pagination,
          paginationSpread,
          settings,
          parameters,
          isPreview,
          specData,
          project,
          allImages,
          userId,
          capability,
          userInfo
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
          variables,
          template,
          pagination,
          paginationSpread,
          project,
          settings,
          isPreview,
          parameters,
          specData,
          userId,
          capability,
          userInfo
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

    return <div className="sheet-render">{sheets}</div>;
  }
}

export default translate('BookSheet')(SheetRender);
