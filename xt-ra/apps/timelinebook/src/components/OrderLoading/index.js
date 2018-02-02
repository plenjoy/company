import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { get, merge } from 'lodash';
import './index.scss';

import loading from './assets/Loading.gif';

class OrderLoading extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  static contextTypes = {
    store: PropTypes.object
  }

  render() {
    const { t, data } = this.props;
    const {  } = this.state;
    
    const { store } = this.context;
    const state = store.getState();
   
    return (
      <div className="loading-content">
        <img className="loading-img" src={loading}/>
      </div> 
    );
  }
}

export default translate('OrderLoading')(OrderLoading);