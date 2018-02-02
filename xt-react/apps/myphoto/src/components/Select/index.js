import React from 'react';
import {observer} from 'mobx-react';

import './style.scss';

@observer
class Select extends React.Component {
  render() {
    const { label = '', options = [] } = this.props;

    return (
      <label className='Select'>
        { label }:
        <select className='Select__input'>
          {
            options.map((option, index) => (
              <option className='Select__option' key={ index }>
                { option.text }
              </option>
            ))
          }
        </select>
      </label>
    )
  }
}

Select.propTypes = {
  label: React.PropTypes.string,
  options: React.PropTypes.array
};

export default Select;
