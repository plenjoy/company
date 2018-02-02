import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { template, merge, isEqual, get } from 'lodash';
import Immutable, { List } from 'immutable';

import * as handler from './handler.js';

import XButton from '../../../../common/ZNOComponents/XButton';


import './index.scss';

class BackgroundList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBackgroundsId: '',
      backgroundsList: [],
      isImgLoading: true,
    };
    this.onDragStarted = (backgroundsObj, index, event) => handler.onDragStarted(this, backgroundsObj, index, event);
    this.receiveProps = nextProps => handler.receiveProps(this, nextProps);
    this.willMount = () => handler.willMount(this);
    this.getBackgroundsHTML = () => handler.getBackgroundsHTML(this);
    this.selectedBackgrounds = selectedBackgroundsId => handler.selectedBackgrounds(this, selectedBackgroundsId);
    this.setImgLoading = this.setImgLoading.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps);
  }

  setImgLoading() {
    this.setState({
      isImgLoading: false
    });
  }

  componentWillMount() {
    this.willMount();
  }

  render() {
    const { data, t } = this.props;
    const { currentThemeType } = data;
    const { backgroundsList } = this.state;
    return (
      <div className="background-list">
        {
          this.getBackgroundsHTML()
        }
      </div>
    );
  }
}


export default translate('BackgroundList')(BackgroundList);
