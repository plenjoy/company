import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import './index.scss';

class IncompleteModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, data, actions } = this.props;
    const { incompleteModal } = data;
    const { boundIncompleteModalActions } = actions;

    return (
      <XModal
        className="incomplete-wrap"
        onClosed={() => boundIncompleteModalActions.hideIncompleteModal()}
        opened={incompleteModal.get('isShown')}
      >
        <div className="incomplete-title">
          { t('INSUFFICIENT_PAGES') }
        </div>
        <div className="incomplete-message">
          { t('INSUFFICIENT_PAGES_MESSAGE') }
        </div>
        <div className="button-wrap">
          <XButton onClicked={() => boundIncompleteModalActions.hideIncompleteModal()}>
            {t('OK')}
          </XButton>
        </div>

      </XModal>
    );
  }
}

IncompleteModal.propTypes = {
};

export default translate('IncompleteModal')(IncompleteModal);

