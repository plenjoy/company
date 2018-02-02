import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';

import * as handler from './handler';

class SaveTemplateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      timer: null,
      isInvalid: false,
      errorTip: 'Name repeat, please give another name'
    };
    this.resetTemplateName = (event) => handler.resetTemplateName(this, event);
    this.checkTemplateName = (templateName, callback) => handler.checkTemplateName(this, templateName, callback);
    this.handleSaveTemplate = () => handler.handleSaveTemplate(this);
    this.templateData = () => handler.templateData(this);
    this.closeModal = () => handler.closeModal(this);
    this.getParams = () => handler.getParams(this);
    this.getPageElementIds = (pageId, pages) => handler.getPageElementIds(pageId, pages);
  }

  render() {
    const isShown = this.props.isShown;
    const errorTip = classNames('error-tip', { show: this.state.isInvalid });
    return (
      <XModal
        className="save-template-modal"
        onClosed={this.closeModal}
        opened={isShown}
      >
        <p className="modal-title">Save Your Layout</p>
        <p className="input-tip">Enter your layout name:</p>
        <div className="name-inputer-wrap">
          <input
            type="text"
            maxLength="50"
            placeholder="input layout name here"
            value={this.state.name}
            onChange={this.resetTemplateName}
          />
          <span className={errorTip}>{this.state.errorTip}</span>
        </div>
        <div className="button-wrap">
          <XButton
            className="little-button white"
            onClicked={this.closeModal}
          >Close</XButton>
          <XButton
            className="little-button"
            disabled={this.state.isInvalid || !this.state.name}
            onClicked={this.handleSaveTemplate}
          >Save</XButton>
        </div>
      </XModal>
    );
  }
}

SaveTemplateModal.propTypes = {
  env: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  pageInfo: PropTypes.object.isRequired,
  isShown: PropTypes.bool.isRequired,
  saveTemplate: PropTypes.func.isRequired,
  checkTemplateName: PropTypes.func.isRequired,
  closeSaveTemplateModal: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired
};

export default translate('SaveTemplateModal')(SaveTemplateModal);
