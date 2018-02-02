import { get } from 'lodash';
import React, { Component } from 'react';
import { translate } from 'react-translate';

// 导入组件.
import BookCover from '../../components/BookCover';
import BookSheet from '../../components/BookSheet';

import OperationPanel from '../OperationPanel';
import * as operationPanelEvents from './operationPanelEvents';

import './index.scss';

class MainRenderContainer extends Component {
  constructor(props) {
    super(props);

    this.onRotateImage = e => operationPanelEvents.onRotateImage(this, e);
    this.onRemoveImage = e => operationPanelEvents.onRemoveImage(this, e);
    this.onCropImage = e => operationPanelEvents.onCropImage(this, e);

    this.toggleOperationPanel = this.toggleOperationPanel.bind(this);
    this.hideOperationPanel = this.hideOperationPanel.bind(this);
    this.clearElementSelect = this.clearElementSelect.bind(this);
    this.selectElementOnMainContainer = this.selectElementOnMainContainer.bind(this);

    this.state = {
      isOperationPanelShow: false,
      operationPanelPosition: {
        top: 300,
        left: 950
      },
      activeElement: null,
      selectElement: null,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.clearElementSelect);
    window.addEventListener('click', this.hideOperationPanel);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.clearElementSelect);
    window.removeEventListener('click', this.hideOperationPanel);
  }

  clearElementSelect(event) {
    const { boundProjectActions, elementArray } = this.props;

    // 如果window选中dom handler元素，不是textElement的handler元素
    if (event.target !== this.state.selectElement) {
      boundProjectActions.clearElementSelect();
    }
  }

  selectElementOnMainContainer(target) {
    this.setState({
      selectElement: target
    });
  }

  toggleOperationPanel(operationPanelStatus, position, element) {
    const { boundProjectActions } = this.props;

    this.setState({
      isOperationPanelShow: operationPanelStatus,
      operationPanelPosition: {
        top: (position && position.top) || 0,
        left: (position && position.left) || 0
      },
      activeElement: element
    });

    boundProjectActions.clearElementSelect();
  }

  hideOperationPanel() {
    this.setState({
      isOperationPanelShow: false,
      operationPanelPosition: {
        top: 0,
        left: 0
      },
      activeElement: null
    });
  }

  render() {
    const {
      paginationSpread,
      rate,
      boundProjectActions,
      urls,
      pagination,
      boundPaginationActions,
      boundSystemActions,
      boundUploadedImagesActions,
      boundWorkspaceActions,
      boundTrackerActions,
      toggleModal,
      isProjectLoadCompleted,
      setting,
      parameterMap,
      editText,
      coverPageSpread,
      innerPageSpread,
      isPreview,
      editTextWithoutJustify,
      userInfo
    } = this.props;
    const bookCoverActions = {
      boundProjectActions,
      boundPaginationActions,
      boundSystemActions,
      boundUploadedImagesActions,
      toggleModal,
      toggleOperationPanel: this.toggleOperationPanel,
      boundWorkspaceActions,
      boundTrackerActions,
      editText,
      selectElementOnMainContainer: this.selectElementOnMainContainer,
      editTextWithoutJustify,
      onRemoveImage: this.onRemoveImage,
      onCropImage: this.onCropImage,
    };
    const bookSheetActions = {
      boundProjectActions,
      boundPaginationActions,
      boundSystemActions,
      boundUploadedImagesActions,
      toggleModal,
      toggleOperationPanel: this.toggleOperationPanel,
      boundWorkspaceActions,
      boundTrackerActions,
      editText,
      selectElementOnMainContainer: this.selectElementOnMainContainer,
      editTextWithoutJustify,
      onRemoveImage: this.onRemoveImage,
      onCropImage: this.onCropImage
    };
    const { backgroundSize, summary, pages } = paginationSpread;
    const bgRenderWidth = get(backgroundSize, 'bgImageWidth') * rate;
    const bgRenderHeight = get(backgroundSize, 'bgImageHeight') * rate;
    const style = {
      width: `${bgRenderWidth}px`,
      height: `${bgRenderHeight}px`
    };

    const sheets = [];
    // if (pages.length) {
    // if (summary.isCover) {
    // cover
    const boxCoverData = {
      paginationSpread: coverPageSpread,
      rate,
      urls,
      pagination,
      setting,
      parameterMap,
      isPreview,
      isProjectLoadCompleted,
      userInfo,

    };
    sheets.push(
      <BookCover key={0} actions={bookCoverActions} data={boxCoverData} />
    );
    // } else {
    const boxSheetData = {
      paginationSpread: innerPageSpread,
      rate,
      urls,
      pagination,
      setting,
      parameterMap,
      isPreview,

    };
    sheets.push(
      <BookSheet key={1} actions={bookSheetActions} data={boxSheetData} />
    );
    // }
    // }

    return (
      <div className="main-render-container" style={style}>
       {/*<OperationPanel
          shown={this.state.isOperationPanelShow}
          offset={this.state.operationPanelPosition}
          onRotateImage={this.onRotateImage}
          onRemoveImage={this.onRemoveImage}
          onCropImage={this.onCropImage}
        />*/}
        {sheets}
      </div>
    );
  }
}

export default translate('MainRenderContainer')(MainRenderContainer);
