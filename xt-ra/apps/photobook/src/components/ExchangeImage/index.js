import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import XDrag from '../../../../common/ZNOComponents/XDrag';

import ico from './icon.svg';

import './index.scss';

class ExchangeImage extends Component {

  render() {
    const { pageId, elementId, t } = this.props;
    const { onExchangeDragStart } = actions;
    return (
      <XDrag onDragStarted={onExchangeDragStart.bind(pageId, elementId)} data-html2canvas-ignore="true">
        <img className="exchange-image" width="25px" src={ico} title={t('DRAR_SWAP_TIP')} />
      </XDrag>
    );
  }

}


ExchangeImage.propTypes = {
  onExchangeDragStart: PropTypes.func.isRequired
}

export default translate('ExchangeImage')(ExchangeImage);
