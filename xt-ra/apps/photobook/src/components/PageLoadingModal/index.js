import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import './index.scss';

class PageLoadingModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown, text } = this.props;
    // const isShown = true;
    // const text = 'loading'
    const pageLoading = classNames('page-loading inpage-loading', { hide: !isShown });
    return (
      <div className={pageLoading}>
        <div className="page-loading-modal"></div>
        <div className="page-loading-content">
          <div></div>
          <p>{text}</p>
        </div>
      </div>
    );
  }
}

PageLoadingModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  text: PropTypes.string
};

export default translate('PageLoadingModal')(PageLoadingModal);
