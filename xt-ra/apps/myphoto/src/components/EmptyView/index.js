import React from 'react';
import EmptyImage from './Empty.png';

import './style.scss';

class EmptyView extends React.Component {
  render() {
    return (
      <div className='EmptyView'>
        <div className='EmptyView__image'>
          <img src={EmptyImage} />
        </div>
        <div className='EmptyView__text'>There are no photos available.</div>
      </div>
    );
  }
}

export default EmptyView;
