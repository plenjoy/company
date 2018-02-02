import classNames from 'classnames';
import { translate } from 'react-translate';
import { merge, isEqual, get } from 'lodash';
import React, { Component, PropTypes } from 'react';

import './index.scss';
import editIcon from './title-edit.svg';
import doneIcon from './title-done.svg';
import deleteIcon from './title-delete.svg';

class TitleEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.data.title || '',
      isEditIconShow: false,
      isInEdit: false,
      isInvalid: false,
      invalidText: 'It is invalid'
    };

    this.toggleEditIcon = this.toggleEditIcon.bind(this);
    this.toggleEditModel = this.toggleEditModel.bind(this);
    this.editDone = this.editDone.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.editTitle = this.editTitle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldTitle = this.props.data.title;
    const newTitle = nextProps.data.title;
    if (oldTitle !== newTitle) {
      this.setState({
        title: newTitle
      });
    }
  }

  toggleEditIcon(bool) {
    this.setState({ isEditIconShow: bool });
  }
  toggleEditModel(bool) {
    if (bool) {
      const { actions } = this.props;
      const { boundTrackerActions } = actions;
      //  点击修改 title 按钮的埋点。
      boundTrackerActions.addTracker('ClickChangeTitle');
    }
    this.setState({
      isInEdit: bool,
      isInvalid: false,
      invalidText: ''
   });
  }
  editDone() {
    if (!this.state.title) {
      this.setState({
        isInvalid: true,
        invalidText: 'Title is required'
      });
    } else if (!(/^[a-zA-Z 0-9\d_\s\-]+$/.test(this.state.title))) {
      this.setState({
        isInvalid: true,
        invalidText: 'Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title'
      });
    } else if (this.state.title !== this.props.data.title) {
      // 请求title 修改的接口。
      const { actions, data, projectSettings } = this.props;
      const { boundProjectActions, boundTrackerActions, boundSystemActions } = actions;
      const { projectId, userId } = data;
      const title = this.state.title;
      boundProjectActions
      .saveProjectTitle(userId, projectId, title).then((res) => {
        const respCode = +get(res, 'respCode');

        switch(respCode) {
          case 2: {
            this.setState({
              isInvalid: true,
              invalidText: 'Please use a name you haven\'t used before.'
            });
            break;
          }
          case 3: {
            boundSystemActions.showConfirm({
              confirmMessage: 'Your session has timed out. You must log in again to continue.',
              okButtonText: 'Log in',
              cancelButtonText: 'Cancel',
              onOkClick: () => window.open('/sign-in.html', '_blank')
            });
            break;
          }
          case 200: {
            this.setState({
              isInvalid: false,
              invalidText: '',
              isInEdit: false
            });
            // 点击修改 title 按钮后并修改成功保存的 埋点。
            boundTrackerActions.addTracker('ClickChangeTitleAndDone');
            boundProjectActions.changeProjectTitle(title);
            break;
          }
          default: {
            boundSystemActions.showConfirm({
              confirmMessage: 'Your network is offline!',
              onOkClick: () => {
                boundSystemActions.hideConfirm();
              },
              okButtonText: 'OK'
            });
          }
        }
      });
    } else if (this.state.title === this.props.data.title) {
      this.setState({ isInEdit: false });
    }
  }
  cancelEdit() {
    const { actions } = this.props;
    const { boundTrackerActions } = actions;
    boundTrackerActions.addTracker('CancelChangeTitle');
    this.setState({
      title: this.props.data.title,
      isInEdit: false
    });
  }

  editTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  render() {
    const { data } = this.props;
    const { title, orderState } = data;
    const InCartOrOrdered = get(orderState, 'isInCart') || get(orderState, 'isOrdered');

    const editIconClass = classNames('title-edit-icon', { 'hide': !this.state.isEditIconShow });
    const titleWarn = classNames('title-warn', { 'show': this.state.isInvalid });
    return (
      <div className="bed-title">
        <div
          onMouseOver={this.toggleEditIcon.bind(this,true)}
          onMouseOut={this.toggleEditIcon.bind(this,false)}
          className={this.state.isInEdit ? 'hide' : ''}
        >
          <p className="box-title" >
            { title }
          </p>
          {
            !InCartOrOrdered
            ?(
              <label htmlFor="titleInputer">
                <img
                  className={editIconClass}
                  title="Click to edit title"
                  alt="edit title"
                  src={editIcon}
                  onClick={this.toggleEditModel.bind(this, true)}
                />
              </label>
              )
            :null
          }

        </div>
        {
          !InCartOrOrdered
          ? (
              <div className = {this.state.isInEdit ? '' : 'hide'} >
                <div className="box-title-edit">
                  <input
                    className="title-edit"
                    type="text"
                    maxLength="50"
                    value={this.state.title}
                    onChange={this.editTitle}
                    id="titleInputer"
                  />
                  <img
                    className="icon-done"
                    src={doneIcon}
                    alt="Done"
                    onClick={this.editDone}
                  />
                  <img
                    className="icon-delete"
                    src={deleteIcon}
                    alt="Cancel"
                    onClick={this.cancelEdit}
                  />
                </div>
                <span className={titleWarn} >
                  { this.state.invalidText }
                </span>
              </div>
            )
          : null
        }
      </div>
    );
  }
}

TitleEditor.propTypes = {};

export default translate('TitleEditor')(TitleEditor);
