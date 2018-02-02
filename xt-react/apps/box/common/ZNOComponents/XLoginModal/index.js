import React, { Component, PropTypes } from 'react';
import XModal from '../XModal';
import XButton from '../XButton';
import { translate } from 'react-translate';
import './index.scss';

class XLoginModal extends Component {
  constructor(props) {
    super(props);
  }

  login() {
    const { loginActions, onClosed } = this.props;
    let userName = this.refs.userName.value;
    let password = this.refs.password.value;

    if (userName && password) {
      loginActions.login(userName, password);
    }

    onClosed();
  }

  render() {
    const { onClosed, opened, t } = this.props;
    return (
      <XModal className="x-login-modal" onClosed={ onClosed }
              opened={ opened }>
        <h3 className="title">
          { t('LOGIN_TITLE') }
        </h3>
        <hr />

        <div className="data-group">
          <div className="group-item">
            <p className="label">{t('USERNAME')}</p>
            <input ref="userName" type="text" placeholder={t('USERNAME_PLACEHOLDER')}/>
          </div>

          <div className="group-item">
            <p className="label">{t('PASSWORD')}</p>
            <input ref="password" type="password" placeholder={t('PASSWORD_PLACEHOLDER')}/>
          </div>

        </div>
        <div className="btn-list">
          <XButton onClicked={ this.login.bind(this) }>
            { t('LOGIN') }
          </XButton>
        </div>
      </XModal>
    );
  }
}

XLoginModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired
};

export default translate('XLoginModal')(XLoginModal);
