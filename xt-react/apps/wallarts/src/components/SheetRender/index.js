import { get, merge } from 'lodash';
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
// import BookCover from '../../components/BookCover';
import BookSheet from '../../canvasComponents/BookSheet';

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
      boundSnippingActions
    } = actions;
    const {
      urls,
      size,
      ratios,
      variables,
      pagination,
      materials,
      paginationSpread,
      settings,
      project,
      parameters,
      allImages,
      isPreview,
      specData,
      userId,
      capability,
      snipping,
      isSplit
    } = data;
    const pages = paginationSpread.get('pages');

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
      boundSnippingActions
    };

    const sheets = [];
    if (pages && pages.size) {
      // 判断是否向右翻页.
      const sheetPageIndex = 0;

      const bookData = {
        urls,
        size,
        ratios,
        variables,
        pagination,
        materials,
        paginationSpread,
        project,
        settings,
        isPreview,
        parameters,
        specData,
        userId,
        capability,
        allImages,
        snipping,
        isSplit
      };
      sheets.push(
        <BookSheet
          key={sheetPageIndex}
          actions={bookSheetActions}
          data={bookData}
        />
      );
    }

    return <div className="sheet-render">{sheets}</div>;
  }
}

export default translate('SheetRender')(SheetRender);
