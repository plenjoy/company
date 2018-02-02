import React, {Component, PropTypes} from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import './index.scss';

class XTextarea extends Component {

  render() {
    const { name, placeholder, className, onChanged, value } = this.props;
    const customClass = classNames("textarea",className);
    return (
      <textarea placeholder={placeholder?placeholder:'Enter text here'}
                name={name}
                className={customClass}
                onChange={onChanged}
                value={value}
                ref="textareatext" />
    )
  }
}

export default XTextarea;

XTextarea.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  onChanged: PropTypes.func.isRequired
}
