import { merge, get } from 'lodash';
import React, { Component } from 'react';
import { translate } from 'react-translate';
import BookSheet from '../BookSheet';

import './index.scss';

class Screenshot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, data } = this.props;
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
      snipping,
      capability,
      isScreenShot,
      isSplit
    } = data;
    const { boundSnippingActions } = actions;
    const bookSheetActions = {
      boundSnippingActions
    };
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
      isScreenShot,
      parameters,
      specData,
      userId,
      capability,
      allImages,
      snipping,
      isSplit
    };
    const screenShotContainerSize = {
      width: `${get(size, 'renderContainerProps').width}px`,
      height: `${get(size, 'renderContainerProps').height}px`
    };
    return (
      <div className="book-cover-screenshot" style={screenShotContainerSize}>
        <BookSheet
          actions={bookSheetActions}
          data={bookData}
        />
      </div>);
}
}
export default translate('Screenshot')(Screenshot);
