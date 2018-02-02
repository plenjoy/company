import React from 'react';
import {observer} from 'mobx-react';

import './style.scss';

@observer
class Loading extends React.Component {
  render() {
    const {isLoading} = this.props;

    if (!isLoading) return null;

    return (
      <div className='Loading'>
        <div className='Loading__container'>
          <span className='Loading__circle'></span>
          <span className='Loading__text'>Loading...</span>
        </div>
      </div>
    )
  }
}

Loading.propTypes = {
  isLoading: React.PropTypes.bool
};

export default Loading;
