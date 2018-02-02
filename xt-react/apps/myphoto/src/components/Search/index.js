import React from 'react';
import {observer} from 'mobx-react';

import './style.scss';

@observer
class Search extends React.Component {
  render() {
    const { label = '', placeholder } = this.props;

    return (
      <label className='Search'>
        { label }:
        <input className='Search__input' type='text' placeholder={placeholder} />
        <span className='Search__icon'></span>
      </label>
    )
  }
}

Search.propTypes = {
  label: React.PropTypes.string,
  placeholder: React.PropTypes.string
};

export default Search;
