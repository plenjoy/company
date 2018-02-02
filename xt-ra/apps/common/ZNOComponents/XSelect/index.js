import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class XSelect extends Component {
  render() {
    const {
      onChanged,
      optionComponent,
      options,
      searchable,
      placeholder,
      arrowRenderer,
      value,
      valueComponent,
      matchPos
    } = this.props;

    return (
      <Select
        arrowRenderer={arrowRenderer}
        onChange={onChanged}
        optionComponent={optionComponent}
        options={options}
        placeholder={placeholder}
        value={value}
        searchable={searchable}
        valueComponent={valueComponent}
        matchPos={matchPos}
      />
    );
  }
}

export default XSelect;
