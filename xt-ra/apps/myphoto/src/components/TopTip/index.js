import React, { Component } from 'react';
import AppStore from '../../stores/AppStore';

import './style.scss';

class TopTip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, isShow } = this.props;
    const topTipStyle = `top-tip${!isShow ? ' hide' : ''}`;
    return (
      <div className={topTipStyle}>
        <span className='icon-close' onClick={() => { AppStore.toggleTopTipVisibility(false) }} />
        { text }
      </div>
    );
  }
}

TopTip.defaultProps = {
  isShow: true,
  text: 'You must select at least one photo in order to create product.',
  className: 'top-tip',
  isCloseButtonShow: true
};

export default TopTip;
