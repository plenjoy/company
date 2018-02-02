import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';
import { translate } from 'react-translate';
import OAuth from '../../../../common/utils/OAuth';
import XModal from '../../../../common/ZNOComponents/XModal';
import { oAuthTypes } from '../../contants/strings';
import FacebookUpload from '../../components/FacebookUpload';
import InstagramUpload from '../../components/InstagramUpload';
import * as handler from './handle/main';
import './index.scss';

class AutoUploadModal extends Component {
  constructor(props) {
    super(props);
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    this.state = {
      winWidth,
      winHeight,
      albums: null
    };
    this.onResize = this.onResize.bind(this);
    this.downloadOrDownloading = id => handler.downloadOrDownloading(this, id);
    this.clickCloseModal = this.clickCloseModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!is(this.props.data.oAuth.albums, nextProps.data.oAuth.albums)) {
      this.setState({
        albums: nextProps.data.oAuth.albums
      });
    }
  }
  clickCloseModal() {
    const { closeModal, actions } = this.props;
    const { boundOAuthActions } = actions;
    boundOAuthActions.removeAllimage();
    OAuth.cancelRequest();
    closeModal();
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
  onResize() {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    this.setState({
      winWidth,
      winHeight
    });
  }

  render() {
    const { isShown, closeModal, t, data, actions, addTracker } = this.props;
    const { boundOAuthActions, login } = actions;
    const { oAuth, allImages, uploadingImages } = data;
    const authAction = {
      boundOAuthActions,
      closeModal,
      downloadOrDownloading: this.downloadOrDownloading,
      onClosed: this.clickCloseModal,
      login,
      addTracker
    };
    let { albums, winWidth, winHeight } = this.state;
    let title = '';
    albums = albums || oAuth.albums;
    // 最小宽度最小放四个
    const autoUpgradeModalSize = {
      width: winWidth > 650 ? winWidth * 0.9 - 80 : 650,
      height: winHeight > 605 ? winHeight * 0.9 - 80 : 605
    };
    switch (OAuth.authType) {
      case oAuthTypes.FACEBOOK:
        title = 'Facebook';
        break;
      case oAuthTypes.INSTAGRAM:
        title = 'Instagram';
        break;
      case oAuthTypes.GOOGLE:
        title = 'Google Photos';
        break;
    }

    const uploadData = {
      albums,
      oAuth,
      allImages,
      uploadingImages,
      title,
      autoUpgradeModalSize
    };
    return (
      <XModal
        className="auto-upgrade-wrap"
        onClosed={this.clickCloseModal}
        opened={isShown}
      >
        <div className="title">{title}</div>
        {OAuth.authType == oAuthTypes.FACEBOOK ? (
          <FacebookUpload data={uploadData} actions={authAction} />
        ) : null}
        {OAuth.authType == oAuthTypes.INSTAGRAM ? (
          <InstagramUpload data={uploadData} actions={authAction} />
        ) : null}
        {OAuth.authType == oAuthTypes.GOOGLE ? (
          <FacebookUpload data={uploadData} actions={authAction} />
        ) : null}
      </XModal>
    );
  }
}

export default translate('UpgradeModal')(AutoUploadModal);
