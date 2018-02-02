import './style.scss';
import React from 'react';
import {observer} from 'mobx-react';

@observer
class ScrollingTip extends React.Component {
  render() {
    const {
      isScrolling,
      scrollingTip,
      scrollingTipTop
    } = this.props;

    if(!isScrolling) return null;

    return (
      <div className='ScrollingTip' style={{top: scrollingTipTop > 111 ? scrollingTipTop : 111}}>
        { scrollingTip }
      </div>
    )
  }
}

ScrollingTip.propTypes = {
};

export default ScrollingTip;
