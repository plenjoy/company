import React from 'react';
import loadingImg from './loading.svg'

import './style.scss';

class LoadView extends React.Component {
  render() {
    return (
      <div className='EmptyView'>
        <div className='EmptyView__image'>
          <img src={loadingImg} />
        </div>
      </div>
    );
  }
}

export default LoadView;
