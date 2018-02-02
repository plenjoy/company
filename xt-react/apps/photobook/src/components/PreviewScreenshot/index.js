import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import { get } from 'lodash';

import './index.scss';

class PreviewScreenshot extends Component {
  constructor(props) {
    super(props);
    this.onUploadClicked = this.onUploadClicked.bind(this);
  }

  onUploadClicked() {
    const { actions } = this.props;
    const { onClickUpload, closePreviewScreenshotModal } = actions;
    onClickUpload();
    closePreviewScreenshotModal();
  }

  render() {
    const { actions, data, t } = this.props;
    const { isShown, screenshot } = data;

    const screenshotSrc = screenshot ? `data:image/png;base64,${screenshot}` : null;
    return (
      <XModal
        className="preview-screenshot-modal"
        onClosed={actions.closePreviewScreenshotModal}
        opened={isShown}
      >
        <p className="modal-title">{t('TITLE')}</p>

        <div className="main">
          <img src={screenshotSrc} />
        </div>

        <div className="button-wrap">
        <XButton
            className="button-white little-button"
            onClicked={actions.closePreviewScreenshotModal}
          >{t('CLOSE')}</XButton>
          <XButton
            className="little-button"
            onClicked={this.onUploadClicked}
          >{t('UPLOAD')}</XButton>
        </div>
      </XModal>
    );
  }
}

export default translate('PreviewScreenshot')(PreviewScreenshot);
