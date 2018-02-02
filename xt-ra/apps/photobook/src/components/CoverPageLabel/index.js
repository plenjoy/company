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
    const { data } = this.props;
    const { pageLabel } = data;
    const { frontPage, backPage } = pageLabel;
    return (
      <div className="cover-page-label" draggable="false">
        <div className="left">{backPage.text}</div>
        <div className="right">{frontPage.text}</div>
      </div>
    );
  }
}

CoverPageLabel.propTypes = {
};

CoverPageLabel.defaultProps = {
  data: {
    pageLabel: {
      frontPage: {
        text: 'Front Cover'
      },
      backPage: {
        text: 'Back Cover'
      }
    }
  }
};

export default translate('CoverPageLabel')(CoverPageLabel);
