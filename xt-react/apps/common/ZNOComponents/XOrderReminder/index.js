import React, { Component, PropTypes } from 'react';
import XButton from '../XButton';

import classNames from 'classnames';
import './index.scss';

class XOrderReminder extends Component {
  constructor(props) {
    super(props);

    this.gotoCart = () => {
      window.location = props.url;
    };
  }

  render() {
    const {
      className,
      children,
      tip,
      linkText
    } = this.props;

    const btnClass = classNames('x-order-reminder', className);

    return (
      <div className={btnClass} onClicked={this.onClickBtn}>
        <div className="tip">{tip}</div>
        <div className="link-text" onClick={this.gotoCart}>{linkText}</div>
        { children }
      </div>
    );
  }
}

XOrderReminder.propTypes = {
  tip: PropTypes.string,
  linkText: PropTypes.string,
  url: PropTypes.string,
};

XOrderReminder.defaultProps = {
  tip: 'The item was already ordered or added to cart. If you wish to edit this item, it needs to be removed from your cart.',
  linkText: 'Click here to go to shopping cart',
  url: '/shopping-cart.html'
};

export default XOrderReminder;
