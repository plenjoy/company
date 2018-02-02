import React, { Component, PropTypes } from 'react';
import { get, isEqual } from 'lodash';
import Immutable from 'immutable';
import classNames from 'classnames';
import './index.scss';

class PageNumberSimple extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const { className, pageNumber, style, isCover = false, isActive = false } = data;
    const pageNumberClassName = classNames('page-number-simple', className, {
    });
    const textActiveClassName = classNames({ active: isActive });

    const leftPage = pageNumber.get('leftPage');
    const rightPage = pageNumber.get('rightPage');

    let innerText = '';
    const leftText = leftPage.get('text');
    const rightText = rightPage.get('text');
    if (leftText) {
      // Page 1 & 2
      innerText = rightText ? `${leftText} & ${rightText.replace(/page/i, '')}` : leftText;
    } else {
      innerText = rightText;
    }

    const text = isCover ? 'Cover' : innerText;

    return (<div className={pageNumberClassName} style={style}>
      <div className={textActiveClassName}>
        <span>{text}</span>
      </div>
    </div>);
  }
}

PageNumberSimple.propTypes = {
};

PageNumberSimple.defaultProps = {
  data: {
    pageNumber: {
      leftPage: {
        text: 'Page 1'
      },
      rightPage: {
        text: 'Page 2'
      }
    }
  }
};

export default PageNumberSimple;
