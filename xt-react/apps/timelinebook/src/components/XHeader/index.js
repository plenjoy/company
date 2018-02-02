import React, { Component, PropTypes } from 'react';
import './index.scss';
import logo from './new-logo-white.svg';

class XHeader extends Component {
  constructor(props) {
    super(props);
    this.handleLogoClick = this.handleLogoClick.bind(this);
  }

  // 点击logo 进入主页时候的执行函数
  handleLogoClick() {
    const {
      isProjectEdited,
      boundSystemActions,
      onSaveProject,
      baseUrls
    } = this.props;

    const goToHome = () => {
      window.onbeforeunload = null;
      window.location.href = baseUrls.baseUrl;
    };

    boundSystemActions.showConfirm({
      confirmMessage: (
        <div className="text-center">
          This will take you to home page.
        </div>
      ),
      onOkClick: () => {
        goToHome();
      },
      onCancelClick: goToHome,
      okButtonText: 'OK',
    });
  }

  stopPropagation(ev) {
    const event = ev || window.event;
    event.stopPropagation();
  }

  render() {
    const { children } = this.props;
    return (
      <div className="mod-header" onClick={this.stopPropagation.bind(this)}>
        <div className="logo" onClick={this.handleLogoClick}>
          <img src={logo} alt="logo"/>
        </div>
        <div className="header-area">
          {children}
        </div>
      </div>
    );
  }
}

XHeader.propTypes = {
  boundSystemActions: PropTypes.object.isRequired,
  isProjectEdited: PropTypes.bool.isRequired,
  onSaveProject: PropTypes.func.isRequired,
  baseUrls: PropTypes.object.isRequired
};

export default XHeader;
