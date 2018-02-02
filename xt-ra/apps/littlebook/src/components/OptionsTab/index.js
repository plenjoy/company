import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import { merge, get } from 'lodash';

import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import ImageList from '../ImageList';

import * as handler from './handler';

import './index.scss';


class OptionsTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="options-tab">
        <h1>this is options tab</h1>
      </div>
    );
  }
}

OptionsTab.proptype = {

};

export default translate('OptionsTab')(OptionsTab);
