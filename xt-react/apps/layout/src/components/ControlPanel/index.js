import React, { Component, PropTypes } from 'react';
import { elementTypes } from '../../constants/strings';
import './index.scss';

class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this.onCreatePhotoElement = this.onCreatePhotoElement.bind(this);
    this.onCreateTextElement = this.onCreateTextElement.bind(this);
  }

  handleSave() {
    const { actions } = this.props;
    const { saveProject } = actions;
    saveProject();
  }

  handlePublish() {
    const { actions } = this.props;
    const { saveProject } = actions;
    saveProject({
      isPublish: true
    });
  }

  handleCopy() {
    const { actions } = this.props;
    const { copyProject } = actions;
    copyProject();
  }

  handleCoverDefaultChange(value) {
    const isCoverDefault = value;
    this.updateSetting({
      isCoverDefault
    });
  }

  handleBestChosenChange(value) {
    const bestChosen = value;
    this.updateSetting({
      bestChosen
    });
  }

  handleShareFlagChange(value) {
    const shareFlag = value;
    this.updateSetting({
      shareFlag
    });
  }

  updateSetting(newSetting) {
    const { actions } = this.props;
    const { updateSetting } = actions;
    updateSetting(newSetting);
  }

  onCreatePhotoElement() {
    const { actions } = this.props;
    actions.createElement(elementTypes.photo);
  }

  onCreateTextElement() {
    const { actions } = this.props;
    actions.createElement(elementTypes.text);
  }

  render() {
    const { setting, canSubmit } = this.props;
    const { isCoverDefault, bestChosen, shareFlag } = setting;
    const coverDefaultFlag = isCoverDefault || false;
    const chosenFlag = !!(bestChosen && bestChosen == 1);
    const isShareFlag = !!(shareFlag && shareFlag == 1);
    return (
      <div className="panel panel-info  panel-info canvas-panel">
        <div className="panel-heading">
          <h3 className="panel-title">
            <i className="glyphicon glyphicon-wrench" />Control Panel
          </h3>
        </div>
        <div className="panel-body">
          <div className="button-block">
            <a
              className="btn btn-sm btn-primary admin-btn"
              id="button-save"
              href="javascript:void(0);"
              onClick={this.handleSave.bind(this)}
            >
              <i className="glyphicon glyphicon-floppy-disk" /> Save
            </a>
            {canSubmit ? (
              <a
                className="btn btn-sm btn-primary admin-btn"
                id="button-publish"
                href="javascript:void(0);"
                title="Your data will be saved automatically before submitting"
                onClick={this.handlePublish.bind(this)}
              >
                <i className="glyphicon glyphicon-send" /> Submit
              </a>
            ) : null}

            <a
              className="btn btn-sm btn-primary admin-btn"
              id="button-copy"
              href="javascript:void(0);"
              onClick={this.handleCopy.bind(this)}
            >
              <i className="glyphicon glyphicon-plus" /> Copy
            </a>
          </div>

          <div className="edit-controls">
            <a className="btn btn-default" onClick={this.onCreatePhotoElement}>
              <i className="glyphicon glyphicon-picture" /> Add photo frame
            </a>
            <a className="btn btn-default" onClick={this.onCreateTextElement}>
              <i className="glyphicon glyphicon-text-size" /> Add text frame
            </a>
          </div>
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  setting: PropTypes.object.isRequired,
  selectedElementIndex: PropTypes.number.isRequired,
  elements: PropTypes.array.isRequired,
  actions: PropTypes.shape({
    saveProject: PropTypes.func.isRequired,
    copyProject: PropTypes.func.isRequired,
    updateSetting: PropTypes.func.isRequired,
    createElement: PropTypes.func.isRequired
  })
};

export default ControlPanel;
