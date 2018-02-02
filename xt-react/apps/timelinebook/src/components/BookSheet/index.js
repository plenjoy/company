import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { zIndex } from '../../constants/strings';
import * as main from './handler/main';

import './index.scss';

class BookSheet extends Component {
  constructor(props) {
    super(props);

    this.getSheetHandlers = main.getSheetHandlers.bind(this);
    this.getSpreadElements = main.getSpreadElements.bind(this);
    this.isComponentShouldUpdate = main.isComponentShouldUpdate.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.isComponentShouldUpdate(nextProps);
  }

  render() {
    const { t, data, actions } = this.props;

    const {
      materials,
      computedPage
    } = data;

    const {
      boundProjectsActions,
      boundPhotoArrayActions,
      boundTrackerActions
    } = actions;

    const computedSize = computedPage.get('computed');
    const elements = computedPage.get('elements');
    const leftPageIdx = computedPage.getIn(['left', 'index']);
    const rightPageIdx = computedPage.getIn(['right', 'index']);

    const containerStyle = {
      height: computedSize.get('height'),
      width: computedSize.get('width'),
      marginBottom: computedSize.getIn(['backgroundImageSize', 'paddingBottom'])
    };

    const backgroundImageStyle = {
      top: computedSize.getIn(['backgroundImageSize', 'x']),
      left: computedSize.getIn(['backgroundImageSize', 'y']),
      width: computedSize.getIn(['backgroundImageSize', 'width']),
      height: computedSize.getIn(['backgroundImageSize', 'height']),
      zIndex: zIndex.backgroundImage
    };

    const photoLayerStyle = {
      top: -computedSize.get('bleedTop'),
      left: -computedSize.get('bleedLeft'),
      width: computedSize.get('widthWithBleed'),
      height: computedSize.get('heightWithBleed'),
      zIndex: zIndex.elements,
    };

    const backgroundImageColorStyle = {
      ...backgroundImageStyle,
      zIndex: zIndex.elements - 1
    };

    const handlersStyle = {
      ...photoLayerStyle,
      zIndex: zIndex.elements + 1
    };

    return (
      <div className="book-sheet-spread">
        <div className="book-sheet-container" style={containerStyle}>
          <img
            className="book-sheet-background"
            src={materials.getIn(['inner', 'url'])}
            style={backgroundImageStyle}
          />
          <div className="book-sheet-photo-layer" style={photoLayerStyle}>
            {this.getSpreadElements()}
          </div>
          <div className="book-sheet-background-color" style={backgroundImageColorStyle}></div>
          <div className="book-sheet-handlers" style={handlersStyle}>
            {this.getSheetHandlers()}
          </div>
        </div>

        <div className="book-sheet-footer">
          <div className="book-sheet-left">{leftPageIdx}</div>
          <div className="book-sheet-right">{rightPageIdx}</div>
        </div>
      </div>
    );
  }
}

BookSheet.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('BookSheet')(BookSheet);
