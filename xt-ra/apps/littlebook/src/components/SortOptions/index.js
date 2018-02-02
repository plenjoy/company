import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class SortOptions extends Component {
  constructor(props) {
    super(props);
  }


  choseOption(option) {
    const { onChanged, hideOptions } = this.props;
    onChanged(option);
    hideOptions();
  }

  render() {
    const { optionValue, options } = this.props;
    return (
      <div className="sort-options" >
        {
        options.map((option) => {
          const optionClassName = classNames('option-each', {
            active: option.label === optionValue.label
          });

          return (
            <div key={option.value}
              onClick={() => this.choseOption(option)}
              className={optionClassName}
            >
              {option.label}
            </div>
          );
        })
      }
      </div>
    );
  }

}

export default SortOptions;
