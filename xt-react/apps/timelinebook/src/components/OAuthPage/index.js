import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { oAuthTypes, zIndex } from '../../constants/strings';
import XButton from '../../../../common/ZNOComponents/XButton';
import OAuth from '../../../../common/utils/OAuth';

import './index.scss';
import facebookIcon from './assets/facebook.svg';
import instagramIcon from './assets/instagram.svg';
import facebookLogo from './assets/facebookLogo.svg';
import instagramLogo from './assets/instagramLogo.svg';
import selectIcon from './assets/select.svg';

class OAuthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectSourceName: '',
      isSelectDisabled: true,
      facebookUser: null,
      instagramUser: null
    };

    this.login = this.login.bind(this);
    this.setLoginUserCallback();
  }

  render() {
    const { t, data } = this.props;
    const { isLogin } = this.state;
    const { oAuthPage, env } = data;

    const facebookSourceClass = classNames('oauth-button', {
      selected: this._isSelectFacebook()
    });
    const instagramSourceClass = classNames('oauth-button', {
      selected: this._isSelectInstagram()
    });

    const OAuthPageStyle = {
      zIndex: zIndex.modal - 1
    };

    const oAuthPageClass = classNames('oauth-page', {
      hide: !oAuthPage.get('isShown')
    });

    return (
      <div className={oAuthPageClass} style={OAuthPageStyle}>
        <div className="oauth-page-container">
          <header className="oauth-page-header">
            {t('CHOOSE_YOUR_PHOTO_SOURCE')}
          </header>
          <section className="oauth-page-body">
            <div className="oauth-page-buttons">
              <div className={facebookSourceClass} onClick={() => this.selectSource(oAuthTypes.FACEBOOK)}>
                <img className="oauth-button-icon" src={facebookIcon} />
                <img className="oauth-button-logo facebook" src={facebookLogo} />
                <div className="oauth-button-text">
                  {t('ADD_VIA_FACEBOOK')}
                </div>

                <img className="oauth-button-select" src={selectIcon} />

                {this.state.facebookUser
                  ? <div className="oauth-user">
                    <img className="oauth-user-icon" src={this.state.facebookUser.avatar} />
                    <span className="oauth-user-name">
                      {this.state.facebookUser.fullName}
                    </span>
                  </div>
                  : null
                }
              </div>
              <div className={instagramSourceClass} onClick={() => this.selectSource(oAuthTypes.INSTAGRAME)}>
                <img className="oauth-button-icon" src={instagramIcon} />
                <img className="oauth-button-logo instagram" src={instagramLogo} />
                <div className="oauth-button-text">
                  {t('ADD_VIA_INSTAGRAM')}
                </div>

                <img className="oauth-button-select" src={selectIcon} />

                {this.state.instagramUser
                  ? <div className="oauth-user">
                    <img className="oauth-user-icon" src={this.state.instagramUser.avatar} />
                    <span className="oauth-user-name">
                      {this.state.instagramUser.fullName}
                    </span>
                  </div>
                  : null
                }
              </div>
            </div>
          </section>
          <footer className="oauth-page-footer">
            <XButton
              width={200}
              height={30}
              onClicked={this.login}
              disabled={this.state.isSelectDisabled}
            >
              {t('SELECT')}
            </XButton>
          </footer>
        </div>
      </div>
    );
  }

  setLoginUserCallback() {
    OAuth[oAuthTypes.FACEBOOK].preLoginCallback = 
      user => this.setState({ facebookUser: user });

    OAuth[oAuthTypes.INSTAGRAME].preLoginCallback =
      user => this.setState({ instagramUser: user });
  }

  componentWillUpdate({data: nextData}) {
    if(nextData && nextData.env && nextData.env.urls) {
      const baseUrl = nextData.env.urls.get('baseUrl');
      
      if(baseUrl) {
        OAuth.setBaseUrl(baseUrl);
      }
    }
  }

  selectSource(selectSourceName) {
    const { boundTrackerActions } = this.props.actions;
    this.setState({
      selectSourceName,
      isSelectDisabled: false
    });
  }

  async login() {
    const { facebookUser, instagramUser, selectSourceName } = this.state;
    const { env } = this.props.data;
    const {
      boundEnvActions,
      boundOAuthActions,
      boundOAuthPageActions,
      boundOAuthLoadingActions,
      boundTrackerActions,
      boundConfirmModalActions
    } = this.props.actions;

    const token = null;
    const user = null;
    const isZnoUser = env && env.userInfo && env.userInfo.get('id') !== -1;

    if(!isZnoUser) {
      const {userSessionData: response} = await boundEnvActions.getUserInfo();

      if(response.status.code === '400') {
        this.showLoginDialog();
        return;
      }
    }

    if (selectSourceName) {
      const oAuthTypesString = this._isSelectFacebook() ? 'SelectFacebook' : 'SelectInstagram';
      let isNotFirst = '';

      if(this._isSelectFacebook()) {
        isNotFirst = facebookUser ? 'true' : 'false';
      }

      if(this._isSelectInstagram()) {
        isNotFirst = instagramUser ? 'true' : 'false';
      }
      
      boundTrackerActions.addTracker(`${oAuthTypesString},${isNotFirst}`);

      OAuth.setOAuthType(selectSourceName);
      this.setState({ isSelectDisabled: true });

      OAuth.login()
        .then((token) => {
          const StartConnectString = this._isSelectFacebook() ? 'StartConnectToFacebook' : 'StartConnectToInstagram';
          boundTrackerActions.addTracker(`${StartConnectString}`);

          boundOAuthActions.setOAuthToken(token);
          return OAuth.getUser();
        })
        .then((user) => {
          boundOAuthActions.setOAuthUser(user);
          boundOAuthLoadingActions.showOAuthLoading();
          boundOAuthPageActions.hideOAuthPage();
          this.setState({ isSelectDisabled: false });

          const connectString = this._isSelectFacebook() ? 'FBConnectComplete' : 'InstagramConnectComplete';
          boundTrackerActions.addTracker(`${connectString}`);
        })
        .catch((e) => {
          // 登录失败，重新登录
          this.setState({ isSelectDisabled: false });

          const failedString = this._isSelectFacebook() ? 'FacebookConnectFailed' : 'InstagramConnectFailed';
          boundTrackerActions.addTracker(`${failedString}`);
          console.error(e);
        });
    }
  }

  toggleSelectButton(state) {
    this.setState({ isSelectDisabled: state });
  }

  _isSelectFacebook() {
    return this.state.selectSourceName === oAuthTypes.FACEBOOK;
  }

  _isSelectInstagram() {
    return this.state.selectSourceName === oAuthTypes.INSTAGRAME;
  }

  showLoginDialog() {
    const { actions } = this.props;
    const { boundConfirmModalActions } = actions;
  
    boundConfirmModalActions.showConfirm({
      confirmMessage: (
        <div className="text-center">
          You must log in to open your little timeline book.
        </div>
      ),
      onOkClick: () => window.open('/sign-in.html', '_blank'),
      okButtonText: 'OK',
    });
  }
}

export default translate('OAuthPage')(OAuthPage);
