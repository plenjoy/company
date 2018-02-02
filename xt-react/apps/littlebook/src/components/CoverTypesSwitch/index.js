import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import XToggle from '../../../../common/ZNOComponents/XToggle';

import classNames from 'classnames';
import './index.scss';

class CoverTypesSwitch extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, t, onSwitch, value } = this.props;
    const btnClass = classNames('cover-type-switch', className);
    const firstText = t('SWITCH_TO_IMAGE_COVER');
    const secondText = t('SWITCH_TO_TEXT_COVER');

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

CoverTypesSwitch.propTypes = {
  value: PropTypes.number,
  onSwitch: PropTypes.func
};

export default translate('CoverTypesSwitch')(CoverTypesSwitch);
