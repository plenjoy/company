import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import { leastUploadImagesCount } from '../../../../common/utils/strings';

import uploadImg from './upload.svg';
import facebook from './facebook.svg';
import Instagram from './Instagram.svg';
import Google from './google.svg';

import * as handler from './handler';

import './index.scss';

class SelectModal extends Component {
  constructor(props) {
    super(props);

    const { actions } = this.props;
    const { login, boundSelectModalActions } = actions;

    this.login = authType => {
      login(authType);
      boundSelectModalActions.hideSelect();
    };
  }

  render() {
    const { t, data, actions } = this.props;
    const { selectModal } = data;
    const {
      boundSelectModalActions,
      boundImagesActions,
      toggleModal
    } = actions;

    const isShown = selectModal.get('isShown');
    return (
      <XModal
        className="select-modal"
        onClosed={() => {
          boundSelectModalActions.hideSelect();
        }}
        opened={isShown}
      >
        <div className="select-upload-method">
          <h3 className="add-title">{t('SELECT_TITLE')}</h3>
          <XFileUpload
            className="add-photo"
            multiple="multiple"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={toggleModal}
            uploadFileClicked={() => {
              boundSelectModalActions.hideSelect();
            }}
          >
            <img src ={uploadImg} />{t('ADD_PHOTOS')}
          </XFileUpload>
          <div className="line">
            <div className="line-left" />
            <span>or</span>
            <div className="line-right" />
          </div>
          <div className="text-content">
            <div
              className="one-item"
              onClick={this.login.bind(this, 'facebook')}
            >
              <div className="item-content">
                <img src={facebook} />
                <span>{t('ADD_FACEBOOK')} </span>
              </div>
            </div>
            <div
              className="one-item"
              onClick={this.login.bind(this, 'instagram')}
            >
              <div className="item-content">
                <img src={Instagram} />
                <span>{t('ADD_INST')} </span>
              </div>
            </div>
            <div className="one-item" onClick={this.login.bind(this, 'google')}>
              <div className="item-content">
                <img src={Google} style ={{marginTop:'11px', height:'25px'}} />
                <span>{t('ADD_GOOGLE')} </span>
              </div>
            </div>
          </div>
        </div>
      </XModal>
    );
  }
}

SelectModal.propTypes = {};

export default translate('SelectModal')(SelectModal);
