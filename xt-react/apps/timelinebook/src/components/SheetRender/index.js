import React, { Component } from 'react';
import BookCover from '../BookCover';
import BookSheet from '../BookSheet';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './index.scss';

class SheetRender extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const {
      env,
      sheets,
      sheetIndex,
      prevSheetIndex,
      materials,
      summary,
      isPreview
    } = data;

    const transitionName = prevSheetIndex > sheetIndex ? 'to-right' : 'to-left';
    const currentSheet = sheets ? sheets.get(String(sheetIndex)) : null;
    const isCover = currentSheet.getIn(['computed', 'isCover']);

    const sheetData = {
      computedPage: currentSheet,
      materials,
      summary,
      env,
      isPreview
    };
    const sheetActions = {};

    return (
      <div className="sheet-render">
        <ReactCSSTransitionGroup
          transitionName={transitionName}
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          { isCover ? (
            <BookCover
              key={sheetIndex}
              data={sheetData}
              actions={sheetActions}
            />
          ) : (
            <BookSheet
              key={sheetIndex}
              data={sheetData}
              actions={sheetActions}
            />
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default SheetRender;