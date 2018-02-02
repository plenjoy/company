import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import './index.scss';

class ActionControl extends Component {
  handleToFront() {
    const { selectedElementArray, actions } = this.props;
    const element = selectedElementArray[0];
    actions.elementToFront(element.id);
  }

  handleToBack() {
    const { selectedElementArray, actions } = this.props;
    const element = selectedElementArray[0];
    actions.elementToBack(element.id);
  }

  handleSetKeepRatio(keepRatio) {
    const { selectedElementArray, actions } = this.props;
    const element = selectedElementArray[0];
    actions.updateElement(element.id, {
      keepRatio
    });
  }

  handleSetLock(isLock) {
    const { selectedElementArray, actions } = this.props;
    const element = selectedElementArray[0];
    actions.updateElement(element.id, {
      isLock
    });
  }

  render() {
    const {
      selectedElementArray,
      actions,
    } = this.props;
    const element = selectedElementArray[0];
    const keepRatio = !!(element && element.keepRatio);
    const isLock = !!(element && element.isLock);
    const isSideBarShow = selectedElementArray.length === 1;
    const Style = {
      display: isSideBarShow ? 'block' : 'none'
    };
    return (
      <div className="action-button" style={Style}>
        <div className="label-detail">
          <i className="glyphicon glyphicon-sort" /> Depth
        </div>
        <div className="label-item" id="inputbox-oy">
          <button
            type="button"
            className="btn btn-default btn-sm"
            onClick={this.handleToFront.bind(this)}
          >
            Front
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm"
            onClick={this.handleToBack.bind(this)}
          >
            Back
          </button>
        </div>
        <div className="label-detail">
          <i className="glyphicon glyphicon-lock" /> Element
        </div>
        <div className="label-item" id="inputbox-oy">
          <input
            type="radio"
            id="lock"
            name="islock"
            checked={isLock === true}
            onChange={this.handleSetLock.bind(this, true)}
          />{' '}
          <label htmlFor="lock">Lock</label> <br />
          <input
            type="radio"
            id="unlock"
            name="islock"
            checked={isLock === false}
            onChange={this.handleSetLock.bind(this, false)}
          />{' '}
          <label htmlFor="unlock">Unlock</label> <br />
        </div>
        <div className="label-detail">
          <i className="glyphicon glyphicon-fullscreen" /> Scale
        </div>
        <div className="label-item" id="inputbox-oy">
          <input
            type="radio"
            id="keep"
            name="keepratio"
            checked={keepRatio === true}
            onChange={this.handleSetKeepRatio.bind(this, true)}
          />{' '}
          <label htmlFor="keep">Keep Ratio</label> <br />
          <input
            type="radio"
            id="free"
            name="keepratio"
            checked={keepRatio === false}
            onChange={this.handleSetKeepRatio.bind(this, false)}
          />{' '}
          <label htmlFor="free">Free Ratio</label> <br />
        </div>
      </div>
    );
  }
}

ActionControl.propTypes = {
  selectedElementArray: PropTypes.array.isRequired,
  actions: PropTypes.shape({
    elementToFront: PropTypes.func.isRequired,
    elementToBack: PropTypes.func.isRequired,
    updateElement: PropTypes.func.isRequired
  })
};

export default ActionControl;
