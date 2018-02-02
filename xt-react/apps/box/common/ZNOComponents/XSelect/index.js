import React, { Component } from 'react';
import { isEqual } from 'lodash';
import Select from 'react-select';
import './index.scss';

class XSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: props.options
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.value, nextProps.value)) {
      this.setState({
        value: nextProps.value,
        options: nextProps.options
      });
    }
  }

  // to fix current select item reposition to previous item
  onOpen() {
    var _this = this;
    setTimeout(function() {
      _this.rePositionScrollBar(_this.state.options, _this.state.value);
    });
  }

  rePositionScrollBar(options, value) {
    const elems = document.querySelectorAll('.Select-option');
    let selected;
    const selectedOption = options.find(opt => opt.value === value);
    Array.prototype.slice.call(elems).forEach(elem => {
      let className = elem.getAttribute('class');
      if (/is-focused/.test(className)) {
        className = className.replace('is-focused', '');
        elem.setAttribute('class', className);
      }
      if (elem.innerHTML === selectedOption.label || elem.getAttribute('title') === selectedOption.label) {
        className += className.indexOf('is-selected') >= 0
          ? ''
          : ' is-selected';
        elem.setAttribute('class', className);
        selected = elem;
      }
    });
    if (selected) {
      const parent = selected.parentNode;
      // 在 app index.scss 中将 .Select-menu-outer 的样式设置为了隐藏，在滚动逻辑处理好了再显示出来。
      parent.parentNode.style.display = 'block';
      parent.scrollTop = selected.offsetTop;
    }
  }

  render() {
    const {
      onChanged,
      optionComponent,
      options,
      searchable,
      placeholder,
      arrowRenderer,
      value,
      valueComponent
    } = this.props;
    return (
      <Select
        arrowRenderer={arrowRenderer}
        onChange={onChanged}
        optionComponent={optionComponent}
        options={options}
        placeholder={placeholder}
        value={this.state.value}
        searchable={searchable}
        onOpen={this.onOpen.bind(this)}
        valueComponent={valueComponent}
      />
    );
  }
}

export default XSelect;
