import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import './index.scss';

class SnackBar extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.replace = this.replace.bind(this);
  }

  replace() {
    const { actions } = this.props;
    actions.onReplaceImage && actions.onReplaceImage();
  }

  delete() {
    const { actions } = this.props;
    actions.onDelete && actions.onDelete();
  }
  render() {
    const {
      isShown,
      left,
      top,
      width,
      zIndex = 0,
      isShowEdit = true,
      isShowDelete = true,
      isShowReplace = false,
      actions
    } = this.props;
    const snackBarClass = classNames('snack-bar', {
      show: isShown && (isShowEdit || isShowDelete),
      mini: isShowEdit && !isShowReplace ? width < 300 : width < 200
    });

    const snackBarStyle = {
      left,
      top,
      width,
      zIndex
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
            isShowReplace ? (
              <li>
                <a onClick={this.replace} title="replace">
                  <icon className="icon replace-image" />
                  <span>Replace</span>
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
  imageType: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  }).isRequired
};

export default SnackBar;
