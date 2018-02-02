import React, { Component, PropTypes } from 'react';

// 导入组件
import XModal from '../../../../common/ZNOComponents/XModal';
import PreviewSheetRender from '../../components/PreviewSheetRender';

import * as handler from './handler.js';

import './index.scss';

class PreviewModal extends Component {
  constructor(props) {
    super(props);

    // 处理函数
    this.onClosePreviewModal = () => handler.onClosePreviewModal(this);
  }

  render() {
    const { data, actions } = this.props;
    const { boundSnippingActions, onSwitchSheet } = actions;
    const {
      // 标记当前是不是处于预览模式,
      // 在预览模式下, 关闭按钮不显示.
      isInPreviewModel,
      isShown,
      pagination,
      urls,
      ratios,
      size,
      position,
      variables,
      settings,
      project,
      parameters,
      allSheets,
      capability,
      ignoreEmpty = true
    } = data;

    const sheetRenderActions = {
      boundSnippingActions,
      onSwitchSheet
    };

    const sheetRenderData = {
      pagination,
      urls,
      ratios,
      size,
      position,
      variables,
      settings,
      project,
      parameters,
      allSheets,
      ignoreEmpty,
      capability
    };

    return (
      <XModal
        className="preview-modal"
        onClosed={this.onClosePreviewModal}
        isHideIcon={isInPreviewModel}
        opened={isShown}
      >
        {isShown && size && size.renderCoverSize
          ? <PreviewSheetRender
            actions={sheetRenderActions}
            data={sheetRenderData}
          />
          : null}
      </XModal>
    );
  }
}

PreviewModal.proptype = {
  isShown: PropTypes.bool
};

export default PreviewModal;
