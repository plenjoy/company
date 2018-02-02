import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';

import { customeTemplateIds } from '../../utils/customeTemplate';

import './index.scss';

class SnackBar extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }
  delete() {
    const { actions } = this.props;
    actions.onDelete();
  }
  render() {
    const {
      isShown,
      left,
      top,
      width,
      isShowEdit = true,
      isShowDelete = true,
      actions
    } = this.props;
    const snackBarClass = classNames('snack-bar', {
      show: isShown && (isShowEdit || isShowDelete),
      mini: isShowEdit ? width < 300 : width < 200
    });

    const snackBarStyle = {
      left,
      top,
      width
    };

    return (
      <div
        className={snackBarClass}
        style={snackBarStyle}
        onMouseEnter={actions.onMouseEnter}
        onMouseLeave={actions.onMouseLeave}
      >
        <ul className="action-buttons">
          {
            isShowEdit ? (
              <li>
                <a onClick={actions.onEditImage} title="Edit Image">
                  <icon className="icon edit-image" />
                  <span>Edit Image</span>
                </a>
              </li>
            ) : null
          }

          {
            isShowDelete ? (
              <li>
                <a onClick={this.delete} title="Delete">
                  <icon className="icon delete-image" />
                  <span>Delete</span>
                </a>
              </li>
            ) : null
          }
        </ul>
      </div>
    );
  }
}

SnackBar.propTypes = {
  isShown: PropTypes.bool.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  }).isRequired
};

export default SnackBar;
