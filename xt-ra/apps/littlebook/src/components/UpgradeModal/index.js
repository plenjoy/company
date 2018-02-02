import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';
import { translate } from 'react-translate';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';
import * as mainHandle from './handle/main';

class UpgradeModalV2 extends Component {
  constructor(props) {
    super(props);

    this.handleConfirm = () => mainHandle.handleConfirm(this);
    this.handleCancel = () => mainHandle.handleCancel(this);
    this.getUpgradeItems = () => mainHandle.getUpgradeItems(this);
    this.getCheckedItems = () => mainHandle.getCheckedItems(this);
    this.computedOptionsSize = () => mainHandle.computedOptionsSize(this);
    this.onClickCheckedItem = item => mainHandle.onClickCheckedItem(this, item);
    this.getPrice = (basePrice, count) => mainHandle.getPrice(basePrice, count);
    this.updateArrowMarginBottom = size => mainHandle.updateArrowMarginBottom(this, size);

    this.state = {
      // 默认选中所有.
      currentCheckedItems: mainHandle.getDefaultCheckedItems(props.upgradeCheckedItems),
      price: props.basePrice,
      to: props.to,
      from: props.from,
      arrowMarginBottom: 0
    };

    this.isClickedCheckout = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!is(this.props.upgradeCheckedItems, nextProps.upgradeCheckedItems)) {
      this.setState({
        currentCheckedItems: mainHandle.getDefaultCheckedItems(nextProps.upgradeCheckedItems)
      });
    }

    if (!is(this.props.to, nextProps.to)) {
      this.setState({
        to: nextProps.to
      });
    }

    if (!is(this.props.from, nextProps.from)) {
      this.setState({
        from: nextProps.from
      });
    }
  }

  render() {
    const { isShown, okButtonText, cancelButtonText, close, basePrice, t } = this.props;
    const { currentCheckedItems, disabled } = this.state;

    const {
      wrapWidth,
      iconsLeftRightPadding
    } = this.computedOptionsSize();

    // wrap
    const wrapStyle = {
      width: `${wrapWidth}px`
    };

    const OKButtonClass = classNames('height-30');
    const upgradeItems = this.getUpgradeItems();
    const checkedItems = this.getCheckedItems();

    return (
      <XModal
        className="upgrade-wrap"
        styles={wrapStyle}
        onClosed={close}
        opened={isShown}
      >
        <div className="upgrade-title">
          { t('UPGRADE_COMMON_TITLE') }
        </div>

        { upgradeItems }

        <div className="upgrade-checked-items">
          { checkedItems }
        </div>
        <div className="button-wrap">
          <XButton
            onClicked={this.handleConfirm}
            className={OKButtonClass}
          >
            {t('CHECKOUT')}
          </XButton>
        </div>

      </XModal>
    );
  }
}

UpgradeModalV2.propTypes = {
  isShown: PropTypes.bool.isRequired
};

UpgradeModalV2.defaultProps = {
  isShown: false,
  okButtonText: 'Upgrade',
  cancelButtonText: 'No, Thanks',
  currentCheckedItems: []
};

export default translate('UpgradeModal')(UpgradeModalV2);

