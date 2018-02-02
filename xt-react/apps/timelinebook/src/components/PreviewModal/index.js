import React, { Component, PropTypes } from 'react';
import XModal from '../../../../common/ZNOComponents/XModal';
import PreviewSheetRender from '../../components/PreviewSheetRender';
import * as handler from './handler.js';
import './index.scss';

class PreviewModal extends Component {
  constructor(props) {
    super(props);

    this.onClosePreviewModal = () => handler.onClosePreviewModal(this);
  }

  render() {
    const { data, actions } = this.props;
    const {
      isShown,
      summary,
      total,
      sheets,
      materials,
      env,
      isPreview
    } = data;

    const sheetRenderActions = {};
    const sheetRenderData = {
      sheets,
      total,
      summary,
      materials,
      env,
      isPreview
    };

    return (
      <XModal
        className="preview-modal"
        onClosed={this.onClosePreviewModal}
        isHideIcon={true}
        opened={isShown}
      >
        {isShown && sheets ? (
          <PreviewSheetRender
            actions={sheetRenderActions}
            data={sheetRenderData}
          />
        ) : null}
      </XModal>
    );
  }
}

PreviewModal.proptype = {
  isShown: PropTypes.bool
};

export default PreviewModal;
