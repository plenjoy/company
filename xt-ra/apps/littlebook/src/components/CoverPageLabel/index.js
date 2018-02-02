import React, { Component, PropTypes } from 'react';
import { get, isEqual } from 'lodash';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import classNames from 'classnames';
import XDrag from '../../../../common/ZNOComponents/XDrag';
import './index.scss';

class CoverPageLabel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pageLabel, style } = this.props;
    const { frontPage, backPage } = pageLabel;
    return (
      <div className="cover-page-label" style={style} data-html2canvas-ignore="true">
        <div className="left">{backPage.text}</div>
        <div className="right">{frontPage.text}</div>
      </div>
    );
  }
}

CoverPageLabel.propTypes = {
};

CoverPageLabel.defaultProps = {
  pageLabel: {
    frontPage: {
      text: 'Front Cover'
    },
    backPage: {
      text: 'Back Cover'
    }
  }
};

export default translate('CoverPageLabel')(CoverPageLabel);
