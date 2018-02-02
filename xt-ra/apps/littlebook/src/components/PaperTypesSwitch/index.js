import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import XToggle from '../../../../common/ZNOComponents/XToggle';

import classNames from 'classnames';
import './index.scss';

class PaperTypesSwitch extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, t, onSwitch, value } = this.props;
    const btnClass = classNames('paper-type-switch', className);
    const firstText = t('UPGRADE_TO_HARD_COVER');
    const secondText = t('SWITCH_TO_PAPER_COVER');

    return (
      <XToggle
        className={btnClass}
        value={value}
        firstText={firstText}
        secondText={secondText}
        onClicked={onSwitch}
      />
    );
  }
}

PaperTypesSwitch.propTypes = {
  value: PropTypes.number,
  onSwitch: PropTypes.func
};

export default translate('PaperTypesSwitch')(PaperTypesSwitch);
