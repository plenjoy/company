import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';
import loadingGif from './Loading.gif';

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShow, isModalShow , isWhiteBackground } = this.props;
    const loadingWrap = classNames('loading-wrap',{show:isShow});
    let loadingModal;
    if(isWhiteBackground){
      loadingModal=classNames('loading-modal-white',{show:isModalShow});
    }else{
      loadingModal=classNames('loading-modal',{show:isModalShow});
    }

    return (
      <div className={loadingWrap} >
        <div className={loadingModal} ></div>
        <div className="loading-concent" >
          <img src={loadingGif} />
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }
}
export default Loading;
