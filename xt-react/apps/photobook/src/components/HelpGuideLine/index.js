import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import lineImage from './icon/Line2.png'

import './index.scss';

class HelpGuideline extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown, closeHelpGuideline, t } = this.props;
    return (
      <XModal
        className="guide-modal"
        onClosed={closeHelpGuideline}
        opened={isShown}
      >
        <div className="modal-title">{t('TITLE1')}</div>
        <div className="line-item">
           <div className="line-title" >
                <div className="line-text">{t('LINE_TEXT1')}</div>
                <span className="out-bleed-line" />
            </div>
            <div className="help-content">
            {t('DESCRIPTION1')}
            </div>
        </div>
        <div className="line-item">
           <div className="line-title" >
                <div className="line-text">{t('LINE_TEXT2')}</div>
                <img className="line2-img" src={lineImage}/>
            </div>
            <div className="help-content">
            {t('DESCRIPTION2')}
            </div>
        </div>
        <div className="line-item">
           <div className="line-title" >
                <div className="line-text">{t('LINE_TEXT3')}</div>
                <span className="safe-line" />
            </div>
            <div className="help-content">
            {t('DESCRIPTION3')}
            </div>
        </div>
        <div className="line-item">
           <div className="line-title" >
                <div className="line-text">{t('LINE_TEXT4')}</div>
                <span className="indentation-line" />
            </div>
            <div className="help-content">
            {t('DESCRIPTION4')}
            </div>
        </div>
        <div className="line-item">
           <div className="line-title" >
                <div className="line-text">{t('LINE_TEXT5')}</div>
                <span className="spine-line" />
            </div>
            <div className="help-content">
            {t('DESCRIPTION5')}
            </div>
        </div>

        <div className="button-wrap">
          <XButton
            className="little-button"
            onClicked={closeHelpGuideline}
          >
            OK
          </XButton>
        </div>
      </XModal>
    );
  }
}

HelpGuideline.propTypes = {
  isShown: PropTypes.bool.isRequired
};

export default translate('HelpGuideline')(HelpGuideline);
